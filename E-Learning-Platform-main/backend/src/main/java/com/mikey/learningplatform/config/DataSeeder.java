package com.mikey.learningplatform.config;

import com.mikey.learningplatform.entity.Course;
import com.mikey.learningplatform.repository.CourseRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner seedCourses(CourseRepository courseRepository) {
        return args -> {
            if (courseRepository.count() > 0) {
                return;
            }

            courseRepository.saveAll(List.of(
                    Course.builder()
                            .title("Java Full Course")
                            .instructor("Programming with Mosh")
                            .duration("12 Hours")
                            .category("Java")
                            .level("Beginner")
                            .thumbnail("https://img.youtube.com/vi/eIrMbAQSU34/maxresdefault.jpg")
                            .youtubeId("eIrMbAQSU34")
                            .description("Complete Java programming course for beginners.")
                            .build(),
                    Course.builder()
                            .title("Spring Boot Masterclass")
                            .instructor("Amigoscode")
                            .duration("10 Hours")
                            .category("Spring Boot")
                            .level("Intermediate")
                            .thumbnail("https://img.youtube.com/vi/9SGDpanrc8U/maxresdefault.jpg")
                            .youtubeId("9SGDpanrc8U")
                            .description("Learn Spring Boot backend development.")
                            .build(),
                    Course.builder()
                            .title("JavaScript Full Course")
                            .instructor("freeCodeCamp")
                            .duration("8 Hours")
                            .category("JavaScript")
                            .level("Beginner")
                            .thumbnail("https://img.youtube.com/vi/PkZNo7MFNFg/maxresdefault.jpg")
                            .youtubeId("PkZNo7MFNFg")
                            .description("Master JavaScript fundamentals and DOM manipulation.")
                            .build(),
                    Course.builder()
                            .title("React JS Complete Course")
                            .instructor("freeCodeCamp")
                            .duration("11 Hours")
                            .category("React")
                            .level("Intermediate")
                            .thumbnail("https://img.youtube.com/vi/bMknfKXIFA8/maxresdefault.jpg")
                            .youtubeId("bMknfKXIFA8")
                            .description("Build modern web applications with React.")
                            .build(),
                    Course.builder()
                            .title("Python for Beginners")
                            .instructor("Programming with Mosh")
                            .duration("6 Hours")
                            .category("Python")
                            .level("Beginner")
                            .thumbnail("https://img.youtube.com/vi/_uQrJ0TkZlc/maxresdefault.jpg")
                            .youtubeId("_uQrJ0TkZlc")
                            .description("Learn Python programming from scratch.")
                            .build(),
                    Course.builder()
                            .title("Docker Crash Course")
                            .instructor("TechWorld with Nana")
                            .duration("3 Hours")
                            .category("DevOps")
                            .level("Intermediate")
                            .thumbnail("https://img.youtube.com/vi/3c-iBn73dDE/maxresdefault.jpg")
                            .youtubeId("3c-iBn73dDE")
                            .description("Understand Docker containers and practical workflows.")
                            .build()
            ));
        };
    }
}
