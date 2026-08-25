package com.bloodlink.bloodlink_backend.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;


@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    private final CustomUserDetailsService userDetailsService;


    public JwtAuthenticationFilter(
            JwtService jwtService,
            CustomUserDetailsService userDetailsService) {

        this.jwtService = jwtService;

        this.userDetailsService = userDetailsService;
    }


    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {


        // =====================================================
        // REQUEST PATH
        // =====================================================

        String path = request.getServletPath();


        System.out.println();
        System.out.println("========================================");
        System.out.println("JWT FILTER");
        System.out.println(
                "Request: "
                        + request.getMethod()
                        + " "
                        + path
        );
        System.out.println("========================================");


        // =====================================================
        // SKIP AUTH ENDPOINTS
        // =====================================================

        if (path.startsWith("/api/auth/")) {

            System.out.println(
                    "Skipping JWT for auth endpoint"
            );

            filterChain.doFilter(
                    request,
                    response
            );

            return;
        }


        // =====================================================
        // SKIP WEBSOCKET HANDSHAKE
        // =====================================================

        if (path.startsWith("/ws")) {

            System.out.println(
                    "Skipping JWT for WebSocket handshake"
            );

            filterChain.doFilter(
                    request,
                    response
            );

            return;
        }


        // =====================================================
        // GET AUTHORIZATION HEADER
        // =====================================================

        String authHeader =
                request.getHeader("Authorization");


        System.out.println(
                "Authorization header present: "
                        + (authHeader != null)
        );


        // =====================================================
        // NO TOKEN
        // =====================================================

        if (authHeader == null ||
                !authHeader.startsWith("Bearer ")) {

            System.out.println(
                    "NO VALID BEARER TOKEN FOUND"
            );

            filterChain.doFilter(
                    request,
                    response
            );

            return;
        }


        // =====================================================
        // EXTRACT TOKEN
        // =====================================================

        String token =
                authHeader.substring(7);


        System.out.println(
                "JWT token received. Length: "
                        + token.length()
        );


        try {


            // =====================================================
            // EXTRACT USERNAME
            // =====================================================

            String username =
                    jwtService.extractUsername(token);


            System.out.println(
                    "Username extracted from JWT: "
                            + username
            );


            // =====================================================
            // CHECK USERNAME + EXISTING AUTHENTICATION
            // =====================================================

            if (username != null &&
                    SecurityContextHolder
                            .getContext()
                            .getAuthentication() == null) {


                // =================================================
                // LOAD USER
                // =================================================

                UserDetails userDetails =
                        userDetailsService
                                .loadUserByUsername(
                                        username
                                );


                System.out.println(
                        "User loaded successfully: "
                                + userDetails.getUsername()
                );


                // =================================================
                // VALIDATE JWT
                // =================================================

                boolean valid =
                        jwtService.isTokenValid(
                                token,
                                userDetails
                        );


                System.out.println(
                        "JWT valid: "
                                + valid
                );


                // =================================================
                // SET AUTHENTICATION
                // =================================================

                if (valid) {


                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails,
                                    null,
                                    userDetails.getAuthorities()
                            );


                    authentication.setDetails(
                            new WebAuthenticationDetailsSource()
                                    .buildDetails(
                                            request
                                    )
                    );


                    SecurityContextHolder
                            .getContext()
                            .setAuthentication(
                                    authentication
                            );


                    System.out.println(
                            "AUTHENTICATION SET SUCCESSFULLY"
                    );

                } else {

                    System.out.println(
                            "JWT IS INVALID"
                    );
                }


            } else {

                System.out.println(
                        "Username is null OR authentication already exists"
                );
            }


        } catch (Exception e) {


            // =====================================================
            // JWT ERROR
            // =====================================================

            System.out.println();
            System.out.println(
                    "!!!!!!!! JWT VALIDATION ERROR !!!!!!!!"
            );


            System.out.println(
                    "Error type: "
                            + e.getClass().getName()
            );


            System.out.println(
                    "Error message: "
                            + e.getMessage()
            );


            e.printStackTrace();


            System.out.println(
                    "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
            );
        }


        // =====================================================
        // CONTINUE REQUEST
        // =====================================================

        filterChain.doFilter(
                request,
                response
        );
    }
}