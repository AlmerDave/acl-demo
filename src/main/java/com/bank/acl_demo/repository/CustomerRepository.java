package com.bank.acl_demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.bank.acl_demo.entity.modern.Customer;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, String> {
}