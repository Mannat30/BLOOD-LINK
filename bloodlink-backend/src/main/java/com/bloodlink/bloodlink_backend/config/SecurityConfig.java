package com.bloodlink.bloodlink_backend.config;

import com.bloodlink.bloodlink_backend.security.CustomUserDetailsService;
import com.bloodlink.bloodlink_backend.security.GoogleOAuth2FailureHandler;
import com.bloodlink.bloodlink_backend.security.GoogleOAuth2SuccessHandler;
import com.bloodlink.bloodlink_backend.security.JwtAuthenticationFilter;

import jakarta.servlet.http.HttpServletResponse;

import lombok.RequiredArgsConstructor;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.http.HttpMethod;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;

import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.web.cors.CorsConfigurationSource;


@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final CustomUserDetailsService customUserDetailsService;

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    private final CorsConfigurationSource corsConfigurationSource;

    private final GoogleOAuth2SuccessHandler googleOAuth2SuccessHandler;

    private final GoogleOAuth2FailureHandler googleOAuth2FailureHandler;


    // =====================================================
    // SECURITY FILTER CHAIN
    // =====================================================

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http

                // =====================================================
                // CORS
                // =====================================================

                .cors(cors ->
                        cors.configurationSource(
                                corsConfigurationSource
                        )
                )


                // =====================================================
                // CSRF
                // =====================================================

                .csrf(csrf ->
                        csrf.disable()
                )


                // =====================================================
                // SESSION
                // =====================================================

                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )


                // =====================================================
                // AUTHORIZATION
                // =====================================================

                .authorizeHttpRequests(auth -> auth

                        // -------------------------------------------------
                        // CORS PREFLIGHT
                        // -------------------------------------------------

                        .requestMatchers(
                                HttpMethod.OPTIONS,
                                "/**"
                        )
                        .permitAll()


                        // -------------------------------------------------
                        // AUTH
                        // -------------------------------------------------

                        .requestMatchers(
                                "/api/auth/**"
                        )
                        .permitAll()


                        // -------------------------------------------------
                        // GOOGLE OAUTH2
                        // -------------------------------------------------

                        .requestMatchers(
                                "/oauth2/**"
                        )
                        .permitAll()


                        // -------------------------------------------------
                        // GOOGLE OAUTH2 CALLBACK
                        // -------------------------------------------------

                        .requestMatchers(
                                "/login/oauth2/**"
                        )
                        .permitAll()


                        // -------------------------------------------------
                        // WEBSOCKET HANDSHAKE
                        // -------------------------------------------------

                        .requestMatchers(
                                "/ws/**"
                        )
                        .permitAll()


                        // -------------------------------------------------
                        // EVERYTHING ELSE
                        // -------------------------------------------------

                        .anyRequest()
                        .authenticated()
                )


                // =====================================================
                // API UNAUTHORIZED RESPONSE
                // =====================================================

                .exceptionHandling(exception ->
                        exception.authenticationEntryPoint(
                                (request, response, authException) ->
                                        response.sendError(
                                                HttpServletResponse.SC_UNAUTHORIZED,
                                                "Unauthorized"
                                        )
                        )
                )


                // =====================================================
                // GOOGLE OAUTH2 LOGIN
                // =====================================================

                .oauth2Login(oauth2 ->
                        oauth2
                                .successHandler(
                                        googleOAuth2SuccessHandler
                                )
                                .failureHandler(
                                        googleOAuth2FailureHandler
                                )
                )


                // =====================================================
                // JWT FILTER
                // =====================================================

                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );


        return http.build();
    }


    // =====================================================
    // AUTHENTICATION PROVIDER
    // =====================================================

    @Bean
    public AuthenticationProvider authenticationProvider(
            PasswordEncoder passwordEncoder) {

        DaoAuthenticationProvider provider =
                new DaoAuthenticationProvider(
                        customUserDetailsService
                );

        provider.setPasswordEncoder(
                passwordEncoder
        );

        return provider;
    }


    // =====================================================
    // AUTHENTICATION MANAGER
    // =====================================================

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration configuration)
            throws Exception {

        return configuration.getAuthenticationManager();
    }
}