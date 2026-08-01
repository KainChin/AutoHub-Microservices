package com.autohub.customer.repository;

import com.autohub.customer.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, BigDecimal> {
    
    // Tìm kiếm khách hàng theo tên (không phân biệt hoa/thường)
    List<Customer> findByCustNameContainingIgnoreCase(String name);
}
