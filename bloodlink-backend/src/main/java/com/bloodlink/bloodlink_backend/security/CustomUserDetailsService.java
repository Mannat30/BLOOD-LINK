package com.bloodlink.bloodlink_backend.security;

import com.bloodlink.bloodlink_backend.repo.Userrepo;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {
    private final Userrepo  rep;
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return rep.findByEmail(email).orElseThrow(()->new UsernameNotFoundException("user not found"));

    }

}
