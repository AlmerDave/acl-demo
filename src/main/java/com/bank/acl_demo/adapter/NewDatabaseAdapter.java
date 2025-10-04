package com.bank.acl_demo.adapter;

import java.util.Optional;

import org.springframework.stereotype.Component;

import com.bank.acl_demo.entity.modern.Customer;
import com.bank.acl_demo.repository.CustomerRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class NewDatabaseAdapter {
    
    private final CustomerRepository customerRepository;
    
    public Optional<Customer> findById(String customerId) {
        log.debug("🔍 NEW DB Adapter: Searching for customer {}", customerId);
        return customerRepository.findById(customerId);
    }
    
    public Customer save(Customer customer) {
        log.debug("💾 NEW DB Adapter: Saving customer {}", customer.getId());
        return customerRepository.save(customer);
    }
    
    public long count() {
        return customerRepository.count();
    }
}