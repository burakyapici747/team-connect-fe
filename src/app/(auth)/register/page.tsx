// app/(auth)/register/page.tsx
"use client";

import { AuthCard } from "@/features/auth/components/auth-card";
import { AuthForm } from "@/features/auth/components/forms/auth-form";
import { RegisterFormData } from "@/features/auth/types";
import { useAuth } from "@/features/auth/hooks/useAuth";

export default function RegisterPage() {
  const { register, isRegisterLoading } = useAuth();

  const onSubmit = async (formData: RegisterFormData) => {
    const { confirmPassword, ...registerData } = formData;
    register(registerData);
  };

  return (
      <AuthCard
          title="Create an Account"
          description="Join Team Connect to start collaborating"
      >
        <AuthForm
            onSubmit={onSubmit}
            isRegister={true}
            isLoading={isRegisterLoading}
        />
      </AuthCard>
  );
}