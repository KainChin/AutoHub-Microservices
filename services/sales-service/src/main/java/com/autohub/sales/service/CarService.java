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
        if (carRepository.count() < 16) {
            carRepository.deleteAll();
            carRepository.saveAll(List.of(
                new Car(BigDecimal.valueOf(201), "WBA5R1C57KAJ12345", "BMW 330i M Sport", "Đen Sapphire", 2022, 1899000000L, "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80", "Available"),
                new Car(BigDecimal.valueOf(202), "MHF8KC3D1N0123456", "Toyota Fortuner 2.8AT 4x4", "Trắng Ngọc Trai", 2023, 1245000000L, "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80", "Available"),
                new Car(BigDecimal.valueOf(203), "RMHFC1F32PN123456", "Honda Civic RS", "Xám Titan", 2023, 870000000L, "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=800&q=80", "Available"),
                new Car(BigDecimal.valueOf(204), "W1K2050771R123456", "Mercedes-Benz C 200 AMG", "Đen Obsidian", 2021, 1599000000L, "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=800&q=80", "Available"),
                new Car(BigDecimal.valueOf(205), "JTJZAMCA2N2001234", "Lexus RX 350 Luxury", "Bạc Sonic", 2022, 2950000000L, "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80", "Available"),
                new Car(BigDecimal.valueOf(206), "RUMKEF976PV123456", "Mazda CX-5 2.5 Premium", "Đỏ Pha Lê", 2023, 889000000L, "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=800&q=80", "Available"),
                new Car(BigDecimal.valueOf(207), "VF8P2024VN001007", "VinFast VF 8 Plus EV", "Đỏ Crimson", 2024, 1270000000L, "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=800&q=80", "Available"),
                new Car(BigDecimal.valueOf(208), "VF9E2024VN002008", "VinFast VF 9 Eco EV", "Xanh VinFast", 2024, 1491000000L, "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=800&q=80", "Available"),
                new Car(BigDecimal.valueOf(209), "VFE342023VN003009", "VinFast VF e34", "Trắng Neptune", 2023, 710000000L, "https://images.unsplash.com/photo-1541348263662-e068662d82af?auto=format&fit=crop&w=800&q=80", "Available"),
                new Car(BigDecimal.valueOf(210), "HYUTUC2023VN004010", "Hyundai Tucson 2.0 Special", "Đen Nam Cực", 2023, 959000000L, "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80", "Available"),
                new Car(BigDecimal.valueOf(211), "HYUSAN2024VN005011", "Hyundai Santa Fe 2.2 Diesel", "Trắng Ngọc Trai", 2024, 1269000000L, "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=800&q=80", "Available"),
                new Car(BigDecimal.valueOf(212), "KIASEL2023VN006012", "Kia Seltos 1.4 Turbo Premium", "Cam Bạc", 2023, 719000000L, "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80", "Available"),
                new Car(BigDecimal.valueOf(213), "KIACAR2024VN007013", "Kia Carnival 2.2D Signature", "Đen Kim Cương", 2024, 1469000000L, "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80", "Available"),
                new Car(BigDecimal.valueOf(214), "FOREVE2024VN008014", "Ford Everest Titanium+ 4x4", "Nâu Đồng", 2024, 1468000000L, "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80", "Available"),
                new Car(BigDecimal.valueOf(215), "MITXPA2023VN009015", "Mitsubishi Xpander Cross", "Cam Đen", 2023, 698000000L, "https://images.unsplash.com/photo-1541348263662-e068662d82af?auto=format&fit=crop&w=800&q=80", "Available"),
                new Car(BigDecimal.valueOf(216), "TOYCRO2023VN010016", "Toyota Corolla Cross 1.8V", "Đỏ Pha Lê", 2023, 860000000L, "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=800&q=80", "Available")
            ));
            System.out.println("✅ [Sales Service DB Seeded] 16 popular vehicles seeded into CSDL");
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
