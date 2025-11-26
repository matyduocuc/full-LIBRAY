package com.biblioteca.prestamos.service;

import com.biblioteca.prestamos.dto.PrestamoCreateRequest;
import com.biblioteca.prestamos.dto.PrestamoDTO;
import com.biblioteca.prestamos.model.Prestamo;
import com.biblioteca.prestamos.model.Prestamo.Estado;
import com.biblioteca.prestamos.repository.PrestamoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PrestamoService {
    @Autowired
    private PrestamoRepository prestamoRepository;

    public List<PrestamoDTO> findAll() {
        return prestamoRepository.findAll().stream().map(PrestamoDTO::fromEntity).collect(Collectors.toList());
    }

    public PrestamoDTO findById(Long id) {
        return PrestamoDTO.fromEntity(prestamoRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Préstamo no encontrado")));
    }

    public List<PrestamoDTO> findByUsuario(Long usuarioId) {
        return prestamoRepository.findByUsuarioId(usuarioId).stream()
            .map(PrestamoDTO::fromEntity).collect(Collectors.toList());
    }

    public List<PrestamoDTO> findByEstado(String estado) {
        return prestamoRepository.findByEstado(Estado.valueOf(estado)).stream()
            .map(PrestamoDTO::fromEntity).collect(Collectors.toList());
    }

    @Transactional
    public PrestamoDTO create(PrestamoCreateRequest req) {
        // Verificar límite de préstamos activos (máximo 5)
        long activos = prestamoRepository.countActivosByUsuario(req.getUsuarioId());
        if (activos >= 5) {
            throw new RuntimeException("El usuario ya tiene 5 préstamos activos");
        }

        Prestamo p = new Prestamo();
        p.setUsuarioId(req.getUsuarioId());
        p.setLibroId(req.getLibroId());
        p.setTituloLibro(req.getTituloLibro() != null ? req.getTituloLibro() : "Libro #" + req.getLibroId());
        p.setNombreUsuario(req.getNombreUsuario() != null ? req.getNombreUsuario() : "Usuario #" + req.getUsuarioId());
        
        return PrestamoDTO.fromEntity(prestamoRepository.save(p));
    }

    @Transactional
    public PrestamoDTO renovar(Long id) {
        Prestamo p = prestamoRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Préstamo no encontrado"));
        
        if (p.getEstado() != Estado.ACTIVO) {
            throw new RuntimeException("Solo se pueden renovar préstamos activos");
        }
        if (p.getRenovaciones() >= 2) {
            throw new RuntimeException("Máximo 2 renovaciones permitidas");
        }

        p.setRenovaciones(p.getRenovaciones() + 1);
        p.setFechaVencimiento(p.getFechaVencimiento().plusDays(7)); // +7 días por renovación
        
        return PrestamoDTO.fromEntity(prestamoRepository.save(p));
    }

    @Transactional
    public PrestamoDTO devolver(Long id) {
        Prestamo p = prestamoRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Préstamo no encontrado"));
        
        if (p.getEstado() == Estado.DEVUELTO) {
            throw new RuntimeException("El préstamo ya fue devuelto");
        }

        p.setEstado(Estado.DEVUELTO);
        p.setFechaDevolucion(LocalDate.now());
        
        return PrestamoDTO.fromEntity(prestamoRepository.save(p));
    }

    @Transactional
    public PrestamoDTO aprobar(Long id) {
        Prestamo p = prestamoRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Préstamo no encontrado"));
        
        if (p.getEstado() != Estado.PENDIENTE) {
            throw new RuntimeException("Solo se pueden aprobar préstamos pendientes");
        }

        p.setEstado(Estado.ACTIVO);
        p.setFechaPrestamo(LocalDate.now());
        p.setFechaVencimiento(LocalDate.now().plusDays(14)); // 14 días para devolver
        
        return PrestamoDTO.fromEntity(prestamoRepository.save(p));
    }

    @Transactional
    public PrestamoDTO rechazar(Long id) {
        Prestamo p = prestamoRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Préstamo no encontrado"));
        
        if (p.getEstado() != Estado.PENDIENTE) {
            throw new RuntimeException("Solo se pueden rechazar préstamos pendientes");
        }

        p.setEstado(Estado.RECHAZADO);
        
        return PrestamoDTO.fromEntity(prestamoRepository.save(p));
    }
}

