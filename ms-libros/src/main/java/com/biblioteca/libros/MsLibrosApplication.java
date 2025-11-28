package com.biblioteca.libros;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class MsLibrosApplication {
    public static void main(String[] args) {
        SpringApplication.run(MsLibrosApplication.class, args);
        System.out.println("\n📚 MS-LIBROS iniciado en http://localhost:8082");
        System.out.println("📖 Swagger: http://localhost:8082/swagger-ui.html\n");
    }
}








