package com.biblioteca.libros.config;

import com.biblioteca.libros.model.Autor;
import com.biblioteca.libros.model.Categoria;
import com.biblioteca.libros.model.Libro;
import com.biblioteca.libros.repository.AutorRepository;
import com.biblioteca.libros.repository.CategoriaRepository;
import com.biblioteca.libros.repository.LibroRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {
    @Autowired private AutorRepository autorRepository;
    @Autowired private CategoriaRepository categoriaRepository;
    @Autowired private LibroRepository libroRepository;

    @Override
    public void run(String... args) {
        // Solo inicializar si no hay datos
        if (libroRepository.count() > 0) {
            System.out.println("✅ Datos ya existen, saltando inicialización");
            return;
        }

        // Crear categorías (verificar si existen)
        Categoria programacion = categoriaRepository.findByNombre("Programación")
            .orElseGet(() -> categoriaRepository.save(new Categoria("Programación", "Libros de desarrollo de software")));
        Categoria redes = categoriaRepository.findByNombre("Redes")
            .orElseGet(() -> categoriaRepository.save(new Categoria("Redes", "Libros de redes y comunicaciones")));
        Categoria bbdd = categoriaRepository.findByNombre("Bases de Datos")
            .orElseGet(() -> categoriaRepository.save(new Categoria("Bases de Datos", "Libros de bases de datos")));

        // Crear autores (verificar si existen)
        Autor martin = autorRepository.findByNombreAndApellido("Robert", "Martin")
            .orElseGet(() -> autorRepository.save(new Autor("Robert", "Martin", "USA")));
        Autor gamma = autorRepository.findByNombreAndApellido("Erich", "Gamma")
            .orElseGet(() -> autorRepository.save(new Autor("Erich", "Gamma", "Suiza")));
        Autor tanenbaum = autorRepository.findByNombreAndApellido("Andrew", "Tanenbaum")
            .orElseGet(() -> autorRepository.save(new Autor("Andrew", "Tanenbaum", "USA")));
        Autor silberschatz = autorRepository.findByNombreAndApellido("Abraham", "Silberschatz")
            .orElseGet(() -> autorRepository.save(new Autor("Abraham", "Silberschatz", "USA")));

        // Crear libros
        Libro libro1 = new Libro();
        libro1.setTitulo("Clean Code");
        libro1.setIsbn("978-0132350884");
        libro1.setDescripcion("Código limpio: Manual de estilo para el desarrollo ágil de software");
        libro1.setAnioPublicacion(2008);
        libro1.setEditorial("Prentice Hall");
        libro1.setIdioma("Español");
        libro1.setPaginas(464);
        libro1.setPortadaUrl("/img/books/clean-code.jpg");
        libro1.setCantidadTotal(5);
        libro1.setCantidadDisponible(5);
        libro1.setAutor(martin);
        libro1.setCategoria(programacion);
        libroRepository.save(libro1);

        Libro libro2 = new Libro();
        libro2.setTitulo("Design Patterns");
        libro2.setIsbn("978-0201633610");
        libro2.setDescripcion("Patrones de diseño: elementos de software orientado a objetos reutilizable");
        libro2.setAnioPublicacion(1994);
        libro2.setEditorial("Addison-Wesley");
        libro2.setIdioma("Español");
        libro2.setPaginas(395);
        libro2.setPortadaUrl("/img/books/design-patterns.jpg");
        libro2.setCantidadTotal(3);
        libro2.setCantidadDisponible(3);
        libro2.setAutor(gamma);
        libro2.setCategoria(programacion);
        libroRepository.save(libro2);

        Libro libro3 = new Libro();
        libro3.setTitulo("Redes de Computadoras");
        libro3.setIsbn("978-6073238465");
        libro3.setDescripcion("Libro completo sobre redes de computadoras");
        libro3.setAnioPublicacion(2012);
        libro3.setEditorial("Pearson");
        libro3.setIdioma("Español");
        libro3.setPaginas(960);
        libro3.setPortadaUrl("/img/books/computer-networks.jpg");
        libro3.setCantidadTotal(4);
        libro3.setCantidadDisponible(4);
        libro3.setAutor(tanenbaum);
        libro3.setCategoria(redes);
        libroRepository.save(libro3);

        Libro libro4 = new Libro();
        libro4.setTitulo("Fundamentos de Bases de Datos");
        libro4.setIsbn("978-8448190330");
        libro4.setDescripcion("Fundamentos de sistemas de bases de datos");
        libro4.setAnioPublicacion(2014);
        libro4.setEditorial("McGraw-Hill");
        libro4.setIdioma("Español");
        libro4.setPaginas(672);
        libro4.setPortadaUrl("/img/books/fundamentos-de-bases-de-datos.jpg");
        libro4.setCantidadTotal(6);
        libro4.setCantidadDisponible(6);
        libro4.setAutor(silberschatz);
        libro4.setCategoria(bbdd);
        libroRepository.save(libro4);

        System.out.println("✅ 4 libros creados en la base de datos");
    }
}
