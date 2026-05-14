package com.mikey.learningplatform.controller;

import com.mikey.learningplatform.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/email")
@CrossOrigin(origins = "*")
public class EmailController {

    @Autowired
    private EmailService emailService;

    @PostMapping("/certificate")
    public ResponseEntity<?> emailCertificate(@RequestBody Map<String, String> payload) {
        try {
            String email = payload.get("email");
            String name = payload.get("studentName");
            String course = payload.get("courseName");
            String certId = payload.get("certificateId");
            emailService.sendCertificateEmail(email, name, course, certId);
            return ResponseEntity.ok().body("Email sent successfully!");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error sending email: " + e.getMessage());
        }
    }
}