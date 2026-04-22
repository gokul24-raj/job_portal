package com.jobportal.backend.controller;

import com.jobportal.backend.model.Resume;
import com.jobportal.backend.service.ResumeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/resume")
public class ResumeController {

    @Autowired
    private ResumeService resumeService;

    @PostMapping("/upload")
    public ResponseEntity<String> uploadResume(@RequestParam("file") MultipartFile file) {
        try {
            Resume resume = resumeService.uploadResume(file);
            return ResponseEntity.ok("Resume uploaded successfully: " + resume.getId());
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Could not upload resume");
        }
    }

    @GetMapping("/view/{id}")
    public ResponseEntity<byte[]> viewResume(@PathVariable Long id) {
        return resumeService.getResume(id)
                .map(resume -> ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(resume.getContentType()))
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resume.getFileName() + "\"")
                        .body(resume.getData()))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/download/{id}")
    public ResponseEntity<byte[]> downloadResume(@PathVariable Long id) {
        return resumeService.getResume(id)
                .map(resume -> ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(resume.getContentType()))
                        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resume.getFileName() + "\"")
                        .body(resume.getData()))
                .orElse(ResponseEntity.notFound().build());
    }
}
