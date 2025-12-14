package com.biblioteca.informes;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class MsInformesApplication {
    public static void main(String[] args) {
        SpringApplication.run(MsInformesApplication.class, args);
        System.out.println("\n📊 MS-INFORMES iniciado en http://localhost:8085");
        System.out.println("📖 Swagger: http://localhost:8085/swagger-ui.html\n");
    }
}
















