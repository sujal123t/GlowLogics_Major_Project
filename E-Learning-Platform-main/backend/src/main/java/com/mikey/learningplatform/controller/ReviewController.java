package com.mikey.learningplatform.controller;

import com.mikey.learningplatform.entity.Review;
import com.mikey.learningplatform.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "*")
public class ReviewController {
    @Autowired
    private ReviewRepository reviewRepository;
    
    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<Review>> getCourseReviews(@PathVariable Long courseId) {
        return ResponseEntity.ok(reviewRepository.findByCourseId(courseId));
    }
    @PostMapping
    public ResponseEntity<Review> submitReview(@RequestBody Review review) {
        return ResponseEntity.ok(reviewRepository.save(review));
    }
}