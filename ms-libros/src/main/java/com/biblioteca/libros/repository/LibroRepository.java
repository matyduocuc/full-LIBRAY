package com.biblioteca.libros.repository;

import com.biblioteca.libros.model.Libro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface LibroRepository extends JpaRepository<Libro, Long> {
    Optional<Libro> findByIsbn(String isbn);
    boolean existsByIsbn(String isbn);
    List<Libro> findByActivoTrue();
    
    @Query("SELECT l FROM Libro l WHERE l.activo = true AND l.cantidadDisponible > 0")
    List<Libro> findDisponibles();
    
    List<Libro> findByCategoriaNombre(String categoria);
    
    @Query("SELECT l FROM Libro l WHERE l.activo = true AND " +
           "(LOWER(l.autor.nombre) LIKE LOWER(CONCAT('%', :autor, '%')) OR " +
           "LOWER(l.autor.apellido) LIKE LOWER(CONCAT('%', :autor, '%')))")
    List<Libro> findByAutor(@Param("autor") String autor);
    
    // Búsqueda simplificada
    @Query("SELECT l FROM Libro l WHERE l.activo = true")
    List<Libro> findAllActivos();
    
    List<Libro> findByTituloContainingIgnoreCase(String titulo);
}
