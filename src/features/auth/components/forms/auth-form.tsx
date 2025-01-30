"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";

import { loginSchema, registerSchema } from "../../validations/auth";
import { AuthFormProps } from "../../types";

export const AuthForm = ({
  onSubmit,
  isRegister = false,
  isLoading = false,
}: AuthFormProps) => {
  const schema = isRegister ? registerSchema : loginSchema;
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
      ...(isRegister && { username: "", confirmPassword: "" }),
    },
  });

  const handleSubmit = async (data: any) => {
    await onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        {isRegister && (
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#B5BAC1] uppercase text-xs font-bold">
                  Username
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="cooluser123"
                    className="bg-[#1E1F22] border-0 text-white placeholder-[#949BA4] focus-visible:ring-offset-0 focus-visible:ring-1 focus-visible:ring-[#5865F2]"
                  />
                </FormControl>
                <FormMessage className="text-[#FA777C]" />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#B5BAC1] uppercase text-xs font-bold">
                Email
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="email"
                  placeholder="you@example.com"
                  className="bg-[#1E1F22] border-0 text-white placeholder-[#949BA4] focus-visible:ring-offset-0 focus-visible:ring-1 focus-visible:ring-[#5865F2]"
                />
              </FormControl>
              <FormMessage className="text-[#FA777C]" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#B5BAC1] uppercase text-xs font-bold">
                Password
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="password"
                  className="bg-[#1E1F22] border-0 text-white placeholder-[#949BA4] focus-visible:ring-offset-0 focus-visible:ring-1 focus-visible:ring-[#5865F2]"
                />
              </FormControl>
              <FormMessage className="text-[#FA777C]" />
            </FormItem>
          )}
        />

        {isRegister && (
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#B5BAC1] uppercase text-xs font-bold">
                  Confirm Password
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    className="bg-[#1E1F22] border-0 text-white placeholder-[#949BA4] focus-visible:ring-offset-0 focus-visible:ring-1 focus-visible:ring-[#5865F2]"
                  />
                </FormControl>
                <FormMessage className="text-[#FA777C]" />
              </FormItem>
            )}
          />
        )}

        <Button
          type="submit"
          className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white"
          disabled={isLoading}
        >
          {isLoading
            ? isRegister
              ? "Creating account..."
              : "Signing in..."
            : isRegister
            ? "Register"
            : "Sign In"}
        </Button>

        <div className="text-sm text-[#949BA4]">
          {isRegister ? (
            <>
              <span>Already have an account? </span>
              <Link href="/login" className="text-[#00A8FC] hover:underline">
                Sign In
              </Link>
            </>
          ) : (
            <>
              <span>Need an account? </span>
              <Link href="/register" className="text-[#00A8FC] hover:underline">
                Register
              </Link>
            </>
          )}
        </div>
      </form>
    </Form>
  );
};
