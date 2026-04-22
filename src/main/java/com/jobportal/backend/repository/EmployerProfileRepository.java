package com.jobportal.backend.repository;

import com.jobportal.backend.model.EmployerProfile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmployerProfileRepository extends JpaRepository<EmployerProfile, Long> {
}
