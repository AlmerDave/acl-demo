package com.bank.acl_demo.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bank.acl_demo.dto.CustomerRequestDTO;
import com.bank.acl_demo.dto.CustomerResponseDTO;
import com.bank.acl_demo.dto.MigrationStatsDTO;
import com.bank.acl_demo.service.AntiCorruptionLayer;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/customer")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*") // For GitHub Pages - update with your actual domain later
public class CustomerController {
    
    private final AntiCorruptionLayer aclService;
    
    /**
     * GET customer by ID - Demonstrates ACL smart query
     */
    @GetMapping("/{id}")
    public ResponseEntity<CustomerResponseDTO> getCustomer(@PathVariable String id) {
        log.info("📥 API Request: GET /api/customer/{}", id);
        CustomerResponseDTO response = aclService.getCustomer(id);
        return ResponseEntity.ok(response);
    }
    
    /**
     * CREATE new customer - Demonstrates ACL dual-write
     */
    @PostMapping
    public ResponseEntity<CustomerResponseDTO> createCustomer(
            @Valid @RequestBody CustomerRequestDTO request) {
        log.info("📥 API Request: POST /api/customer");
        CustomerResponseDTO response = aclService.createCustomer(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    /**
     * GET migration statistics
     */
    @GetMapping("/stats")
    public ResponseEntity<MigrationStatsDTO> getMigrationStats() {
        log.info("📥 API Request: GET /api/customer/stats");
        MigrationStatsDTO stats = aclService.getMigrationStats();
        return ResponseEntity.ok(stats);
    }
}