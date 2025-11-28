/**
 * API client para microservicio de Libros (librabackend)
 * Conectado a: http://localhost:8082/api/books
 */
import { httpClient, ApiError } from './httpClient';

// DTO del backend - BookResponseDTO
export interface BookResponseDTO {
  id: number;
  title: string;
  author: string;
  isbn?: string;
  category?: string;
  publisher?: string;
  year?: number;
  description?: string;
  coverUrl?: string;
  status: 'AVAILABLE' | 'LOANED' | 'RESERVED';
  statusFrontend: 'disponible' | 'prestado' | 'reservado'; // Campo compatible con frontend
  totalCopies: number;
  availableCopies: number;
  price?: number;
  featured?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// DTO para crear libro
export interface BookCreateDTO {
  title: string;
  author: string;
  isbn?: string;
  category?: string;
  publisher?: string;
  year?: number;
  description?: string;
  coverUrl?: string;
  totalCopies?: number;
  price?: number;
  featured?: boolean;
}

// DTO para actualizar libro
export interface BookUpdateDTO {
  title?: string;
  author?: string;
  isbn?: string;
  category?: string;
  publisher?: string;
  year?: number;
  description?: string;
  coverUrl?: string;
  totalCopies?: number;
  price?: number;
  featured?: boolean;
}

// Respuesta paginada
export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

// DTO de disponibilidad
export interface BookAvailabilityDTO {
  bookId: number;
  available: boolean;
  availableCopies: number;
  totalCopies: number;
}

// DTO de estadísticas
export interface BookStatisticsDTO {
  totalBooks: number;
  availableBooks: number;
  loanedBooks: number;
  totalCopies: number;
  availableCopies: number;
}

export const booksApi = {
  /**
   * Obtiene todos los libros (paginado)
   * Endpoint: GET /api/books?page=0&size=10
   */
  async getAll(page = 0, size = 100): Promise<BookResponseDTO[]> {
    const data = await httpClient.get<PageResponse<BookResponseDTO>>(
      `${httpClient.urls.books}?page=${page}&size=${size}`
    );
    return data?.content || [];
  },

  /**
   * Obtiene todos los libros sin paginación
   * Endpoint: GET /api/books/all
   */
  async getAllWithoutPagination(): Promise<BookResponseDTO[]> {
    const data = await httpClient.get<BookResponseDTO[]>(`${httpClient.urls.books}/all`);
    return Array.isArray(data) ? data : [];
  },

  /**
   * Obtiene un libro por ID
   * Endpoint: GET /api/books/{id}
   */
  async getById(id: number): Promise<BookResponseDTO | null> {
    try {
      const data = await httpClient.get<BookResponseDTO>(`${httpClient.urls.books}/${id}`);
      return data || null;
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        return null;
      }
      throw error;
    }
  },

  /**
   * Crea un nuevo libro
   * Endpoint: POST /api/books
   */
  async create(book: BookCreateDTO): Promise<BookResponseDTO> {
    return await httpClient.post<BookResponseDTO>(`${httpClient.urls.books}`, book);
  },

  /**
   * Actualiza un libro existente
   * Endpoint: PUT /api/books/{id}
   */
  async update(id: number, book: BookUpdateDTO): Promise<BookResponseDTO> {
    return await httpClient.put<BookResponseDTO>(`${httpClient.urls.books}/${id}`, book);
  },

  /**
   * Elimina un libro
   * Endpoint: DELETE /api/books/{id}
   */
  async delete(id: number): Promise<void> {
    await httpClient.delete<void>(`${httpClient.urls.books}/${id}`);
  },

  /**
   * Busca libros
   * Endpoint: GET /api/books/search?q=texto
   */
  async search(query: string, page = 0, size = 10): Promise<BookResponseDTO[]> {
    const data = await httpClient.get<PageResponse<BookResponseDTO>>(
      `${httpClient.urls.books}/search?q=${encodeURIComponent(query)}&page=${page}&size=${size}`
    );
    return data?.content || [];
  },

  /**
   * Obtiene libros por categoría
   * Endpoint: GET /api/books/category/{category}
   */
  async getByCategory(category: string, page = 0, size = 10): Promise<BookResponseDTO[]> {
    const data = await httpClient.get<PageResponse<BookResponseDTO>>(
      `${httpClient.urls.books}/category/${encodeURIComponent(category)}?page=${page}&size=${size}`
    );
    return data?.content || [];
  },

  /**
   * Obtiene libros destacados
   * Endpoint: GET /api/books/featured
   */
  async getFeatured(page = 0, size = 10): Promise<BookResponseDTO[]> {
    const data = await httpClient.get<PageResponse<BookResponseDTO>>(
      `${httpClient.urls.books}/featured?page=${page}&size=${size}`
    );
    return data?.content || [];
  },

  /**
   * Verifica disponibilidad de un libro
   * Endpoint: GET /api/books/{id}/availability
   */
  async checkAvailability(id: number): Promise<BookAvailabilityDTO> {
    return await httpClient.get<BookAvailabilityDTO>(`${httpClient.urls.books}/${id}/availability`);
  },

  /**
   * Actualiza las copias de un libro
   * Endpoint: PATCH /api/books/{id}/copies?change=1
   */
  async updateCopies(id: number, change: number): Promise<BookResponseDTO> {
    return await httpClient.patch<BookResponseDTO>(
      `${httpClient.urls.books}/${id}/copies?change=${change}`,
      {}
    );
  },

  /**
   * Obtiene estadísticas de libros
   * Endpoint: GET /api/books/statistics
   */
  async getStatistics(): Promise<BookStatisticsDTO> {
    return await httpClient.get<BookStatisticsDTO>(`${httpClient.urls.books}/statistics`);
  },
};
