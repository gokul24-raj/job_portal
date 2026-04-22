package com.jobportal.backend.service;

import com.jobportal.backend.model.Application;
import com.jobportal.backend.model.Job;
import com.jobportal.backend.repository.ApplicationRepository;
import com.jobportal.backend.repository.JobRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    public Map<String, Object> getEmployerAnalytics(Long employerId) {
        List<Job> employerJobs = jobRepository.findAll().stream()
                .filter(job -> job.getEmployer() != null && job.getEmployer().getId().equals(employerId))
                .collect(Collectors.toList());

        List<Application> applications = applicationRepository.findAll().stream()
                .filter(app -> employerJobs.contains(app.getJob()))
                .collect(Collectors.toList());

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalJobsPosted", employerJobs.size());
        stats.put("totalApplicationsReceived", applications.size());
        stats.put("pendingApplications", applications.stream().filter(app -> "Pending".equalsIgnoreCase(app.getStatus())).count());
        stats.put("shortlistedCandidates", applications.stream().filter(app -> "Shortlisted".equalsIgnoreCase(app.getStatus())).count());
        stats.put("rejectedCandidates", applications.stream().filter(app -> "Rejected".equalsIgnoreCase(app.getStatus())).count());

        // Success rate calculation
        double successRate = applications.isEmpty() ? 0 : 
            (double) applications.stream().filter(app -> "Shortlisted".equalsIgnoreCase(app.getStatus())).count() / applications.size() * 100;
        stats.put("successRate", Math.round(successRate * 100.0) / 100.0 + "%");

        return stats;
    }
}
