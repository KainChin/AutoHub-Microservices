package com.autohub.customer;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class CustomerApplication {

    public static void main(String[] args) {
        SpringApplication.run(CustomerApplication.class, args);
        System.out.println("🚀 [Customer Service Spring Boot] Started on port 5001");
        System.out.println("📚 [Swagger UI] Available at http://localhost:5001/swagger");
    }
}
