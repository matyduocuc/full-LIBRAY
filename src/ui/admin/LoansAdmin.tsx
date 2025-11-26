/**
 * Panel de administración de préstamos
 * Permite aprobar, rechazar y marcar devolución de préstamos
 */
import { useEffect, useState } from 'react';
import { loanService } from '../../services/loan.service';
import { userService } from '../../services/user.service';
import { bookService } from '../../services/book.service';
import type { LegacyLoan } from '../../domain/loan';

export function LoansAdmin() {
  const [loans, setLoans] = useState<LegacyLoan[]>([]);
  const [loading, setLoading] = useState(false);

  const reload = () => {
    setLoans(loanService.getAll());
  };

  useEffect(() => { reload(); }, []);

  const handleApprove = async (id: string) => {
    setLoading(true);
    await loanService.approve(id);
    reload();
    setLoading(false);
  };

  const handleReject = async (id: string) => {
    setLoading(true);
    await loanService.reject(id);
    reload();
    setLoading(false);
  };

  const handleReturn = async (id: string) => {
    setLoading(true);
    await loanService.returnBook(id);
    reload();
    setLoading(false);
  };

  const getUserName = (userId: string): string => {
    const user = userService.getById(userId);
    return user ? user.name : `Usuario ${userId.substring(0, 8)}`;
  };

  const getBookTitle = (bookId: string): string => {
    const book = bookService.getById(bookId);
    return book ? book.title : `Libro ${bookId.substring(0, 8)}`;
  };

  const getStatusBadge = (status: string): string => {
    const badges: Record<string, string> = {
      pendiente: 'bg-warning text-dark',
      aprobado: 'bg-success',
      rechazado: 'bg-danger',
      devuelto: 'bg-info'
    };
    return badges[status] || 'bg-secondary';
  };

  // Ordenar: pendientes primero
  const sortedLoans = [...loans].sort((a, b) => {
    if (a.status === 'pendiente' && b.status !== 'pendiente') return -1;
    if (a.status !== 'pendiente' && b.status === 'pendiente') return 1;
    return new Date(b.loanDate).getTime() - new Date(a.loanDate).getTime();
  });

  const pendingCount = loans.filter(l => l.status === 'pendiente').length;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>
          <i className="bi bi-journal-bookmark me-2"></i>Gestión de Préstamos
          {pendingCount > 0 && (
            <span className="badge bg-warning text-dark ms-2">{pendingCount} pendientes</span>
          )}
        </h3>
        <div>
          <span className="badge bg-secondary me-2">{loans.length} total</span>
          <button className="btn btn-outline-primary btn-sm" onClick={reload} disabled={loading}>
            <i className="bi bi-arrow-clockwise me-1"></i>Actualizar
          </button>
        </div>
      </div>

      {loans.length === 0 ? (
        <div className="alert alert-info">
          <i className="bi bi-info-circle me-2"></i>
          <strong>No hay préstamos registrados.</strong>
          <p className="mb-0 mt-2">Los préstamos aparecerán aquí cuando los usuarios soliciten libros desde el catálogo.</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle shadow-sm">
            <thead className="table-dark">
              <tr>
                <th>Usuario</th>
                <th>Libro</th>
                <th>Fecha Solicitud</th>
                <th>Vencimiento</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {sortedLoans.map(l => (
                <tr key={l.id} className={l.status === 'pendiente' ? 'table-warning' : ''}>
                  <td><strong>{getUserName(l.userId)}</strong></td>
                  <td>{getBookTitle(l.bookId)}</td>
                  <td>{new Date(l.loanDate).toLocaleDateString('es-CL')}</td>
                  <td>{new Date(l.dueDate).toLocaleDateString('es-CL')}</td>
                  <td><span className={`badge ${getStatusBadge(l.status)}`}>{l.status}</span></td>
                  <td>
                    {l.status === 'pendiente' && (
                      <div className="btn-group btn-group-sm">
                        <button 
                          className="btn btn-success" 
                          onClick={() => handleApprove(l.id)} 
                          title="Aprobar préstamo"
                          disabled={loading}
                        >
                          <i className="bi bi-check-lg"></i> Aprobar
                        </button>
                        <button 
                          className="btn btn-danger" 
                          onClick={() => handleReject(l.id)} 
                          title="Rechazar préstamo"
                          disabled={loading}
                        >
                          <i className="bi bi-x-lg"></i> Rechazar
                        </button>
                      </div>
                    )}
                    {l.status === 'aprobado' && (
                      <button 
                        className="btn btn-sm btn-outline-primary" 
                        onClick={() => handleReturn(l.id)}
                        disabled={loading}
                      >
                        <i className="bi bi-box-arrow-in-left me-1"></i>Marcar Devuelto
                      </button>
                    )}
                    {(l.status === 'devuelto' || l.status === 'rechazado') && (
                      <span className="text-muted">Completado</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Leyenda de estados */}
      <div className="mt-4 p-3 bg-light rounded">
        <h6 className="mb-2">Estados de préstamo:</h6>
        <div className="d-flex gap-3 flex-wrap">
          <span><span className="badge bg-warning text-dark">pendiente</span> Esperando aprobación del admin</span>
          <span><span className="badge bg-success">aprobado</span> Préstamo activo</span>
          <span><span className="badge bg-info">devuelto</span> Libro devuelto</span>
          <span><span className="badge bg-danger">rechazado</span> Solicitud rechazada</span>
        </div>
      </div>
    </div>
  );
}
