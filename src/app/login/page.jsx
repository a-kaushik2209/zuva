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
import { ArrowLeft, LogIn, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useEffect, useState } from "react";
import { GoogleButton } from "@/components/ui/google-button";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export default function LoginPage() {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [authError, setAuthError] = useState(null);
  const router = useRouter();
  const { login, user, loading, signInWithGoogle } = useAuth();

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data) => {
    const loggedInUser = login(data.email, data.password);
    if (loggedInUser) {
      toast.success("Login Successful", {
        description: "Redirecting to your dashboard...",
      });
      router.push("/dashboard");
    } else {
      toast.error("Login Failed", {
        description: "Invalid email or password.",
      });
    }
  };

  const handleGoogleLogin = async () => {
    if (isGoogleLoading) return;

    setIsGoogleLoading(true);
    setAuthError(null);

    try {
      const result = await signInWithGoogle();

      if (result) {
        toast.success("Login Successful", {
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
              onClick: () => handleGoogleLogin(),
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
              onClick: () => handleGoogleLogin(),
            },
          });
          break;

        case "auth/too-many-requests":
          toast.error("Too Many Attempts", {
            description: "Please wait a moment before trying again.",
          });
          break;

        default:
          toast.error("Login Failed", {
            description: "An unexpected error occurred. Please try again later.",
          });
          console.error("Google login error:", {
            code: error.code,
            message: error.message,
            fullError: error,
          });
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  useEffect(() => {
    if (user && !loading) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center p-4 bg-background">
        <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
        <p className="text-base sm:text-lg text-muted-foreground">Loading...</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-6 lg:p-8 bg-background">
      <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />

      <Button
        variant="ghost"
        className="absolute top-4 left-4 sm:top-6 sm:left-6 lg:top-8 lg:left-8 transition-colors"
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
            Welcome Back
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Enter your credentials to access your account.
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
              <Button
                type="submit"
                className="w-full h-11 sm:h-12 transition-all"
                size="lg"
              >
                <span className="flex items-center justify-center">
                  <LogIn className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="text-base">Login</span>
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
            onClick={handleGoogleLogin}
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
                Continue with Google
              </span>
            )}
          </GoogleButton>

          <div className="mt-6 text-center text-sm sm:text-base">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="underline font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}