package com.biblioteca.prestamos.repository;

import com.biblioteca.prestamos.model.Prestamo;
import com.biblioteca.prestamos.model.Prestamo.Estado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface PrestamoRepository extends JpaRepository<Prestamo, Long> {
    List<Prestamo> findByUsuarioId(Long usuarioId);
    List<Prestamo> findByLibroId(Long libroId);
    List<Prestamo> findByEstado(Estado estado);
    
    @Query("SELECT COUNT(p) FROM Prestamo p WHERE p.estado = :estado")
    long countByEstado(Estado estado);
    
    @Query("SELECT COUNT(p) FROM Prestamo p WHERE p.usuarioId = :usuarioId AND p.estado = 'ACTIVO'")
    long countActivosByUsuario(Long usuarioId);
    
    @Query("SELECT p FROM Prestamo p WHERE p.estado = 'ACTIVO' AND p.fechaVencimiento < CURRENT_DATE")
    List<Prestamo> findVencidos();
}








