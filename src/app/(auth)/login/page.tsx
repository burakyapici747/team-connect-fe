"use client";

import { AuthCard } from "@/features/auth/components/auth-card";
import { AuthForm } from "@/features/auth/components/forms/auth-form";
import { LoginFormData } from "@/features/auth/types";
import {useAuth} from "@/features/auth/hooks/useAuth";

export default function LoginPage() {
  const { login, isLoading, error } = useAuth();

  const onSubmit = async (loginFormData: LoginFormData) => {
    login(loginFormData);
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
