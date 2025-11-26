package com.biblioteca.informes.controller;

import com.biblioteca.informes.dto.DashboardDTO;
import com.biblioteca.informes.dto.MultasResumenDTO;
import com.biblioteca.informes.dto.PrestamosResumenDTO;
import com.biblioteca.informes.dto.UsuarioResumenDTO;
import com.biblioteca.informes.service.InformeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * CONTROLADOR DE INFORMES
 * 
 * Endpoints para obtener reportes y estadísticas del sistema.
 * Este microservicio consulta a los otros microservicios y agrega los datos.
 * 
 * ENDPOINTS:
 * - GET /api/informes/dashboard - Dashboard principal con todas las estadísticas
 * - GET /api/informes/prestamos/resumen - Resumen de préstamos
 * - GET /api/informes/usuarios/{id}/resumen - Resumen de un usuario
 * - GET /api/informes/multas/resumen - Resumen de multas
 */
@RestController
@RequestMapping("/api/informes")
@Tag(name = "Informes", description = "Reportes y estadísticas agregadas")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:3000"})
public class InformeController {

    @Autowired
    private InformeService informeService;

    @GetMapping("/dashboard")
    @Operation(summary = "Dashboard principal", 
               description = "Devuelve todas las estadísticas: libros, usuarios, préstamos")
    public ResponseEntity<DashboardDTO> getDashboard() {
        System.out.println("📊 Generando dashboard...");
        DashboardDTO dashboard = informeService.getDashboard();
        System.out.println("✅ Dashboard generado");
        return ResponseEntity.ok(dashboard);
    }

    @GetMapping("/prestamos/resumen")
    @Operation(summary = "Resumen de préstamos", 
               description = "Consulta MS-PRESTAMOS y devuelve estadísticas")
    public ResponseEntity<PrestamosResumenDTO> getPrestamosResumen() {
        return ResponseEntity.ok(informeService.getPrestamosResumen());
    }

    @GetMapping("/usuarios/{usuarioId}/resumen")
    @Operation(summary = "Resumen de un usuario",
               description = "Estadísticas de préstamos de un usuario específico")
    public ResponseEntity<UsuarioResumenDTO> getUsuarioResumen(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(informeService.getUsuarioResumen(usuarioId));
    }

    @GetMapping("/multas/resumen")
    @Operation(summary = "Resumen de multas")
    public ResponseEntity<MultasResumenDTO> getMultasResumen() {
        return ResponseEntity.ok(informeService.getMultasResumen());
    }
}
