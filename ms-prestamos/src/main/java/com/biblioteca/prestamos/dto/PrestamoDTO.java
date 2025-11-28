package com.biblioteca.prestamos.dto;

import com.biblioteca.prestamos.model.Prestamo;
import java.time.LocalDate;

public class PrestamoDTO {
    private Long id;
    private Long usuarioId;
    private Long libroId;
    private String tituloLibro;
    private String nombreUsuario;
    private LocalDate fechaPrestamo;
    private LocalDate fechaVencimiento;
    private LocalDate fechaDevolucion;
    private String estado;
    private Integer renovaciones;

    public static PrestamoDTO fromEntity(Prestamo p) {
        PrestamoDTO dto = new PrestamoDTO();
        dto.id = p.getId();
        dto.usuarioId = p.getUsuarioId();
        dto.libroId = p.getLibroId();
        dto.tituloLibro = p.getTituloLibro();
        dto.nombreUsuario = p.getNombreUsuario();
        dto.fechaPrestamo = p.getFechaPrestamo();
        dto.fechaVencimiento = p.getFechaVencimiento();
        dto.fechaDevolucion = p.getFechaDevolucion();
        dto.estado = p.getEstado().name();
        dto.renovaciones = p.getRenovaciones();
        return dto;
    }

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getUsuarioId() { return usuarioId; }
    public void setUsuarioId(Long usuarioId) { this.usuarioId = usuarioId; }
    public Long getLibroId() { return libroId; }
    public void setLibroId(Long libroId) { this.libroId = libroId; }
    public String getTituloLibro() { return tituloLibro; }
    public void setTituloLibro(String tituloLibro) { this.tituloLibro = tituloLibro; }
    public String getNombreUsuario() { return nombreUsuario; }
    public void setNombreUsuario(String nombreUsuario) { this.nombreUsuario = nombreUsuario; }
    public LocalDate getFechaPrestamo() { return fechaPrestamo; }
    public void setFechaPrestamo(LocalDate fechaPrestamo) { this.fechaPrestamo = fechaPrestamo; }
    public LocalDate getFechaVencimiento() { return fechaVencimiento; }
    public void setFechaVencimiento(LocalDate fechaVencimiento) { this.fechaVencimiento = fechaVencimiento; }
    public LocalDate getFechaDevolucion() { return fechaDevolucion; }
    public void setFechaDevolucion(LocalDate fechaDevolucion) { this.fechaDevolucion = fechaDevolucion; }
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
    public Integer getRenovaciones() { return renovaciones; }
    public void setRenovaciones(Integer renovaciones) { this.renovaciones = renovaciones; }
}


