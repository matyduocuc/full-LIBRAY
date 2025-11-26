/**
 * Hook para obtener préstamos del usuario
 * Usa localStorage directamente
 */
import { useState, useEffect } from 'react';
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

  const loadLoans = () => {
    if (!userId) {
      setLoading(false);
      setLoans([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Cargar desde localStorage
      const userLoans = loanService.getByUser(userId);
      
      // Agregar información del libro
      const loansWithBooks: LoanWithBook[] = userLoans.map(loan => ({
        ...loan,
        book: bookService.getById(loan.bookId) || null
      }));
      
      setLoans(loansWithBooks);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error al cargar préstamos'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLoans();
  }, [userId]);

  return { loans, loading, error, reload: loadLoans };
}
