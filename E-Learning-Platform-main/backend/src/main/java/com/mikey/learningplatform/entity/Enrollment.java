package com.mikey.learningplatform.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Enrollment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    private Long courseId;

    private Integer progress;

    private Boolean completed;

    @Column(length = 1000)
    private String completedLessons; 

    private Integer lastVideoTimestamp;

    private String certificateId;
}