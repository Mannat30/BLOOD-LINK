package com.bloodlink.bloodlink_backend.security;

import com.bloodlink.bloodlink_backend.entity.User;
import com.bloodlink.bloodlink_backend.repo.Userrepo;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;


@ExtendWith(MockitoExtension.class)
class CustomUserDetailsServiceTest {

    @Mock
    private Userrepo userrepo;

    @InjectMocks
    private CustomUserDetailsService customUserDetailsService;

    private User user;


    // =====================================================
    // SETUP
    // =====================================================

    @BeforeEach
    void setUp() {

        user = new User();

        user.setEmail(
                "mannat@example.com"
        );

        user.setName(
                "Mannat"
        );

        user.setPassword(
                "encodedPassword"
        );
    }


    // =====================================================
    // TEST 1
    // USER FOUND
    // =====================================================

    @Test
    void shouldLoadUserByUsername() {

        when(
                userrepo.findByEmail(
                        "mannat@example.com"
                )
        ).thenReturn(
                Optional.of(user)
        );


        var result =
                customUserDetailsService
                        .loadUserByUsername(
                                "mannat@example.com"
                        );


        assertNotNull(result);


        assertSame(
                user,
                result
        );


        assertEquals(
                "mannat@example.com",
                result.getUsername()
        );


        verify(
                userrepo,
                times(1)
        ).findByEmail(
                "mannat@example.com"
        );
    }


    // =====================================================
    // TEST 2
    // USER NOT FOUND
    // =====================================================

    @Test
    void shouldThrowExceptionWhenUserNotFound() {

        when(
                userrepo.findByEmail(
                        "unknown@example.com"
                )
        ).thenReturn(
                Optional.empty()
        );


        UsernameNotFoundException exception =
                assertThrows(
                        UsernameNotFoundException.class,
                        () ->
                                customUserDetailsService
                                        .loadUserByUsername(
                                                "unknown@example.com"
                                        )
                );


        assertEquals(
                "user not found",
                exception.getMessage()
        );


        verify(
                userrepo,
                times(1)
        ).findByEmail(
                "unknown@example.com"
        );
    }


    // =====================================================
    // TEST 3
    // REPOSITORY CALLED ONLY ONCE
    // =====================================================

    @Test
    void shouldCallRepositoryOnlyOnce() {

        when(
                userrepo.findByEmail(
                        "mannat@example.com"
                )
        ).thenReturn(
                Optional.of(user)
        );


        customUserDetailsService
                .loadUserByUsername(
                        "mannat@example.com"
                );


        verify(
                userrepo,
                times(1)
        ).findByEmail(
                "mannat@example.com"
        );


        verifyNoMoreInteractions(
                userrepo
        );
    }
}