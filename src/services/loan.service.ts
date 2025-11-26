/**
 * SERVICIO DE PRÉSTAMOS - CORREGIDO
 * Funciona 100% con localStorage
 * Compatible con LegacyLoan (usa loanDate)
 */
import { storageService } from './storage.service';
import type { LegacyLoan } from '../domain/loan';

const K = { loans: 'loans' };

export const loanService = {
  getAll(): LegacyLoan[] { 
    return storageService.read<LegacyLoan[]>(K.loans, []); 
  },
  
  async getAllAsync(): Promise<LegacyLoan[]> { 
    return this.getAll(); 
  },
  
  saveAll(loans: LegacyLoan[]): void { 
    storageService.write(K.loans, loans); 
  },

  // SOLICITAR PRÉSTAMO
  async request(bookId: string, userId: string): Promise<LegacyLoan> {
    const dueDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000); // 14 días
    const loan: LegacyLoan = {
      id: crypto.randomUUID(),
      bookId,
      userId,
      status: 'pendiente',
      loanDate: new Date().toISOString(),
      dueDate: dueDate.toISOString()
    };
    const loans = this.getAll();
    console.log('📦 Préstamos antes:', loans.length);
    loans.push(loan);
    this.saveAll(loans);
    console.log('📦 Préstamos después:', loans.length);
    console.log('✅ Préstamo creado:', { id: loan.id, bookId, userId, status: loan.status });
    return loan;
  },

  // APROBAR
  async approve(id: string): Promise<LegacyLoan | null> {
    const loans = this.getAll();
    const idx = loans.findIndex(l => l.id === id);
    if (idx === -1) return null;
    loans[idx].status = 'aprobado';
    this.saveAll(loans);
    console.log('✅ Préstamo aprobado:', id);
    return loans[idx];
  },

  // RECHAZAR
  async reject(id: string): Promise<LegacyLoan | null> {
    const loans = this.getAll();
    const idx = loans.findIndex(l => l.id === id);
    if (idx === -1) return null;
    loans[idx].status = 'rechazado';
    this.saveAll(loans);
    console.log('✅ Préstamo rechazado:', id);
    return loans[idx];
  },

  // DEVOLVER
  async returnBook(id: string): Promise<LegacyLoan | null> {
    const loans = this.getAll();
    const idx = loans.findIndex(l => l.id === id);
    if (idx === -1) return null;
    loans[idx].status = 'devuelto';
    loans[idx].returnDate = new Date().toISOString();
    this.saveAll(loans);
    console.log('✅ Libro devuelto:', id);
    return loans[idx];
  },

  getByUser(userId: string): LegacyLoan[] { 
    return this.getAll().filter(l => l.userId === userId); 
  },
  
  async getByUserAsync(userId: string): Promise<LegacyLoan[]> { 
    return this.getByUser(userId); 
  },
  
  getByBookId(bookId: string): LegacyLoan[] { 
    return this.getAll().filter(l => l.bookId === bookId); 
  },
  
  getById(id: string): LegacyLoan | null { 
    return this.getAll().find(l => l.id === id) || null; 
  },

  // SOLICITAR VARIOS
  async requestMany(bookIds: string[], userId: string): Promise<LegacyLoan[]> {
    const results: LegacyLoan[] = [];
    for (const bookId of bookIds) {
      const loan = await this.request(bookId, userId);
      results.push(loan);
    }
    return results;
  }
};
