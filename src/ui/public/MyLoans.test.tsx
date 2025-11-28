/**
 * Tests para MyLoans - Manejo de préstamos del usuario
 * 
 * ¿QUÉ ES UN MOCK?
 * ================
 * Un "mock" simula módulos externos para aislar el código que probamos.
 * Aquí mockeamos la API y servicios para no depender de un servidor real.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MyLoans } from './MyLoans';
import * as loanServiceModule from '../../services/loan.service';
import * as bookServiceModule from '../../services/book.service';

// Mock de las dependencias
vi.mock('../../api/loansApi', () => ({
  loansApi: {
    getByUser: vi.fn().mockRejectedValue(new Error('Backend no disponible')),
  }
}));

vi.mock('../../api/booksApi', () => ({
  booksApi: {
    getById: vi.fn().mockRejectedValue(new Error('Backend no disponible')),
  }
}));

const mockUser = { id: 'user1', name: 'Test User', role: 'User' as const };

vi.mock('../../hooks/useUser', () => ({
  useUser: () => ({ user: mockUser }),
}));

const renderWithRouter = () => {
  window.history.pushState({}, '', '/my-loans');
  return render(
    <BrowserRouter>
      <Routes>
        <Route path="/my-loans" element={<MyLoans />} />
      </Routes>
    </BrowserRouter>
  );
};

describe('MyLoans', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.history.pushState({}, '', '/my-loans');
  });

  it('debe mostrar mensaje cuando no hay préstamos', async () => {
    // Mock: sin préstamos
    vi.spyOn(loanServiceModule.loanService, 'getByUser').mockReturnValue([]);

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText(/No tienes préstamos registrados/i)).toBeInTheDocument();
    });
  });

  it('debe mostrar botón para explorar catálogo cuando no hay préstamos', async () => {
    vi.spyOn(loanServiceModule.loanService, 'getByUser').mockReturnValue([]);

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText(/Explorar catálogo/i)).toBeInTheDocument();
    });
  });

  it('debe mostrar préstamos cuando existen en localStorage', async () => {
    const mockLoans = [
      {
        id: 'loan1',
        userId: 'user1',
        bookId: 'book1',
        loanDate: '2024-01-01',
        dueDate: '2024-01-15',
        status: 'aprobado' as const,
      },
    ];

    const mockBook = {
      id: 'book1',
      title: 'Test Book',
      author: 'Test Author',
      category: 'Test',
      status: 'prestado' as const,
      coverUrl: '',
      description: 'Test',
    };

    // Mock: localStorage tiene préstamos
    vi.spyOn(loanServiceModule.loanService, 'getByUser').mockReturnValue(mockLoans);
    vi.spyOn(bookServiceModule.bookService, 'getById').mockReturnValue(mockBook);

    renderWithRouter();

    await waitFor(() => {
      // Debe mostrar el libro del préstamo
      expect(screen.getByText('Test Book')).toBeInTheDocument();
    });
  });

  it('debe mostrar el estado del préstamo', async () => {
    const mockLoans = [
      {
        id: 'loan2',
        userId: 'user1',
        bookId: 'book2',
        loanDate: '2024-01-01',
        dueDate: '2024-01-15',
        status: 'pendiente' as const,
      },
    ];

    const mockBook = {
      id: 'book2',
      title: 'Another Book',
      author: 'Another Author',
      category: 'Test',
      status: 'reservado' as const,
      coverUrl: '',
      description: 'Test',
    };

    vi.spyOn(loanServiceModule.loanService, 'getByUser').mockReturnValue(mockLoans);
    vi.spyOn(bookServiceModule.bookService, 'getById').mockReturnValue(mockBook);

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('Another Book')).toBeInTheDocument();
    });
  });
});
