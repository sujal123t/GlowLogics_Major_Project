package com.mikey.learningplatform.repository;

import com.mikey.learningplatform.entity.Note;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NoteRepository extends JpaRepository<Note, Long> {
    List<Note> findByUserIdAndCourseIdOrderByVideoTimestampAsc(Long userId, Long courseId);
}