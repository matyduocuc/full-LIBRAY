/**
 * SERVICIO DE LIBROS - SOLO BACKEND
 * Los datos vienen exclusivamente del microservicio (MySQL)
 * Sin fallback a localStorage - Para demostración académica
 */
import { booksApi } from '../api/booksApi';
import type { BookResponseDTO } from '../api/booksApi';
import type { Book } from '../domain/book';

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

// Cache local para métodos síncronos (se actualiza desde el backend)
let cachedBooks: Book[] = [];

export const bookService = {
  // ========== OBTENER TODOS ==========
  /**
   * Obtiene libros del cache local (síncrono)
   * Usar getAllAsync() para datos frescos del backend
   */
  getAll(): Book[] { 
    return cachedBooks; 
  },
  
  /**
   * Obtiene todos los libros del backend (MySQL)
   * Esta es la función principal - siempre usar esta
   */
  async getAllAsync(): Promise<Book[]> { 
    console.log('📚 Obteniendo libros del backend...');
    
      const response = await booksApi.getAllWithoutPagination();
      console.log('✅ Libros obtenidos del backend:', response.length);
      
    cachedBooks = response.map(backendToBook);
    return cachedBooks;
  },

  // ========== BUSCAR ==========
  /**
   * Búsqueda en cache local (síncrono)
   */
  search(query: string): Book[] {
    const q = query.trim().toLowerCase();
    if (!q) return this.getAll();
    return this.getAll().filter(b => 
      b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)
    );
  },

  /**
   * Búsqueda en el backend (MySQL)
   */
  async searchAsync(query: string): Promise<Book[]> {
    console.log('🔍 Buscando libros en backend:', query);
    
      const response = await booksApi.search(query);
      console.log('✅ Resultados de búsqueda:', response.length);
      return response.map(backendToBook);
  },

  // ========== FILTRAR POR CATEGORÍA ==========
  filterByCategory(category: string): Book[] {
    const cat = category.trim().toLowerCase();
    if (!cat) return this.getAll();
    return this.getAll().filter(b => b.category.toLowerCase() === cat);
  },

  async filterByCategoryAsync(category: string): Promise<Book[]> {
    console.log('📂 Filtrando por categoría:', category);
    
    const response = await booksApi.getByCategory(category);
    return response.map(backendToBook);
  },

  // ========== AGREGAR ==========
  /**
   * Crea un nuevo libro en el backend (MySQL)
   */
  async add(book: Omit<Book, 'id'>): Promise<Book> {
    console.log('📖 Agregando libro al backend:', book.title);
    
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
    cachedBooks.push(newBook);
      
      return newBook;
  },

  // ========== ACTUALIZAR ==========
  /**
   * Actualiza un libro en el backend (MySQL)
   */
  async update(id: string, changes: Partial<Book>): Promise<Book | null> {
    console.log('📝 Actualizando libro en backend:', id);
    
      const response = await booksApi.update(Number(id), {
        title: changes.title,
        author: changes.author,
        category: changes.category,
        description: changes.description,
        coverUrl: changes.coverUrl
      });
      console.log('✅ Libro actualizado en backend');
      
      const updatedBook = backendToBook(response);
      
    // Actualizar cache
    const idx = cachedBooks.findIndex(b => b.id === id || String(b.id) === id);
      if (idx !== -1) {
      cachedBooks[idx] = updatedBook;
      }
      
      return updatedBook;
  },

  // ========== OBTENER POR ID ==========
  /**
   * Obtiene libro del cache local (síncrono)
   */
  getById(id: string): Book | null { 
    return cachedBooks.find(b => b.id === id || String(b.id) === id) || null; 
  },
  
  /**
   * Obtiene un libro del backend (MySQL)
   */
  async getByIdAsync(id: string): Promise<Book | null> { 
    console.log('📖 Obteniendo libro del backend:', id);
    
      const response = await booksApi.getById(Number(id));
      if (!response) return null;
      console.log('✅ Libro obtenido del backend');
      return backendToBook(response);
  },

  // ========== ELIMINAR ==========
  /**
   * Elimina un libro del backend (MySQL)
   */
  async delete(id: string): Promise<boolean> {
    console.log('🗑️ Eliminando libro del backend:', id);
    
      await booksApi.delete(Number(id));
      console.log('✅ Libro eliminado del backend');
      
    // Actualizar cache
    cachedBooks = cachedBooks.filter(b => b.id !== id && String(b.id) !== id);
      
      return true;
  },

  /**
   * @deprecated Usar delete() en su lugar
   */
  remove(id: string): boolean {
    cachedBooks = cachedBooks.filter(b => b.id !== id);
    return true;
  },

  // ========== ESTADÍSTICAS ==========
  /**
   * Obtiene estadísticas del backend
   */
  async getStatistics() {
    return await booksApi.getStatistics();
  },

  // ========== DISPONIBILIDAD ==========
  /**
   * Verifica disponibilidad de un libro
   */
  async checkAvailability(id: string) {
    return await booksApi.checkAvailability(Number(id));
  }
};
