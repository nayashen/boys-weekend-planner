import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export function useUserRole() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadUser() {
      setLoading(true);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        console.error(
          "Error loading user:",
          userError
        );
      }

      if (!mounted) return;

      if (!user) {
        setUser(null);
        setRole(null);
        setLoading(false);
        return;
      }

      setUser(user);

      const {
        data: profile,
        error: profileError,
      } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profileError) {
        console.error(
          "Error loading user role:",
          profileError
        );

        if (mounted) {
          setRole(null);
          setLoading(false);
        }

        return;
      }

      if (mounted) {
        setRole(profile?.role || null);
        setLoading(false);
      }
    }

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!session?.user) {
          setUser(null);
          setRole(null);
          setLoading(false);
        } else {
          loadUser();
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return {
    user,
    role,
    isAdmin: role === "admin",
    isMember: role === "member",
    loading,
  };
}