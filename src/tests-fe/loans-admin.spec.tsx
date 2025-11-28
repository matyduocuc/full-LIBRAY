/**
 * Pruebas unitarias para LoansAdmin
 * 
 * ¿QUÉ ES UN MOCK?
 * ================
 * Un "mock" simula dependencias externas para aislar el componente.
 * Aquí mockeamos los servicios para controlar qué datos devuelven.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { LoansAdmin } from '../ui/admin/LoansAdmin';
import type { LegacyLoan } from '../domain/loan';

// Préstamo mock para las pruebas
const mockLoan: LegacyLoan = {
  id: 'loan1',
  userId: 'u1',
  bookId: 'b1',
  loanDate: new Date().toISOString(),
  dueDate: new Date().toISOString(),
  status: 'pendiente'
};

// Mock de book service
vi.mock('../services/book.service', () => ({
  bookService: {
    getById: vi.fn(() => ({
      id: 'b1',
      title: 'Test Book',
      author: 'Test Author',
      category: 'Test',
      status: 'disponible',
      coverUrl: '',
      description: 'Test'
    })),
    getAll: vi.fn(() => []),
  }
}));

// Mock de user service
vi.mock('../services/user.service', () => ({
  userService: {
    getById: vi.fn(() => ({
      id: 'u1',
      name: 'Test User',
      email: 'test@test.com',
      role: 'User'
    })),
    getAll: vi.fn(() => []),
  }
}));

// Mock de loan service - con estado mutable para simular cambios
let mockLoans = [{ ...mockLoan }];

vi.mock('../services/loan.service', () => ({
  loanService: {
    getAll: vi.fn(() => mockLoans),
    approve: vi.fn((id) => {
      const loan = mockLoans.find(l => l.id === id);
      if (loan) {
        loan.status = 'aprobado';
        return Promise.resolve(loan);
      }
      return Promise.resolve(null);
    }),
    reject: vi.fn((id) => {
      const loan = mockLoans.find(l => l.id === id);
      if (loan) {
        loan.status = 'rechazado';
        return Promise.resolve(loan);
      }
      return Promise.resolve(null);
    }),
    saveAll: vi.fn(),
  }
}));

// Mock de APIs
vi.mock('../api/loansApi', () => ({
  loansApi: {
    getAll: vi.fn().mockRejectedValue(new Error('Backend no disponible')),
  }
}));

// Helper para renderizar con Router
const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

// Importar después de los mocks
import { loanService } from '../services/loan.service';

describe('LoansAdmin', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Resetear los préstamos mock
    mockLoans = [{
      id: 'loan1',
      userId: 'u1',
      bookId: 'b1',
      loanDate: new Date().toISOString(),
      dueDate: new Date().toISOString(),
      status: 'pendiente'
    }];
  });

  it('cambia estado tras aprobar', async () => {
    renderWithRouter(<LoansAdmin />);
    
    const approveBtn = await screen.findByRole('button', { name: /aprobar/i });
    await userEvent.click(approveBtn);
    
    const loans = loanService.getAll();
    expect(loans.some(l => l.status === 'aprobado')).toBe(true);
  });
});
