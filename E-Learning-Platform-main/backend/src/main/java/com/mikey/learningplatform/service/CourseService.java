package com.mikey.learningplatform.service;

import com.mikey.learningplatform.entity.Course;
import com.mikey.learningplatform.repository.CourseRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CourseService {

    private final CourseRepository courseRepository;

    public CourseService(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    public Course getCourseById(Long id) {
        return courseRepository.findById(id).orElse(null);
    }

    public Course saveCourse(Course course) {
        return courseRepository.save(course);
    }
    public void deleteCourse(Long id) {

    courseRepository.deleteById(id);
}

    public List<Course> searchCourses(String keyword) {
        return courseRepository.findByTitleContainingIgnoreCase(keyword);
    }

    public List<Course> filterByCategory(String category) {
        return courseRepository.findByCategoryContainingIgnoreCase(category);
    }
}