/**
 * API client para microservicio de Préstamos (librabackend)
 * Conectado a: http://localhost:8083/api/loans
 */
import { httpClient, ApiError } from './httpClient';

export { ApiError } from './httpClient';

// DTO del backend - LoanResponseDTO
export interface LoanResponseDTO {
  id: number;
  userId: number;
  bookId: number;
  loanDate: string;          // ISO date string
  dueDate: string;           // ISO date string
  returnDate?: string;       // ISO date string (opcional)
  status: 'PENDING' | 'ACTIVE' | 'RETURNED' | 'OVERDUE' | 'CANCELLED';
  statusFrontend: 'pending' | 'active' | 'returned';        // Campo compatible con frontend
  statusFrontendLegacy: 'pendiente' | 'aprobado' | 'rechazado' | 'devuelto'; // Legacy
  loanDays: number;
  fineAmount: number;
  extensionsCount: number;
  createdAt?: string;
  updatedAt?: string;
}

// DTO para crear préstamo
export interface LoanCreateDTO {
  userId: number;
  bookId: number;
  loanDays?: number;         // Default: 14 días
}

// DTO de validación
export interface LoanValidationDTO {
  userId: number;
  bookId: number;
  valid: boolean;
  userExists: boolean;
  bookAvailable: boolean;
  withinLoanLimit: boolean;
  noActiveLoanForBook: boolean;
  validLoanDays: boolean;
  message?: string;
}

// DTO de cálculo de multa
export interface FineCalculationDTO {
  loanId: number;
  daysOverdue: number;
  dailyFineRate: number;
  totalFine: number;
  message?: string;
}

// DTO de historial
export interface LoanHistoryResponseDTO {
  id: number;
  loanId: number;
  action: string;
  notes?: string;
  timestamp: string;
}

export const loansApi = {
  /**
   * Obtiene todos los préstamos
   * Endpoint: GET /api/loans
   */
  async getAll(): Promise<LoanResponseDTO[]> {
    try {
      const data = await httpClient.get<LoanResponseDTO[]>(`${httpClient.urls.loans}`);
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  },

  /**
   * Obtiene un préstamo por ID
   * Endpoint: GET /api/loans/{id}
   */
  async getById(id: number): Promise<LoanResponseDTO | null> {
    try {
      const data = await httpClient.get<LoanResponseDTO>(`${httpClient.urls.loans}/${id}`);
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
   * Endpoint: GET /api/loans/user/{userId}
   */
  async getByUser(userId: number): Promise<LoanResponseDTO[]> {
    const data = await httpClient.get<LoanResponseDTO[]>(`${httpClient.urls.loans}/user/${userId}`);
    return Array.isArray(data) ? data : [];
  },

  /**
   * Obtiene préstamos activos de un usuario
   * Endpoint: GET /api/loans/user/{userId}/active
   */
  async getActiveByUser(userId: number): Promise<LoanResponseDTO[]> {
    const data = await httpClient.get<LoanResponseDTO[]>(`${httpClient.urls.loans}/user/${userId}/active`);
    return Array.isArray(data) ? data : [];
  },

  /**
   * Obtiene préstamos pendientes de aprobación
   * Endpoint: GET /api/loans/pending
   */
  async getPending(): Promise<LoanResponseDTO[]> {
    const data = await httpClient.get<LoanResponseDTO[]>(`${httpClient.urls.loans}/pending`);
    return Array.isArray(data) ? data : [];
  },

  /**
   * Obtiene préstamos vencidos
   * Endpoint: GET /api/loans/overdue
   */
  async getOverdue(): Promise<LoanResponseDTO[]> {
    const data = await httpClient.get<LoanResponseDTO[]>(`${httpClient.urls.loans}/overdue`);
    return Array.isArray(data) ? data : [];
  },

  /**
   * Crea un nuevo préstamo (queda en estado PENDING)
   * Endpoint: POST /api/loans
   */
  async create(loanData: LoanCreateDTO): Promise<LoanResponseDTO> {
    return await httpClient.post<LoanResponseDTO>(`${httpClient.urls.loans}`, loanData);
  },

  /**
   * Aprueba un préstamo pendiente
   * Endpoint: PUT /api/loans/{id}/approve
   */
  async approve(id: number): Promise<LoanResponseDTO> {
    return await httpClient.put<LoanResponseDTO>(`${httpClient.urls.loans}/${id}/approve`, {});
  },

  /**
   * Rechaza un préstamo pendiente
   * Endpoint: PUT /api/loans/{id}/reject
   */
  async reject(id: number): Promise<LoanResponseDTO> {
    return await httpClient.put<LoanResponseDTO>(`${httpClient.urls.loans}/${id}/reject`, {});
  },

  /**
   * Registra la devolución de un préstamo
   * Endpoint: POST /api/loans/{id}/return
   */
  async return(id: number): Promise<LoanResponseDTO> {
    return await httpClient.post<LoanResponseDTO>(`${httpClient.urls.loans}/${id}/return`, {});
  },

  /**
   * Extiende un préstamo (máximo 2 extensiones de 7 días)
   * Endpoint: PATCH /api/loans/{id}/extend
   */
  async extend(id: number): Promise<LoanResponseDTO> {
    return await httpClient.patch<LoanResponseDTO>(`${httpClient.urls.loans}/${id}/extend`, {});
  },

  /**
   * Cancela un préstamo activo
   * Endpoint: PATCH /api/loans/{id}/cancel
   */
  async cancel(id: number): Promise<LoanResponseDTO> {
    return await httpClient.patch<LoanResponseDTO>(`${httpClient.urls.loans}/${id}/cancel`, {});
  },

  /**
   * Calcula la multa de un préstamo vencido
   * Endpoint: GET /api/loans/{id}/fine
   */
  async calculateFine(id: number): Promise<FineCalculationDTO> {
    return await httpClient.get<FineCalculationDTO>(`${httpClient.urls.loans}/${id}/fine`);
  },

  /**
   * Obtiene el historial de un préstamo
   * Endpoint: GET /api/loans/{id}/history
   */
  async getHistory(id: number): Promise<LoanHistoryResponseDTO[]> {
    const data = await httpClient.get<LoanHistoryResponseDTO[]>(`${httpClient.urls.loans}/${id}/history`);
    return Array.isArray(data) ? data : [];
  },

  /**
   * Valida si se puede crear un préstamo
   * Endpoint: POST /api/loans/validate
   */
  async validate(loanData: LoanCreateDTO): Promise<LoanValidationDTO> {
    return await httpClient.post<LoanValidationDTO>(`${httpClient.urls.loans}/validate`, loanData);
  },
};
