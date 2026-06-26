package com.sms.school.api.config;

import org.springframework.boot.persistence.autoconfigure.EntityScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@Configuration
@EnableJpaRepositories(basePackages = "com.sms.school.api.repository")
@EntityScan(basePackages = "com.sms.school.common")
public class JpaConfig {
}
