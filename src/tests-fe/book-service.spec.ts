/**
 * Pruebas unitarias para el servicio de libros
 * 
 * Verifica que las operaciones CRUD del servicio funcionen correctamente
 * con localStorage. Estas pruebas verifican la lógica de negocio.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { bookService } from '../services/book.service';

describe('bookService', () => {
  beforeEach(() => {
    // Limpiar localStorage antes de cada prueba
    localStorage.clear();
  });

  it('debe devolver un array vacío cuando no hay libros', () => {
    const books = bookService.getAll();
    expect(books).toEqual([]);
  });

  it('debe agregar un nuevo libro y generar un ID automáticamente', () => {
    const newBook = bookService.add({
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
    expect(allBooks).toHaveLength(1);
    expect(allBooks[0]).toEqual(newBook);
  });

  it('debe actualizar un libro existente', () => {
    const book = bookService.add({
      title: 'Original Title',
      author: 'Original Author',
      category: 'Category',
      description: 'Original description',
      coverUrl: 'https://example.com/original-cover.jpg',
      status: 'disponible'
    });

    const updated = bookService.update(book.id, { title: 'Updated Title' });
    
    expect(updated).not.toBeNull();
    expect(updated?.title).toBe('Updated Title');
    expect(updated?.author).toBe('Original Author'); // Se mantiene
    
    const allBooks = bookService.getAll();
    expect(allBooks[0].title).toBe('Updated Title');
  });

  it('debe devolver null al intentar actualizar un libro inexistente', () => {
    const result = bookService.update('non-existent-id', { title: 'New Title' });
    expect(result).toBeNull();
  });

  it('debe obtener un libro por su ID', () => {
    const book = bookService.add({
      title: 'Test Book',
      author: 'Author',
      category: 'Category',
      description: 'Test description',
      coverUrl: 'https://example.com/test-cover.jpg',
      status: 'disponible'
    });

    const found = bookService.getById(book.id);
    expect(found).not.toBeNull();
    expect(found?.id).toBe(book.id);
    expect(found?.title).toBe('Test Book');
  });

  it('debe eliminar un libro', () => {
    const book = bookService.add({
      title: 'To Delete',
      author: 'Author',
      category: 'Category',
      description: 'Description to delete',
      coverUrl: 'https://example.com/delete-cover.jpg',
      status: 'disponible'
    });

    const deleted = bookService.delete(book.id);
    expect(deleted).toBe(true);
    
    const allBooks = bookService.getAll();
    expect(allBooks).toHaveLength(0);
    expect(bookService.getById(book.id)).toBeNull();
  });

  it('debe devolver false al intentar eliminar un libro inexistente', () => {
    const result = bookService.delete('non-existent-id');
    expect(result).toBe(false);
  });

  it('L1: debe buscar libros por título', async () => {
    // Agregar libros de prueba
    await bookService.add({
      title: 'JavaScript Guide',
      author: 'JS Author',
      category: 'Programación',
      description: 'Una guía completa de JavaScript para desarrolladores',
      coverUrl: 'https://example.com/js.jpg',
      status: 'disponible'
    });
    await bookService.add({
      title: 'Python Basics',
      author: 'Python Author',
      category: 'Programación',
      description: 'Introducción básica al lenguaje Python',
      coverUrl: 'https://example.com/python.jpg',
      status: 'disponible'
    });
    
    // Buscar por título
    const results = bookService.search('JavaScript');
    
    expect(results.length).toBe(1);
    expect(results[0].title).toContain('JavaScript');
  });

  it('L2: debe filtrar libros por categoría', async () => {
    // Agregar libros de diferentes categorías
    await bookService.add({
      title: 'Programming Book',
      author: 'Author 1',
      category: 'Programación',
      description: 'Un libro sobre programación muy interesante',
      coverUrl: 'https://example.com/prog.jpg',
      status: 'disponible'
    });
    await bookService.add({
      title: 'History Book',
      author: 'Author 2',
      category: 'Historia',
      description: 'Un libro sobre historia mundial muy completo',
      coverUrl: 'https://example.com/history.jpg',
      status: 'disponible'
    });
    
    // Filtrar por categoría
    const results = bookService.filterByCategory('Programación');
    
    expect(results.length).toBe(1);
    expect(results[0].category).toBe('Programación');
  });

  it('L3: debe buscar libros por autor', () => {
    bookService.add({
      title: 'Clean Code',
      author: 'Robert Martin',
      category: 'Programación',
      description: 'Principios y patrones de código limpio para programadores',
      coverUrl: 'https://example.com/clean.jpg',
      status: 'disponible'
    });
    bookService.add({
      title: 'Design Patterns',
      author: 'Gang of Four',
      category: 'Programación',
      description: 'Patrones de diseño de software explicados con ejemplos',
      coverUrl: 'https://example.com/patterns.jpg',
      status: 'disponible'
    });
    
    const results = bookService.search('Robert');
    
    expect(results.length).toBe(1);
    expect(results[0].author).toContain('Robert');
  });
});


