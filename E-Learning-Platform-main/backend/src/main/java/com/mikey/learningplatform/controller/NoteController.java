package com.mikey.learningplatform.controller;

import com.mikey.learningplatform.entity.Note;
import com.mikey.learningplatform.repository.NoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notes")
@CrossOrigin(origins = "*")
public class NoteController {
    @Autowired private NoteRepository noteRepository;

    @GetMapping("/user/{userId}/course/{courseId}")
    public ResponseEntity<List<Note>> getNotes(@PathVariable Long userId, @PathVariable Long courseId) {
        return ResponseEntity.ok(noteRepository.findByUserIdAndCourseIdOrderByVideoTimestampAsc(userId, courseId));
    }

    @PostMapping
    public ResponseEntity<Note> saveNote(@RequestBody Note note) {
        return ResponseEntity.ok(noteRepository.save(note));
    }
}