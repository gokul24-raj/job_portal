package com.jobportal.backend.service;

import com.jobportal.backend.model.Admin;
import com.jobportal.backend.model.Employer;
import com.jobportal.backend.model.Student;
import com.jobportal.backend.repository.AdminRepository;
import com.jobportal.backend.repository.EmployerRepository;
import com.jobportal.backend.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private EmployerRepository employerRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (adminRepository.count() == 0) {
            Admin admin = new Admin();
            admin.setEmail("admin@vip.dev");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setFullName("Super Admin");
            adminRepository.save(admin);
        }

        if (employerRepository.count() == 0) {
            Employer employer = new Employer();
            employer.setEmail("employer@vip.dev");
            employer.setPassword(passwordEncoder.encode("password"));
            employer.setCompanyName("Tech Solutions Inc");
            employer.setIndustry("IT");
            employerRepository.save(employer);
        }

        if (studentRepository.count() == 0) {
            Student student = new Student();
            student.setEmail("student@vip.dev");
            student.setPassword(passwordEncoder.encode("password"));
            student.setFullName("John Doe");
            student.setUniversity("Anna University");
            studentRepository.save(student);
        }
    }
}
