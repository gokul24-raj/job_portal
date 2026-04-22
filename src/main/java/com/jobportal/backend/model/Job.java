package com.jobportal.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "JOBS")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Job {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private String location;
    private String salary;
    private String type; // Full-time, Internship, etc.

    @ManyToOne
    @JoinColumn(name = "employer_id")
    private EmployerProfile employer;

    private LocalDateTime createdAt = LocalDateTime.now();
}
