/**
 * Panel de Stock/Inventario - Gestión de Copias de Libros
 * 
 * Requisitos EFT DSY1104:
 * - Visualización de inventario de productos (libros)
 * - Control de stock (copias totales vs disponibles)
 * - Alertas de bajo stock
 * - Gestión de inventario (agregar/quitar copias)
 * 
 * Conectado al backend: GET /api/books/statistics
 *                       PATCH /api/books/{id}/copies
 */
import { useEffect, useState, useCallback } from 'react';
import { booksApi, BookResponseDTO, BookStatisticsDTO } from '../../api/booksApi';

// Umbral de bajo stock (alerta cuando hay menos de esta cantidad disponible)
const LOW_STOCK_THRESHOLD = 2;

export function StockAdmin() {
  const [books, setBooks] = useState<BookResponseDTO[]>([]);
  const [statistics, setStatistics] = useState<BookStatisticsDTO | null>(null);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState<number | null>(null);
  const [filter, setFilter] = useState<'all' | 'low' | 'out'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Cargar datos del backend
  const loadData = useCallback(async () => {
    setLoading(true);
    console.log('📦 Cargando inventario...');
    try {
      const [booksData, statsData] = await Promise.all([
        booksApi.getAllWithoutPagination(),
        booksApi.getStatistics()
      ]);
      setBooks(booksData);
      setStatistics(statsData);
      console.log('✅ Inventario cargado:', booksData.length, 'libros');
    } catch (error) {
      console.error('❌ Error cargando inventario:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  // Modificar copias de un libro
  const updateCopies = async (bookId: number, change: number) => {
    setUpdating(bookId);
    console.log(`📝 Actualizando copias del libro ${bookId}: ${change > 0 ? '+' : ''}${change}`);
    try {
      await booksApi.updateCopies(bookId, change);
      await loadData();
      console.log('✅ Stock actualizado');
    } catch (error) {
      console.error('❌ Error actualizando stock:', error);
      alert('Error al actualizar el stock. Verifica la conexión con el backend.');
    } finally {
      setUpdating(null);
    }
  };

  // Filtrar libros según criterio
  const filteredBooks = books.filter(book => {
    // Filtro por búsqueda
    const matchesSearch = searchTerm === '' || 
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;

    // Filtro por estado de stock
    switch (filter) {
      case 'low': return book.availableCopies <= LOW_STOCK_THRESHOLD && book.availableCopies > 0;
      case 'out': return book.availableCopies === 0;
      default: return true;
    }
  });

  // Calcular estadísticas adicionales
  const lowStockCount = books.filter(b => b.availableCopies <= LOW_STOCK_THRESHOLD && b.availableCopies > 0).length;
  const outOfStockCount = books.filter(b => b.availableCopies === 0).length;

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2><i className="bi bi-box-seam me-2"></i>Panel de Stock</h2>
        <button 
          className="btn btn-outline-primary" 
          onClick={loadData}
          disabled={loading}
        >
          {loading ? (
            <><span className="spinner-border spinner-border-sm me-2"></span>Cargando...</>
          ) : (
            <><i className="bi bi-arrow-clockwise me-2"></i>Actualizar</>
          )}
        </button>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="row g-3 mb-4">
        <div className="col-md-3 col-sm-6">
          <div className="card bg-primary text-white h-100 shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-subtitle mb-1 text-white-50">Total Libros</h6>
                  <h2 className="card-title mb-0">{statistics?.totalBooks || 0}</h2>
                </div>
                <i className="bi bi-book display-4 opacity-50"></i>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-3 col-sm-6">
          <div className="card bg-success text-white h-100 shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-subtitle mb-1 text-white-50">Copias Disponibles</h6>
                  <h2 className="card-title mb-0">{statistics?.availableCopies || 0}</h2>
                </div>
                <i className="bi bi-check-circle display-4 opacity-50"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3 col-sm-6">
          <div className="card bg-info text-white h-100 shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-subtitle mb-1 text-white-50">Total Copias</h6>
                  <h2 className="card-title mb-0">{statistics?.totalCopies || 0}</h2>
                </div>
                <i className="bi bi-boxes display-4 opacity-50"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3 col-sm-6">
          <div className={`card ${outOfStockCount > 0 ? 'bg-danger' : 'bg-secondary'} text-white h-100 shadow-sm`}>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-subtitle mb-1 text-white-50">Sin Stock</h6>
                  <h2 className="card-title mb-0">{outOfStockCount}</h2>
                </div>
                <i className="bi bi-exclamation-triangle display-4 opacity-50"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alertas */}
      {lowStockCount > 0 && (
        <div className="alert alert-warning d-flex align-items-center mb-4" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2 fs-4"></i>
          <div>
            <strong>⚠️ Alerta de Stock Bajo:</strong> {lowStockCount} libro(s) tienen menos de {LOW_STOCK_THRESHOLD} copias disponibles.
          </div>
        </div>
      )}

      {outOfStockCount > 0 && (
        <div className="alert alert-danger d-flex align-items-center mb-4" role="alert">
          <i className="bi bi-x-octagon-fill me-2 fs-4"></i>
          <div>
            <strong>🚨 Sin Stock:</strong> {outOfStockCount} libro(s) no tienen copias disponibles.
          </div>
        </div>
      )}

      {/* Filtros y búsqueda */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text"><i className="bi bi-search"></i></span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Buscar por título o autor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="btn-group w-100" role="group">
                <button
                  className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setFilter('all')}
                >
                  <i className="bi bi-list me-1"></i>
                  Todos ({books.length})
                </button>
                <button
                  className={`btn ${filter === 'low' ? 'btn-warning' : 'btn-outline-warning'}`}
                  onClick={() => setFilter('low')}
                >
                  <i className="bi bi-exclamation-circle me-1"></i>
                  Stock Bajo ({lowStockCount})
                </button>
                <button
                  className={`btn ${filter === 'out' ? 'btn-danger' : 'btn-outline-danger'}`}
                  onClick={() => setFilter('out')}
                >
                  <i className="bi bi-x-circle me-1"></i>
                  Sin Stock ({outOfStockCount})
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de inventario */}
      <div className="card shadow-sm">
        <div className="card-header bg-white">
          <h5 className="mb-0">
            <i className="bi bi-table me-2"></i>
            Inventario de Libros
            <span className="badge bg-secondary ms-2">{filteredBooks.length}</span>
          </h5>
        </div>
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Título</th>
                <th>Autor</th>
                <th>Categoría</th>
                <th className="text-center">Copias Totales</th>
                <th className="text-center">Disponibles</th>
                <th className="text-center">Prestadas</th>
                <th className="text-center">Estado</th>
                <th className="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} className="text-center py-4">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Cargando...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredBooks.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-4 text-muted">
                    <i className="bi bi-inbox display-4 d-block mb-2"></i>
                    No se encontraron libros
                  </td>
                </tr>
              ) : (
                filteredBooks.map(book => {
                  const loanedCopies = book.totalCopies - book.availableCopies;
                  const stockPercentage = book.totalCopies > 0 
                    ? (book.availableCopies / book.totalCopies) * 100 
                    : 0;
                  
                  let statusBadge = 'bg-success';
                  let statusText = 'OK';
                  
                  if (book.availableCopies === 0) {
                    statusBadge = 'bg-danger';
                    statusText = 'SIN STOCK';
                  } else if (book.availableCopies <= LOW_STOCK_THRESHOLD) {
                    statusBadge = 'bg-warning text-dark';
                    statusText = 'BAJO';
                  }

                  return (
                    <tr key={book.id}>
                      <td className="text-muted">#{book.id}</td>
                      <td>
                        <strong>{book.title}</strong>
                      </td>
                      <td className="text-muted">{book.author}</td>
                      <td>
                        <span className="badge bg-info">{book.category || 'General'}</span>
                      </td>
                      <td className="text-center">
                        <span className="fw-bold">{book.totalCopies}</span>
                      </td>
                      <td className="text-center">
                        <span className={`fw-bold ${book.availableCopies === 0 ? 'text-danger' : 'text-success'}`}>
                          {book.availableCopies}
                        </span>
                      </td>
                      <td className="text-center">
                        <span className="text-primary">{loanedCopies}</span>
                      </td>
                      <td className="text-center">
                        <span className={`badge ${statusBadge}`}>{statusText}</span>
                        <div className="progress mt-1" style={{ height: '4px' }}>
                          <div 
                            className={`progress-bar ${book.availableCopies === 0 ? 'bg-danger' : book.availableCopies <= LOW_STOCK_THRESHOLD ? 'bg-warning' : 'bg-success'}`}
                            style={{ width: `${stockPercentage}%` }}
                          ></div>
                        </div>
                      </td>
                      <td className="text-center">
                        <div className="btn-group btn-group-sm" role="group">
                          <button
                            className="btn btn-outline-danger"
                            onClick={() => updateCopies(book.id, -1)}
                            disabled={updating === book.id || book.totalCopies <= book.totalCopies - book.availableCopies}
                            title="Quitar una copia"
                          >
                            {updating === book.id ? (
                              <span className="spinner-border spinner-border-sm"></span>
                            ) : (
                              <i className="bi bi-dash-lg"></i>
                            )}
                          </button>
                          <button
                            className="btn btn-outline-success"
                            onClick={() => updateCopies(book.id, 1)}
                            disabled={updating === book.id}
                            title="Agregar una copia"
                          >
                            {updating === book.id ? (
                              <span className="spinner-border spinner-border-sm"></span>
                            ) : (
                              <i className="bi bi-plus-lg"></i>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Leyenda */}
      <div className="mt-3 text-muted small">
        <i className="bi bi-info-circle me-1"></i>
        <strong>Leyenda:</strong> 
        <span className="badge bg-success ms-2">OK</span> Stock normal | 
        <span className="badge bg-warning text-dark ms-2">BAJO</span> Menos de {LOW_STOCK_THRESHOLD} copias | 
        <span className="badge bg-danger ms-2">SIN STOCK</span> No hay copias disponibles
      </div>
    </div>
  );
}




