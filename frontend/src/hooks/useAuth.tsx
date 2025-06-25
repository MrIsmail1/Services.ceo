"use client";
import { getUser } from "@/lib/api";
import { User } from "@/types/Auth";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const AUTH = "auth";

const useAuth = (options = {}) => {
  const router = useRouter();
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

  return { user, ...rest };
};

export default useAuth;
