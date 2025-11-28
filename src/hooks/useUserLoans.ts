/**
 * Hook para obtener préstamos del usuario - CONECTADO A BACKEND
 * Carga desde microservicio con fallback a localStorage
 */
import { useState, useEffect, useCallback } from 'react';
import { bookService } from '../services/book.service';
import { loanService } from '../services/loan.service';
import type { LegacyLoan } from '../domain/loan';
import type { Book } from '../domain/book';

// Tipo: préstamo con información del libro
interface LoanWithBook extends LegacyLoan {
  book: Book | null;
}

interface UseUserLoansResult {
  loans: LoanWithBook[];
  loading: boolean;
  error: Error | null;
  reload: () => void;
}

export function useUserLoans(userId: string | undefined): UseUserLoansResult {
  const [loans, setLoans] = useState<LoanWithBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadLoans = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      setLoans([]);
      return;
    }

    setLoading(true);
    setError(null);
    console.log('📋 Cargando préstamos del usuario:', userId);

    try {
      // Usar método async que intenta backend primero
      const userLoans = await loanService.getByUserAsync(userId);
      console.log('✅ Préstamos cargados:', userLoans.length);
      
      // Agregar información del libro
      const loansWithBooks: LoanWithBook[] = userLoans.map(loan => ({
        ...loan,
        book: bookService.getById(loan.bookId) || null
      }));
      
      setLoans(loansWithBooks);
    } catch (err) {
      console.warn('⚠️ Error cargando préstamos:', err);
      
      // Fallback a localStorage
      try {
        const localLoans = loanService.getByUser(userId);
        const loansWithBooks: LoanWithBook[] = localLoans.map(loan => ({
          ...loan,
          book: bookService.getById(loan.bookId) || null
        }));
        setLoans(loansWithBooks);
      } catch {
        setError(err instanceof Error ? err : new Error('Error al cargar préstamos'));
      }
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadLoans();
    
    // Auto-refresh cada 10 segundos para ver cambios (ej: admin aprobó)
    const interval = setInterval(() => {
      console.log('🔄 Refrescando préstamos del usuario...');
      loadLoans();
    }, 10000);
    
    return () => clearInterval(interval);
  }, [loadLoans]);

  return { loans, loading, error, reload: loadLoans };
}
