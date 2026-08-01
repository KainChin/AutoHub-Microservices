package com.autohub.sales.repository;

import com.autohub.sales.entity.Car;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface CarRepository extends JpaRepository<Car, BigDecimal> {
    List<Car> findByStatusIgnoreCase(String status);
}
