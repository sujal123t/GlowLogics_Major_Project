package com.mikey.learningplatform.controller;

import com.mikey.learningplatform.repository.EnrollmentRepository;
import com.mikey.learningplatform.repository.UserRepository;
import com.mikey.learningplatform.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired private UserRepository userRepository;
    @Autowired private CourseService courseService;
    @Autowired private EnrollmentRepository enrollmentRepository;

    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        return ResponseEntity.ok(Map.of(
            "totalUsers", userRepository.count(),
            "totalCourses", courseService.getAllCourses().size(),
            "totalEnrollments", enrollmentRepository.count()
        ));
    }
}