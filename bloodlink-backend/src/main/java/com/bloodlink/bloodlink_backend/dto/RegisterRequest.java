package com.bloodlink.bloodlink_backend.dto;

import com.bloodlink.bloodlink_backend.Enum.Role;
import com.bloodlink.bloodlink_backend.Enum.Userstatus;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequest {
    private String name;
    private String email;
    private Role role;
    private String password;
    private Userstatus status;
    private String phoneNumber;
}
