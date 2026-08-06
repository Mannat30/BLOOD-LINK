package com.bloodlink.bloodlink_backend.util;

public class ScoreCalculator {

    public static double calculateScore(
            double distance,
            double bloodLinkScore,
            int successfulDonations,
            boolean available) {

        double score = 0;

        // -----------------------------
        // Distance Score (Max 40)
        // -----------------------------
        if (distance <= 5) {
            score += 40;
        } else if (distance <= 10) {
            score += 30;
        } else if (distance <= 20) {
            score += 20;
        } else {
            score += 10;
        }

        // -----------------------------
        // BloodLink Score (Max 20)
        // -----------------------------
        score += Math.min(bloodLinkScore, 20);

        // -----------------------------
        // Donation History (Max 20)
        // -----------------------------
        score += Math.min(successfulDonations * 2, 20);

        // -----------------------------
        // Availability (Max 20)
        // -----------------------------
        if (available) {
            score += 20;
        }

        return score;
    }
}