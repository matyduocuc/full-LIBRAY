/**
 * Pruebas unitarias para el componente LoanForm
 * 
 * ¿QUÉ ES UN MOCK?
 * ================
 * Un "mock" simula dependencias externas para aislar el componente.
 * Aquí mockeamos los servicios para controlar qué datos devuelven.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { LoanForm } from '../ui/loans/LoanForm';
import type { Book } from '../domain/book';
import type { User } from '../domain/user';
import type { LegacyLoan } from '../domain/loan';

// Datos mock para las pruebas
const mockBook: Book = {
  id: '1',
  title: 'Clean Code',
  author: 'Robert C. Martin',
  category: 'Dev',
  description: 'A book about clean code',
  coverUrl: 'https://example.com/clean-code.jpg',
  status: 'disponible' // Importante: debe estar disponible
};

const mockUser: User = {
  id: '1',
  name: 'Juan Pérez',
  email: 'juan@example.com',
  role: 'User',
  passwordHash: 'hash123'
};

const mockLoan: LegacyLoan = {
  id: 'loan1',
  userId: '1',
  bookId: '1',
  loanDate: new Date().toISOString(),
  dueDate: new Date().toISOString(),
  status: 'pendiente'
};

// Mock de los servicios
vi.mock('../services/book.service', () => ({
  bookService: {
    getAll: vi.fn(() => [{
      id: '1',
      title: 'Clean Code',
      author: 'Robert C. Martin',
      category: 'Dev',
      description: 'A book about clean code',
      coverUrl: 'https://example.com/clean-code.jpg',
      status: 'disponible'
    }]),
  }
}));

vi.mock('../services/user.service', () => ({
  userService: {
    getAll: vi.fn(() => [{
      id: '1',
      name: 'Juan Pérez',
      email: 'juan@example.com',
      role: 'User',
      passwordHash: 'hash123'
    }]),
  }
}));

vi.mock('../services/loan.service', () => ({
  loanService: {
    // El componente llama: loanService.request(userId, bookId)
    request: vi.fn(() => ({
      id: 'loan1',
      userId: '1',
      bookId: '1',
      loanDate: new Date().toISOString(),
      dueDate: new Date().toISOString(),
      status: 'pendiente'
    })),
  }
}));

// Importar después de los mocks
import { loanService } from '../services/loan.service';

describe('LoanForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe mostrar el formulario con los campos de libro y usuario', () => {
    render(<LoanForm onLoanCreated={vi.fn()} />);
    
    expect(screen.getByLabelText(/Libro/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Usuario/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Solicitar Préstamo/i })).toBeInTheDocument();
  });

  it('debe mostrar los libros disponibles en el select', () => {
    render(<LoanForm onLoanCreated={vi.fn()} />);
    
    const bookSelect = screen.getByLabelText(/Libro/i);
    expect(bookSelect).toBeInTheDocument();
    expect(screen.getByText(/Clean Code/)).toBeInTheDocument();
  });

  it('debe mostrar los usuarios en el select', () => {
    render(<LoanForm onLoanCreated={vi.fn()} />);
    
    const userSelect = screen.getByLabelText(/Usuario/i);
    expect(userSelect).toBeInTheDocument();
    expect(screen.getByText(/Juan Pérez/)).toBeInTheDocument();
  });

  it('debe crear un préstamo cuando se completa y envía el formulario', async () => {
    const user = userEvent.setup();
    const onLoanCreated = vi.fn();
    
    render(<LoanForm onLoanCreated={onLoanCreated} />);
    
    // Seleccionar libro
    const bookSelect = screen.getByLabelText(/Libro/i);
    await user.selectOptions(bookSelect, '1');
    
    // Seleccionar usuario
    const userSelect = screen.getByLabelText(/Usuario/i);
    await user.selectOptions(userSelect, '1');
    
    // Enviar formulario
    const submitButton = screen.getByRole('button', { name: /Solicitar Préstamo/i });
    await user.click(submitButton);
    
    // Verificar que se llamó al servicio - orden: (userId, bookId)
    expect(loanService.request).toHaveBeenCalledWith('1', '1');
    expect(onLoanCreated).toHaveBeenCalled();
  });

  it('debe mostrar un mensaje de éxito después de crear el préstamo', async () => {
    const user = userEvent.setup();
    
    render(<LoanForm onLoanCreated={vi.fn()} />);
    
    const bookSelect = screen.getByLabelText(/Libro/i);
    await user.selectOptions(bookSelect, '1');
    
    const userSelect = screen.getByLabelText(/Usuario/i);
    await user.selectOptions(userSelect, '1');
    
    const submitButton = screen.getByRole('button', { name: /Solicitar Préstamo/i });
    await user.click(submitButton);
    
    // El componente muestra "Préstamo solicitado exitosamente. Espera aprobación del administrador."
    await waitFor(() => {
      expect(screen.getByText(/Préstamo solicitado exitosamente/i)).toBeInTheDocument();
    });
  });
});
