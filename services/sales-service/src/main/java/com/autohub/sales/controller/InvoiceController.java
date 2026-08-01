package com.autohub.sales.controller;

import com.autohub.sales.entity.SalesInvoice;
import com.autohub.sales.service.InvoiceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sales/invoices")
@Tag(name = "Sales Invoices", description = "Endpoints for car sales transactions")
public class InvoiceController {

    private final InvoiceService invoiceService;

    public InvoiceController(InvoiceService invoiceService) {
        this.invoiceService = invoiceService;
    }

    @GetMapping
    @Operation(summary = "Get list of all sales invoices")
    public ResponseEntity<List<SalesInvoice>> getAllInvoices() {
        return ResponseEntity.ok(invoiceService.getAllInvoices());
    }

    @PostMapping
    @Operation(summary = "Issue a sales invoice and mark car as Sold")
    public ResponseEntity<SalesInvoice> createInvoice(@RequestBody SalesInvoice invoice) {
        return ResponseEntity.status(HttpStatus.CREATED).body(invoiceService.createInvoice(invoice));
    }
}
