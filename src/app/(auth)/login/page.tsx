"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { AuthCard } from "@/features/auth/components/auth-card";
import { AuthForm } from "@/features/auth/components/forms/auth-form";
import { LoginFormData } from "@/features/auth/types";
import { useCurrentUser } from "@/shared/hooks/use-current-user";

export default function LoginPage() {
  const router = useRouter();
  const { fetchUserData } = useCurrentUser();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      await authAPI.login(data.email, data.password);
      await fetchUserData();
      router.push("/channels/me");
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard
      title="Welcome Back!"
      description="We're so excited to see you again!"
    >
      <AuthForm onSubmit={onSubmit} isRegister={false} isLoading={isLoading} />
    </AuthCard>
  );
}
