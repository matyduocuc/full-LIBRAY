/**
 * SERVICIO DE PRÉSTAMOS - CONECTADO A BACKEND
 * Intenta usar el microservicio, fallback a localStorage
 */
import { storageService } from './storage.service';
import { loansApi, LoanResponseDTO } from '../api/loansApi';
import type { LegacyLoan } from '../domain/loan';

const K = { loans: 'loans' };

// Convierte LoanResponseDTO del backend a LegacyLoan del frontend
function backendToLegacy(dto: LoanResponseDTO): LegacyLoan {
  return {
    id: String(dto.id),
    userId: String(dto.userId),
    bookId: String(dto.bookId),
    loanDate: dto.loanDate,
    dueDate: dto.dueDate,
    returnDate: dto.returnDate,
    status: dto.statusFrontendLegacy // "pendiente", "aprobado", "rechazado", "devuelto"
  };
}

export const loanService = {
  // ========== OBTENER TODOS ==========
  getAll(): LegacyLoan[] { 
    return storageService.read<LegacyLoan[]>(K.loans, []); 
  },
  
  async getAllAsync(): Promise<LegacyLoan[]> { 
    console.log('📋 Obteniendo préstamos...');
    
    try {
      const response = await loansApi.getAll();
      console.log('✅ Préstamos obtenidos del backend:', response.length);
      
      const loans = response.map(backendToLegacy);
      // Sincronizar con localStorage
      storageService.write(K.loans, loans);
      return loans;
    } catch (error) {
      console.warn('⚠️ Backend no disponible, usando localStorage');
      return this.getAll(); 
    }
  },
  
  saveAll(loans: LegacyLoan[]): void { 
    storageService.write(K.loans, loans); 
  },

  // ========== SOLICITAR PRÉSTAMO ==========
  async request(bookId: string, userId: string): Promise<LegacyLoan> {
    console.log('═══════════════════════════════════════════');
    console.log('📦 SOLICITANDO PRÉSTAMO');
    console.log('═══════════════════════════════════════════');
    console.log('📋 Datos:', { bookId, userId, bookIdNum: Number(bookId), userIdNum: Number(userId) });
    
    try {
      console.log('🌐 Intentando conectar al backend...');
      console.log('🔗 URL:', 'http://localhost:8083/api/loans');
      
      const requestData = {
        userId: Number(userId),
        bookId: Number(bookId),
        loanDays: 14
      };
      console.log('📤 Enviando datos:', JSON.stringify(requestData));
      
      const response = await loansApi.create(requestData);
      
      console.log('✅ ¡ÉXITO! Préstamo creado en BACKEND (MySQL)');
      console.log('📥 Respuesta del servidor:', response);
      
      const loan = backendToLegacy(response);
      
      // También guardar en localStorage para sincronía
      const loans = this.getAll();
      loans.push(loan);
      this.saveAll(loans);
      
      console.log('💾 También guardado en localStorage');
      console.log('═══════════════════════════════════════════');
      
      return loan;
    } catch (error: any) {
      console.log('═══════════════════════════════════════════');
      console.log('❌ ERROR AL CONECTAR CON BACKEND');
      console.log('═══════════════════════════════════════════');
      console.log('🔴 Tipo de error:', error?.name || 'Desconocido');
      console.log('🔴 Mensaje:', error?.message || error);
      console.log('🔴 Status:', error?.status || 'N/A');
      console.log('🔴 Error completo:', error);
      
      // Fallback a localStorage
      console.log('💾 Guardando en localStorage como fallback...');
      
      const dueDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
      const loan: LegacyLoan = {
        id: crypto.randomUUID(),
        bookId,
        userId,
        status: 'pendiente',
        loanDate: new Date().toISOString(),
        dueDate: dueDate.toISOString()
      };
      
      const loans = this.getAll();
      loans.push(loan);
      this.saveAll(loans);
      
      console.log('✅ Préstamo guardado en localStorage (NO en MySQL)');
      console.log('📋 ID del préstamo:', loan.id);
      console.log('═══════════════════════════════════════════');
      
      return loan;
    }
  },

  // ========== APROBAR ==========
  async approve(id: string): Promise<LegacyLoan | null> {
    console.log('✅ Aprobando préstamo:', id);
    
    try {
      const response = await loansApi.approve(Number(id));
      console.log('✅ Préstamo aprobado en backend');
      
      const loan = backendToLegacy(response);
      
      // Actualizar localStorage
      const loans = this.getAll();
      const idx = loans.findIndex(l => l.id === id || String(l.id) === id);
      if (idx !== -1) {
        loans[idx] = loan;
        this.saveAll(loans);
      }
      
      return loan;
    } catch (error) {
      console.warn('⚠️ Backend no disponible, actualizando localStorage');
      
      const loans = this.getAll();
      const idx = loans.findIndex(l => l.id === id);
      if (idx === -1) return null;
      
      loans[idx].status = 'aprobado';
      this.saveAll(loans);
      return loans[idx];
    }
  },

  // ========== RECHAZAR ==========
  async reject(id: string): Promise<LegacyLoan | null> {
    console.log('❌ Rechazando préstamo:', id);
    
    try {
      const response = await loansApi.reject(Number(id));
      console.log('✅ Préstamo rechazado en backend');
      
      const loan = backendToLegacy(response);
      
      // Actualizar localStorage
      const loans = this.getAll();
      const idx = loans.findIndex(l => l.id === id || String(l.id) === id);
      if (idx !== -1) {
        loans[idx] = loan;
        this.saveAll(loans);
      }
      
      return loan;
    } catch (error) {
      console.warn('⚠️ Backend no disponible, actualizando localStorage');
      
      const loans = this.getAll();
      const idx = loans.findIndex(l => l.id === id);
      if (idx === -1) return null;
      
      loans[idx].status = 'rechazado';
      this.saveAll(loans);
      return loans[idx];
    }
  },

  // ========== DEVOLVER ==========
  async returnBook(id: string): Promise<LegacyLoan | null> {
    console.log('📚 Devolviendo libro:', id);
    
    try {
      const response = await loansApi.return(Number(id));
      console.log('✅ Libro devuelto en backend');
      
      const loan = backendToLegacy(response);
      
      // Actualizar localStorage
      const loans = this.getAll();
      const idx = loans.findIndex(l => l.id === id || String(l.id) === id);
      if (idx !== -1) {
        loans[idx] = loan;
        this.saveAll(loans);
      }
      
      return loan;
    } catch (error) {
      console.warn('⚠️ Backend no disponible, actualizando localStorage');
      
      const loans = this.getAll();
      const idx = loans.findIndex(l => l.id === id);
      if (idx === -1) return null;
      
      loans[idx].status = 'devuelto';
      loans[idx].returnDate = new Date().toISOString();
      this.saveAll(loans);
      return loans[idx];
    }
  },

  // ========== CONSULTAS ==========
  getByUser(userId: string): LegacyLoan[] { 
    return this.getAll().filter(l => l.userId === userId || String(l.userId) === userId); 
  },
  
  async getByUserAsync(userId: string): Promise<LegacyLoan[]> { 
    console.log('📋 Obteniendo préstamos del usuario:', userId);
    
    try {
      const response = await loansApi.getByUser(Number(userId));
      console.log('✅ Préstamos del usuario obtenidos:', response.length);
      return response.map(backendToLegacy);
    } catch (error) {
      console.warn('⚠️ Backend no disponible, usando localStorage');
      return this.getByUser(userId); 
    }
  },
  
  getByBookId(bookId: string): LegacyLoan[] { 
    return this.getAll().filter(l => l.bookId === bookId || String(l.bookId) === bookId); 
  },
  
  getById(id: string): LegacyLoan | null { 
    return this.getAll().find(l => l.id === id || String(l.id) === id) || null; 
  },

  // ========== SOLICITAR VARIOS ==========
  async requestMany(bookIds: string[], userId: string): Promise<LegacyLoan[]> {
    console.log('📦 Solicitando múltiples préstamos:', bookIds.length);
    
    const results: LegacyLoan[] = [];
    for (const bookId of bookIds) {
      try {
        const loan = await this.request(bookId, userId);
        results.push(loan);
      } catch (error) {
        console.error('Error al solicitar préstamo para libro:', bookId, error);
      }
    }
    
    console.log('✅ Préstamos solicitados:', results.length);
    return results;
  },

  // ========== PRÉSTAMOS PENDIENTES (para admin) ==========
  async getPending(): Promise<LegacyLoan[]> {
    console.log('📋 Obteniendo préstamos pendientes...');
    
    try {
      const response = await loansApi.getPending();
      console.log('✅ Préstamos pendientes obtenidos:', response.length);
      return response.map(backendToLegacy);
    } catch (error) {
      console.warn('⚠️ Backend no disponible, filtrando localStorage');
      return this.getAll().filter(l => l.status === 'pendiente');
    }
  }
};
