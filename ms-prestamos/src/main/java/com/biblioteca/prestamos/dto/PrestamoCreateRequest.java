package com.biblioteca.prestamos.dto;

import jakarta.validation.constraints.NotNull;

public class PrestamoCreateRequest {
    @NotNull private Long usuarioId;
    @NotNull private Long libroId;
    private String tituloLibro;
    private String nombreUsuario;

    public Long getUsuarioId() { return usuarioId; }
    public void setUsuarioId(Long usuarioId) { this.usuarioId = usuarioId; }
    public Long getLibroId() { return libroId; }
    public void setLibroId(Long libroId) { this.libroId = libroId; }
    public String getTituloLibro() { return tituloLibro; }
    public void setTituloLibro(String tituloLibro) { this.tituloLibro = tituloLibro; }
    public String getNombreUsuario() { return nombreUsuario; }
    public void setNombreUsuario(String nombreUsuario) { this.nombreUsuario = nombreUsuario; }
}

