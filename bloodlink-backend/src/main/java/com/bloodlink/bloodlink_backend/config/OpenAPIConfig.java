package com.bloodlink.bloodlink_backend.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenAPIConfig {

    @Bean
    public OpenAPI bloodLinkOpenAPI() {

        final String securitySchemeName = "bearerAuth";

        return new OpenAPI()

                // ==========================
                // API INFORMATION
                // ==========================

                .info(
                        new Info()
                                .title("BloodLink API")
                                .description(
                                        "BloodLink AI - Blood Donation " +
                                                "and Emergency Blood Management Platform"
                                )
                                .version("1.0.0")
                )

                // ==========================
                // JWT SECURITY
                // ==========================

                .addSecurityItem(
                        new SecurityRequirement()
                                .addList(securitySchemeName)
                )

                .components(
                        new Components()
                                .addSecuritySchemes(
                                        securitySchemeName,
                                        new SecurityScheme()
                                                .name("Authorization")
                                                .type(SecurityScheme.Type.HTTP)
                                                .scheme("bearer")
                                                .bearerFormat("JWT")
                                )
                );
    }
}