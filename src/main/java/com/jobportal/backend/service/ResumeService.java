package com.jobportal.backend.service;

import com.jobportal.backend.model.Resume;
import com.jobportal.backend.repository.ResumeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;

@Service
public class ResumeService {

    @Autowired
    private ResumeRepository resumeRepository;

    public Resume uploadResume(MultipartFile file) throws IOException {
        Resume resume = new Resume();
        resume.setFileName(file.getOriginalFilename());
        resume.setContentType(file.getContentType());
        resume.setData(file.getBytes());
        return resumeRepository.save(resume);
    }

    public Optional<Resume> getResume(Long id) {
        return resumeRepository.findById(id);
    }
}
