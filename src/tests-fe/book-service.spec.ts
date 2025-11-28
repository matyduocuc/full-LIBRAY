/**
 * Pruebas unitarias para el servicio de libros
 * 
 * Verifica que las operaciones CRUD del servicio funcionen correctamente.
 * 
 * ¿QUÉ ES UN MOCK?
 * ================
 * Un "mock" es una versión falsa/simulada de un módulo o función.
 * Se usa en tests para:
 * - Evitar llamadas HTTP reales (no queremos depender de un servidor)
 * - Controlar qué devuelven las funciones externas
 * - Aislar el código que estamos probando
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';

/**
 * MOCK DE booksApi
 * ================
 * Simula que el backend no está disponible para forzar el uso de localStorage.
 */
vi.mock('../api/booksApi', () => ({
  booksApi: {
    getAllWithoutPagination: vi.fn().mockRejectedValue(new Error('Backend no disponible')),
    search: vi.fn().mockRejectedValue(new Error('Backend no disponible')),
    create: vi.fn().mockRejectedValue(new Error('Backend no disponible')),
    update: vi.fn().mockRejectedValue(new Error('Backend no disponible')),
    delete: vi.fn().mockRejectedValue(new Error('Backend no disponible')),
    getById: vi.fn().mockRejectedValue(new Error('Backend no disponible')),
  }
}));

/**
 * MOCK DE localStorage
 * ====================
 * Simula el almacenamiento en memoria para las pruebas.
 */
const mockStorage: Record<string, string> = {};

vi.mock('../services/storage.service', () => ({
  storageService: {
    keys: { books: 'books' },
    read: vi.fn((key: string, fallback: unknown) => {
      const value = mockStorage[key];
      if (!value) return fallback;
      try {
        return JSON.parse(value);
      } catch {
        return fallback;
      }
    }),
    write: vi.fn((key: string, value: unknown) => {
      mockStorage[key] = JSON.stringify(value);
    }),
  }
}));

// Importamos DESPUÉS de los mocks
import { bookService } from '../services/book.service';

describe('bookService', () => {
  beforeEach(() => {
    // Limpiar el almacenamiento mock antes de cada prueba
    Object.keys(mockStorage).forEach(key => delete mockStorage[key]);
  });

  // NOTA: El servicio tiene libros por defecto que se cargan automáticamente
  // cuando el storage está vacío. Los tests se adaptan a este comportamiento.

  it('debe cargar libros por defecto cuando el storage está vacío', () => {
    const books = bookService.getAll();
    // El servicio carga 8 libros por defecto
    expect(books.length).toBeGreaterThan(0);
    expect(books[0].title).toBeDefined();
  });

  it('debe agregar un nuevo libro y generar un ID automáticamente', async () => {
    const initialBooks = bookService.getAll();
    const initialCount = initialBooks.length;
    
    // add() es async, necesita await
    const newBook = await bookService.add({
      title: 'Test Book',
      author: 'Test Author',
      category: 'Test Category',
      description: 'A test book description',
      coverUrl: 'https://example.com/test-cover.jpg',
      status: 'disponible'
    });

    expect(newBook.id).toBeDefined();
    expect(newBook.title).toBe('Test Book');
    expect(newBook.author).toBe('Test Author');
    
    const allBooks = bookService.getAll();
    expect(allBooks).toHaveLength(initialCount + 1);
  });

  it('debe actualizar un libro existente', async () => {
    // Obtener un libro existente (de los por defecto)
    const existingBooks = bookService.getAll();
    const bookToUpdate = existingBooks[0];

    // update() es async
    const updated = await bookService.update(bookToUpdate.id, { title: 'Updated Title' });
    
    expect(updated).not.toBeNull();
    expect(updated?.title).toBe('Updated Title');
    expect(updated?.author).toBe(bookToUpdate.author); // Se mantiene
  });

  it('debe devolver null al intentar actualizar un libro inexistente', async () => {
    // update() es async
    const result = await bookService.update('non-existent-id', { title: 'New Title' });
    expect(result).toBeNull();
  });

  it('debe obtener un libro por su ID', () => {
    const existingBooks = bookService.getAll();
    const bookToFind = existingBooks[0];

    // getById() es síncrono
    const found = bookService.getById(bookToFind.id);
    expect(found).not.toBeNull();
    expect(found?.id).toBe(bookToFind.id);
  });

  it('debe eliminar un libro', async () => {
    const initialBooks = bookService.getAll();
    const bookToDelete = initialBooks[0];
    const initialCount = initialBooks.length;

    // delete() es async
    const deleted = await bookService.delete(bookToDelete.id);
    expect(deleted).toBe(true);
    
    const allBooks = bookService.getAll();
    expect(allBooks).toHaveLength(initialCount - 1);
    expect(bookService.getById(bookToDelete.id)).toBeNull();
  });

  it('debe devolver false al intentar eliminar un libro inexistente', async () => {
    // delete() es async
    const result = await bookService.delete('non-existent-id');
    expect(result).toBe(false);
  });

  it('L1: debe buscar libros por título', () => {
    // Buscar "Clean" que está en los libros por defecto
    const results = bookService.search('Clean');
    
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].title.toLowerCase()).toContain('clean');
  });

  it('L2: debe filtrar libros por categoría', () => {
    // Filtrar por "Programación" que está en los libros por defecto
    const results = bookService.filterByCategory('Programación');
    
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].category).toBe('Programación');
  });

  it('L3: debe buscar libros por autor', () => {
    // Buscar "Martin" que está en los libros por defecto (Robert C. Martin)
    const results = bookService.search('Martin');
    
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].author.toLowerCase()).toContain('martin');
  });
});
