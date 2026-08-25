package com.bloodlink.bloodlink_backend.util;

import com.bloodlink.bloodlink_backend.Enum.BloodGroup;

public class BloodCompatibilityUtil {

    public static boolean isCompatible(BloodGroup donor,
                                       BloodGroup patient) {

        return donor == patient;
    }
}