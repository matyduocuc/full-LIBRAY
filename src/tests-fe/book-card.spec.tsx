/**
 * Pruebas unitarias para el componente BookCard
 * 
 * ¿QUÉ ES UN MOCK?
 * ================
 * Un "mock" simula dependencias externas (como react-router) para aislar el componente.
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import { BookCard } from '../ui/books/BookCard';
import type { Book } from '../domain/book';

// Helper para renderizar con Router (necesario para useNavigate)
const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('BookCard', () => {
  const mockBook: Book = {
    id: '1',
    title: 'Clean Code',
    author: 'Robert C. Martin',
    category: 'Desarrollo de Software',
    description: 'Principios y buenas prácticas para escribir código claro y mantenible.',
    coverUrl: 'https://example.com/clean-code.jpg',
    status: 'disponible'
  };

  it('debe mostrar el título del libro', () => {
    renderWithRouter(<BookCard book={mockBook} />);
    
    expect(screen.getByText('Clean Code')).toBeInTheDocument();
  });

  it('debe mostrar el autor del libro', () => {
    renderWithRouter(<BookCard book={mockBook} />);
    
    expect(screen.getByText(/Robert C. Martin/)).toBeInTheDocument();
  });

  it('debe mostrar la categoría del libro', () => {
    renderWithRouter(<BookCard book={mockBook} />);
    
    expect(screen.getByText(/Desarrollo de Software/)).toBeInTheDocument();
  });

  it('debe mostrar el estado del libro como badge', () => {
    renderWithRouter(<BookCard book={mockBook} />);
    
    const statusBadge = screen.getByText('Disponible');
    expect(statusBadge).toBeInTheDocument();
    expect(statusBadge).toHaveClass('badge', 'bg-success');
  });

  it('debe mostrar el botón de solicitar préstamo cuando showActions es true y el libro está disponible', () => {
    const handleSelect = vi.fn();
    renderWithRouter(<BookCard book={mockBook} onSelect={handleSelect} showActions={true} />);
    
    const button = screen.getByText('Solicitar Préstamo');
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
  });

  it('debe deshabilitar el botón cuando el libro no está disponible', () => {
    const unavailableBook: Book = { ...mockBook, status: 'prestado' };
    const handleSelect = vi.fn();
    
    renderWithRouter(<BookCard book={unavailableBook} onSelect={handleSelect} showActions={true} />);
    
    const button = screen.getByText('Solicitar Préstamo');
    expect(button).toBeDisabled();
  });

  it('no debe mostrar el botón cuando showActions es false', () => {
    renderWithRouter(<BookCard book={mockBook} showActions={false} />);
    
    expect(screen.queryByText('Solicitar Préstamo')).not.toBeInTheDocument();
  });
});
