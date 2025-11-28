/**
 * Pruebas unitarias para el servicio de usuarios
 * 
 * Tests básicos para registro y login
 * 
 * ¿QUÉ ES UN MOCK?
 * ================
 * Un "mock" es una versión falsa/simulada de un módulo o función.
 * Se usa en tests para:
 * - Evitar llamadas HTTP reales (no queremos depender de un servidor)
 * - Controlar qué devuelven las funciones externas
 * - Aislar el código que estamos probando
 * 
 * En este archivo:
 * - Mockeamos 'usersApi' para simular las respuestas del backend
 * - Mockeamos 'storageService' para simular localStorage
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';

/**
 * MOCK DE usersApi
 * ================
 * vi.mock() reemplaza el módulo real por uno falso.
 * Todas las funciones devuelven promesas rechazadas para forzar
 * que el userService use su fallback a localStorage.
 */
vi.mock('../api/usersApi', () => ({
  usersApi: {
    // Simula que el backend no está disponible (rechaza las promesas)
    login: vi.fn().mockRejectedValue(new Error('Backend no disponible')),
    register: vi.fn().mockRejectedValue(new Error('Backend no disponible')),
    getAll: vi.fn().mockRejectedValue(new Error('Backend no disponible')),
    update: vi.fn().mockRejectedValue(new Error('Backend no disponible')),
    delete: vi.fn().mockRejectedValue(new Error('Backend no disponible')),
  }
}));

/**
 * MOCK DE localStorage
 * ====================
 * Creamos un almacenamiento en memoria que simula localStorage.
 * Esto es necesario porque Node.js no tiene localStorage nativo.
 */
const mockStorage: Record<string, string> = {};

vi.mock('../services/storage.service', () => ({
  storageService: {
    keys: { session: 'session', users: 'users' },
    // Lee del objeto mockStorage en memoria
    read: vi.fn((key: string, fallback: unknown) => {
      const value = mockStorage[key];
      if (!value) return fallback;
      try {
        return JSON.parse(value);
      } catch {
        return fallback;
      }
    }),
    // Escribe en el objeto mockStorage en memoria
    write: vi.fn((key: string, value: unknown) => {
      mockStorage[key] = JSON.stringify(value);
    }),
  }
}));

// Importamos DESPUÉS de los mocks para que use las versiones mockeadas
import { userService } from '../services/user.service';

describe('userService', () => {
  beforeEach(() => {
    // Limpiar el almacenamiento mock antes de cada prueba
    // Esto asegura que cada test empiece con datos limpios
    Object.keys(mockStorage).forEach(key => delete mockStorage[key]);
  });

  it('U1: debe registrar un usuario nuevo', async () => {
    const user = await userService.register({
      name: 'Test User',
      email: 'test@test.com',
      password: '123456'
    });
    
    expect(user).toBeDefined();
    expect(user.name).toBe('Test User');
    expect(user.email).toBe('test@test.com');
    expect(user.role).toBe('User');
  });

  it('U2: debe hacer login con credenciales correctas', async () => {
    // Primero registrar un usuario
    await userService.register({
      name: 'Login Test User',
      email: 'login@test.com',
      password: 'pass123'
    });
    
    // Luego hacer login
    const user = await userService.login('login@test.com', 'pass123');
    
    expect(user).toBeDefined();
    expect(user.email).toBe('login@test.com');
    expect(user.name).toBe('Login Test User');
  });

  it('U3: debe lanzar error con credenciales incorrectas', async () => {
    // Registrar usuario
    await userService.register({
      name: 'Error Test',
      email: 'error@test.com',
      password: 'correctpass'
    });
    
    // Intentar login con contraseña incorrecta
    await expect(
      userService.login('error@test.com', 'wrongpass')
    ).rejects.toThrow('Credenciales incorrectas');
  });

  it('U4: debe lanzar error si el email ya está registrado', async () => {
    // Registrar primer usuario
    await userService.register({
      name: 'First User',
      email: 'duplicate@test.com',
      password: '123456'
    });
    
    // Intentar registrar con mismo email
    await expect(
      userService.register({
        name: 'Second User',
        email: 'duplicate@test.com',
        password: '654321'
      })
    ).rejects.toThrow('El email ya está registrado');
  });
});
