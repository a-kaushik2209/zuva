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
  const router = useRouter();
  const { signup, user, loading } = useAuth();

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

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center p-4">
        <p>Loading...</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-6 lg:p-8 bg-background">
      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />

      {/* Back Button */}
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

      {/* Main Card */}
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">
              {/* Email Field */}
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
              
              {/* Password Fields */}
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
                    <FormLabel className="text-sm font-medium">Confirm Password</FormLabel>
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

              {/* Submit Button */}
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

          {/* Login Link */}
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