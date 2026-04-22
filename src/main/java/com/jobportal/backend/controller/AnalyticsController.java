package com.jobportal.backend.controller;

import com.jobportal.backend.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/analytics")
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    @GetMapping("/employer/{employerId}")
    public Map<String, Object> getEmployerStats(@PathVariable Long employerId) {
        return analyticsService.getEmployerAnalytics(employerId);
    }
}
