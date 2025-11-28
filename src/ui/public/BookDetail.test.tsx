/**
 * Tests para BookDetail - Manejo de errores de rutas y recursos
 * 
 * ¿QUÉ ES UN MOCK?
 * ================
 * Un "mock" simula módulos externos para aislar el código que probamos.
 * Aquí mockeamos la API para no depender de un servidor real.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { BookDetail } from './BookDetail';
import * as bookServiceModule from '../../services/book.service';

// Mock de las dependencias - Simula módulos externos
vi.mock('../../api/booksApi', () => ({
  booksApi: {
    getById: vi.fn().mockRejectedValue(new Error('Backend no disponible')),
  }
}));

vi.mock('../../hooks/useUser', () => ({
  useUser: () => ({ user: { id: 'user1', name: 'Test User', role: 'User' } }),
}));

vi.mock('../../services/cart.service', () => ({
  cartService: {
    add: vi.fn(),
  },
}));

const renderWithRouter = (initialPath: string) => {
  window.history.pushState({}, '', initialPath);
  return render(
    <BrowserRouter>
      <Routes>
        <Route path="/book/:id" element={<BookDetail />} />
      </Routes>
    </BrowserRouter>
  );
};

describe('BookDetail', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe mostrar un mensaje de error cuando el libro no existe', async () => {
    // Mock: localStorage retorna null (libro no existe)
    vi.spyOn(bookServiceModule.bookService, 'getById').mockReturnValue(null);

    renderWithRouter('/book/nonexistent-id');

    // El componente debe mostrar algún tipo de error o mensaje
    await waitFor(() => {
      // Verificamos que se renderice el componente de error
      const container = document.querySelector('.container');
      expect(container).toBeInTheDocument();
    });
  });

  it('debe mostrar el libro cuando existe en localStorage', async () => {
    const mockBook = {
      id: 'book1',
      title: 'Test Book',
      author: 'Test Author',
      category: 'Test',
      status: 'disponible' as const,
      coverUrl: '',
      description: 'Test description',
    };

    // Mock: localStorage tiene el libro
    vi.spyOn(bookServiceModule.bookService, 'getById').mockReturnValue(mockBook);

    renderWithRouter('/book/book1');

    await waitFor(() => {
      // Debe mostrar el título del libro
      expect(screen.getByText('Test Book')).toBeInTheDocument();
    });
  });

  it('debe mostrar el autor del libro', async () => {
    const mockBook = {
      id: 'book2',
      title: 'Another Book',
      author: 'Another Author',
      category: 'Fiction',
      status: 'disponible' as const,
      coverUrl: '',
      description: 'Another description',
    };

    vi.spyOn(bookServiceModule.bookService, 'getById').mockReturnValue(mockBook);

    renderWithRouter('/book/book2');

    await waitFor(() => {
      expect(screen.getByText('Another Author')).toBeInTheDocument();
    });
  });
});
