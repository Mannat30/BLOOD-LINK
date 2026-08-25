package com.bloodlink.bloodlink_backend.util;

import com.bloodlink.bloodlink_backend.Enum.RequestPriority;

public class ScoreCalculator {

    private ScoreCalculator() {
    }

    // =====================================================
    // NORMAL PRIORITY
    // =====================================================

    private static final double NORMAL_COMPATIBILITY = 40.0;
    private static final double NORMAL_DISTANCE = 25.0;
    private static final double NORMAL_AVAILABILITY = 15.0;
    private static final double NORMAL_HISTORY = 10.0;
    private static final double NORMAL_RELIABILITY = 10.0;


    // =====================================================
    // CALCULATE FINAL SCORE
    // =====================================================

    public static double calculateScore(

            double distanceKm,

            double compatibilityScore,

            double availabilityScore,

            double donationHistoryScore,

            double reliabilityScore,

            double bloodLinkScore,

            RequestPriority priority) {


        double distanceScore =
                calculateDistanceScore(
                        distanceKm,
                        priority
                );


        double normalizedBloodLinkScore =
                Math.min(
                        Math.max(bloodLinkScore, 0.0),
                        100.0
                );


        double finalScore =

                compatibilityScore

                        + distanceScore

                        + availabilityScore

                        + donationHistoryScore

                        + reliabilityScore

                        + (
                        normalizedBloodLinkScore
                                * 0.10
                );


        return Math.min(
                finalScore,
                100.0
        );
    }


    // =====================================================
    // DISTANCE SCORE
    // =====================================================

    public static double calculateDistanceScore(

            double distanceKm,

            RequestPriority priority) {


        double maxDistance;

        if (priority == RequestPriority.CRITICAL) {

            maxDistance = 10.0;

        } else if (priority == RequestPriority.HIGH) {

            maxDistance = 25.0;

        } else {

            maxDistance = 50.0;
        }


        if (distanceKm >= maxDistance) {
            return 0.0;
        }


        return 25.0 *
                (
                        1.0 -
                                distanceKm / maxDistance
                );
    }


    // =====================================================
    // DONATION HISTORY SCORE
    // =====================================================

    public static double calculateDonationHistoryScore(
            int successfulDonations) {

        return Math.min(
                successfulDonations * 2.0,
                10.0
        );
    }


    // =====================================================
    // RELIABILITY SCORE
    // =====================================================

    public static double calculateReliabilityScore(

            int accepted,

            int rejected) {


        int total =
                accepted + rejected;


        if (total == 0) {
            return 5.0;
        }


        double acceptanceRate =
                (double) accepted / total;


        return acceptanceRate * 10.0;
    }
}