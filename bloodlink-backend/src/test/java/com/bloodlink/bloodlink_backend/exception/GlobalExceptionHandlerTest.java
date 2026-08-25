package com.bloodlink.bloodlink_backend.exception;

import com.bloodlink.bloodlink_backend.dto.ErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class GlobalExceptionHandlerTest {

    private final GlobalExceptionHandler handler =
            new GlobalExceptionHandler();


    // =====================================================
    // TEST 1
    // ResourceNotFoundException -> 404
    // =====================================================

    @Test
    void shouldHandleResourceNotFoundException() {

        ResourceNotFoundException exception =
                new ResourceNotFoundException(
                        "Blood Request Not Found"
                );

        HttpServletRequest request =
                mock(HttpServletRequest.class);

        when(request.getRequestURI())
                .thenReturn("/api/matching/eligible/123");


        ResponseEntity<ErrorResponse> response =
                handler.handleNotFound(
                        exception,
                        request
                );


        assertEquals(
                HttpStatus.NOT_FOUND,
                response.getStatusCode()
        );

        assertNotNull(response.getBody());

        assertEquals(
                404,
                response.getBody().getStatus()
        );

        assertEquals(
                "NOT_FOUND",
                response.getBody().getError()
        );

        assertEquals(
                "Blood Request Not Found",
                response.getBody().getMessage()
        );

        assertEquals(
                "/api/matching/eligible/123",
                response.getBody().getPath()
        );
    }


    // =====================================================
    // TEST 2
    // BadRequestException -> 400
    // =====================================================

    @Test
    void shouldHandleBadRequestException() {

        BadRequestException exception =
                new BadRequestException(
                        "Invalid blood request"
                );

        HttpServletRequest request =
                mock(HttpServletRequest.class);

        when(request.getRequestURI())
                .thenReturn("/api/blood-request");


        ResponseEntity<ErrorResponse> response =
                handler.handleBadRequest(
                        exception,
                        request
                );


        assertEquals(
                HttpStatus.BAD_REQUEST,
                response.getStatusCode()
        );

        assertNotNull(response.getBody());

        assertEquals(
                400,
                response.getBody().getStatus()
        );

        assertEquals(
                "BAD_REQUEST",
                response.getBody().getError()
        );

        assertEquals(
                "Invalid blood request",
                response.getBody().getMessage()
        );

        assertEquals(
                "/api/blood-request",
                response.getBody().getPath()
        );
    }


    // =====================================================
    // TEST 3
    // Generic Exception -> 500
    // =====================================================

    @Test
    void shouldHandleGenericException() {

        Exception exception =
                new Exception(
                        "Something went wrong"
                );

        HttpServletRequest request =
                mock(HttpServletRequest.class);

        when(request.getRequestURI())
                .thenReturn("/api/test");


        ResponseEntity<ErrorResponse> response =
                handler.handleException(
                        exception,
                        request
                );


        assertEquals(
                HttpStatus.INTERNAL_SERVER_ERROR,
                response.getStatusCode()
        );

        assertNotNull(response.getBody());

        assertEquals(
                500,
                response.getBody().getStatus()
        );

        assertEquals(
                "INTERNAL_SERVER_ERROR",
                response.getBody().getError()
        );

        assertEquals(
                "Something went wrong",
                response.getBody().getMessage()
        );

        assertEquals(
                "/api/test",
                response.getBody().getPath()
        );
    }


    // =====================================================
    // TEST 4
    // Handler object should exist
    // =====================================================

    @Test
    void shouldCreateExceptionHandler() {

        assertNotNull(handler);
    }
}