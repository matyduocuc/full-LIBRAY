/**
 * Pruebas unitarias para el catálogo
 * 
 * ¿QUÉ ES UN MOCK?
 * ================
 * Un "mock" simula dependencias externas para aislar el componente.
 * Aquí mockeamos los servicios para controlar qué datos devuelven.
 * 
 * NOTA: vi.mock() se "hoistea" al inicio del archivo, por eso los datos
 * deben estar DENTRO del factory, no como variables externas.
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import { Catalog } from '../ui/public/Catalog';

// Mock de las dependencias
vi.mock('../api/booksApi', () => ({
  booksApi: {
    getAllWithoutPagination: vi.fn().mockRejectedValue(new Error('Backend no disponible')),
  }
}));

vi.mock('../hooks/useUser', () => ({
  useUser: () => ({ user: null }),
}));

vi.mock('../services/cart.service', () => ({
  cartService: {
    get: vi.fn().mockReturnValue([]),
  },
}));

// Mock de book service - los datos DEBEN estar dentro del factory
vi.mock('../services/book.service', () => {
  // Datos mock definidos DENTRO del factory
  const books = [
    { id: 'b1', title: 'Clean Code', author: 'Robert C. Martin', category: 'Programación', status: 'disponible', coverUrl: '', description: 'Test' },
    { id: 'b2', title: 'Design Patterns', author: 'GoF', category: 'Programación', status: 'disponible', coverUrl: '', description: 'Test' },
    { id: 'b3', title: 'Fundamentos BD', author: 'Elmasri', category: 'Base de Datos', status: 'disponible', coverUrl: '', description: 'Test' },
    { id: 'b4', title: 'JavaScript', author: 'Crockford', category: 'Programación', status: 'disponible', coverUrl: '', description: 'Test' },
    { id: 'b5', title: 'Refactoring', author: 'Fowler', category: 'Programación', status: 'disponible', coverUrl: '', description: 'Test' },
    { id: 'b6', title: 'Sistemas Op', author: 'Tanenbaum', category: 'Sistemas', status: 'disponible', coverUrl: '', description: 'Test' },
    { id: 'b7', title: 'Redes', author: 'Kurose', category: 'Redes', status: 'disponible', coverUrl: '', description: 'Test' },
    { id: 'b8', title: 'Arquitectura', author: 'Buschmann', category: 'Arquitectura', status: 'disponible', coverUrl: '', description: 'Test' },
  ];
  
  return {
    bookService: {
      getAll: vi.fn(() => books),
      getAllAsync: vi.fn().mockResolvedValue(books),
      search: vi.fn((q: string) => books.filter(b => 
        b.title.toLowerCase().includes(q.toLowerCase()) ||
        b.author.toLowerCase().includes(q.toLowerCase())
      )),
      filterByCategory: vi.fn((cat: string) => books.filter(b => 
        b.category.toLowerCase() === cat.toLowerCase()
      )),
    }
  };
});

// Helper para renderizar con Router
const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Catalog', () => {
  it('renderiza cards con datos del seed', async () => {
    renderWithRouter(<Catalog />);
    
    // Esperar a que se carguen los libros
    await waitFor(() => {
      expect(screen.getByText('Clean Code')).toBeInTheDocument();
    }, { timeout: 3000 });
  });
});
