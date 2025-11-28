package com.biblioteca.libros.dto;

import com.biblioteca.libros.model.Libro;
import java.time.LocalDateTime;

public class LibroDTO {
    private Long id;
    private String titulo;
    private String isbn;
    private String descripcion;
    private Integer anioPublicacion;
    private String editorial;
    private String idioma;
    private Integer paginas;
    private String portadaUrl;
    private Integer cantidadTotal;
    private Integer cantidadDisponible;
    private Boolean activo;
    private LocalDateTime fechaCreacion;
    private AutorDTO autor;
    private CategoriaDTO categoria;

    public static LibroDTO fromEntity(Libro l) {
        LibroDTO dto = new LibroDTO();
        dto.id = l.getId();
        dto.titulo = l.getTitulo();
        dto.isbn = l.getIsbn();
        dto.descripcion = l.getDescripcion();
        dto.anioPublicacion = l.getAnioPublicacion();
        dto.editorial = l.getEditorial();
        dto.idioma = l.getIdioma();
        dto.paginas = l.getPaginas();
        dto.portadaUrl = l.getPortadaUrl();
        dto.cantidadTotal = l.getCantidadTotal();
        dto.cantidadDisponible = l.getCantidadDisponible();
        dto.activo = l.getActivo();
        dto.fechaCreacion = l.getFechaCreacion();
        if (l.getAutor() != null) {
            dto.autor = new AutorDTO(l.getAutor().getId(), l.getAutor().getNombre(), 
                                     l.getAutor().getApellido(), l.getAutor().getNacionalidad());
        }
        if (l.getCategoria() != null) {
            dto.categoria = new CategoriaDTO(l.getCategoria().getId(), 
                                             l.getCategoria().getNombre(), l.getCategoria().getDescripcion());
        }
        return dto;
    }

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }
    public String getIsbn() { return isbn; }
    public void setIsbn(String isbn) { this.isbn = isbn; }
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    public Integer getAnioPublicacion() { return anioPublicacion; }
    public void setAnioPublicacion(Integer anioPublicacion) { this.anioPublicacion = anioPublicacion; }
    public String getEditorial() { return editorial; }
    public void setEditorial(String editorial) { this.editorial = editorial; }
    public String getIdioma() { return idioma; }
    public void setIdioma(String idioma) { this.idioma = idioma; }
    public Integer getPaginas() { return paginas; }
    public void setPaginas(Integer paginas) { this.paginas = paginas; }
    public String getPortadaUrl() { return portadaUrl; }
    public void setPortadaUrl(String portadaUrl) { this.portadaUrl = portadaUrl; }
    public Integer getCantidadTotal() { return cantidadTotal; }
    public void setCantidadTotal(Integer cantidadTotal) { this.cantidadTotal = cantidadTotal; }
    public Integer getCantidadDisponible() { return cantidadDisponible; }
    public void setCantidadDisponible(Integer cantidadDisponible) { this.cantidadDisponible = cantidadDisponible; }
    public Boolean getActivo() { return activo; }
    public void setActivo(Boolean activo) { this.activo = activo; }
    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(LocalDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }
    public AutorDTO getAutor() { return autor; }
    public void setAutor(AutorDTO autor) { this.autor = autor; }
    public CategoriaDTO getCategoria() { return categoria; }
    public void setCategoria(CategoriaDTO categoria) { this.categoria = categoria; }

    public static class AutorDTO {
        private Long id;
        private String nombre;
        private String apellido;
        private String nacionalidad;
        
        public AutorDTO() {}
        public AutorDTO(Long id, String nombre, String apellido, String nacionalidad) {
            this.id = id; this.nombre = nombre; this.apellido = apellido; this.nacionalidad = nacionalidad;
        }
        public Long getId() { return id; }
        public String getNombre() { return nombre; }
        public String getApellido() { return apellido; }
        public String getNacionalidad() { return nacionalidad; }
    }

    public static class CategoriaDTO {
        private Long id;
        private String nombre;
        private String descripcion;
        
        public CategoriaDTO() {}
        public CategoriaDTO(Long id, String nombre, String descripcion) {
            this.id = id; this.nombre = nombre; this.descripcion = descripcion;
        }
        public Long getId() { return id; }
        public String getNombre() { return nombre; }
        public String getDescripcion() { return descripcion; }
    }
}


