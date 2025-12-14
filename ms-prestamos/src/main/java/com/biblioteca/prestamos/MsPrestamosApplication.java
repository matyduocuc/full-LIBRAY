package com.biblioteca.prestamos;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class MsPrestamosApplication {
    public static void main(String[] args) {
        SpringApplication.run(MsPrestamosApplication.class, args);
        System.out.println("\n📋 MS-PRESTAMOS iniciado en http://localhost:8083");
        System.out.println("📖 Swagger: http://localhost:8083/swagger-ui.html\n");
    }
}
















