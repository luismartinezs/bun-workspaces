# Feature Spec: Referral Reward System

## Overview
We want to incentivize existing users to invite new people to the platform.

## Business Rules
1. **The Referral:** When an existing user (the Referrer) shares their code and a new user (the Referee) signs up, a "Referral Link" is created.
2. **The Reward:** The Referrer does NOT get the reward immediately. They only get a "Bonus Credit" once the Referee completes their first successful purchase.
3. **Variable Rewards:** The amount of the Bonus Credit depends on the Referee's first purchase type:
   - "Standard Purchase": $10 Credit.
   - "Subscription Purchase": $25 Credit.
4. **Tracking:** We need to keep track of how many successful referrals a user has made to show them a "Top Referrer" badge if they exceed 10 successful referrals.