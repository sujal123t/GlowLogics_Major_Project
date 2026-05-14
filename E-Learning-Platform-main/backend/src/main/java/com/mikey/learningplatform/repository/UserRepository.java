package com.mikey.learningplatform.repository;

import com.mikey.learningplatform.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByEmail(String email);
    
    List<User> findTop10ByOrderByPointsDesc();
}