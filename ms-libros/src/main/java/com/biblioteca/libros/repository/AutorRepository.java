package com.biblioteca.libros.repository;

import com.biblioteca.libros.model.Autor;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface AutorRepository extends JpaRepository<Autor, Long> {
    Optional<Autor> findByNombreAndApellido(String nombre, String apellido);
}
