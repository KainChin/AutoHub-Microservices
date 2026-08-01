package com.autohub.customer.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.math.BigDecimal;

@Entity
@Table(name = "Customer")
public class Customer {

    @Id
    @Column(name = "custID")
    private BigDecimal custID;

    @Column(name = "custName", nullable = false)
    private String custName;

    @Column(name = "phone")
    private BigDecimal phone;

    @Column(name = "sex", length = 10)
    private String sex;

    @Column(name = "cusAddress")
    private String cusAddress;

    public Customer() {}

    public Customer(BigDecimal custID, String custName, BigDecimal phone, String sex, String cusAddress) {
        this.custID = custID;
        this.custName = custName;
        this.phone = phone;
        this.sex = sex;
        this.cusAddress = cusAddress;
    }

    public BigDecimal getCustID() { return custID; }
    public void setCustID(BigDecimal custID) { this.custID = custID; }

    public String getCustName() { return custName; }
    public void setCustName(String custName) { this.custName = custName; }

    public BigDecimal getPhone() { return phone; }
    public void setPhone(BigDecimal phone) { this.phone = phone; }

    public String getSex() { return sex; }
    public void setSex(String sex) { this.sex = sex; }

    public String getCusAddress() { return cusAddress; }
    public void setCusAddress(String cusAddress) { this.cusAddress = cusAddress; }
}
