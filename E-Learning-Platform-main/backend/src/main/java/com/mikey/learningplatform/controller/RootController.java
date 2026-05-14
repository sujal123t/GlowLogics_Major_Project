package com.mikey.learningplatform.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RootController {

    @GetMapping("/")
    public String home() {
        return "🚀 E-Learning Platform Backend is running successfully!";
    }
}