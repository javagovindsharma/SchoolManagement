package com.sms.school.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI schoolApi() {

        return new OpenAPI()
                .info(
                        new Info()
                                .title("School Management API")
                                .version("1.0")
                                .description(
                                        "School Management System APIs"
                                )
                );
    }
}