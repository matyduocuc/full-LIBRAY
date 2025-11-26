/**
 * API client para microservicio de Préstamos
 * Conectado a: http://localhost:8083/api/v1/prestamos
 */
import { httpClient, ApiError } from './httpClient';

export { ApiError } from './httpClient';

export interface PrestamoDTO {
  id: number;
  usuarioId: number;
  libroId?: number;
  ejemplarId?: number;
  fechaPrestamo?: string;
  fechaDevolucionEsperada?: string;
  fechaVencimiento?: string;
  fechaDevolucionReal?: string;
  estado: string;
  renovaciones?: number;
  usuario?: { id: number; nombre: string; };
  libro?: { id: number; titulo: string; };
}

export interface CreatePrestamoDto {
  usuarioId: number;
  libroId: number;
  fechaPrestamo?: string;
  fechaDevolucionEsperada?: string;
}

export const loansApi = {
  /**
   * Obtiene todos los préstamos
   */
  async getAll(): Promise<PrestamoDTO[]> {
    try {
      const data = await httpClient.get<PrestamoDTO[]>(`${httpClient.urls.loans}`);
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  },

  /**
   * Obtiene un préstamo por ID
   */
  async getById(id: number): Promise<PrestamoDTO | null> {
    try {
      const data = await httpClient.get<PrestamoDTO>(`${httpClient.urls.loans}/${id}`);
      return data || null;
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        return null;
      }
      throw error;
    }
  },

  /**
   * Obtiene préstamos de un usuario
   */
  async getByUser(usuarioId: number): Promise<PrestamoDTO[]> {
    const data = await httpClient.get<PrestamoDTO[]>(`${httpClient.urls.loans}/usuario/${usuarioId}`);
    return Array.isArray(data) ? data : [];
  },

  /**
   * Obtiene préstamos por estado
   */
  async getByEstado(estado: string): Promise<PrestamoDTO[]> {
    const data = await httpClient.get<PrestamoDTO[]>(`${httpClient.urls.loans}/estado/${encodeURIComponent(estado)}`);
    return Array.isArray(data) ? data : [];
  },

  /**
   * Crea un nuevo préstamo
   */
  async create(loanData: CreatePrestamoDto): Promise<PrestamoDTO> {
    return await httpClient.post<PrestamoDTO>(`${httpClient.urls.loans}`, loanData);
  },

  /**
   * Aprueba un préstamo
   */
  async approve(id: number): Promise<PrestamoDTO> {
    return await httpClient.put<PrestamoDTO>(`${httpClient.urls.loans}/${id}/aprobar`, {});
  },

  /**
   * Rechaza un préstamo
   */
  async reject(id: number): Promise<PrestamoDTO> {
    return await httpClient.put<PrestamoDTO>(`${httpClient.urls.loans}/${id}/rechazar`, {});
  },

  /**
   * Renueva un préstamo
   */
  async renew(id: number): Promise<PrestamoDTO> {
    return await httpClient.post<PrestamoDTO>(`${httpClient.urls.loans}/${id}/renovar`, {});
  },

  /**
   * Devuelve un préstamo
   */
  async return(id: number): Promise<PrestamoDTO> {
    return await httpClient.post<PrestamoDTO>(`${httpClient.urls.loans}/${id}/devolver`, {});
  },
};
