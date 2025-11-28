/**
 * API client para microservicio de Reportes (librabackend)
 * Conectado a: http://localhost:8084/api/reports
 */
import { httpClient } from './httpClient';

// DTO del backend - DashboardStatisticsDTO
export interface DashboardStatisticsDTO {
  totalBooks: number;
  totalUsers: number;
  totalLoans: number;
  activeLoans: number;
  overdueLoans: number;
  availableBooks: number;
  loanedBooks: number;
  revenue: number;
  dateRange?: string;
}

// DTOs legacy para compatibilidad
export interface PrestamosResumenDTO {
  totalPrestamos: number;
  activos: number;
  atraso: number;
  devueltos: number;
  cancelados: number;
  perdidos: number;
  multasPendientes: number;
  multasPagadas: number;
}

export interface UsuarioResumenDTO {
  usuarioId: number;
  nombreCompleto: string;
  email: string;
  totalPrestamos: number;
  prestamosActivos: number;
  prestamosAtraso: number;
  multasPendientes: number;
}

export interface MultasResumenDTO {
  totalMultas: number;
  multasPendientes: number;
  multasPagadas: number;
  multasExentas: number;
}

export const reportsApi = {
  /**
   * Obtiene estadísticas del dashboard
   * Endpoint: GET /api/reports/dashboard
   */
  async getDashboard(): Promise<DashboardStatisticsDTO> {
    console.log('═══════════════════════════════════════════');
    console.log('📊 OBTENIENDO ESTADÍSTICAS DEL DASHBOARD');
    console.log('═══════════════════════════════════════════');
    console.log('🔗 URL:', 'http://localhost:8084/api/reports/dashboard');
    
    try {
      const response = await httpClient.get<DashboardStatisticsDTO>(`${httpClient.urls.reports}/dashboard`);
      
      console.log('✅ ¡ÉXITO! Estadísticas obtenidas del BACKEND');
      console.log('📈 Datos:', response);
      console.log('═══════════════════════════════════════════');
      
      return response;
    } catch (error: any) {
      console.log('═══════════════════════════════════════════');
      console.log('❌ ERROR AL OBTENER ESTADÍSTICAS');
      console.log('═══════════════════════════════════════════');
      console.log('🔴 Mensaje:', error?.message || error);
      console.log('🔴 Status:', error?.status || 'N/A');
      console.log('═══════════════════════════════════════════');
      throw error;
    }
  },

  /**
   * Obtiene resumen de préstamos (mapea desde dashboard)
   */
  async getPrestamosResumen(): Promise<PrestamosResumenDTO> {
    try {
      const dashboard = await this.getDashboard();
      return {
        totalPrestamos: dashboard.totalLoans || 0,
        activos: dashboard.activeLoans || 0,
        atraso: dashboard.overdueLoans || 0,
        devueltos: 0,
        cancelados: 0,
        perdidos: 0,
        multasPendientes: 0,
        multasPagadas: 0,
      };
    } catch {
      console.log('⚠️ Usando datos vacíos para préstamos');
      return {
        totalPrestamos: 0,
        activos: 0,
        atraso: 0,
        devueltos: 0,
        cancelados: 0,
        perdidos: 0,
        multasPendientes: 0,
        multasPagadas: 0,
      };
    }
  },

  /**
   * Obtiene resumen de un usuario específico
   */
  async getUsuarioResumen(usuarioId: number): Promise<UsuarioResumenDTO> {
    // El backend actual no tiene este endpoint específico
    return {
      usuarioId,
      nombreCompleto: '',
      email: '',
      totalPrestamos: 0,
      prestamosActivos: 0,
      prestamosAtraso: 0,
      multasPendientes: 0,
    };
  },

  /**
   * Obtiene resumen de multas
   */
  async getMultasResumen(): Promise<MultasResumenDTO> {
    // El backend actual no tiene este endpoint específico
    return {
      totalMultas: 0,
      multasPendientes: 0,
      multasPagadas: 0,
      multasExentas: 0,
    };
  },
};
