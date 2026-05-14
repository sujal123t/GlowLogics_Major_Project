package com.mikey.learningplatform.controller;

import com.mikey.learningplatform.entity.Course;
import com.mikey.learningplatform.service.CourseService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = "*")
public class CourseController {

    private final CourseService courseService;

    public CourseController(
            CourseService courseService
    ) {
        this.courseService = courseService;
    }

    @GetMapping
    public List<Course> getCourses() {

        return courseService.getAllCourses();
    }

    @GetMapping("/{id}")
    public Course getCourse(
            @PathVariable Long id
    ) {

        return courseService.getCourseById(id);
    }

    @PostMapping
    public Course addCourse(
            @RequestBody Course course
    ) {

        return courseService.saveCourse(course);
    }

    @DeleteMapping("/{id}")
    public void deleteCourse(
            @PathVariable Long id
    ) {

        courseService.deleteCourse(id);
    }

    @GetMapping("/search")
    public List<Course> searchCourses(
            @RequestParam String keyword
    ) {

        return courseService.searchCourses(keyword);
    }

    @GetMapping("/category")
    public List<Course> filterByCategory(
            @RequestParam String name
    ) {

        return courseService.filterByCategory(name);
    }
}