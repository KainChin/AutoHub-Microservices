package com.autohub.customer.service;

import com.autohub.customer.entity.Customer;
import com.autohub.customer.repository.CustomerRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;

    public CustomerService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    public List<Customer> getAllCustomers(String query) {
        if (query != null && !query.trim().isEmpty()) {
            return customerRepository.findByCustNameContainingIgnoreCase(query.trim());
        }
        return customerRepository.findAll();
    }

    public Optional<Customer> getCustomerById(BigDecimal id) {
        return customerRepository.findById(id);
    }

    public Customer saveCustomer(Customer customer) {
        if (customer.getCustID() == null) {
            customer.setCustID(BigDecimal.valueOf(100 + (long)(Math.random() * 900)));
        }
        return customerRepository.save(customer);
    }

    public void deleteCustomer(BigDecimal id) {
        customerRepository.deleteById(id);
    }
}
