package com.jobportal.backend.service;

import com.jobportal.backend.model.User;
import com.jobportal.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @Autowired
    private com.jobportal.backend.repository.AdminRepository adminRepository;

    @Autowired
    private com.jobportal.backend.repository.EmployerRepository employerRepository;

    @Autowired
    private com.jobportal.backend.repository.StudentRepository studentRepository;

    public Optional<User> register(User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return Optional.empty();
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return Optional.of(userRepository.save(user));
    }

    public Optional<User> login(String email, String password) {
        // Check Admin
        Optional<com.jobportal.backend.model.Admin> adminOpt = adminRepository.findByEmail(email);
        if (adminOpt.isPresent() && passwordEncoder.matches(password, adminOpt.get().getPassword())) {
            User u = new User();
            u.setEmail(email);
            u.setRole("ADMIN");
            u.setId(adminOpt.get().getId());
            return Optional.of(u);
        }

        // Check Employer
        Optional<com.jobportal.backend.model.Employer> empOpt = employerRepository.findByEmail(email);
        if (empOpt.isPresent() && passwordEncoder.matches(password, empOpt.get().getPassword())) {
            User u = new User();
            u.setEmail(email);
            u.setRole("EMPLOYER");
            u.setId(empOpt.get().getId());
            return Optional.of(u);
        }

        // Check Student
        Optional<com.jobportal.backend.model.Student> stuOpt = studentRepository.findByEmail(email);
        if (stuOpt.isPresent() && passwordEncoder.matches(password, stuOpt.get().getPassword())) {
            User u = new User();
            u.setEmail(email);
            u.setRole("STUDENT");
            u.setId(stuOpt.get().getId());
            return Optional.of(u);
        }

        // Fallback to generic user table
        return userRepository.findByEmail(email)
                .filter(user -> passwordEncoder.matches(password, user.getPassword()));
    }
}
