package com.bloodlink.bloodlink_backend.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class JwtAuthenticationFilterTest {

    @Mock
    private JwtService jwtService;

    @Mock
    private CustomUserDetailsService userDetailsService;

    @Mock
    private HttpServletRequest request;

    @Mock
    private HttpServletResponse response;

    @Mock
    private FilterChain filterChain;

    private JwtAuthenticationFilter filter;

    private UserDetails userDetails;


    // =====================================================
    // SETUP
    // =====================================================

    @BeforeEach
    void setUp() {

        filter = new JwtAuthenticationFilter(
                jwtService,
                userDetailsService
        );

        userDetails =
                User.withUsername(
                                "mannat@example.com"
                        )
                        .password("password")
                        .authorities("DONOR")
                        .build();

        SecurityContextHolder.clearContext();
    }


    // =====================================================
    // TEST 1
    // NO AUTHORIZATION HEADER
    // =====================================================

    @Test
    void shouldContinueWhenAuthorizationHeaderIsMissing()
            throws Exception {

        when(request.getServletPath())
                .thenReturn("/api/blood-request");

        when(request.getHeader("Authorization"))
                .thenReturn(null);


        filter.doFilterInternal(
                request,
                response,
                filterChain
        );


        verify(filterChain, times(1))
                .doFilter(request, response);


        verifyNoInteractions(jwtService);

        verifyNoInteractions(userDetailsService);

        assertNull(
                SecurityContextHolder
                        .getContext()
                        .getAuthentication()
        );
    }


    // =====================================================
    // TEST 2
    // INVALID AUTHORIZATION HEADER
    // =====================================================

    @Test
    void shouldContinueWhenAuthorizationHeaderIsNotBearer()
            throws Exception {

        when(request.getServletPath())
                .thenReturn("/api/blood-request");

        when(request.getHeader("Authorization"))
                .thenReturn("Basic abc123");


        filter.doFilterInternal(
                request,
                response,
                filterChain
        );


        verify(filterChain, times(1))
                .doFilter(request, response);


        verifyNoInteractions(jwtService);

        verifyNoInteractions(userDetailsService);

        assertNull(
                SecurityContextHolder
                        .getContext()
                        .getAuthentication()
        );
    }


    // =====================================================
    // TEST 3
    // VALID JWT
    // =====================================================

    @Test
    void shouldAuthenticateUserWithValidToken()
            throws Exception {

        String token =
                "valid.jwt.token";

        when(request.getServletPath())
                .thenReturn("/api/blood-request");

        when(request.getHeader("Authorization"))
                .thenReturn(
                        "Bearer " + token
                );


        when(jwtService.extractUsername(token))
                .thenReturn(
                        "mannat@example.com"
                );


        when(
                userDetailsService.loadUserByUsername(
                        "mannat@example.com"
                )
        ).thenReturn(userDetails);


        when(
                jwtService.isTokenValid(
                        token,
                        userDetails
                )
        ).thenReturn(true);


        filter.doFilterInternal(
                request,
                response,
                filterChain
        );


        assertNotNull(
                SecurityContextHolder
                        .getContext()
                        .getAuthentication()
        );


        assertEquals(
                "mannat@example.com",
                SecurityContextHolder
                        .getContext()
                        .getAuthentication()
                        .getName()
        );


        assertTrue(
                SecurityContextHolder
                        .getContext()
                        .getAuthentication()
                        .isAuthenticated()
        );


        verify(
                jwtService,
                times(1)
        ).extractUsername(token);


        verify(
                userDetailsService,
                times(1)
        ).loadUserByUsername(
                "mannat@example.com"
        );


        verify(
                jwtService,
                times(1)
        ).isTokenValid(
                token,
                userDetails
        );


        verify(
                filterChain,
                times(1)
        ).doFilter(
                request,
                response
        );
    }


    // =====================================================
    // TEST 4
    // INVALID JWT
    // =====================================================

    @Test
    void shouldContinueWhenJwtIsInvalid()
            throws Exception {

        String token =
                "invalid.jwt.token";

        when(request.getServletPath())
                .thenReturn("/api/blood-request");

        when(request.getHeader("Authorization"))
                .thenReturn(
                        "Bearer " + token
                );


        when(
                jwtService.extractUsername(token)
        ).thenThrow(
                new RuntimeException(
                        "Invalid JWT"
                )
        );


        filter.doFilterInternal(
                request,
                response,
                filterChain
        );


        verify(
                filterChain,
                times(1)
        ).doFilter(
                request,
                response
        );


        assertNull(
                SecurityContextHolder
                        .getContext()
                        .getAuthentication()
        );
    }


    // =====================================================
    // TEST 5
    // AUTH ENDPOINT SHOULD BE SKIPPED
    // =====================================================

    @Test
    void shouldSkipAuthenticationEndpoint()
            throws Exception {

        when(request.getServletPath())
                .thenReturn("/api/auth/login");


        filter.doFilterInternal(
                request,
                response,
                filterChain
        );


        verify(
                filterChain,
                times(1)
        ).doFilter(
                request,
                response
        );


        verifyNoInteractions(jwtService);

        verifyNoInteractions(userDetailsService);


        assertNull(
                SecurityContextHolder
                        .getContext()
                        .getAuthentication()
        );
    }


    // =====================================================
    // TEST 6
    // ALREADY AUTHENTICATED USER
    // =====================================================

    @Test
    void shouldNotAuthenticateAgainWhenAlreadyAuthenticated()
            throws Exception {

        String token =
                "valid.jwt.token";


        // Put an existing authentication
        // into SecurityContext.

        var existingAuthentication =
                new org.springframework.security.authentication
                        .UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities()
                );


        SecurityContextHolder
                .getContext()
                .setAuthentication(
                        existingAuthentication
                );


        when(request.getServletPath())
                .thenReturn("/api/blood-request");

        when(request.getHeader("Authorization"))
                .thenReturn(
                        "Bearer " + token
                );


        when(
                jwtService.extractUsername(token)
        ).thenReturn(
                "mannat@example.com"
        );


        filter.doFilterInternal(
                request,
                response,
                filterChain
        );


        verify(
                jwtService,
                times(1)
        ).extractUsername(token);


        verifyNoInteractions(
                userDetailsService
        );


        verify(
                jwtService,
                never()
        ).isTokenValid(
                anyString(),
                any(UserDetails.class)
        );


        verify(
                filterChain,
                times(1)
        ).doFilter(
                request,
                response
        );


        assertSame(
                existingAuthentication,
                SecurityContextHolder
                        .getContext()
                        .getAuthentication()
        );
    }
}