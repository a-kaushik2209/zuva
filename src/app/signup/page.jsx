"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { ArrowLeft, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { GoogleButton } from "@/components/ui/google-button";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

const signupSchema = z
  .object({
    email: z.string().email("Please enter a valid email address."),
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export default function SignupPage() {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [authError, setAuthError] = useState(null);
  const router = useRouter();
  const { signup, user, loading, signInWithGoogle } = useAuth();

  useEffect(() => {
    if (user && !loading) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  const form = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data) => {
    const newUser = signup(data.email, data.password);
    if (newUser) {
      toast.success("Signup Successful", {
        description: "Redirecting to your dashboard...",
      });
      router.push("/dashboard");
    } else {
      toast.error("Signup Failed", {
        description: "An account with this email already exists.",
      });
    }
  };

  const handleGoogleSignup = async () => {
    if (isGoogleLoading) return;

    setIsGoogleLoading(true);
    setAuthError(null);

    try {
      const result = await signInWithGoogle();

      if (result) {
        toast.success("Account created successfully", {
          description: "Redirecting to your dashboard...",
        });
        router.push("/dashboard");
      }
    } catch (error) {
      setAuthError(error);
      switch (error.code) {
        case "auth/popup-closed-by-user":
          break;

        case "auth/popup-blocked":
          toast.error("Popup Blocked", {
            description: "Please allow popups for this site and try again.",
            action: {
              label: "Try Again",
              onClick: () => handleGoogleSignup(),
            },
          });
          break;

        case "auth/cancelled-popup-request":
          break;

        case "auth/network-request-failed":
          toast.error("Connection Failed", {
            description: "Please check your internet connection and try again.",
            action: {
              label: "Retry",
              onClick: () => handleGoogleSignup(),
            },
          });
          break;

        case "auth/too-many-requests":
          toast.error("Too Many Attempts", {
            description: "Please wait a moment before trying again.",
          });
          break;

        default:
          toast.error("Signup Failed", {
            description: "An unexpected error occurred. Please try again later.",
          });
          console.error("Google signup error:", {
            code: error.code,
            message: error.message,
            fullError: error,
          });
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center p-4">
        <p>Loading...</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-6 lg:p-8 bg-background">
      <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />

      <Button
        variant="ghost"
        className="absolute top-4 left-4 sm:top-6 sm:left-6 lg:top-8 lg:left-8"
        asChild
      >
        <Link href="/">
          <span className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
            <span className="hidden sm:inline">Back to Home</span>
            <span className="sm:hidden">Back</span>
          </span>
        </Link>
      </Button>

      <Card className="w-full max-w-sm shadow-xl">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl sm:text-3xl font-headline tracking-tight">
            Create an Account
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Get started with your secure wallet manager.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 sm:space-y-5"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium">Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="name@example.com"
                        className="h-11"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium">Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        className="h-11"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium">
                      Confirm Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        className="h-11"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full h-11 sm:h-12 mt-2 transition-all"
                size="lg"
              >
                <span className="flex items-center justify-center">
                  <UserPlus className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  Create Account
                </span>
              </Button>
            </form>
          </Form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-muted"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <GoogleButton
            onClick={handleGoogleSignup}
            disabled={isGoogleLoading || loading}
            className="relative hover:bg-muted/50"
          >
            {isGoogleLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>
                  {authError?.code === "auth/popup-blocked"
                    ? "Waiting for popup..."
                    : "Connecting..."}
                </span>
              </span>
            ) : (
              <span className="flex items-center justify-center">
                Sign up with Google
              </span>
            )}
          </GoogleButton>

          <div className="mt-6 text-center text-sm sm:text-base">
            Already have an account?{" "}
            <Link
              href="/login"
              className="underline font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}