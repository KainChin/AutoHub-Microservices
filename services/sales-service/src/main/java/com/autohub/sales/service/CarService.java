package com.autohub.sales.service;

import com.autohub.sales.entity.Car;
import com.autohub.sales.repository.CarRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class CarService {

    private final CarRepository carRepository;

    public CarService(CarRepository carRepository) {
        this.carRepository = carRepository;
    }

    @PostConstruct
    public void seedInitialCars() {
        if (carRepository.count() == 0) {
            carRepository.saveAll(List.of(
                new Car(BigDecimal.valueOf(201), "WBA5R1C57KAJ12345", "BMW 330i M Sport", "Đen Sapphire", 2022, 1899000000L, "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80", "Available"),
                new Car(BigDecimal.valueOf(202), "MHF8KC3D1N0123456", "Toyota Fortuner 2.8AT 4x4", "Trắng Ngọc Trai", 2023, 1245000000L, "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80", "Available"),
                new Car(BigDecimal.valueOf(203), "RMHFC1F32PN123456", "Honda Civic RS", "Xám Titan", 2023, 870000000L, "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=800&q=80", "Available"),
                new Car(BigDecimal.valueOf(204), "W1K2050771R123456", "Mercedes-Benz C 200 AMG", "Đen Obsidian", 2021, 1599000000L, "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=800&q=80", "Available"),
                new Car(BigDecimal.valueOf(205), "JTJZAMCA2N2001234", "Lexus RX 350 Luxury", "Bạc Sonic", 2022, 2950000000L, "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80", "Available"),
                new Car(BigDecimal.valueOf(206), "RUMKEF976PV123456", "Mazda CX-5 2.5 Premium", "Đỏ Pha Lê", 2023, 889000000L, "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=800&q=80", "Available")
            ));
            System.out.println("✅ [Sales Service DB Seeded] Initial vehicle inventory seeded into CSDL");
        }
    }

    public List<Car> getAllCars(String status) {
        if (status != null && !status.trim().isEmpty()) {
            return carRepository.findByStatusIgnoreCase(status.trim());
        }
        return carRepository.findAll();
    }

    public Optional<Car> getCarById(BigDecimal id) {
        return carRepository.findById(id);
    }

    public Car saveCar(Car car) {
        if (car.getCarID() == null) {
            car.setCarID(BigDecimal.valueOf(200 + (long)(Math.random() * 800)));
        }
        return carRepository.save(car);
    }
}
