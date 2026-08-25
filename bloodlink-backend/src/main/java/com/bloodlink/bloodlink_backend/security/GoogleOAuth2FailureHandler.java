package com.bloodlink.bloodlink_backend.security;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.core.AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class GoogleOAuth2FailureHandler
        implements AuthenticationFailureHandler {

    @Override
    public void onAuthenticationFailure(
            HttpServletRequest request,
            HttpServletResponse response,
            AuthenticationException exception)
            throws IOException, ServletException {

        System.out.println();
        System.out.println("==============================================");
        System.out.println("        GOOGLE OAUTH2 LOGIN FAILED");
        System.out.println("==============================================");

        System.out.println(
                "Exception Type: "
                        + exception.getClass().getName()
        );

        System.out.println(
                "Message: "
                        + exception.getMessage()
        );

        // If this is an OAuth2-specific exception
        if (exception instanceof OAuth2AuthenticationException oauthException) {

            OAuth2Error error = oauthException.getError();

            System.out.println(
                    "OAuth2 Error Code: "
                            + error.getErrorCode()
            );

            System.out.println(
                    "OAuth2 Error Description: "
                            + error.getDescription()
            );

            System.out.println(
                    "OAuth2 Error URI: "
                            + error.getUri()
            );
        }

        // Print root cause
        Throwable cause = exception.getCause();

        if (cause != null) {

            System.out.println(
                    "Cause Type: "
                            + cause.getClass().getName()
            );

            System.out.println(
                    "Cause Message: "
                            + cause.getMessage()
            );

            cause.printStackTrace();
        }

        // Print complete stack trace
        exception.printStackTrace();

        System.out.println(
                "=============================================="
        );
        System.out.println();

        /*
         * During debugging, send the user back to React.
         */
        response.sendRedirect(
                "http://localhost:5173/login?oauth2Error=true"
        );
    }
}