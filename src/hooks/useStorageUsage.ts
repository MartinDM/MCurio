import { useState, useEffect } from "react";
import { useGetIdentity } from "@refinedev/core";
import { supabase } from "@/lib/supabase";

export interface StorageUsage {
  usedBytes: number;
  limitBytes: number;
  usagePercentage: number;
  formattedUsed: string;
  formattedLimit: string;
  isNearLimit: boolean; // >80%
  isAtLimit: boolean; // >95%
  planType: string;
}

export const useStorageUsage = () => {
  const { data: identity } = useGetIdentity<{ id: string }>();
  const [storageUsage, setStorageUsage] = useState<StorageUsage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 MB";
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
  };

  const fetchStorageUsage = async () => {
    if (!identity?.id) return;

    try {
      setLoading(true);

      // Get user profile with museum information
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select(
          `
          storage_used_bytes,
          museums!inner (
            storage_limit_bytes,
            plan_type
          )
        `,
        )
        .eq("id", identity.id)
        .single();

      if (profileError) {
        throw profileError;
      }

      const usedBytes = profile.storage_used_bytes || 0;
      const limitBytes =
        profile.museums?.[0]?.storage_limit_bytes || 1073741824; // 1GB default
      const planType = profile.museums?.[0]?.plan_type || "personal";
      const usagePercentage = (usedBytes / limitBytes) * 100;

      setStorageUsage({
        usedBytes,
        limitBytes,
        usagePercentage,
        formattedUsed: formatBytes(usedBytes),
        formattedLimit: formatBytes(limitBytes),
        isNearLimit: usagePercentage > 80,
        isAtLimit: usagePercentage > 95,
        planType,
      });
    } catch (err) {
      console.error("Error fetching storage usage:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch storage usage",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStorageUsage();
  }, [identity?.id]);

  const refetch = () => {
    fetchStorageUsage();
  };

  return {
    storageUsage,
    loading,
    error,
    refetch,
  };
};
