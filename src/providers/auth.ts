import { supabase } from "@/lib/supabase";
import type { AuthProvider } from "@refinedev/core";

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

    const { data: profile } = await supabase
      .from("profiles")
      .select("museum_id, is_admin")
      .eq("id", data.session.user.id)
      .single();

    if (!profile?.museum_id && !profile?.is_admin) {
      return { authenticated: false, redirectTo: "/no-museum" };
    }

    return { authenticated: true };
  },
  getPermissions: async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) return null;
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", data.user.id)
      .single();
    return profile?.is_admin ? "admin" : "user";
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
