"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Camera, CheckCircle2 } from "lucide-react";
import Image from "next/image";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { apiClient } from "@/lib/api-client";
import { useAuthStore } from "@/stores/auth-store";
import type { User } from "@/types";

const profileSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
  address: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { user, setUser, token } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({ resolver: zodResolver(profileSchema) });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await apiClient.get<{ data: User }>("/profile");
        reset({
          fullName: res.data.fullName,
          email: res.data.email,
          phone: res.data.phone,
          address: res.data.address,
        });
      } catch {
        setError("Failed to load profile.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [reset]);

  const onSubmit = async (data: ProfileFormData) => {
    setIsSaving(true);
    setError(null);
    try {
      const res = await apiClient.put<{ data: User }>("/profile", data);
      if (token) setUser(res.data, token);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError("Failed to save changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
        <p className="text-[hsl(var(--muted-foreground))] text-sm mt-1">
          Manage your personal information
        </p>
      </div>

      {/* Avatar section */}
      <Card>
        <CardHeader>
          <CardTitle>Profile photo</CardTitle>
          <CardDescription>
            Upload a photo to personalise your account
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-4">
          <div className="relative">
            {isLoading ? (
              <Skeleton className="h-16 w-16 rounded-full" />
            ) : (
              <div className="h-16 w-16 rounded-full overflow-hidden bg-[hsl(var(--muted))] flex items-center justify-center">
                {user?.avatarUrl ? (
                  <Image
                    src={user.avatarUrl}
                    alt={`${user.fullName}'s avatar`}
                    width={64}
                    height={64}
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <span className="text-xl font-semibold text-[hsl(var(--muted-foreground))]">
                    {user?.fullName?.charAt(0) ?? "U"}
                  </span>
                )}
              </div>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            disabled
            aria-label="Upload photo (coming soon)"
          >
            <Camera className="h-4 w-4 mr-2" aria-hidden="true" />
            Upload photo
          </Button>
        </CardContent>
      </Card>

      {/* Profile form */}
      <Card>
        <CardHeader>
          <CardTitle>Personal information</CardTitle>
          <CardDescription>
            Update your name, email, and contact details
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-1.5">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          ) : (
            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              aria-label="Profile form"
            >
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="fullName">Full name</Label>
                    <Input
                      id="fullName"
                      aria-describedby={
                        errors.fullName ? "name-error" : undefined
                      }
                      aria-invalid={!!errors.fullName}
                      {...register("fullName")}
                    />
                    {errors.fullName && (
                      <p
                        id="name-error"
                        className="text-xs text-[hsl(var(--destructive))]"
                        role="alert"
                      >
                        {errors.fullName.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="email">Email address</Label>
                    <Input
                      id="email"
                      type="email"
                      aria-describedby={
                        errors.email ? "email-error" : undefined
                      }
                      aria-invalid={!!errors.email}
                      {...register("email")}
                    />
                    {errors.email && (
                      <p
                        id="email-error"
                        className="text-xs text-[hsl(var(--destructive))]"
                        role="alert"
                      >
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="phone">Phone number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="+44 7700 900000"
                    {...register("phone")}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    autoComplete="street-address"
                    placeholder="12 King Street, Manchester, M2 4LQ"
                    {...register("address")}
                  />
                </div>

                {error && (
                  <p
                    className="text-sm text-[hsl(var(--destructive))]"
                    role="alert"
                    aria-live="polite"
                  >
                    {error}
                  </p>
                )}

                <div className="flex items-center gap-3 pt-2">
                  <Button
                    type="submit"
                    disabled={isSaving || !isDirty}
                    aria-busy={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <Loader2
                          className="h-4 w-4 animate-spin"
                          aria-hidden="true"
                        />
                        Saving…
                      </>
                    ) : (
                      "Save changes"
                    )}
                  </Button>

                  {saved && (
                    <span
                      className="flex items-center gap-1.5 text-sm text-green-700"
                      role="status"
                      aria-live="polite"
                    >
                      <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                      Saved
                    </span>
                  )}
                </div>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
