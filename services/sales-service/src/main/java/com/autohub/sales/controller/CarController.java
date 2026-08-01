package com.autohub.sales.controller;

import com.autohub.sales.entity.Car;
import com.autohub.sales.service.CarService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sales/cars")
@Tag(name = "Vehicle Inventory", description = "Endpoints for vehicle showroom catalog")
public class CarController {

    private final CarService carService;

    public CarController(CarService carService) {
        this.carService = carService;
    }

    @GetMapping
    @Operation(summary = "Get vehicle catalog or filter by status")
    public ResponseEntity<List<Car>> getAllCars(@RequestParam(required = false) String status) {
        return ResponseEntity.ok(carService.getAllCars(status));
    }

    @PostMapping
    @Operation(summary = "Add a new vehicle to showroom inventory")
    public ResponseEntity<Car> createCar(@RequestBody Car car) {
        return ResponseEntity.status(HttpStatus.CREATED).body(carService.saveCar(car));
    }
}
