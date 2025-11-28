/**
 * Pruebas unitarias para el servicio de préstamos
 * 
 * Tests básicos para solicitar, aprobar y rechazar préstamos
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { loanService } from '../services/loan.service';

describe('loanService', () => {
  beforeEach(() => {
    // Limpiar localStorage antes de cada prueba
    localStorage.clear();
  });

  it('P1: debe crear un préstamo con estado pendiente', async () => {
    const loan = await loanService.request('book-123', 'user-456');
    
    expect(loan).toBeDefined();
    expect(loan.id).toBeDefined();
    expect(loan.bookId).toBe('book-123');
    expect(loan.userId).toBe('user-456');
    expect(loan.status).toBe('pendiente');
    expect(loan.loanDate).toBeDefined();
    expect(loan.dueDate).toBeDefined();
  });

  it('P2: debe aprobar un préstamo pendiente', async () => {
    // Crear préstamo
    const loan = await loanService.request('book-1', 'user-1');
    expect(loan.status).toBe('pendiente');
    
    // Aprobar préstamo
    const approved = await loanService.approve(loan.id);
    
    expect(approved).not.toBeNull();
    expect(approved?.status).toBe('aprobado');
    expect(approved?.id).toBe(loan.id);
  });

  it('P3: debe rechazar un préstamo pendiente', async () => {
    // Crear préstamo
    const loan = await loanService.request('book-2', 'user-2');
    expect(loan.status).toBe('pendiente');
    
    // Rechazar préstamo
    const rejected = await loanService.reject(loan.id);
    
    expect(rejected).not.toBeNull();
    expect(rejected?.status).toBe('rechazado');
  });

  it('P4: debe marcar un préstamo como devuelto', async () => {
    // Crear y aprobar préstamo
    const loan = await loanService.request('book-3', 'user-3');
    await loanService.approve(loan.id);
    
    // Marcar como devuelto
    const returned = await loanService.returnBook(loan.id);
    
    expect(returned).not.toBeNull();
    expect(returned?.status).toBe('devuelto');
    expect(returned?.returnDate).toBeDefined();
  });

  it('P5: debe obtener préstamos de un usuario específico', async () => {
    // Crear varios préstamos para diferentes usuarios
    await loanService.request('book-1', 'user-A');
    await loanService.request('book-2', 'user-A');
    await loanService.request('book-3', 'user-B');
    
    // Obtener préstamos del usuario A
    const loansUserA = loanService.getByUser('user-A');
    
    expect(loansUserA).toHaveLength(2);
    expect(loansUserA.every(l => l.userId === 'user-A')).toBe(true);
  });

  it('P6: debe solicitar múltiples préstamos a la vez', async () => {
    const bookIds = ['book-10', 'book-20', 'book-30'];
    
    const loans = await loanService.requestMany(bookIds, 'user-multi');
    
    expect(loans).toHaveLength(3);
    expect(loans.every(l => l.userId === 'user-multi')).toBe(true);
    expect(loans.every(l => l.status === 'pendiente')).toBe(true);
  });
});

