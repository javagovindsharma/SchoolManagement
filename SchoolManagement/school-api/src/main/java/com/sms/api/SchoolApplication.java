package com.sms.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.persistence.autoconfigure.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = {"com.sms"})
@EntityScan(basePackages = {
        "com.sms.auth.entity",
        "com.sms.student.entity",
        "com.sms.teacher.entity",
        "com.sms.attendance.entity"
})
@EnableJpaRepositories(basePackages = {
        "com.sms.auth.repository",
        "com.sms.student.repository",
        "com.sms.teacher.repository",
        "com.sms.attendance.repository"
})

public class SchoolApplication {

    public static void main(String[] args) {

        SpringApplication.run(
                SchoolApplication.class,
                args
        );
    }
}