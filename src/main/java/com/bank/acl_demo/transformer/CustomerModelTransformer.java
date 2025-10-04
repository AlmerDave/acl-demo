package com.bank.acl_demo.transformer;

import java.time.LocalDate;
import java.util.UUID;

import org.springframework.stereotype.Component;

import com.bank.acl_demo.dto.CustomerRequestDTO;
import com.bank.acl_demo.dto.CustomerResponseDTO;
import com.bank.acl_demo.entity.legacy.LegacyCustomer;
import com.bank.acl_demo.entity.modern.Address;
import com.bank.acl_demo.entity.modern.Contact;
import com.bank.acl_demo.entity.modern.Customer;

import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class CustomerModelTransformer {
    
    /**
     * Transform Legacy (flat) model → Modern (normalized) model
     */
    public Customer fromLegacy(LegacyCustomer legacy) {
        log.debug("🔄 Transforming LEGACY → MODERN for customer {}", legacy.getCustomerId());
        
        Customer customer = new Customer();
        customer.setId(legacy.getCustomerId());
        customer.setName(legacy.getFullName());
        customer.setAccountType(legacy.getAccountType());
        
        // Create Address
        Address address = new Address();
        address.setStreet(legacy.getAddress());
        address.setCity(legacy.getCity());
        address.setCustomer(customer);
        customer.setAddress(address);
        
        // Create Contact
        Contact contact = new Contact();
        contact.setEmail(legacy.getEmail());
        contact.setPhone(legacy.getPhoneNumber());
        contact.setCustomer(customer);
        customer.setContact(contact);
        
        return customer;
    }
    
    /**
     * Transform Modern (normalized) model → Legacy (flat) model
     */
    public LegacyCustomer toLegacy(Customer customer) {
        log.debug("🔄 Transforming MODERN → LEGACY for customer {}", customer.getId());
        
        LegacyCustomer legacy = new LegacyCustomer();
        legacy.setCustomerId(customer.getId());
        legacy.setFullName(customer.getName());
        legacy.setAccountType(customer.getAccountType());
        legacy.setCreatedDate(LocalDate.now().toString());
        
        if (customer.getContact() != null) {
            legacy.setEmail(customer.getContact().getEmail());
            legacy.setPhoneNumber(customer.getContact().getPhone());
        }
        
        if (customer.getAddress() != null) {
            legacy.setAddress(customer.getAddress().getStreet());
            legacy.setCity(customer.getAddress().getCity());
        }
        
        return legacy;
    }
    
    /**
     * Transform DTO → Modern model
     */
    public Customer fromRequest(CustomerRequestDTO dto) {
        log.debug("🔄 Transforming DTO → MODERN for new customer");
        
        Customer customer = new Customer();
        customer.setId("NEW" + UUID.randomUUID().toString().substring(0, 6).toUpperCase());
        customer.setName(dto.getName());
        customer.setAccountType(dto.getAccountType() != null ? dto.getAccountType() : "SAVINGS");
        
        // Create Address
        Address address = new Address();
        address.setStreet(dto.getStreet());
        address.setCity(dto.getCity());
        address.setState(dto.getState());
        address.setZipCode(dto.getZipCode());
        address.setCustomer(customer);
        customer.setAddress(address);
        
        // Create Contact
        Contact contact = new Contact();
        contact.setEmail(dto.getEmail());
        contact.setPhone(dto.getPhone());
        contact.setPreferredContact("EMAIL");
        contact.setCustomer(customer);
        customer.setContact(contact);
        
        return customer;
    }
    
    /**
     * Transform Modern model → Response DTO
     */
    public CustomerResponseDTO toResponseDTO(Customer customer, String source) {
        return CustomerResponseDTO.builder()
                .id(customer.getId())
                .name(customer.getName())
                .email(customer.getContact() != null ? customer.getContact().getEmail() : null)
                .phone(customer.getContact() != null ? customer.getContact().getPhone() : null)
                .street(customer.getAddress() != null ? customer.getAddress().getStreet() : null)
                .city(customer.getAddress() != null ? customer.getAddress().getCity() : null)
                .state(customer.getAddress() != null ? customer.getAddress().getState() : null)
                .zipCode(customer.getAddress() != null ? customer.getAddress().getZipCode() : null)
                .accountType(customer.getAccountType())
                .source(source)
                .build();
    }
}