package com.bloodlink.bloodlink_backend.security;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import org.springframework.security.core.AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2Error;

import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class GoogleOAuth2FailureHandlerTest {

    @Mock
    private HttpServletRequest request;

    @Mock
    private HttpServletResponse response;

    private GoogleOAuth2FailureHandler handler;


    @BeforeEach
    void setUp() {

        handler =
                new GoogleOAuth2FailureHandler();
    }


    // =====================================================
    // TEST 1
    // NORMAL AUTHENTICATION EXCEPTION
    // =====================================================

    @Test
    void shouldRedirectWhenAuthenticationFails()
            throws Exception {

        AuthenticationException exception =
                new AuthenticationException(
                        "Google login failed"
                ) {
                };


        handler.onAuthenticationFailure(
                request,
                response,
                exception
        );


        verify(
                response,
                times(1)
        ).sendRedirect(
                "http://localhost:5173/login?oauth2Error=true"
        );
    }


    // =====================================================
    // TEST 2
    // OAUTH2 AUTHENTICATION EXCEPTION
    // =====================================================

    @Test
    void shouldHandleOAuth2AuthenticationException()
            throws Exception {

        OAuth2Error error =
                new OAuth2Error(
                        "access_denied",
                        "Google login was denied",
                        "https://example.com/oauth-error"
                );


        OAuth2AuthenticationException exception =
                new OAuth2AuthenticationException(
                        error
                );


        handler.onAuthenticationFailure(
                request,
                response,
                exception
        );


        verify(
                response,
                times(1)
        ).sendRedirect(
                "http://localhost:5173/login?oauth2Error=true"
        );
    }


    // =====================================================
    // TEST 3
    // EXCEPTION WITH CAUSE
    // =====================================================

    @Test
    void shouldHandleExceptionWithCause()
            throws Exception {

        RuntimeException cause =
                new RuntimeException(
                        "Google server error"
                );


        AuthenticationException exception =
                new AuthenticationException(
                        "OAuth login failed",
                        cause
                ) {
                };


        handler.onAuthenticationFailure(
                request,
                response,
                exception
        );


        verify(
                response,
                times(1)
        ).sendRedirect(
                "http://localhost:5173/login?oauth2Error=true"
        );
    }
}