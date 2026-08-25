package com.bloodlink.bloodlink_backend.security;

import com.bloodlink.bloodlink_backend.entity.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.junit.jupiter.MockitoExtension;

import org.springframework.test.util.ReflectionTestUtils;

import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;


@ExtendWith(MockitoExtension.class)
class JwtServiceTest {

    private JwtService jwtService;

    private User user;

    private final String secret =
            "mySuperSecretKeyForBloodLinkApplicationJwt2026";


    // =====================================================
    // SETUP
    // =====================================================

    @BeforeEach
    void setUp() {

        jwtService = new JwtService();

        // Inject @Value("${jwt.secret}")
        ReflectionTestUtils.setField(
                jwtService,
                "secret",
                secret
        );


        user = new User();

        user.setEmail(
                "mannat@example.com"
        );

        user.setName(
                "Mannat"
        );
    }


    // =====================================================
    // TEST 1
    // GENERATE TOKEN
    // =====================================================

    @Test
    void shouldGenerateToken() {

        String token =
                jwtService.generateToken(user);

        assertNotNull(token);

        assertFalse(token.isBlank());

        // JWT normally contains 3 parts:
        // header.payload.signature

        assertEquals(
                3,
                token.split("\\.").length
        );
    }


    // =====================================================
    // TEST 2
    // EXTRACT USERNAME
    // =====================================================

    @Test
    void shouldExtractUsernameFromToken() {

        String token =
                jwtService.generateToken(user);


        String username =
                jwtService.extractUsername(token);


        assertEquals(
                "mannat@example.com",
                username
        );
    }


    // =====================================================
    // TEST 3
    // EXTRACT EXPIRATION
    // =====================================================

    @Test
    void shouldExtractExpirationFromToken() {

        Date before =
                new Date();


        String token =
                jwtService.generateToken(user);


        Date expiration =
                jwtService.extractExpiration(token);


        assertNotNull(expiration);


        assertTrue(
                expiration.after(before)
        );
    }


    // =====================================================
    // TEST 4
    // VALID TOKEN
    // =====================================================

    @Test
    void shouldValidateCorrectToken() {

        String token =
                jwtService.generateToken(user);


        boolean valid =
                jwtService.isTokenValid(
                        token,
                        user
                );


        assertTrue(valid);
    }


    // =====================================================
    // TEST 5
    // WRONG USER
    // =====================================================

    @Test
    void shouldRejectTokenForDifferentUser() {

        String token =
                jwtService.generateToken(user);


        User anotherUser =
                new User();

        anotherUser.setEmail(
                "other@example.com"
        );


        boolean valid =
                jwtService.isTokenValid(
                        token,
                        anotherUser
                );


        assertFalse(valid);
    }


    // =====================================================
    // TEST 6
    // TAMPERED TOKEN
    // =====================================================

    @Test
    void shouldRejectTamperedToken() {

        String token =
                jwtService.generateToken(user);


        String tamperedToken =
                token.substring(0, token.length() - 1)
                        + "x";


        assertThrows(
                Exception.class,
                () ->
                        jwtService.extractUsername(
                                tamperedToken
                        )
        );
    }
}