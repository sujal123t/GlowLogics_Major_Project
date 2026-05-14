package com.mikey.learningplatform.controller;

import com.mikey.learningplatform.entity.Discussion;
import com.mikey.learningplatform.repository.DiscussionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/discussions")
@CrossOrigin(origins = "*")
public class DiscussionController {
    @Autowired private DiscussionRepository discussionRepository;

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<Discussion>> getDiscussions(@PathVariable Long courseId) {
        return ResponseEntity.ok(discussionRepository.findByCourseIdOrderByTimestampDesc(courseId));
    }

    @PostMapping
    public ResponseEntity<Discussion> addDiscussion(@RequestBody Discussion discussion) {
        discussion.setTimestamp(LocalDateTime.now());
        return ResponseEntity.ok(discussionRepository.save(discussion));
    }
}