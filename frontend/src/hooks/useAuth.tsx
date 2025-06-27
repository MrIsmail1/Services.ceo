"use client";
import { getUser, signOut } from "@/lib/api";
import { User } from "@/types/Auth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const AUTH = "auth";

const useAuth = (options = {}) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  
  const { data: user, ...rest } = useQuery<User>({
    queryKey: [AUTH],
    queryFn: getUser,
    staleTime: Infinity,
    ...options,
  });

  useEffect(() => {
    if (!rest.isLoading && !user) {
      router.replace("/auth");
    }
    if (rest.error && rest.error.name === "AccessDeniedError") {
      router.replace("/auth");
    }
  }, [rest.isLoading, user, router, rest.error]);

  const logout = async () => {
    try {
      await signOut();
      // Invalider le cache utilisateur
      queryClient.invalidateQueries({ queryKey: [AUTH] });
      // Rediriger vers la page d'authentification
      router.replace("/auth");
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  return { user, logout, ...rest };
};

export default useAuth;
