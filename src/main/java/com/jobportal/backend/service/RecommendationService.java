package com.jobportal.backend.service;

import com.jobportal.backend.model.Job;
import com.jobportal.backend.model.StudentProfile;
import com.jobportal.backend.repository.JobRepository;
import com.jobportal.backend.repository.StudentProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RecommendationService {

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private StudentProfileRepository studentProfileRepository;

    public List<Job> getRecommendedJobs(Long studentId) {
        StudentProfile profile = studentProfileRepository.findById(studentId).orElse(null);
        if (profile == null || profile.getSkills() == null) {
            return jobRepository.findAll(); // Return all if no profile or skills
        }

        List<String> studentSkills = Arrays.asList(profile.getSkills().toLowerCase().split(",\\s*"));
        List<Job> allJobs = jobRepository.findAll();

        return allJobs.stream()
                .filter(job -> {
                    String description = job.getDescription().toLowerCase();
                    String title = job.getTitle().toLowerCase();
                    return studentSkills.stream().anyMatch(skill -> description.contains(skill) || title.contains(skill));
                })
                .sorted((j1, j2) -> {
                    long count1 = studentSkills.stream().filter(skill -> j1.getDescription().toLowerCase().contains(skill)).count();
                    long count2 = studentSkills.stream().filter(skill -> j2.getDescription().toLowerCase().contains(skill)).count();
                    return Long.compare(count2, count1); // Sort by highest skill match
                })
                .collect(Collectors.toList());
    }
}
