package com.mikey.learningplatform.repository;

import com.mikey.learningplatform.entity.Course;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CourseRepository
        extends JpaRepository<Course, Long> {

    List<Course>
    findByTitleContainingIgnoreCase(
            String keyword
    );

    List<Course>
    findByCategoryContainingIgnoreCase(
            String category
    );
}