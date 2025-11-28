/**
 * Catálogo de Libros - CONECTADO A BACKEND
 * Carga libros desde microservicio con fallback a localStorage
 */
import { useEffect, useMemo, useState, useCallback } from 'react';
import { bookService } from '../../services/book.service';
import type { Book } from '../../domain/book';
import { BookCard } from '../books/BookCard';
import { useUser } from '../../hooks/useUser';
import { cartService } from '../../services/cart.service';
import { EmptyState } from '../shared/EmptyState';

export function Catalog() {
  const { user } = useUser();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [cartItems, setCartItems] = useState<Array<{ bookId: string; addedAt: string }>>([]);

  const reload = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('📚 Cargando catálogo...');
      
      // Usar el servicio que maneja backend + fallback
      const loadedBooks = await bookService.getAllAsync();
      console.log('✅ Libros cargados:', loadedBooks.length);
      setBooks(loadedBooks);
    } catch (err) {
      console.warn('⚠️ Error cargando libros:', err);
      // Fallback a localStorage
      const localBooks = bookService.getAll();
      if (localBooks.length > 0) {
        setBooks(localBooks);
        setError(null);
      } else {
        setError(err instanceof Error ? err : new Error('Error al cargar los libros'));
      }
    } finally {
      setLoading(false);
      setCartItems(cartService.get());
    }
  }, []);

  useEffect(() => {
    reload();
    
    // Refrescar carrito cada 500ms
    const interval = setInterval(() => {
      setCartItems(cartService.get());
    }, 500);
    
    return () => clearInterval(interval);
  }, [reload]);

  const categories = useMemo(() => {
    const all = Array.from(new Set(books.map(b => b.category)));
    return all.sort();
  }, [books]);

  const filtered = useMemo(() => {
    let result = books;
    if (query) {
      const q = query.trim().toLowerCase();
      if (q) {
        result = result.filter(b => 
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q)
        );
      }
    }
    if (category) {
      result = result.filter(b => b.category.toLowerCase() === category.toLowerCase());
    }
    return result;
  }, [books, query, category]);

  // Mostrar error si hay y no hay libros
  if (error && books.length === 0) {
    return (
      <div className="container py-4">
        <div className="alert alert-danger">
          <i className="bi bi-exclamation-triangle me-2"></i>
          Error al cargar el catálogo. Por favor, recarga la página.
        </div>
        <button className="btn btn-primary" onClick={reload}>
          <i className="bi bi-arrow-clockwise me-1"></i>Reintentar
        </button>
      </div>
    );
  }

  // Mostrar loading
  if (loading && books.length === 0) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3 text-muted">Cargando catálogo...</p>
        </div>
      </div>
    );
  }

  // Mostrar estado vacío si no hay resultados después de filtrar
  if (!loading && filtered.length === 0 && (query || category)) {
    return (
      <div>
        <div className="mb-4">
          <h2 className="mb-3">
            <i className="bi bi-book me-2"></i>Catálogo de Libros
          </h2>
          <div className="row g-3 align-items-end">
            <div className="col-md-6">
              <label className="form-label">
                <i className="bi bi-search me-1"></i>Buscar
              </label>
              <input 
                className="form-control" 
                placeholder="Título o autor..." 
                value={query} 
                onChange={e => setQuery(e.target.value)} 
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">
                <i className="bi bi-filter me-1"></i>Categoría
              </label>
              <select className="form-select" value={category} onChange={e => setCategory(e.target.value)}>
                <option value="">Todas las categorías</option>
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div className="col-md-2">
              <button className="btn btn-outline-secondary w-100" onClick={() => { setQuery(''); setCategory(''); }}>
                <i className="bi bi-x-lg me-1"></i>Limpiar
              </button>
            </div>
          </div>
        </div>
        <EmptyState
          title="No se encontraron libros"
          message={`No hay libros que coincidan con tu búsqueda "${query}"${category ? ` en la categoría "${category}"` : ''}. Intenta con otros términos de búsqueda.`}
          icon="bi-search"
        />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="mb-0">
            <i className="bi bi-book me-2"></i>Catálogo de Libros
          </h2>
          <button 
            className="btn btn-outline-primary btn-sm" 
            onClick={reload}
            disabled={loading}
          >
            {loading ? (
              <span className="spinner-border spinner-border-sm"></span>
            ) : (
              <i className="bi bi-arrow-clockwise"></i>
            )}
          </button>
        </div>
        
        <div className="row g-3 align-items-end">
          <div className="col-md-5">
            <label className="form-label">
              <i className="bi bi-search me-1"></i>Buscar
            </label>
            <input 
              className="form-control" 
              placeholder="Título o autor..." 
              value={query} 
              onChange={e => setQuery(e.target.value)} 
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">
              <i className="bi bi-filter me-1"></i>Categoría
            </label>
            <select className="form-select" value={category} onChange={e => setCategory(e.target.value)}>
              <option value="">Todas las categorías</option>
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          <div className="col-md-3">
            <div className="d-flex justify-content-between align-items-center">
              <span className="text-muted small">
                <i className="bi bi-info-circle me-1"></i>
                {filtered.length} libro{filtered.length !== 1 ? 's' : ''}
              </span>
              {(query || category) && (
                <button 
                  className="btn btn-sm btn-outline-secondary" 
                  onClick={() => { setQuery(''); setCategory(''); }}
                >
                  <i className="bi bi-x-lg"></i>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-3">
        {filtered.map(b => (
          <div className="col" key={b.id}>
            <BookCard 
              book={b} 
              isInCart={cartItems.some(item => item.bookId === b.id)}
              userId={user?.id || null}
              onCartChange={reload}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
