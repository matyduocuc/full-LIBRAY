/**
 * SERVICIO DE LIBROS - MANTENIMIENTO COMPLETO
 * Funciona 100% con localStorage
 */
import { storageService } from './storage.service';
import type { Book } from '../domain/book';

const K = { books: 'books' };

// Libros por defecto
const DEFAULT_BOOKS: Book[] = [
  { id: 'b1', title: 'Clean Code', author: 'Robert C. Martin', category: 'Programación', status: 'disponible', coverUrl: '', description: 'Principios para escribir código limpio' },
  { id: 'b2', title: 'Design Patterns', author: 'GoF', category: 'Programación', status: 'disponible', coverUrl: '', description: 'Patrones de diseño clásicos' },
  { id: 'b3', title: 'Fundamentos de Bases de Datos', author: 'Elmasri & Navathe', category: 'Base de Datos', status: 'disponible', coverUrl: '', description: 'Modelado y diseño de BD' },
  { id: 'b4', title: 'JavaScript: The Good Parts', author: 'Douglas Crockford', category: 'Programación', status: 'disponible', coverUrl: '', description: 'Lo mejor de JavaScript' },
  { id: 'b5', title: 'Refactoring', author: 'Martin Fowler', category: 'Programación', status: 'disponible', coverUrl: '', description: 'Técnicas de refactorización' },
  { id: 'b6', title: 'Sistemas Operativos', author: 'Tanenbaum', category: 'Sistemas', status: 'disponible', coverUrl: '', description: 'Conceptos de SO' },
  { id: 'b7', title: 'Redes de Computadoras', author: 'Kurose & Ross', category: 'Redes', status: 'disponible', coverUrl: '', description: 'Fundamentos de redes' },
  { id: 'b8', title: 'Patrones de Arquitectura', author: 'Buschmann', category: 'Arquitectura', status: 'disponible', coverUrl: '', description: 'Patrones arquitectónicos' }
];

function initBooks(): Book[] {
  let books = storageService.read<Book[]>(K.books, []);
  if (books.length === 0) {
    books = [...DEFAULT_BOOKS];
    storageService.write(K.books, books);
  }
  return books;
}

export const bookService = {
  getAll(): Book[] { return initBooks(); },
  async getAllAsync(): Promise<Book[]> { return initBooks(); },

  search(query: string): Book[] {
    const q = query.trim().toLowerCase();
    if (!q) return this.getAll();
    return this.getAll().filter(b => 
      b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)
    );
  },

  filterByCategory(category: string): Book[] {
    const cat = category.trim().toLowerCase();
    if (!cat) return this.getAll();
    return this.getAll().filter(b => b.category.toLowerCase() === cat);
  },

  saveAll(books: Book[]): void { storageService.write(K.books, books); },

  async add(book: Omit<Book, 'id'>): Promise<Book> {
    const newBook: Book = { ...book, id: crypto.randomUUID(), status: book.status || 'disponible' };
    const books = this.getAll();
    books.push(newBook);
    this.saveAll(books);
    return newBook;
  },

  async update(id: string, changes: Partial<Book>): Promise<Book | null> {
    const books = this.getAll();
    const idx = books.findIndex(b => b.id === id);
    if (idx === -1) return null;
    books[idx] = { ...books[idx], ...changes };
    this.saveAll(books);
    return books[idx];
  },

  getById(id: string): Book | null { return this.getAll().find(b => b.id === id) || null; },
  async getByIdAsync(id: string): Promise<Book | null> { return this.getById(id); },

  async delete(id: string): Promise<boolean> {
    const books = this.getAll();
    const filtered = books.filter(b => b.id !== id);
    if (filtered.length === books.length) return false;
    this.saveAll(filtered);
    return true;
  },

  remove(id: string): boolean {
    const books = this.getAll();
    const filtered = books.filter(b => b.id !== id);
    if (filtered.length === books.length) return false;
    this.saveAll(filtered);
    return true;
  }
};
