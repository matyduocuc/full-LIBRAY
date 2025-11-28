/**
 * SERVICIO DE LIBROS - CONECTADO A BACKEND
 * Intenta usar el microservicio, fallback a localStorage
 */
import { storageService } from './storage.service';
import { booksApi, BookResponseDTO } from '../api/booksApi';
import type { Book } from '../domain/book';

const K = { books: 'books' };

// Libros por defecto (fallback)
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

// Convierte BookResponseDTO del backend a Book del frontend
function backendToBook(dto: BookResponseDTO): Book {
  return {
    id: String(dto.id),
    title: dto.title,
    author: dto.author,
    category: dto.category || 'General',
    description: dto.description || '',
    coverUrl: dto.coverUrl || '',
    status: dto.statusFrontend // "disponible", "prestado", "reservado"
  };
}

export const bookService = {
  // ========== OBTENER TODOS ==========
  getAll(): Book[] { 
    return initBooks(); 
  },
  
  async getAllAsync(): Promise<Book[]> { 
    console.log('📚 Obteniendo libros...');
    
    try {
      const response = await booksApi.getAllWithoutPagination();
      console.log('✅ Libros obtenidos del backend:', response.length);
      
      const books = response.map(backendToBook);
      // Sincronizar con localStorage
      storageService.write(K.books, books);
      return books;
    } catch (error) {
      console.warn('⚠️ Backend no disponible, usando localStorage');
      return initBooks(); 
    }
  },

  // ========== BUSCAR ==========
  search(query: string): Book[] {
    const q = query.trim().toLowerCase();
    if (!q) return this.getAll();
    return this.getAll().filter(b => 
      b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)
    );
  },

  async searchAsync(query: string): Promise<Book[]> {
    console.log('🔍 Buscando libros:', query);
    
    try {
      const response = await booksApi.search(query);
      console.log('✅ Resultados de búsqueda:', response.length);
      return response.map(backendToBook);
    } catch (error) {
      console.warn('⚠️ Backend no disponible, buscando en localStorage');
      return this.search(query);
    }
  },

  // ========== FILTRAR POR CATEGORÍA ==========
  filterByCategory(category: string): Book[] {
    const cat = category.trim().toLowerCase();
    if (!cat) return this.getAll();
    return this.getAll().filter(b => b.category.toLowerCase() === cat);
  },

  saveAll(books: Book[]): void { 
    storageService.write(K.books, books); 
  },

  // ========== AGREGAR ==========
  async add(book: Omit<Book, 'id'>): Promise<Book> {
    console.log('📖 Agregando libro:', book.title);
    
    try {
      const response = await booksApi.create({
        title: book.title,
        author: book.author,
        category: book.category,
        description: book.description,
        coverUrl: book.coverUrl,
        totalCopies: 1
      });
      console.log('✅ Libro creado en backend:', response.id);
      
      const newBook = backendToBook(response);
      
      // También guardar en localStorage
      const books = this.getAll();
      books.push(newBook);
      this.saveAll(books);
      
      return newBook;
    } catch (error) {
      console.warn('⚠️ Backend no disponible, guardando en localStorage:', error);
      
      const newBook: Book = { 
        ...book, 
        id: crypto.randomUUID(), 
        status: book.status || 'disponible' 
      };
      
      const books = this.getAll();
      books.push(newBook);
      this.saveAll(books);
      
      return newBook;
    }
  },

  // ========== ACTUALIZAR ==========
  async update(id: string, changes: Partial<Book>): Promise<Book | null> {
    console.log('📝 Actualizando libro:', id);
    
    try {
      const response = await booksApi.update(Number(id), {
        title: changes.title,
        author: changes.author,
        category: changes.category,
        description: changes.description,
        coverUrl: changes.coverUrl
      });
      console.log('✅ Libro actualizado en backend');
      
      const updatedBook = backendToBook(response);
      
      // Actualizar localStorage
      const books = this.getAll();
      const idx = books.findIndex(b => b.id === id || String(b.id) === id);
      if (idx !== -1) {
        books[idx] = updatedBook;
        this.saveAll(books);
      }
      
      return updatedBook;
    } catch (error) {
      console.warn('⚠️ Backend no disponible, actualizando localStorage');
      
      const books = this.getAll();
      const idx = books.findIndex(b => b.id === id);
      if (idx === -1) return null;
      
      books[idx] = { ...books[idx], ...changes };
      this.saveAll(books);
      return books[idx];
    }
  },

  // ========== OBTENER POR ID ==========
  getById(id: string): Book | null { 
    return this.getAll().find(b => b.id === id || String(b.id) === id) || null; 
  },
  
  async getByIdAsync(id: string): Promise<Book | null> { 
    console.log('📖 Obteniendo libro:', id);
    
    try {
      const response = await booksApi.getById(Number(id));
      if (!response) return null;
      console.log('✅ Libro obtenido del backend');
      return backendToBook(response);
    } catch (error) {
      console.warn('⚠️ Backend no disponible, buscando en localStorage');
      return this.getById(id); 
    }
  },

  // ========== ELIMINAR ==========
  async delete(id: string): Promise<boolean> {
    console.log('🗑️ Eliminando libro:', id);
    
    try {
      await booksApi.delete(Number(id));
      console.log('✅ Libro eliminado del backend');
      
      // También eliminar de localStorage
      const books = this.getAll();
      const filtered = books.filter(b => b.id !== id && String(b.id) !== id);
      this.saveAll(filtered);
      
      return true;
    } catch (error) {
      console.warn('⚠️ Backend no disponible, eliminando de localStorage');
      
      const books = this.getAll();
      const filtered = books.filter(b => b.id !== id);
      if (filtered.length === books.length) return false;
      this.saveAll(filtered);
      return true;
    }
  },

  remove(id: string): boolean {
    const books = this.getAll();
    const filtered = books.filter(b => b.id !== id);
    if (filtered.length === books.length) return false;
    this.saveAll(filtered);
    return true;
  }
};
