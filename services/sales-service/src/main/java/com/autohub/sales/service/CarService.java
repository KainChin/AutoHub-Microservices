package com.autohub.sales.service;

import com.autohub.sales.entity.Car;
import com.autohub.sales.repository.CarRepository;
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
