package com.autohub.sales.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "SalesInvoice")
public class SalesInvoice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "invoiceID")
    private Integer invoiceID;

    @Column(name = "invoiceDate")
    private LocalDate invoiceDate = LocalDate.now();

    @Column(name = "salesID")
    private BigDecimal salesID;

    @Column(name = "carID")
    private BigDecimal carID;

    @Column(name = "custID")
    private BigDecimal custID;

    @Column(name = "price")
    private Integer price;

    public SalesInvoice() {}

    public SalesInvoice(BigDecimal salesID, BigDecimal carID, BigDecimal custID, Integer price) {
        this.salesID = salesID;
        this.carID = carID;
        this.custID = custID;
        this.price = price;
        this.invoiceDate = LocalDate.now();
    }

    public Integer getInvoiceID() { return invoiceID; }
    public void setInvoiceID(Integer invoiceID) { this.invoiceID = invoiceID; }

    public LocalDate getInvoiceDate() { return invoiceDate; }
    public void setInvoiceDate(LocalDate invoiceDate) { this.invoiceDate = invoiceDate; }

    public BigDecimal getSalesID() { return salesID; }
    public void setSalesID(BigDecimal salesID) { this.salesID = salesID; }

    public BigDecimal getCarID() { return carID; }
    public void setCarID(BigDecimal carID) { this.carID = carID; }

    public BigDecimal getCustID() { return custID; }
    public void setCustID(BigDecimal custID) { this.custID = custID; }

    public Integer getPrice() { return price; }
    public void setPrice(Integer price) { this.price = price; }
}
