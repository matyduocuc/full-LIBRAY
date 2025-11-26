package com.biblioteca.libros.controller;

import com.biblioteca.libros.dto.BusquedaRequest;
import com.biblioteca.libros.dto.LibroCreateRequest;
import com.biblioteca.libros.dto.LibroDTO;
import com.biblioteca.libros.service.LibroService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/libros")
@Tag(name = "Libros", description = "Gestión de libros")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:5176", "http://localhost:3000"})
public class LibroController {
    @Autowired
    private LibroService libroService;

    @GetMapping
    @Operation(summary = "Listar todos los libros")
    public ResponseEntity<List<LibroDTO>> getAll() {
        return ResponseEntity.ok(libroService.findAll());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener libro por ID")
    public ResponseEntity<LibroDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(libroService.findById(id));
    }

    @GetMapping("/disponibles")
    @Operation(summary = "Listar libros disponibles")
    public ResponseEntity<List<LibroDTO>> getDisponibles() {
        return ResponseEntity.ok(libroService.findDisponibles());
    }

    @GetMapping("/categoria/{categoria}")
    @Operation(summary = "Listar libros por categoría")
    public ResponseEntity<List<LibroDTO>> getByCategoria(@PathVariable String categoria) {
        return ResponseEntity.ok(libroService.findByCategoria(categoria));
    }

    @GetMapping("/autor/{autor}")
    @Operation(summary = "Listar libros por autor")
    public ResponseEntity<List<LibroDTO>> getByAutor(@PathVariable String autor) {
        return ResponseEntity.ok(libroService.findByAutor(autor));
    }

    @PostMapping("/buscar")
    @Operation(summary = "Buscar libros con criterios")
    public ResponseEntity<List<LibroDTO>> buscar(@RequestBody BusquedaRequest request) {
        return ResponseEntity.ok(libroService.buscar(request));
    }

    @PostMapping
    @Operation(summary = "Crear libro")
    public ResponseEntity<LibroDTO> create(@Valid @RequestBody LibroCreateRequest request) {
        return ResponseEntity.ok(libroService.create(request));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar libro")
    public ResponseEntity<LibroDTO> update(@PathVariable Long id, @Valid @RequestBody LibroCreateRequest request) {
        return ResponseEntity.ok(libroService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar libro")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        libroService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/stock")
    @Operation(summary = "Actualizar stock de libro")
    public ResponseEntity<LibroDTO> updateStock(@PathVariable Long id, @RequestParam Integer cantidad) {
        return ResponseEntity.ok(libroService.updateStock(id, cantidad));
    }

    @GetMapping("/verificar-isbn/{isbn}")
    @Operation(summary = "Verificar si ISBN existe")
    public ResponseEntity<Map<String, Object>> verificarIsbn(@PathVariable String isbn) {
        return ResponseEntity.ok(libroService.verificarIsbn(isbn));
    }
}

