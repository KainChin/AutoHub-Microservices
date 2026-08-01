package com.autohub.sales;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class SalesApplication {

    public static void main(String[] args) {
        SpringApplication.run(SalesApplication.class, args);
        System.out.println("🚀 [Sales Service Spring Boot] Started on port 5002");
        System.out.println("📚 [Swagger UI] Available at http://localhost:5002/swagger");
    }
}
