package com.mikey.learningplatform.controller;

import com.mikey.learningplatform.entity.Course;
import com.mikey.learningplatform.entity.Enrollment;
import com.mikey.learningplatform.entity.User;
import com.mikey.learningplatform.repository.EnrollmentRepository;
import com.mikey.learningplatform.repository.UserRepository;
import com.mikey.learningplatform.service.CourseService;
import com.mikey.learningplatform.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/enrollments")
@CrossOrigin(origins = "*")
public class EnrollmentController {

    @Autowired
    private EnrollmentRepository enrollmentRepository;
    
    @Autowired
    private CourseService courseService;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private EmailService emailService;

    @PostMapping("/enroll")
    public ResponseEntity<?> enroll(@RequestBody Enrollment enrollment) {
        Optional<Enrollment> existing = enrollmentRepository.findByUserIdAndCourseId(enrollment.getUserId(), enrollment.getCourseId());
        if (existing.isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Already enrolled!"));
        }
        enrollment.setProgress(0);
        enrollment.setCompleted(false);
        enrollment.setCompletedLessons("[]");
        enrollment.setLastVideoTimestamp(0);
        Enrollment saved = enrollmentRepository.save(enrollment);
        
        // Auto-generate and email the PDF Receipt
        Optional<User> userOpt = userRepository.findById(enrollment.getUserId());
        Course courseOpt = courseService.getCourseById(enrollment.getCourseId());
        if (userOpt.isPresent() && courseOpt != null) {
            try {
                emailService.sendEnrollmentInvoice(userOpt.get().getEmail(), userOpt.get().getName(), courseOpt.getTitle());
            } catch (Exception e) {
                System.err.println("Failed to send invoice email: " + e.getMessage());
            }
        }
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserEnrollments(@PathVariable Long userId) {
        List<Enrollment> enrollments = enrollmentRepository.findByUserId(userId);
        List<Map<String, Object>> result = new ArrayList<>();
        
        for (Enrollment e : enrollments) {
            Course courseOpt = courseService.getCourseById(e.getCourseId());
            if (courseOpt != null) {
                Map<String, Object> map = new HashMap<>();
                map.put("enrollment", e);
                map.put("course", courseOpt);
                result.add(map);
            }
        }
        return ResponseEntity.ok(result);
    }
    
    @GetMapping("/status")
    public ResponseEntity<?> getEnrollmentStatus(@RequestParam Long userId, @RequestParam Long courseId) {
        Optional<Enrollment> existing = enrollmentRepository.findByUserIdAndCourseId(userId, courseId);
        if (existing.isPresent()) {
            return ResponseEntity.ok(existing.get());
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateEnrollment(@RequestBody Enrollment updated) {
        Optional<Enrollment> existingOpt = enrollmentRepository.findByUserIdAndCourseId(updated.getUserId(), updated.getCourseId());
        if (existingOpt.isPresent()) {
            Enrollment existing = existingOpt.get();
            if (updated.getProgress() != null) existing.setProgress(updated.getProgress());
            if (updated.getCompleted() != null) existing.setCompleted(updated.getCompleted());
            if (updated.getCompletedLessons() != null) existing.setCompletedLessons(updated.getCompletedLessons());
            if (updated.getLastVideoTimestamp() != null) existing.setLastVideoTimestamp(updated.getLastVideoTimestamp());
            if (updated.getCertificateId() != null) existing.setCertificateId(updated.getCertificateId());
            
            enrollmentRepository.save(existing);
            return ResponseEntity.ok(existing);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/verify/{certId}")
    public ResponseEntity<?> verifyCertificate(@PathVariable String certId) {
        Optional<Enrollment> enrollment = enrollmentRepository.findByCertificateId(certId);
        if (enrollment.isPresent() && enrollment.get().getCompleted()) {
            Course course = courseService.getCourseById(enrollment.get().getCourseId());
            Optional<User> user = userRepository.findById(enrollment.get().getUserId());
            if (course != null && user.isPresent()) {
                return ResponseEntity.ok(Map.of(
                    "valid", true,
                    "studentName", user.get().getName(),
                    "courseName", course.getTitle()
                ));
            }
        }
        return ResponseEntity.ok(Map.of("valid", false));
    }
}