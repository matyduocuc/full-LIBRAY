package com.biblioteca.libros.service;

import com.biblioteca.libros.dto.BusquedaRequest;
import com.biblioteca.libros.dto.LibroCreateRequest;
import com.biblioteca.libros.dto.LibroDTO;
import com.biblioteca.libros.model.Autor;
import com.biblioteca.libros.model.Categoria;
import com.biblioteca.libros.model.Libro;
import com.biblioteca.libros.repository.AutorRepository;
import com.biblioteca.libros.repository.CategoriaRepository;
import com.biblioteca.libros.repository.LibroRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class LibroService {
    @Autowired private LibroRepository libroRepository;
    @Autowired private AutorRepository autorRepository;
    @Autowired private CategoriaRepository categoriaRepository;

    public List<LibroDTO> findAll() {
        return libroRepository.findByActivoTrue().stream().map(LibroDTO::fromEntity).collect(Collectors.toList());
    }

    public LibroDTO findById(Long id) {
        return LibroDTO.fromEntity(libroRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Libro no encontrado")));
    }

    public List<LibroDTO> findDisponibles() {
        return libroRepository.findDisponibles().stream().map(LibroDTO::fromEntity).collect(Collectors.toList());
    }

    public List<LibroDTO> findByCategoria(String categoria) {
        return libroRepository.findByCategoriaNombre(categoria).stream()
            .map(LibroDTO::fromEntity).collect(Collectors.toList());
    }

    public List<LibroDTO> findByAutor(String autor) {
        return libroRepository.findByAutor(autor).stream()
            .map(LibroDTO::fromEntity).collect(Collectors.toList());
    }

    public List<LibroDTO> buscar(BusquedaRequest req) {
        // Búsqueda simplificada
        List<Libro> libros = libroRepository.findByActivoTrue();
        
        return libros.stream()
            .filter(l -> req.getTitulo() == null || 
                        l.getTitulo().toLowerCase().contains(req.getTitulo().toLowerCase()))
            .filter(l -> req.getIsbn() == null || l.getIsbn().equals(req.getIsbn()))
            .filter(l -> req.getAutorId() == null || 
                        (l.getAutor() != null && l.getAutor().getId().equals(req.getAutorId())))
            .filter(l -> req.getCategoriaId() == null || 
                        (l.getCategoria() != null && l.getCategoria().getId().equals(req.getCategoriaId())))
            .filter(l -> req.getDisponible() == null || 
                        (l.getCantidadDisponible() > 0) == req.getDisponible())
            .map(LibroDTO::fromEntity)
            .collect(Collectors.toList());
    }

    @Transactional
    public LibroDTO create(LibroCreateRequest req) {
        if (libroRepository.existsByIsbn(req.getIsbn())) 
            throw new RuntimeException("ISBN ya existe");

        Libro libro = new Libro();
        libro.setTitulo(req.getTitulo());
        libro.setIsbn(req.getIsbn());
        libro.setDescripcion(req.getDescripcion());
        libro.setAnioPublicacion(req.getAnioPublicacion());
        libro.setEditorial(req.getEditorial());
        libro.setIdioma(req.getIdioma());
        libro.setPaginas(req.getPaginas());
        libro.setPortadaUrl(req.getPortadaUrl());
        libro.setCantidadTotal(req.getCantidadTotal());
        libro.setCantidadDisponible(req.getCantidadTotal());

        if (req.getAutorId() != null) {
            libro.setAutor(autorRepository.findById(req.getAutorId())
                .orElseThrow(() -> new RuntimeException("Autor no encontrado")));
        }
        if (req.getCategoriaId() != null) {
            libro.setCategoria(categoriaRepository.findById(req.getCategoriaId())
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada")));
        }

        return LibroDTO.fromEntity(libroRepository.save(libro));
    }

    @Transactional
    public LibroDTO update(Long id, LibroCreateRequest req) {
        Libro libro = libroRepository.findById(id).orElseThrow(() -> new RuntimeException("Libro no encontrado"));
        libro.setTitulo(req.getTitulo());
        libro.setDescripcion(req.getDescripcion());
        libro.setAnioPublicacion(req.getAnioPublicacion());
        libro.setEditorial(req.getEditorial());
        libro.setIdioma(req.getIdioma());
        libro.setPaginas(req.getPaginas());
        libro.setPortadaUrl(req.getPortadaUrl());

        int diff = req.getCantidadTotal() - libro.getCantidadTotal();
        libro.setCantidadTotal(req.getCantidadTotal());
        libro.setCantidadDisponible(Math.max(0, libro.getCantidadDisponible() + diff));

        if (req.getAutorId() != null) {
            libro.setAutor(autorRepository.findById(req.getAutorId()).orElse(null));
        }
        if (req.getCategoriaId() != null) {
            libro.setCategoria(categoriaRepository.findById(req.getCategoriaId()).orElse(null));
        }

        return LibroDTO.fromEntity(libroRepository.save(libro));
    }

    @Transactional
    public void delete(Long id) {
        Libro libro = libroRepository.findById(id).orElseThrow(() -> new RuntimeException("No encontrado"));
        libro.setActivo(false);
        libroRepository.save(libro);
    }

    @Transactional
    public LibroDTO updateStock(Long id, Integer cantidad) {
        Libro libro = libroRepository.findById(id).orElseThrow(() -> new RuntimeException("No encontrado"));
        libro.setCantidadDisponible(Math.max(0, libro.getCantidadDisponible() + cantidad));
        libro.setCantidadTotal(libro.getCantidadTotal() + cantidad);
        return LibroDTO.fromEntity(libroRepository.save(libro));
    }

    public Map<String, Object> verificarIsbn(String isbn) {
        Map<String, Object> result = new HashMap<>();
        boolean existe = libroRepository.existsByIsbn(isbn);
        result.put("existe", existe);
        result.put("mensaje", existe ? "ISBN ya existe" : "ISBN disponible");
        return result;
    }
}
