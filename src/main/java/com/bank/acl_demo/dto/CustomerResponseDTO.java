package com.bank.acl_demo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CustomerResponseDTO {
    
    private String id;
    private String name;
    private String email;
    private String phone;
    private String street;
    private String city;
    private String state;
    private String zipCode;
    private String accountType;
    private String source; // "NEW_DB", "LEGACY_DB", or "DUAL_WRITE"
    private String message;
}