package com.biblioteca.usuarios.service;

import com.biblioteca.usuarios.dto.UsuarioCreateRequest;
import com.biblioteca.usuarios.dto.UsuarioDTO;
import com.biblioteca.usuarios.model.Rol;
import com.biblioteca.usuarios.model.Usuario;
import com.biblioteca.usuarios.repository.RolRepository;
import com.biblioteca.usuarios.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UsuarioService {
    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired
    private RolRepository rolRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<UsuarioDTO> findAll() {
        return usuarioRepository.findAll().stream().map(UsuarioDTO::fromEntity).collect(Collectors.toList());
    }

    public UsuarioDTO findById(Long id) {
        return UsuarioDTO.fromEntity(usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado")));
    }

    public Usuario findByEmail(String email) {
        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    @Transactional
    public UsuarioDTO create(UsuarioCreateRequest req) {
        if (usuarioRepository.existsByEmail(req.getEmail())) 
            throw new RuntimeException("Email ya registrado");
        if (usuarioRepository.existsByRut(req.getRut())) 
            throw new RuntimeException("RUT ya registrado");

        Usuario u = new Usuario();
        u.setRut(req.getRut());
        u.setNombre(req.getNombre());
        u.setApellido(req.getApellido());
        u.setEmail(req.getEmail());
        u.setPassword(passwordEncoder.encode(req.getPassword()));
        u.setTelefono(req.getTelefono());
        u.setDireccion(req.getDireccion());
        
        Rol rol = rolRepository.findByNombre("User").orElseGet(() -> rolRepository.save(new Rol("User")));
        u.getRoles().add(rol);
        
        return UsuarioDTO.fromEntity(usuarioRepository.save(u));
    }

    @Transactional
    public UsuarioDTO update(Long id, UsuarioCreateRequest req) {
        Usuario u = usuarioRepository.findById(id).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        u.setNombre(req.getNombre());
        u.setApellido(req.getApellido());
        u.setTelefono(req.getTelefono());
        u.setDireccion(req.getDireccion());
        if (req.getPassword() != null && !req.getPassword().isEmpty()) {
            u.setPassword(passwordEncoder.encode(req.getPassword()));
        }
        return UsuarioDTO.fromEntity(usuarioRepository.save(u));
    }

    @Transactional
    public void delete(Long id) {
        usuarioRepository.deleteById(id);
    }

    @Transactional
    public void activar(Long id) {
        Usuario u = usuarioRepository.findById(id).orElseThrow(() -> new RuntimeException("No encontrado"));
        u.setActivo(true);
        usuarioRepository.save(u);
    }

    @Transactional
    public void desactivar(Long id) {
        Usuario u = usuarioRepository.findById(id).orElseThrow(() -> new RuntimeException("No encontrado"));
        u.setActivo(false);
        usuarioRepository.save(u);
    }
}

