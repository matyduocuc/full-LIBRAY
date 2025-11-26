package com.biblioteca.usuarios.config;

import com.biblioteca.usuarios.model.Rol;
import com.biblioteca.usuarios.model.Usuario;
import com.biblioteca.usuarios.repository.RolRepository;
import com.biblioteca.usuarios.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {
    @Autowired
    private RolRepository rolRepository;
    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Crear roles (Admin y User para coincidir con el frontend)
        Rol rolAdmin = rolRepository.findByNombre("Admin").orElseGet(() -> rolRepository.save(new Rol("Admin")));
        Rol rolUser = rolRepository.findByNombre("User").orElseGet(() -> rolRepository.save(new Rol("User")));

        // Crear usuario Admin
        if (!usuarioRepository.existsByEmail("admin@biblioteca.com")) {
            Usuario admin = new Usuario();
            admin.setRut("11111111-1");
            admin.setNombre("Administrador");
            admin.setApellido("Sistema");
            admin.setEmail("admin@biblioteca.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.getRoles().add(rolAdmin);
            usuarioRepository.save(admin);
            System.out.println("✅ Usuario Admin creado: admin@biblioteca.com / admin123");
        }

        // Crear usuario normal de prueba
        if (!usuarioRepository.existsByEmail("usuario@biblioteca.com")) {
            Usuario user = new Usuario();
            user.setRut("22222222-2");
            user.setNombre("Usuario");
            user.setApellido("Prueba");
            user.setEmail("usuario@biblioteca.com");
            user.setPassword(passwordEncoder.encode("user123"));
            user.getRoles().add(rolUser);
            usuarioRepository.save(user);
            System.out.println("✅ Usuario normal creado: usuario@biblioteca.com / user123");
        }
    }
}

