"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { useAuthStore } from "@/stores/auth-store";
import type { Metadata } from "next";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login } = useAuth();
  const { isLoading, error } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => login(data);

  return (
    <div className="page-enter">
      <h1 className="text-2xl font-bold tracking-tight mb-2">Welcome back</h1>
      <p className="text-sm text-[hsl(var(--muted-foreground))] mb-8">
        Sign in to your Eagle Bank account
      </p>

      {/* Demo hint */}
      <div
        className="mb-6 p-3 rounded-lg text-xs border"
        style={{
          background: "hsl(var(--secondary))",
          borderColor: "hsl(var(--border))",
        }}
        role="note"
        aria-label="Demo credentials"
      >
        <strong>Demo:</strong> joe.burton@eaglebank.com / any password
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate aria-label="Login form">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              autoFocus
              placeholder="you@example.com"
              aria-describedby={errors.email ? "email-error" : undefined}
              aria-invalid={!!errors.email}
              {...register("email")}
            />
            {errors.email && (
              <p id="email-error" className="text-xs text-[hsl(var(--destructive))]" role="alert">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link
                href="#"
                className="text-xs text-[hsl(var(--primary))] hover:underline"
                tabIndex={0}
              >
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              aria-describedby={errors.password ? "password-error" : undefined}
              aria-invalid={!!errors.password}
              {...register("password")}
            />
            {errors.password && (
              <p id="password-error" className="text-xs text-[hsl(var(--destructive))]" role="alert">
                {errors.password.message}
              </p>
            )}
          </div>

          {error && (
            <div
              className="p-3 rounded-md text-sm text-[hsl(var(--destructive))] border"
              style={{ borderColor: "hsl(var(--destructive) / 0.3)", background: "hsl(var(--destructive) / 0.05)" }}
              role="alert"
              aria-live="polite"
            >
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full mt-2"
            disabled={isLoading}
            aria-busy={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                Signing in…
              </>
            ) : (
              "Sign in"
            )}
          </Button>
        </div>
      </form>

      <p className="mt-6 text-center text-sm text-[hsl(var(--muted-foreground))]">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-medium text-[hsl(var(--primary))] hover:underline"
        >
          Create one
        </Link>
      </p>
    </div>
  );
}
