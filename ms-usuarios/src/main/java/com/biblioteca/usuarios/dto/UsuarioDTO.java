package com.biblioteca.usuarios.dto;

import com.biblioteca.usuarios.model.Usuario;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public class UsuarioDTO {
    private Long id;
    private String rut;
    private String nombre;
    private String apellido;
    private String email;
    private String telefono;
    private String direccion;
    private List<String> roles;
    private Boolean activo;
    private LocalDateTime fechaCreacion;

    public static UsuarioDTO fromEntity(Usuario u) {
        UsuarioDTO dto = new UsuarioDTO();
        dto.id = u.getId();
        dto.rut = u.getRut();
        dto.nombre = u.getNombre();
        dto.apellido = u.getApellido();
        dto.email = u.getEmail();
        dto.telefono = u.getTelefono();
        dto.direccion = u.getDireccion();
        dto.activo = u.getActivo();
        dto.fechaCreacion = u.getFechaCreacion();
        dto.roles = u.getRoles().stream().map(r -> r.getNombre()).collect(Collectors.toList());
        return dto;
    }

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getRut() { return rut; }
    public void setRut(String rut) { this.rut = rut; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getApellido() { return apellido; }
    public void setApellido(String apellido) { this.apellido = apellido; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }
    public String getDireccion() { return direccion; }
    public void setDireccion(String direccion) { this.direccion = direccion; }
    public List<String> getRoles() { return roles; }
    public void setRoles(List<String> roles) { this.roles = roles; }
    public Boolean getActivo() { return activo; }
    public void setActivo(Boolean activo) { this.activo = activo; }
    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(LocalDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }
}
















