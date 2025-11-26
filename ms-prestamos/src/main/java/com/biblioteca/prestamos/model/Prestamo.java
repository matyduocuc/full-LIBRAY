package com.biblioteca.prestamos.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "prestamos")
public class Prestamo {
    public enum Estado { PENDIENTE, ACTIVO, DEVUELTO, VENCIDO, CANCELADO, PERDIDO, RECHAZADO }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long usuarioId;

    @Column(nullable = false)
    private Long libroId;

    // Campos para mostrar info sin necesidad de llamar a otros microservicios
    private String tituloLibro;
    private String nombreUsuario;

    @Column(nullable = false)
    private LocalDate fechaPrestamo = LocalDate.now();

    @Column(nullable = false)
    private LocalDate fechaVencimiento = LocalDate.now().plusDays(14);

    private LocalDate fechaDevolucion;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Estado estado = Estado.PENDIENTE;

    @Column(nullable = false)
    private Integer renovaciones = 0;

    private LocalDateTime fechaCreacion = LocalDateTime.now();

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
    public Estado getEstado() { return estado; }
    public void setEstado(Estado estado) { this.estado = estado; }
    public Integer getRenovaciones() { return renovaciones; }
    public void setRenovaciones(Integer renovaciones) { this.renovaciones = renovaciones; }
    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
}

