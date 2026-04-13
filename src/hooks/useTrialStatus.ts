import { useState, useEffect } from "react";
import { useGetIdentity } from "@refinedev/core";
import { supabase } from "@/lib/supabase";

export interface TrialStatus {
  isOnTrial: boolean;
  daysRemaining: number;
  expiresAt: Date | null;
  isExpired: boolean;
  isNearExpiration: boolean; // <7 days
  warningMessage: string | null;
  planType: string;
}

export const useTrialStatus = () => {
  const { data: identity } = useGetIdentity<{ id: string }>();
  const [trialStatus, setTrialStatus] = useState<TrialStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const calculateDaysRemaining = (expirationDate: Date): number => {
    const now = new Date();
    const timeDiff = expirationDate.getTime() - now.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };

  const fetchTrialStatus = async () => {
    if (!identity?.id) return;

    try {
      setLoading(true);

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select(
          `
          museums!inner(
            plan_type,
            trial_ends_at,
            trial_started_at
          )
        `,
        )
        .eq("id", identity.id)
        .single();

      if (profileError) {
        throw profileError;
      }

      const planType = profile.museums[0]?.plan_type || "personal";
      const isOnTrial =
        planType === "personal" && !!profile.museums[0]?.trial_ends_at;

      let expiresAt: Date | null = null;
      let daysRemaining = 0;
      let isExpired = false;
      let isNearExpiration = false;
      let warningMessage: string | null = null;

      if (isOnTrial && profile.museums[0]?.trial_ends_at) {
        expiresAt = new Date(profile.museums[0].trial_ends_at);
        daysRemaining = calculateDaysRemaining(expiresAt);
        isExpired = daysRemaining <= 0;
        isNearExpiration = daysRemaining <= 7 && daysRemaining > 0;

        if (isExpired) {
          warningMessage =
            "Your trial has expired. Upgrade to continue using MCurio.";
        } else if (isNearExpiration) {
          warningMessage = `Your trial expires in ${daysRemaining} day${
            daysRemaining === 1 ? "" : "s"
          }. Upgrade to keep your data.`;
        }
      }

      setTrialStatus({
        isOnTrial,
        daysRemaining,
        expiresAt,
        isExpired,
        isNearExpiration,
        warningMessage,
        planType,
      });
    } catch (err) {
      console.error("Error fetching trial status:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch trial status",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrialStatus();
  }, [identity?.id]);

  const refetch = () => {
    fetchTrialStatus();
  };

  return {
    trialStatus,
    loading,
    error,
    refetch,
  };
};
