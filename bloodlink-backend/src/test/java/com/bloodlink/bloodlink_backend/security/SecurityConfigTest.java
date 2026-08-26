package com.bloodlink.bloodlink_backend.config;

import com.bloodlink.bloodlink_backend.security.CustomUserDetailsService;
import com.bloodlink.bloodlink_backend.security.GoogleOAuth2FailureHandler;
import com.bloodlink.bloodlink_backend.security.GoogleOAuth2SuccessHandler;

import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


@SpringBootTest
@AutoConfigureMockMvc
class SecurityConfigTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private PasswordEncoder passwordEncoder;


    // =====================================================
    // MOCK SECURITY DEPENDENCIES
    // =====================================================

    @MockBean
    private CustomUserDetailsService customUserDetailsService;

    @MockBean
    private GoogleOAuth2SuccessHandler googleOAuth2SuccessHandler;

    @MockBean
    private GoogleOAuth2FailureHandler googleOAuth2FailureHandler;


    // =====================================================
    // TEST 1
    // PROTECTED ENDPOINT
    // =====================================================

    @Test
    void shouldProtectNormalEndpoints()
            throws Exception {

        mockMvc.perform(
                        get("/api/blood-request")
                )
                .andExpect(
                        status().isUnauthorized()
                );
    }


    // =====================================================
    // TEST 2
    // OAUTH2 AUTHORIZATION
    // =====================================================

    @Test
    void shouldAllowOAuth2AuthorizationEndpoint()
            throws Exception {

        mockMvc.perform(
                        get("/oauth2/authorization/google")
                )
                .andExpect(
                        status().is3xxRedirection()
                );
    }


    // =====================================================
    // TEST 3
    // PASSWORD ENCODER
    // =====================================================

    @Test
    void shouldProvidePasswordEncoder() {

        assertNotNull(passwordEncoder);

        String rawPassword =
                "Password@123";

        String encodedPassword =
                passwordEncoder.encode(
                        rawPassword
                );

        assertTrue(
                passwordEncoder.matches(
                        rawPassword,
                        encodedPassword
                )
        );
    }


    // =====================================================
    // TEST 4
    // PASSWORD SHOULD NOT BE PLAIN TEXT
    // =====================================================

    @Test
    void shouldEncodePassword() {

        String rawPassword =
                "Password@123";

        String encodedPassword =
                passwordEncoder.encode(
                        rawPassword
                );

        assertNotNull(encodedPassword);

        assertTrue(
                !rawPassword.equals(
                        encodedPassword
                )
        );
    }
}