package com.medcabinet.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI medCabinetOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Home Medicine Cabinet API")
                        .description("API для управления домашней аптечкой")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("MedCabinet Team")
                                .email("support@medcabinet.com")));
    }
}