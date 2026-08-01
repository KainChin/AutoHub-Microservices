package com.autohub.sales.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.math.BigDecimal;

@Entity
@Table(name = "Cars")
public class Car {

    @Id
    @Column(name = "carID")
    private BigDecimal carID;

    @Column(name = "serialNumber")
    private String serialNumber;

    @Column(name = "model", nullable = false)
    private String model;

    @Column(name = "colour")
    private String colour;

    @Column(name = "year")
    private Integer year;

    @Column(name = "Status", nullable = false)
    private String status = "Available";

    public Car() {}

    public Car(BigDecimal carID, String serialNumber, String model, String colour, Integer year, String status) {
        this.carID = carID;
        this.serialNumber = serialNumber;
        this.model = model;
        this.colour = colour;
        this.year = year;
        this.status = status;
    }

    public BigDecimal getCarID() { return carID; }
    public void setCarID(BigDecimal carID) { this.carID = carID; }

    public String getSerialNumber() { return serialNumber; }
    public void setSerialNumber(String serialNumber) { this.serialNumber = serialNumber; }

    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }

    public String getColour() { return colour; }
    public void setColour(String colour) { this.colour = colour; }

    public Integer getYear() { return year; }
    public void setYear(Integer year) { this.year = year; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
