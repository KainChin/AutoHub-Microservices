package com.autohub.sales.service;

import com.autohub.sales.entity.Car;
import com.autohub.sales.entity.SalesInvoice;
import com.autohub.sales.repository.CarRepository;
import com.autohub.sales.repository.SalesInvoiceRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InvoiceService {

    private final SalesInvoiceRepository invoiceRepository;
    private final CarRepository carRepository;

    public InvoiceService(SalesInvoiceRepository invoiceRepository, CarRepository carRepository) {
        this.invoiceRepository = invoiceRepository;
        this.carRepository = carRepository;
    }

    public List<SalesInvoice> getAllInvoices() {
        return invoiceRepository.findAll();
    }

    public SalesInvoice createInvoice(SalesInvoice invoice) {
        // 1. Kiểm tra xem xe có tồn tại và đang Available không
        Car car = carRepository.findById(invoice.getCarID())
                .orElseThrow(() -> new IllegalArgumentException("Car #" + invoice.getCarID() + " not found"));

        if ("Sold".equalsIgnoreCase(car.getStatus())) {
            throw new IllegalStateException("Car #" + invoice.getCarID() + " is already Sold");
        }

        // 2. Chuyển trạng thái xe thành 'Sold'
        car.setStatus("Sold");
        carRepository.save(car);

        // 3. Lưu Hóa đơn
        SalesInvoice saved = invoiceRepository.save(invoice);

        // 4. Giả lập bắn sự kiện Kafka
        System.out.println("📢 [Kafka Event Emitted] CarSoldEvent -> Invoice #" + saved.getInvoiceID() + ", Car #" + car.getCarID());

        return saved;
    }
}
