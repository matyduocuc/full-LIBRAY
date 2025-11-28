package com.biblioteca.usuarios.controller;

import com.biblioteca.usuarios.dto.AuthResponse;
import com.biblioteca.usuarios.dto.LoginRequest;
import com.biblioteca.usuarios.dto.UsuarioCreateRequest;
import com.biblioteca.usuarios.dto.UsuarioDTO;
import com.biblioteca.usuarios.model.Usuario;
import com.biblioteca.usuarios.security.JwtTokenProvider;
import com.biblioteca.usuarios.service.UsuarioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Autenticación", description = "Endpoints de login y registro")
public class AuthController {
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private JwtTokenProvider jwtTokenProvider;
    @Autowired
    private UsuarioService usuarioService;

    @PostMapping("/login")
    @Operation(summary = "Iniciar sesión", description = "Autentica usuario y devuelve token JWT")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        Authentication auth = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        
        String token = jwtTokenProvider.generateToken(request.getEmail());
        Usuario usuario = usuarioService.findByEmail(request.getEmail());
        
        return ResponseEntity.ok(new AuthResponse(
            token,
            usuario.getId(),
            usuario.getEmail(),
            usuario.getNombreCompleto(),
            usuario.getRut(),
            usuario.getRoles().stream().map(r -> r.getNombre()).collect(Collectors.toList())
        ));
    }

    @PostMapping("/register")
    @Operation(summary = "Registrar usuario", description = "Crea un nuevo usuario")
    public ResponseEntity<UsuarioDTO> register(@Valid @RequestBody UsuarioCreateRequest request) {
        return ResponseEntity.ok(usuarioService.create(request));
    }
}


