/**
 * SERVICIO DE USUARIOS - CONECTADO A BACKEND
 * Intenta usar el microservicio, fallback a localStorage
 */
import { storageService } from './storage.service';
import { usersApi } from '../api/usersApi';
import type { UserResponseDTO, LoginResponseDTO } from '../api/usersApi';
import type { User, PublicUser, CreateUserDto } from '../domain/user';

const K = { session: 'session', users: 'users' };

// Usuarios por defecto (fallback)
const DEFAULT_USERS: User[] = [
  { id: '1', name: 'Administrador', email: 'admin@biblioteca.com', role: 'Admin', passwordHash: 'admin123' },
  { id: '2', name: 'Usuario Prueba', email: 'usuario@biblioteca.com', role: 'User', passwordHash: 'user123' }
];

function initUsers(): User[] {
  let users = storageService.read<User[]>(K.users, []);
  if (users.length === 0) {
    users = [...DEFAULT_USERS];
    storageService.write(K.users, users);
  }
  return users;
}

function toPublic(u: User): PublicUser {
  return { id: u.id, name: u.name, email: u.email, role: u.role };
}

// Convierte UserResponseDTO del backend a PublicUser del frontend
function backendToPublic(dto: UserResponseDTO): PublicUser {
  return {
    id: String(dto.id),
    name: dto.name,
    email: dto.email,
    role: dto.roleFrontend // Usa el campo compatible "Admin" | "User"
  };
}

export const userService = {
  // ========== LOGIN ==========
  async login(email: string, password: string): Promise<PublicUser> {
    console.log('═══════════════════════════════════════════');
    console.log('🔐 INICIANDO SESIÓN');
    console.log('═══════════════════════════════════════════');
    console.log('📋 Email:', email);
    
    try {
      console.log('🌐 Intentando conectar al backend...');
      console.log('🔗 URL:', 'http://localhost:8081/api/users/login');
      
      const response: LoginResponseDTO = await usersApi.login({ email, password });
      
      console.log('✅ ¡ÉXITO! Login en BACKEND');
      console.log('📥 Usuario:', response.user?.name, '| Rol:', response.user?.roleFrontend);
      console.log('🎫 Token recibido:', response.token ? 'Sí' : 'No');
      
      const publicUser = backendToPublic(response.user);
      
      // Guardar sesión con token
      storageService.write(K.session, { 
        ...publicUser, 
        token: response.token 
      });
      
      console.log('💾 Sesión guardada');
      console.log('═══════════════════════════════════════════');
      
      return publicUser;
    } catch (error: any) {
      console.log('═══════════════════════════════════════════');
      console.log('❌ ERROR EN LOGIN CON BACKEND');
      console.log('═══════════════════════════════════════════');
      console.log('🔴 Tipo de error:', error?.name || 'Desconocido');
      console.log('🔴 Mensaje:', error?.message || error);
      console.log('🔴 Status:', error?.status || 'N/A');
      console.log('💾 Intentando login con localStorage...');
      
      // Fallback a localStorage
      const users = initUsers();
      const user = users.find(u => 
        u.email.toLowerCase() === email.toLowerCase() && 
        u.passwordHash === password
      );
      
      if (!user) throw new Error('Credenciales incorrectas');
      
      const publicUser = toPublic(user);
      this.setSession(publicUser);
      return publicUser;
    }
  },

  // ========== REGISTRO ==========
  async register(dto: Omit<CreateUserDto, 'role'> & { role?: 'User' | 'Admin' }): Promise<PublicUser> {
    console.log('═══════════════════════════════════════════');
    console.log('📝 REGISTRANDO USUARIO');
    console.log('═══════════════════════════════════════════');
    console.log('📋 Datos:', { name: dto.name, email: dto.email, role: dto.role || 'User' });
    
    try {
      console.log('🌐 Intentando conectar al backend...');
      console.log('🔗 URL:', 'http://localhost:8081/api/users/register');
      
      const requestData = {
        name: dto.name.trim(),
        email: dto.email.trim().toLowerCase(),
        password: dto.password
      };
      console.log('📤 Enviando datos:', { ...requestData, password: '***' });
      
      const response = await usersApi.register(requestData);
      
      console.log('✅ ¡ÉXITO! Usuario registrado en BACKEND (MySQL)');
      console.log('📥 Respuesta del servidor:', response);
      console.log('═══════════════════════════════════════════');
      
      // Hacer login automático después de registro
      return await this.login(dto.email, dto.password);
    } catch (error: any) {
      console.log('═══════════════════════════════════════════');
      console.log('❌ ERROR AL REGISTRAR EN BACKEND');
      console.log('═══════════════════════════════════════════');
      console.log('🔴 Tipo de error:', error?.name || 'Desconocido');
      console.log('🔴 Mensaje:', error?.message || error);
      console.log('🔴 Status:', error?.status || 'N/A');
      console.log('🔴 Error completo:', error);
      console.log('💾 Guardando en localStorage como fallback...');
      
      // Fallback a localStorage
      const users = initUsers();
      if (users.find(u => u.email.toLowerCase() === dto.email.toLowerCase())) {
        throw new Error('El email ya está registrado');
      }
      
      const newUser: User = {
        id: crypto.randomUUID(),
        name: dto.name.trim(),
        email: dto.email.trim().toLowerCase(),
        role: dto.role || 'User',
        passwordHash: dto.password
      };
      
      users.push(newUser);
      storageService.write(K.users, users);
      
      const publicUser = toPublic(newUser);
      this.setSession(publicUser);
      return publicUser;
    }
  },

  // ========== CREAR USUARIO (Admin) ==========
  async createByAdmin(dto: CreateUserDto): Promise<PublicUser> {
    console.log('👤 Creando usuario desde admin...');
    
    try {
      const response = await usersApi.register({
        name: dto.name.trim(),
        email: dto.email.trim().toLowerCase(),
        password: dto.password
      });
      console.log('✅ Usuario creado en backend:', response);
      
      // También guardar en localStorage para sincronía
      const users = initUsers();
      const newUser: User = {
        id: String(response.id),
        name: response.name,
        email: response.email,
        role: response.roleFrontend,
        passwordHash: dto.password
      };
      users.push(newUser);
      storageService.write(K.users, users);
      
      return backendToPublic(response);
    } catch (error) {
      console.warn('⚠️ Backend no disponible, usando localStorage:', error);
      
      const users = initUsers();
      if (users.find(u => u.email.toLowerCase() === dto.email.toLowerCase())) {
        throw new Error('El email ya está registrado');
      }
      
      const newUser: User = {
        id: crypto.randomUUID(),
        name: dto.name.trim(),
        email: dto.email.trim().toLowerCase(),
        role: dto.role,
        passwordHash: dto.password
      };
      
      users.push(newUser);
      storageService.write(K.users, users);
      return toPublic(newUser);
    }
  },

  // ========== OBTENER TODOS ==========
  getAll(): User[] { 
    return initUsers(); 
  },
  
  async getAllAsync(): Promise<PublicUser[]> { 
    console.log('📋 Obteniendo usuarios...');
    
    try {
      const response = await usersApi.getAll();
      console.log('✅ Usuarios obtenidos del backend:', response.length);
      return response.map(backendToPublic);
    } catch (error) {
      console.warn('⚠️ Backend no disponible, usando localStorage');
      return initUsers().map(toPublic); 
    }
  },
  
  saveAll(users: User[]): void { 
    storageService.write(K.users, users); 
  },
  
  findByEmail(email: string): User | null { 
    return initUsers().find(u => u.email.toLowerCase() === email.toLowerCase()) || null; 
  },
  
  getById(id: string): User | null { 
    return initUsers().find(u => u.id === id) || null; 
  },
  
  logout(): void { 
    storageService.write(K.session, null); 
    console.log('🚪 Sesión cerrada');
  },
  
  setSession(user: PublicUser | null): void { 
    storageService.write(K.session, user); 
  },
  
  getSession(): PublicUser | null { 
    return storageService.read<PublicUser | null>(K.session, null); 
  },
  
  // ========== ACTUALIZAR ==========
  async update(id: string, partial: Partial<PublicUser>): Promise<PublicUser | null> {
    try {
      const response = await usersApi.update(Number(id), {
        name: partial.name,
        email: partial.email
      });
      console.log('✅ Usuario actualizado en backend');
      
      // También actualizar localStorage
      const users = initUsers();
      const idx = users.findIndex(u => u.id === id);
      if (idx !== -1) {
        users[idx] = { ...users[idx], ...partial };
        storageService.write(K.users, users);
      }
      
      return backendToPublic(response);
    } catch (error) {
      console.warn('⚠️ Backend no disponible, actualizando localStorage');
      
      const users = initUsers();
      const idx = users.findIndex(u => u.id === id);
      if (idx === -1) return null;
      
      users[idx] = { ...users[idx], ...partial };
      storageService.write(K.users, users);
      return toPublic(users[idx]);
    }
  },

  // ========== ELIMINAR ==========
  async remove(id: string): Promise<boolean> {
    try {
      await usersApi.delete(Number(id));
      console.log('✅ Usuario eliminado del backend');
      
      // También eliminar de localStorage
      const users = initUsers();
      const filtered = users.filter(u => u.id !== id);
      storageService.write(K.users, filtered);
      
      return true;
    } catch (error) {
      console.warn('⚠️ Backend no disponible, eliminando de localStorage');
      
      const users = initUsers();
      const filtered = users.filter(u => u.id !== id);
      if (filtered.length === users.length) return false;
      storageService.write(K.users, filtered);
      return true;
    }
  }
};
