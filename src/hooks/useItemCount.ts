import { useState, useEffect } from "react";
import { useGetIdentity } from "@refinedev/core";
import { supabase } from "@/lib/supabase";

export interface ItemUsage {
  currentCount: number;
  maxItems: number;
  canCreateMore: boolean;
  usageText: string;
  planType: string;
  isAtLimit: boolean;
}

interface Identity {
  id: string;
}

export const useItemCount = () => {
  const { data: identity } = useGetIdentity<Identity>();
  const [itemUsage, setItemUsage] = useState<ItemUsage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchItemUsage = async () => {
    if (!identity?.id) return;

    try {
      setLoading(true);

      // Get user profile with museum information
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select(
          `
          id,
          museum:museum_id!inner (
            item_limit,
            plan_type
          )
        `,
        )
        .eq("id", identity.id)
        .single();

      if (profileError) {
        throw profileError;
      }

      // Count user's items
      const { count, error: countError } = await supabase
        .from("items")
        .select("*", { count: "exact", head: true })
        .eq("user_id", identity.id);

      if (countError) {
        throw countError;
      }

      const currentCount = count || 0;

      // Handle both single object and array responses from the database query
      const museumData = Array.isArray(profile.museum)
        ? profile.museum[0]
        : profile.museum;
      const planType = museumData?.plan_type || "personal";
      const maxItems = museumData?.item_limit || 20;
      const canCreateMore = currentCount < maxItems;
      const isAtLimit = currentCount >= maxItems;

      let usageText: string;
      if (planType === "personal") {
        usageText = `${currentCount} of ${maxItems} items used (Personal Plan)`;
      } else {
        usageText = `${currentCount} of ${maxItems} items used (Museum Plan)`;
      }

      setItemUsage({
        currentCount,
        maxItems,
        canCreateMore,
        usageText,
        planType,
        isAtLimit,
      });
    } catch (err) {
      console.error("Error fetching item usage:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch item usage",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItemUsage();
  }, [identity?.id]);

  const refetch = () => {
    fetchItemUsage();
  };

  return {
    itemUsage,
    loading,
    error,
    refetch,
  };
};
