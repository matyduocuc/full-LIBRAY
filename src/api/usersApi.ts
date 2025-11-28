/**
 * API client para microservicio de Usuarios (librabackend)
 * Conectado a: http://localhost:8081/api/users
 */
import { httpClient, ApiError } from './httpClient';

// DTO del backend - UserResponseDTO
export interface UserResponseDTO {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: 'USUARIO' | 'ADMINISTRADOR';
  roleFrontend: 'Admin' | 'User'; // Campo compatible con frontend
  status: 'ACTIVO' | 'BLOQUEADO';
  profileImageUri?: string;
  createdAt?: string;
  updatedAt?: string;
}

// DTO del backend - LoginResponseDTO
export interface LoginResponseDTO {
  token: string;
  user: UserResponseDTO;
  expiresIn: number;
}

// DTO para login
export interface UserLoginDTO {
  email: string;
  password: string;
}

// DTO para registro
export interface UserRegistrationDTO {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

// DTO para actualizar usuario
export interface UserUpdateDTO {
  name?: string;
  email?: string;
  phone?: string;
  profileImageUri?: string;
}

// Tipos legacy para compatibilidad con el frontend existente
export interface AuthResponse {
  token: string;
  type?: string;
  id: number;
  email: string;
  nombre: string;
  rut: string;
  roles: string[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export const usersApi = {
  /**
   * Inicia sesión
   * Endpoint: POST /api/users/login
   */
  async login(credentials: UserLoginDTO): Promise<LoginResponseDTO> {
    return await httpClient.post<LoginResponseDTO>(
      `${httpClient.urls.auth}/login`,
      credentials
    );
  },

  /**
   * Registra un nuevo usuario
   * Endpoint: POST /api/users/register
   */
  async register(userData: UserRegistrationDTO): Promise<UserResponseDTO> {
    return await httpClient.post<UserResponseDTO>(
      `${httpClient.urls.users}/register`,
      userData
    );
  },

  /**
   * Obtiene todos los usuarios (solo admin)
   * Endpoint: GET /api/users
   */
  async getAll(): Promise<UserResponseDTO[]> {
    const data = await httpClient.get<UserResponseDTO[]>(`${httpClient.urls.users}`);
    return Array.isArray(data) ? data : [];
  },

  /**
   * Obtiene un usuario por ID
   * Endpoint: GET /api/users/{id}
   */
  async getById(id: number): Promise<UserResponseDTO | null> {
    try {
      const data = await httpClient.get<UserResponseDTO>(`${httpClient.urls.users}/${id}`);
      return data || null;
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        return null;
      }
      throw error;
    }
  },

  /**
   * Actualiza un usuario
   * Endpoint: PUT /api/users/{id}
   */
  async update(id: number, userData: UserUpdateDTO): Promise<UserResponseDTO> {
    return await httpClient.put<UserResponseDTO>(`${httpClient.urls.users}/${id}`, userData);
  },

  /**
   * Elimina un usuario (solo admin)
   * Endpoint: DELETE /api/users/{id}
   */
  async delete(id: number): Promise<void> {
    await httpClient.delete<void>(`${httpClient.urls.users}/${id}`);
  },

  /**
   * Bloquea/desbloquea un usuario (solo admin)
   * Endpoint: PATCH /api/users/{id}/block
   */
  async block(id: number, blocked: boolean): Promise<UserResponseDTO> {
    return await httpClient.patch<UserResponseDTO>(
      `${httpClient.urls.users}/${id}/block`,
      { blocked }
    );
  },

  /**
   * Cambia el rol de un usuario (solo admin)
   * Endpoint: PATCH /api/users/{id}/role
   */
  async changeRole(id: number, role: 'USUARIO' | 'ADMINISTRADOR'): Promise<UserResponseDTO> {
    return await httpClient.patch<UserResponseDTO>(
      `${httpClient.urls.users}/${id}/role`,
      { role }
    );
  },

  /**
   * Valida un token JWT
   * Endpoint: POST /api/users/validate-token
   */
  async validateToken(token: string): Promise<{ valid: boolean; userId?: number }> {
    return await httpClient.post<{ valid: boolean; userId?: number }>(
      `${httpClient.urls.users}/validate-token`,
      { token }
    );
  },
};
