package com.bank.acl_demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.bank.acl_demo.entity.legacy.LegacyCustomer;

@Repository
public interface LegacyCustomerRepository extends JpaRepository<LegacyCustomer, String> {
}