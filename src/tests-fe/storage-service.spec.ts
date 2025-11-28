/**
 * Pruebas unitarias para el servicio de almacenamiento
 * 
 * Verifica que las operaciones de lectura/escritura de localStorage
 * funcionen correctamente, incluyendo el manejo de errores.
 * 
 * ¿QUÉ ES UN MOCK?
 * ================
 * Un "mock" simula localStorage en memoria porque Node.js no lo tiene.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';

/**
 * MOCK DE localStorage
 * ====================
 * Simulamos localStorage en memoria para las pruebas.
 */
const mockStorage: Record<string, string> = {};

const localStorageMock = {
  getItem: vi.fn((key: string) => mockStorage[key] || null),
  setItem: vi.fn((key: string, value: string) => {
    mockStorage[key] = value;
  }),
  clear: vi.fn(() => {
    Object.keys(mockStorage).forEach(key => delete mockStorage[key]);
  }),
  removeItem: vi.fn((key: string) => {
    delete mockStorage[key];
  }),
};

// Reemplazar localStorage global con nuestro mock
Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

// Importamos DESPUÉS de configurar el mock
import { storageService } from '../services/storage.service';

describe('storageService', () => {
  beforeEach(() => {
    // Limpiar el almacenamiento mock antes de cada prueba
    Object.keys(mockStorage).forEach(key => delete mockStorage[key]);
    vi.clearAllMocks();
  });

  it('debe leer un valor que existe en localStorage', () => {
    const testData = { name: 'test', value: 123 };
    mockStorage['test-key'] = JSON.stringify(testData);
    
    const result = storageService.read('test-key', {});
    expect(result).toEqual(testData);
  });

  it('debe devolver el fallback cuando la clave no existe', () => {
    const fallback = { default: true };
    const result = storageService.read('non-existent-key', fallback);
    expect(result).toEqual(fallback);
  });

  it('debe devolver el fallback cuando el JSON es inválido', () => {
    mockStorage['invalid-json'] = 'not valid json {';
    const fallback = { default: true };
    
    const result = storageService.read('invalid-json', fallback);
    expect(result).toEqual(fallback);
  });

  it('debe escribir un valor en localStorage', () => {
    const testData = { name: 'write-test', value: 456 };
    storageService.write('write-key', testData);
    
    const stored = mockStorage['write-key'];
    expect(stored).toBeDefined();
    expect(JSON.parse(stored)).toEqual(testData);
  });

  it('debe usar las claves correctas definidas en STORAGE_KEYS', () => {
    expect(storageService.keys.books).toBe('books');
    expect(storageService.keys.users).toBe('users');
    expect(storageService.keys.loans).toBe('loans');
    expect(storageService.keys.session).toBe('session');
    expect(storageService.keys.admin).toBe('admin');
  });
});
