/**
 * Dashboard de Administrador - CONECTADO A BACKEND
 * Carga datos en tiempo real desde microservicios
 * Auto-refresh cada 30 segundos
 */
import { useState, useEffect, useCallback } from 'react';
import { bookService } from '../../services/book.service';
import { userService } from '../../services/user.service';
import { loanService } from '../../services/loan.service';
import { reportsApi } from '../../api/reportsApi';

export function AdminDashboard() {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalUsers: 0,
    totalLoans: 0,
    availableBooks: 0,
    activeLoans: 0,
    pendingLoans: 0,
    loansByStatus: {} as Record<string, number>,
    recentUsers: [] as any[]
  });
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const loadStats = useCallback(async () => {
    setLoading(true);
    console.log('📊 Cargando estadísticas del dashboard...');

    try {
      // Intentar cargar del backend primero
      const [books, users, loans] = await Promise.all([
        bookService.getAllAsync(),
        userService.getAllAsync(),
        loanService.getAllAsync()
      ]);

      console.log('✅ Datos cargados:', { books: books.length, users: users.length, loans: loans.length });

      const loansByStatus = loans.reduce<Record<string, number>>((acc, l) => {
        acc[l.status] = (acc[l.status] || 0) + 1;
        return acc;
      }, {});

      setStats({
        totalBooks: books.length,
        totalUsers: users.length,
        totalLoans: loans.length,
        availableBooks: books.filter(b => b.status === 'disponible').length,
        activeLoans: loans.filter(l => l.status === 'aprobado').length,
        pendingLoans: loans.filter(l => l.status === 'pendiente').length,
        loansByStatus,
        recentUsers: users.slice(-5).reverse()
      });

      setLastUpdate(new Date());

      // También intentar obtener estadísticas del microservicio de reportes
      try {
        const dashboardStats = await reportsApi.getDashboard();
        console.log('📈 Estadísticas del backend:', dashboardStats);
      } catch {
        // Si el servicio de reportes no está disponible, usar datos locales
      }

    } catch (error) {
      console.warn('⚠️ Error cargando estadísticas:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { 
    loadStats(); 

    // Auto-refresh cada 30 segundos
    const interval = setInterval(() => {
      console.log('🔄 Auto-refresh dashboard...');
      loadStats();
    }, 30000);

    return () => clearInterval(interval);
  }, [loadStats]);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2><i className="bi bi-speedometer2 me-2"></i>Dashboard</h2>
        <div className="d-flex align-items-center gap-3">
          {lastUpdate && (
            <small className="text-muted">
              <i className="bi bi-clock me-1"></i>
              Actualizado: {lastUpdate.toLocaleTimeString('es-CL')}
            </small>
          )}
          <button 
            className="btn btn-outline-primary btn-sm" 
            onClick={loadStats}
            disabled={loading}
          >
            {loading ? (
              <><span className="spinner-border spinner-border-sm me-1"></span>Cargando...</>
            ) : (
              <><i className="bi bi-arrow-clockwise me-1"></i>Actualizar</>
            )}
          </button>
        </div>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card bg-primary text-white h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="card-title opacity-75">Total Libros</h6>
                  <h2 className="mb-0">{stats.totalBooks}</h2>
                </div>
                <i className="bi bi-book display-4 opacity-50"></i>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-success text-white h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="card-title opacity-75">Disponibles</h6>
                  <h2 className="mb-0">{stats.availableBooks}</h2>
                </div>
                <i className="bi bi-check-circle display-4 opacity-50"></i>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-info text-white h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="card-title opacity-75">Usuarios</h6>
                  <h2 className="mb-0">{stats.totalUsers}</h2>
                </div>
                <i className="bi bi-people display-4 opacity-50"></i>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-warning text-dark h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="card-title opacity-75">Préstamos</h6>
                  <h2 className="mb-0">{stats.totalLoans}</h2>
                </div>
                <i className="bi bi-journal-text display-4 opacity-50"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Segunda fila de estadísticas */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card border-warning h-100">
            <div className="card-body text-center">
              <h3 className="text-warning mb-0">{stats.pendingLoans}</h3>
              <small className="text-muted">Préstamos Pendientes</small>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-success h-100">
            <div className="card-body text-center">
              <h3 className="text-success mb-0">{stats.activeLoans}</h3>
              <small className="text-muted">Préstamos Activos</small>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-info h-100">
            <div className="card-body text-center">
              <h3 className="text-info mb-0">{stats.totalLoans - stats.activeLoans - stats.pendingLoans}</h3>
              <small className="text-muted">Completados/Rechazados</small>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Préstamos por estado */}
        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-header bg-light">
              <h5 className="mb-0"><i className="bi bi-pie-chart me-2"></i>Préstamos por Estado</h5>
            </div>
            <div className="card-body">
              {Object.keys(stats.loansByStatus).length === 0 ? (
                <p className="text-muted mb-0">No hay préstamos registrados</p>
              ) : (
                <div className="d-flex flex-wrap gap-2">
                  {Object.entries(stats.loansByStatus).map(([status, count]) => (
                    <span key={status} className={`badge ${
                      status === 'pendiente' ? 'bg-warning text-dark' :
                      status === 'aprobado' ? 'bg-success' :
                      status === 'devuelto' ? 'bg-info' :
                      status === 'rechazado' ? 'bg-danger' : 'bg-secondary'
                    }`} style={{fontSize: '1rem', padding: '8px 12px'}}>
                      {status}: {count}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Usuarios recientes */}
        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-header bg-light">
              <h5 className="mb-0"><i className="bi bi-person-plus me-2"></i>Usuarios Registrados</h5>
            </div>
            <div className="card-body">
              {stats.recentUsers.length === 0 ? (
                <p className="text-muted mb-0">No hay usuarios registrados</p>
              ) : (
                <ul className="list-group list-group-flush">
                  {stats.recentUsers.map((user: any) => (
                    <li key={user.id} className="list-group-item d-flex justify-content-between align-items-center">
                      <div>
                        <strong>{user.name}</strong>
                        <br />
                        <small className="text-muted">{user.email}</small>
                      </div>
                      <span className={`badge ${user.role === 'Admin' ? 'bg-danger' : 'bg-primary'}`}>
                        {user.role}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Indicador de conexión */}
      <div className="mt-4 text-center">
        <small className="text-muted">
          <i className="bi bi-wifi me-1"></i>
          Los datos se actualizan automáticamente cada 30 segundos
        </small>
      </div>
    </div>
  );
}
