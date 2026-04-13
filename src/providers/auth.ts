import { supabase } from "@/lib/supabase";
import type { AuthProvider } from "@refinedev/core";

const isAdminProfile = async (userId: string) => {
  const { data: profile } = await supabase
    .from("profiles")
    .select("museum_id, role")
    .eq("id", userId)
    .single();

  if (!profile) {
    return { museumId: null as string | null, isAdmin: false };
  }

  return {
    museumId: profile.museum_id ?? null,
    isAdmin: profile.role === "admin",
  };
};

export const authProvider: AuthProvider = {
  login: async ({ email, password }: { email: string; password: string }) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return { success: true, redirectTo: "/dashboard" };
  },
  logout: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      return { success: false, error };
    }
    return { success: true, redirectTo: "/login" };
  },
  check: async () => {
    const { data, error } = await supabase.auth.getSession();
    if (error || !data.session) {
      return { authenticated: false, redirectTo: "/login", logout: true };
    }

    const { museumId, isAdmin } = await isAdminProfile(data.session.user.id);

    if (!museumId && !isAdmin) {
      return { authenticated: false, redirectTo: "/onboarding" };
    }

    return { authenticated: true };
  },
  getPermissions: async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) return null;

    const { isAdmin } = await isAdminProfile(data.user.id);
    return isAdmin ? "admin" : "user";
  },
  getIdentity: async () => {
    const { data } = await supabase.auth.getUser();
    const user = data.user;
    if (!user) return null;
    return {
      id: user.id,
      name: user.email ?? "User",
      avatar: undefined,
    };
  },
  onError: async (error) => {
    const statusCode = (error as { statusCode?: number })?.statusCode;
    if (statusCode === 401) {
      return {
        logout: true,
        redirectTo: "/login",
      };
    }
    return {};
  },
};
