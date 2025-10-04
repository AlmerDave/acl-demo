package com.bank.acl_demo.service;

import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bank.acl_demo.adapter.NewDatabaseAdapter;
import com.bank.acl_demo.adapter.OldDatabaseAdapter;
import com.bank.acl_demo.dto.CustomerRequestDTO;
import com.bank.acl_demo.dto.CustomerResponseDTO;
import com.bank.acl_demo.dto.MigrationStatsDTO;
import com.bank.acl_demo.entity.legacy.LegacyCustomer;
import com.bank.acl_demo.entity.modern.Customer;
import com.bank.acl_demo.exception.CustomerNotFoundException;
import com.bank.acl_demo.transformer.CustomerModelTransformer;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class AntiCorruptionLayer {
    
    private final OldDatabaseAdapter oldDbAdapter;
    private final NewDatabaseAdapter newDbAdapter;
    private final CustomerModelTransformer transformer;
    
    /**
     * SMART READ: Try new DB first, fallback to old DB
     * This is the core ACL pattern for querying
     */
    @Transactional(readOnly = true)
    public CustomerResponseDTO getCustomer(String customerId) {
        log.info("🔍 ACL: Initiating smart query for customer ID: {}", customerId);
        
        // STEP 1: Try New Database first
        log.debug("   → Step 1: Checking NEW database...");
        Optional<Customer> newCustomer = newDbAdapter.findById(customerId);
        
        if (newCustomer.isPresent()) {
            log.info("   ✅ FOUND in NEW database");
            return transformer.toResponseDTO(newCustomer.get(), "NEW_DB");
        }
        
        // STEP 2: Fallback to Old Database
        log.debug("   → Step 2: Not found in new DB, checking LEGACY database...");
        Optional<LegacyCustomer> oldCustomer = oldDbAdapter.findById(customerId);
        
        if (oldCustomer.isPresent()) {
            log.info("   ✅ FOUND in LEGACY database");
            log.debug("   → Step 3: Transforming legacy data to modern format...");
            Customer transformed = transformer.fromLegacy(oldCustomer.get());
            return transformer.toResponseDTO(transformed, "LEGACY_DB");
        }
        
        // STEP 3: Not found in either database
        log.error("   ❌ Customer {} not found in ANY database", customerId);
        throw new CustomerNotFoundException("Customer with ID " + customerId + " not found");
    }
    
    /**
     * DUAL WRITE: Write to both databases
     * This ensures backward compatibility during migration
     */
    @Transactional
    public CustomerResponseDTO createCustomer(CustomerRequestDTO request) {
        log.info("📝 ACL: Starting DUAL-WRITE for new customer");
        
        // STEP 1: Transform DTO to modern model
        log.debug("   → Step 1: Creating modern model from request...");
        Customer newCustomer = transformer.fromRequest(request);
        
        // STEP 2: Save to NEW database
        log.debug("   → Step 2: Saving to NEW database...");
        Customer savedCustomer = newDbAdapter.save(newCustomer);
        log.info("   ✅ Saved to NEW database with ID: {}", savedCustomer.getId());
        
        // STEP 3: Transform to legacy format
        log.debug("   → Step 3: Converting to legacy format...");
        LegacyCustomer legacyCustomer = transformer.toLegacy(savedCustomer);
        
        // STEP 4: Save to OLD database for backward compatibility
        log.debug("   → Step 4: Saving to LEGACY database...");
        oldDbAdapter.save(legacyCustomer);
        log.info("   ✅ Saved to LEGACY database for backward compatibility");
        
        log.info("🎉 ACL: Dual-write completed successfully!");
        
        CustomerResponseDTO response = transformer.toResponseDTO(savedCustomer, "DUAL_WRITE");
        response.setMessage("Successfully created in both NEW and LEGACY databases");
        return response;
    }
    
    /**
     * Get migration statistics
     */
    @Transactional(readOnly = true)
    public MigrationStatsDTO getMigrationStats() {
        long legacyCount = oldDbAdapter.count();
        long modernCount = newDbAdapter.count();
        long total = legacyCount + modernCount;
        
        double percentage = total > 0 ? (modernCount * 100.0 / total) : 0.0;
        
        String status = percentage >= 100 ? "COMPLETED" : 
                       percentage >= 50 ? "IN_PROGRESS" : "STARTED";
        
        return MigrationStatsDTO.builder()
                .legacyRecords(legacyCount)
                .modernRecords(modernCount)
                .totalRecords(total)
                .migrationPercentage(Math.round(percentage * 100.0) / 100.0)
                .status(status)
                .build();
    }
}