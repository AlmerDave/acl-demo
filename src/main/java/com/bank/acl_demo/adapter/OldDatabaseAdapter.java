package com.bank.acl_demo.adapter;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.bank.acl_demo.entity.legacy.LegacyCustomer;
import com.bank.acl_demo.repository.LegacyCustomerRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class OldDatabaseAdapter {
    
	@Autowired
    private final LegacyCustomerRepository legacyRepository;
    
    public Optional<LegacyCustomer> findById(String customerId) {
        log.debug("🔍 OLD DB Adapter: Searching for customer {}", customerId);
        return legacyRepository.findById(customerId);
    }
    
    public LegacyCustomer save(LegacyCustomer customer) {
        log.debug("💾 OLD DB Adapter: Saving customer {}", customer.getCustomerId());
        return legacyRepository.save(customer);
    }
    
    public long count() {
        return legacyRepository.count();
    }
}