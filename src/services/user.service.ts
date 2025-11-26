/**
 * SERVICIO DE USUARIOS - MANTENIMIENTO COMPLETO
 * Funciona 100% con localStorage
 */
import { storageService } from './storage.service';
import type { User, PublicUser, CreateUserDto } from '../domain/user';

const K = { session: 'session', users: 'users' };

// Usuarios por defecto
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
  // Asegurar que admin existe
  if (!users.find(u => u.email === 'admin@biblioteca.com')) {
    users.push(DEFAULT_USERS[0]);
    storageService.write(K.users, users);
  }
  return users;
}

function toPublic(u: User): PublicUser {
  return { id: u.id, name: u.name, email: u.email, role: u.role };
}

export const userService = {
  // LOGIN
  async login(email: string, password: string): Promise<PublicUser> {
    const users = initUsers();
    const user = users.find(u => 
      u.email.toLowerCase() === email.toLowerCase() && 
      u.passwordHash === password
    );
    if (!user) throw new Error('Credenciales incorrectas');
    const publicUser = toPublic(user);
    this.setSession(publicUser);
    return publicUser;
  },

  // REGISTRO
  async register(dto: Omit<CreateUserDto, 'role'> & { role?: 'User' | 'Admin' }): Promise<PublicUser> {
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
  },

  // CREAR USUARIO (Admin)
  async createByAdmin(dto: CreateUserDto): Promise<PublicUser> {
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
  },

  getAll(): User[] { return initUsers(); },
  async getAllAsync(): Promise<PublicUser[]> { return initUsers().map(toPublic); },
  saveAll(users: User[]): void { storageService.write(K.users, users); },
  findByEmail(email: string): User | null { 
    return initUsers().find(u => u.email.toLowerCase() === email.toLowerCase()) || null; 
  },
  getById(id: string): User | null { return initUsers().find(u => u.id === id) || null; },
  logout(): void { storageService.write(K.session, null); },
  setSession(user: PublicUser | null): void { storageService.write(K.session, user); },
  getSession(): PublicUser | null { return storageService.read<PublicUser | null>(K.session, null); },
  
  update(id: string, partial: Partial<PublicUser>): PublicUser | null {
    const users = initUsers();
    const idx = users.findIndex(u => u.id === id);
    if (idx === -1) return null;
    users[idx] = { ...users[idx], ...partial };
    storageService.write(K.users, users);
    return toPublic(users[idx]);
  },

  remove(id: string): boolean {
    const users = initUsers();
    const filtered = users.filter(u => u.id !== id);
    if (filtered.length === users.length) return false;
    storageService.write(K.users, filtered);
    return true;
  }
};
