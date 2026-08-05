package com.bloodlink.bloodlink_backend.util;

public class ScoreCalculator {
    public static double score(double distance,double bloodLinkScore){
        double score=100;
        score-=distance;
        score+=bloodLinkScore;
        return score;
    }
}
