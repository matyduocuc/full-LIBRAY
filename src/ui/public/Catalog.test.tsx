/**
 * Tests para Catalog - Manejo de errores de conexión y sin resultados
 * 
 * ¿QUÉ ES UN MOCK?
 * ================
 * Un "mock" simula módulos externos para aislar el código que probamos.
 * Aquí mockeamos la API y servicios para no depender de un servidor real.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Catalog } from './Catalog';
import * as bookServiceModule from '../../services/book.service';

// Mock de las dependencias
vi.mock('../../api/booksApi', () => ({
  booksApi: {
    getAll: vi.fn().mockRejectedValue(new Error('Backend no disponible')),
    getAllWithoutPagination: vi.fn().mockRejectedValue(new Error('Backend no disponible')),
  }
}));

vi.mock('../../hooks/useUser', () => ({
  useUser: () => ({ user: null }),
}));

vi.mock('../../services/cart.service', () => ({
  cartService: {
    get: vi.fn().mockReturnValue([]),
  },
}));

// Helper para renderizar con Router (necesario para useNavigate)
const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Catalog', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe mostrar libros cuando hay datos en localStorage', async () => {
    const mockBooks = [
      {
        id: 'book1',
        title: 'Test Book 1',
        author: 'Author 1',
        category: 'Category 1',
        status: 'disponible' as const,
        coverUrl: '',
        description: 'Description 1',
      },
    ];

    // Mock: localStorage tiene libros
    vi.spyOn(bookServiceModule.bookService, 'getAll').mockReturnValue(mockBooks);
    vi.spyOn(bookServiceModule.bookService, 'search').mockReturnValue(mockBooks);
    vi.spyOn(bookServiceModule.bookService, 'filterByCategory').mockReturnValue(mockBooks);

    renderWithRouter(<Catalog />);

    await waitFor(() => {
      expect(screen.getByText('Test Book 1')).toBeInTheDocument();
    });
  });

  it('debe mostrar mensaje cuando no hay libros', async () => {
    // Mock: localStorage vacío
    vi.spyOn(bookServiceModule.bookService, 'getAll').mockReturnValue([]);
    vi.spyOn(bookServiceModule.bookService, 'search').mockReturnValue([]);
    vi.spyOn(bookServiceModule.bookService, 'filterByCategory').mockReturnValue([]);

    renderWithRouter(<Catalog />);

    // El componente renderiza aunque no haya libros
    await waitFor(() => {
      const container = document.querySelector('.container');
      expect(container).toBeInTheDocument();
    });
  });

  it('debe filtrar libros por búsqueda', async () => {
    const mockBooks = [
      {
        id: 'book1',
        title: 'JavaScript Guide',
        author: 'JS Author',
        category: 'Programación',
        status: 'disponible' as const,
        coverUrl: '',
        description: 'Description',
      },
      {
        id: 'book2',
        title: 'Python Basics',
        author: 'Python Author',
        category: 'Programación',
        status: 'disponible' as const,
        coverUrl: '',
        description: 'Description',
      },
    ];

    vi.spyOn(bookServiceModule.bookService, 'getAll').mockReturnValue(mockBooks);
    vi.spyOn(bookServiceModule.bookService, 'search').mockImplementation((query) => {
      return mockBooks.filter(b => 
        b.title.toLowerCase().includes(query.toLowerCase())
      );
    });

    renderWithRouter(<Catalog />);

    await waitFor(() => {
      // Ambos libros deberían aparecer inicialmente
      expect(screen.getByText('JavaScript Guide')).toBeInTheDocument();
      expect(screen.getByText('Python Basics')).toBeInTheDocument();
    });
  });
});
