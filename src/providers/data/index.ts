import { supabase } from "@/lib/supabase";
import { dataProvider as supabaseDataProvider } from "@refinedev/supabase";
import type { DataProvider, LiveProvider } from "@refinedev/core";

const museumScopedResources = new Set([
  "items",
  "contacts",
  "locations",
  "exhibitions",
  "exhibition_items",
  "item_movements",
  "condition_reports",
  "loans",
  "loan_items",
  "properties",
  "item_property_values",
  "roles",
]);

const getCurrentMuseumId = async () => {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;
  if (!userId) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("museum_id")
    .eq("id", userId)
    .single();

  return profile?.museum_id ?? null;
};

// Get the official Supabase data provider
const baseDataProvider = supabaseDataProvider(supabase);

// Wrap it with custom museum scoping logic
export const dataProvider: DataProvider = {
  ...baseDataProvider,
  create: async ({ resource, variables }) => {
    const payload = { ...(variables as Record<string, unknown>) };

    if (museumScopedResources.has(resource) && !payload.museum_id) {
      const museumId = await getCurrentMuseumId();
      if (museumId) {
        payload.museum_id = museumId;
      }
    }

    return baseDataProvider.create({ resource, variables: payload });
  },
};

export const liveProvider: LiveProvider = {
  subscribe: () => {
    return { unsubscribe: () => undefined };
  },
  unsubscribe: () => undefined,
  publish: async () => undefined,
};
