package com.biblioteca.prestamos.controller;

import com.biblioteca.prestamos.dto.PrestamoCreateRequest;
import com.biblioteca.prestamos.dto.PrestamoDTO;
import com.biblioteca.prestamos.service.PrestamoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/prestamos")
@Tag(name = "Préstamos", description = "Gestión de préstamos de libros")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:5176", "http://localhost:3000"})
public class PrestamoController {
    @Autowired
    private PrestamoService prestamoService;

    @GetMapping
    @Operation(summary = "Listar todos los préstamos")
    public ResponseEntity<List<PrestamoDTO>> getAll() {
        return ResponseEntity.ok(prestamoService.findAll());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener préstamo por ID")
    public ResponseEntity<PrestamoDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(prestamoService.findById(id));
    }

    @GetMapping("/usuario/{usuarioId}")
    @Operation(summary = "Listar préstamos de un usuario")
    public ResponseEntity<List<PrestamoDTO>> getByUsuario(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(prestamoService.findByUsuario(usuarioId));
    }

    @GetMapping("/estado/{estado}")
    @Operation(summary = "Listar préstamos por estado")
    public ResponseEntity<List<PrestamoDTO>> getByEstado(@PathVariable String estado) {
        return ResponseEntity.ok(prestamoService.findByEstado(estado));
    }

    @PostMapping
    @Operation(summary = "Crear préstamo")
    public ResponseEntity<PrestamoDTO> create(@Valid @RequestBody PrestamoCreateRequest request) {
        return ResponseEntity.ok(prestamoService.create(request));
    }

    @PostMapping("/{id}/renovar")
    @Operation(summary = "Renovar préstamo")
    public ResponseEntity<PrestamoDTO> renovar(@PathVariable Long id) {
        return ResponseEntity.ok(prestamoService.renovar(id));
    }

    @PostMapping("/{id}/devolver")
    @Operation(summary = "Devolver préstamo")
    public ResponseEntity<PrestamoDTO> devolver(@PathVariable Long id) {
        return ResponseEntity.ok(prestamoService.devolver(id));
    }

    @PutMapping("/{id}/aprobar")
    @Operation(summary = "Aprobar préstamo")
    public ResponseEntity<PrestamoDTO> aprobar(@PathVariable Long id) {
        return ResponseEntity.ok(prestamoService.aprobar(id));
    }

    @PutMapping("/{id}/rechazar")
    @Operation(summary = "Rechazar préstamo")
    public ResponseEntity<PrestamoDTO> rechazar(@PathVariable Long id) {
        return ResponseEntity.ok(prestamoService.rechazar(id));
    }
}

