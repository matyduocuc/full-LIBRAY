package com.biblioteca.informes.dto;

/**
 * DTO para datos del Dashboard
 * Contiene todas las estadísticas principales del sistema
 */
public class DashboardDTO {
    private long totalLibros;
    private long librosDisponibles;
    private long totalUsuarios;
    private long totalPrestamos;
    private long prestamosPendientes;
    private long prestamosActivos;
    private long prestamosDevueltos;

    public DashboardDTO() {
        // Valores por defecto
        this.totalLibros = 0;
        this.librosDisponibles = 0;
        this.totalUsuarios = 0;
        this.totalPrestamos = 0;
        this.prestamosPendientes = 0;
        this.prestamosActivos = 0;
        this.prestamosDevueltos = 0;
    }

    // Getters y Setters
    public long getTotalLibros() { return totalLibros; }
    public void setTotalLibros(long totalLibros) { this.totalLibros = totalLibros; }
    
    public long getLibrosDisponibles() { return librosDisponibles; }
    public void setLibrosDisponibles(long librosDisponibles) { this.librosDisponibles = librosDisponibles; }
    
    public long getTotalUsuarios() { return totalUsuarios; }
    public void setTotalUsuarios(long totalUsuarios) { this.totalUsuarios = totalUsuarios; }
    
    public long getTotalPrestamos() { return totalPrestamos; }
    public void setTotalPrestamos(long totalPrestamos) { this.totalPrestamos = totalPrestamos; }
    
    public long getPrestamosPendientes() { return prestamosPendientes; }
    public void setPrestamosPendientes(long prestamosPendientes) { this.prestamosPendientes = prestamosPendientes; }
    
    public long getPrestamosActivos() { return prestamosActivos; }
    public void setPrestamosActivos(long prestamosActivos) { this.prestamosActivos = prestamosActivos; }
    
    public long getPrestamosDevueltos() { return prestamosDevueltos; }
    public void setPrestamosDevueltos(long prestamosDevueltos) { this.prestamosDevueltos = prestamosDevueltos; }
}








