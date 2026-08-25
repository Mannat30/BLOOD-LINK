package com.bloodlink.bloodlink_backend.security;

import com.bloodlink.bloodlink_backend.entity.User;
import com.bloodlink.bloodlink_backend.repo.Userrepo;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Component
@RequiredArgsConstructor
public class GoogleOAuth2SuccessHandler
        implements AuthenticationSuccessHandler {

    private final Userrepo userRepository;
    private final JwtService jwtService;

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication)
            throws IOException, ServletException {

        OAuth2User oauth2User =
                (OAuth2User) authentication.getPrincipal();

        String email = oauth2User.getAttribute("email");

        if (email == null || email.isBlank()) {
            response.sendRedirect(
                    "http://localhost:5173/login?error=GOOGLE_EMAIL_NOT_FOUND"
            );
            return;
        }

        User user = userRepository.findByEmail(email)
                .orElse(null);

        /*
         * Google account must already exist
         * in BloodLink.
         */
        if (user == null) {

            response.sendRedirect(
                    "http://localhost:5173/login?error=USER_NOT_REGISTERED"
            );
            return;
        }

        /*
         * Check account status
         */
        if (!user.isEnabled()) {

            response.sendRedirect(
                    "http://localhost:5173/login?error=ACCOUNT_DISABLED"
            );
            return;
        }

        /*
         * Generate YOUR BloodLink JWT
         */
        String token = jwtService.generateToken(user);

        String role = user.getRole().name();
        String userId = user.getId().toString();

        /*
         * Redirect to React OAuth callback page.
         *
         * Fragment (#) is used so the token is not sent
         * back to the server as part of the request.
         */
        String redirectUrl =
                "http://localhost:5173/oauth2/callback"
                        + "#token="
                        + URLEncoder.encode(
                        token,
                        StandardCharsets.UTF_8
                )
                        + "&role="
                        + URLEncoder.encode(
                        role,
                        StandardCharsets.UTF_8
                )
                        + "&userId="
                        + URLEncoder.encode(
                        userId,
                        StandardCharsets.UTF_8
                );

        response.sendRedirect(redirectUrl);
    }
}