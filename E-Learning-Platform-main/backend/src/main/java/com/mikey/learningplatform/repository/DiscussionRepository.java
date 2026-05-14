package com.mikey.learningplatform.repository;

import com.mikey.learningplatform.entity.Discussion;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DiscussionRepository extends JpaRepository<Discussion, Long> {
    List<Discussion> findByCourseIdOrderByTimestampDesc(Long courseId);
}