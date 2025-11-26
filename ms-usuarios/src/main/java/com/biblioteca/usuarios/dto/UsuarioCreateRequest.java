package com.biblioteca.usuarios.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class UsuarioCreateRequest {
    private String rut = "00000000-0";  // Opcional con valor por defecto
    @NotBlank private String nombre;
    private String apellido = "";       // Opcional
    @NotBlank @Email private String email;
    @NotBlank @Size(min = 6) private String password;
    private String telefono;
    private String direccion;

    public String getRut() { return rut != null ? rut : "00000000-0"; }
    public void setRut(String rut) { this.rut = rut; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getApellido() { return apellido != null ? apellido : ""; }
    public void setApellido(String apellido) { this.apellido = apellido; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }
    public String getDireccion() { return direccion; }
    public void setDireccion(String direccion) { this.direccion = direccion; }
}
