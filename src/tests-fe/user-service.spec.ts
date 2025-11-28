/**
 * Pruebas unitarias para el servicio de usuarios
 * 
 * Tests básicos para registro y login
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { userService } from '../services/user.service';

describe('userService', () => {
  beforeEach(() => {
    // Limpiar localStorage antes de cada prueba
    localStorage.clear();
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

