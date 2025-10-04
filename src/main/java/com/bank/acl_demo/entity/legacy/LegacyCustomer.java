package com.bank.acl_demo.entity.legacy;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "legacy_customer")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LegacyCustomer {
    
    @Id
    @Column(name = "customer_id")
    private String customerId;
    
    @Column(name = "full_name", nullable = false)
    private String fullName;
    
    @Column(name = "email")
    private String email;
    
    @Column(name = "phone_number")
    private String phoneNumber;
    
    @Column(name = "address")
    private String address;
    
    @Column(name = "city")
    private String city;
    
    @Column(name = "account_type")
    private String accountType;
    
    @Column(name = "created_date")
    private String createdDate;
}