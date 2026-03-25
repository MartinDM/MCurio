import { supabase } from "@/lib/supabase";
import type { DataProvider, LiveProvider } from "@refinedev/core";

const museumScopedResources = new Set([
  "items",
  "contacts",
  "exhibitions",
  "condition_reports",
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

export const dataProvider: DataProvider = {
  getList: async ({ resource, pagination }) => {
    const current = pagination?.current ?? 1;
    const pageSize = pagination?.pageSize ?? 10;
    const from = (current - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error, count } = await supabase
      .from(resource)
      .select("*", { count: "exact" })
      .range(from, to);

    if (error) throw error;
    return { data: data ?? [], total: count ?? 0 };
  },
  getOne: async ({ resource, id }) => {
    const { data, error } = await supabase
      .from(resource)
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    return { data };
  },
  create: async ({ resource, variables }) => {
    const payload = { ...(variables as Record<string, unknown>) };

    if (museumScopedResources.has(resource) && !payload.museum_id) {
      const museumId = await getCurrentMuseumId();
      if (museumId) {
        payload.museum_id = museumId;
      }
    }

    const { data, error } = await supabase
      .from(resource)
      .insert(payload)
      .select("*")
      .single();
    if (error) throw error;
    return { data };
  },
  update: async ({ resource, id, variables }) => {
    const { data, error } = await supabase
      .from(resource)
      .update(variables as object)
      .eq("id", id)
      .select("*")
      .single();
    if (error) throw error;
    return { data };
  },
  deleteOne: async ({ resource, id }) => {
    const { data, error } = await supabase
      .from(resource)
      .delete()
      .eq("id", id)
      .select("*")
      .single();
    if (error) throw error;
    return { data };
  },
  getApiUrl: () => import.meta.env.VITE_SUPABASE_URL ?? "",
};

export const liveProvider: LiveProvider = {
  subscribe: () => {
    return { unsubscribe: () => undefined };
  },
  unsubscribe: () => undefined,
  publish: async () => undefined,
};
