package com.sms.school.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = {
        "com.sms.school.api",
        "com.sms.school.common",
        "com.sms.school.rag",
        "com.sms.school.video",
})
@EnableJpaRepositories(basePackages = {
        "com.sms.school.rag.repository"
})
@EntityScan(basePackages = {
        "com.sms.school.rag.entity"
})
public class SchoolManagementApplication {

	public static void main(String[] args) {
		SpringApplication.run(SchoolManagementApplication.class, args);
	}

}
