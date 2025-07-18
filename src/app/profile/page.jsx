"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center p-4 bg-background">
        <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
        <p className="text-base sm:text-lg text-muted-foreground">Loading...</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 md:p-12 bg-background">
      <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
      
      <div className="w-full max-w-md relative">
        <Button
          variant="ghost"
          className="absolute -top-2 sm:-top-4 left-0 transition-colors"
          asChild
        >
          <Link href="/dashboard">
            <span className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden sm:inline">Back to Dashboard</span>
              <span className="sm:hidden">Back</span>
            </span>
          </Link>
        </Button>

        <Card className="mt-16 sm:mt-20 shadow-lg">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl sm:text-3xl font-headline tracking-tight">
              Your Profile
            </CardTitle>
            <CardDescription className="text-sm sm:text-base">
              View and manage your account details.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 sm:space-y-8">
            <div className="space-y-2 sm:space-y-3">
              <h4 className="text-sm font-medium sm:text-base">Email</h4>
              <p className="text-sm sm:text-base text-muted-foreground px-3 py-2 bg-muted/50 rounded-md">
                {user.email}
              </p>
            </div>

            <Button
              variant="destructive"
              className="w-full h-11 sm:h-12 transition-all hover:opacity-90"
              onClick={() => {
                logout();
                router.push("/");
              }}
            >
              <span className="flex items-center justify-center">
                <LogOut className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-base">Log Out</span>
              </span>
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}