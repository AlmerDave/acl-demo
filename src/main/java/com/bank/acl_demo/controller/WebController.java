package com.bank.acl_demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import com.bank.acl_demo.dto.MigrationStatsDTO;
import com.bank.acl_demo.service.AntiCorruptionLayer;

import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
public class WebController {
    
    private final AntiCorruptionLayer aclService;
    
    @GetMapping("/")
    public String index(Model model) {
        MigrationStatsDTO stats = aclService.getMigrationStats();
        model.addAttribute("stats", stats);
        return "index";
    }
    
    @GetMapping("/documentation")
    public String documentation() {
        return "documentation";
    }
}