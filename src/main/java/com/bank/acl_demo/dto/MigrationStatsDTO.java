package com.bank.acl_demo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MigrationStatsDTO {
    
    private long legacyRecords;
    private long modernRecords;
    private long totalRecords;
    private double migrationPercentage;
    private String status;
}