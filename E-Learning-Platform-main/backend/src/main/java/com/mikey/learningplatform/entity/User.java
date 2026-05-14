package com.mikey.learningplatform.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(unique = true)
    private String email;

    private String password;

    private String phoneNumber;

    @Builder.Default
    private String role = "USER";

    @Builder.Default
    private Integer points = 0;

    @Column(length = 1000)
    @Builder.Default
    private String badges = "[]";

    @Builder.Default
    private Integer streak = 0;

    private String lastActiveDate;
}