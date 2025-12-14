package com.biblioteca.informes.dto;

public class PrestamosResumenDTO {
    private long totalPrestamos;
    private long activos;
    private long atraso;
    private long devueltos;
    private long cancelados;
    private long perdidos;
    private long multasPendientes;
    private long multasPagadas;

    public PrestamosResumenDTO() {
        // Datos de ejemplo
        this.totalPrestamos = 150;
        this.activos = 45;
        this.atraso = 8;
        this.devueltos = 90;
        this.cancelados = 5;
        this.perdidos = 2;
        this.multasPendientes = 12;
        this.multasPagadas = 25;
    }

    // Getters y Setters
    public long getTotalPrestamos() { return totalPrestamos; }
    public void setTotalPrestamos(long totalPrestamos) { this.totalPrestamos = totalPrestamos; }
    public long getActivos() { return activos; }
    public void setActivos(long activos) { this.activos = activos; }
    public long getAtraso() { return atraso; }
    public void setAtraso(long atraso) { this.atraso = atraso; }
    public long getDevueltos() { return devueltos; }
    public void setDevueltos(long devueltos) { this.devueltos = devueltos; }
    public long getCancelados() { return cancelados; }
    public void setCancelados(long cancelados) { this.cancelados = cancelados; }
    public long getPerdidos() { return perdidos; }
    public void setPerdidos(long perdidos) { this.perdidos = perdidos; }
    public long getMultasPendientes() { return multasPendientes; }
    public void setMultasPendientes(long multasPendientes) { this.multasPendientes = multasPendientes; }
    public long getMultasPagadas() { return multasPagadas; }
    public void setMultasPagadas(long multasPagadas) { this.multasPagadas = multasPagadas; }
}
















