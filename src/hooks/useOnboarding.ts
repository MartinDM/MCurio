import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export interface MuseumProfile {
  id: string;
  name: string;
  type: "personal" | "museum" | "organisation" | "conservator";
  plan_type: "personal" | "museum";
  onboarding_completed: boolean;
  onboarding_completed_at?: string;
  trial_ends_at?: string;
  item_limit?: number;
}

export interface TrialStatus {
  daysRemaining: number;
  trialExpired: boolean;
  trialEndsAt: string;
  itemsUsed: number;
  itemsRemaining: number;
  canCreateItems: boolean;
  itemLimit: number;
}

export interface OnboardingStep {
  step_name: string;
  completed: boolean;
  completed_at?: string;
}

export interface OnboardingState {
  museum: MuseumProfile | null;
  steps: OnboardingStep[];
  loading: boolean;
  error: string | null;
  needsOnboarding: boolean;
  trialStatus: TrialStatus | null;
}

export const useOnboarding = () => {
  const [state, setState] = useState<OnboardingState>({
    museum: null,
    steps: [],
    loading: true,
    error: null,
    needsOnboarding: false,
    trialStatus: null,
  });

  const fetchOnboardingState = async () => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      // Clean up any orphaned profile data first
      await supabase.rpc("cleanup_orphaned_profile");

      // Get current user's museum with trial data
      const { data: profile } = await supabase
        .from("profiles")
        .select(
          `
          id,
          museum_id,
          museum (
            id,
            name,
            type,
            plan_type,
            onboarding_completed,
            onboarding_completed_at,
            trial_ends_at,
            item_limit
          )
        `,
        )
        .single();

      if (!profile?.museum_id || !profile.museum) {
        // User needs onboarding
        setState((prev) => ({
          ...prev,
          loading: false,
          needsOnboarding: true,
          museum: null,
          steps: [],
          trialStatus: null,
        }));
        return;
      }

      const museum = Array.isArray(profile.museum)
        ? profile.museum[0]
        : profile.museum;

      // Get onboarding steps (including condition reports)
      const { data: steps } = await supabase
        .from("onboarding_progress")
        .select("step_name, completed, completed_at")
        .eq("museum_id", museum.id);

      // Get trial status using the database function
      const { data: trialData } = await supabase.rpc("get_trial_status", {
        museum_uuid: museum.id,
      });

      let trialStatus: TrialStatus | null = null;
      if (trialData) {
        const now = new Date();
        const trialEndsAt = new Date(trialData.trial_ends_at);
        const daysRemaining = Math.max(
          0,
          Math.ceil(
            (trialEndsAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
          ),
        );

        trialStatus = {
          daysRemaining,
          trialExpired: trialData.trial_expired || false,
          trialEndsAt: trialData.trial_ends_at,
          itemsUsed: trialData.items_used || 0,
          itemsRemaining: Math.max(
            0,
            (trialData.item_limit || 20) - (trialData.items_used || 0),
          ),
          canCreateItems: trialData.can_create_items || false,
          itemLimit: trialData.item_limit || 20,
        };
      }

      setState((prev) => ({
        ...prev,
        loading: false,
        needsOnboarding: false,
        museum: museum as MuseumProfile,
        steps: steps || [],
        trialStatus,
      }));
    } catch (error: any) {
      console.error("Error fetching onboarding state:", error);
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error.message || "Failed to load onboarding state",
      }));
    }
  };

  const completeStep = async (stepName: string) => {
    try {
      const { error } = await supabase.rpc("complete_onboarding_step", {
        step_name: stepName,
      });

      if (error) throw error;

      // Refresh onboarding state
      await fetchOnboardingState();
    } catch (error: any) {
      console.error("Error completing onboarding step:", error);
      setState((prev) => ({
        ...prev,
        error: error.message || "Failed to complete onboarding step",
      }));
    }
  };

  const uncompleteStep = async (stepName: string) => {
    try {
      if (!state.museum?.id) return;

      // Mark step as incomplete
      const { error: stepError } = await supabase
        .from("onboarding_progress")
        .update({
          completed: false,
          completed_at: null,
          updated_at: new Date().toISOString(),
        })
        .eq("museum_id", state.museum.id)
        .eq("step_name", stepName);

      if (stepError) throw stepError;

      // Reset museum onboarding completion
      const { error: museumError } = await supabase
        .from("museums")
        .update({
          onboarding_completed: false,
          onboarding_completed_at: null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", state.museum.id);

      if (museumError) throw museumError;

      // Refresh onboarding state
      await fetchOnboardingState();
    } catch (error: any) {
      console.error("Error uncompleting onboarding step:", error);
      setState((prev) => ({
        ...prev,
        error: error.message || "Failed to uncomplete onboarding step",
      }));
    }
  };

  useEffect(() => {
    fetchOnboardingState();
  }, []);

  // Auto-complete/uncomplete steps based on data presence
  const checkAndCompleteSteps = async () => {
    if (!state.museum?.id) return;

    try {
      // Check items
      const { data: items } = await supabase
        .from("items")
        .select("id")
        .limit(1);

      const hasItems = items && items.length > 0;
      const itemStepCompleted = state.steps.find(
        (s) => s.step_name === "add_first_item",
      )?.completed;

      if (hasItems && !itemStepCompleted) {
        await completeStep("add_first_item");
      } else if (!hasItems && itemStepCompleted) {
        await uncompleteStep("add_first_item");
      }

      // Check contacts
      const { data: contacts } = await supabase
        .from("contacts")
        .select("id")
        .limit(1);

      const hasContacts = contacts && contacts.length > 0;
      const contactStepCompleted = state.steps.find(
        (s) => s.step_name === "add_first_contact",
      )?.completed;

      if (hasContacts && !contactStepCompleted) {
        await completeStep("add_first_contact");
      } else if (!hasContacts && contactStepCompleted) {
        await uncompleteStep("add_first_contact");
      }

      // Check exhibitions
      const { data: exhibitions } = await supabase
        .from("exhibitions")
        .select("id")
        .limit(1);

      const hasExhibitions = exhibitions && exhibitions.length > 0;
      const exhibitionStepCompleted = state.steps.find(
        (s) => s.step_name === "create_exhibition",
      )?.completed;

      if (hasExhibitions && !exhibitionStepCompleted) {
        await completeStep("create_exhibition");
      } else if (!hasExhibitions && exhibitionStepCompleted) {
        await uncompleteStep("create_exhibition");
      }

      // Check condition reports
      const { data: conditionReports } = await supabase
        .from("condition_reports")
        .select("id")
        .limit(1);

      const hasConditionReports =
        conditionReports && conditionReports.length > 0;
      const conditionReportStepCompleted = state.steps.find(
        (s) => s.step_name === "create_condition_report",
      )?.completed;

      if (hasConditionReports && !conditionReportStepCompleted) {
        await completeStep("create_condition_report");
      } else if (!hasConditionReports && conditionReportStepCompleted) {
        await uncompleteStep("create_condition_report");
      }
    } catch (error: any) {
      console.error("Error checking step completion:", error);
    }
  };

  return {
    ...state,
    refetch: fetchOnboardingState,
    completeStep,
    uncompleteStep,
    checkAndCompleteSteps,
  };
};

export default useOnboarding;
