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
      <main className="flex min-h-screen items-center justify-center p-4">
        <p>Loading...</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 md:p-12">
      <div className="w-full max-w-md relative">
        <Button
          variant="ghost"
          className="absolute top-0 left-0"
          asChild
        >
          <Link href="/dashboard">
            <div className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </div>
          </Link>
        </Button>

        <Card className="mt-20">
          <CardHeader>
            <CardTitle className="text-3xl font-headline">Your Profile</CardTitle>
            <CardDescription>View and manage your account details.</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-2">
              <h4 className="font-semibold">Email</h4>
              <p className="text-muted-foreground">{user.email}</p>
            </div>

            <Button
              variant="destructive"
              className="w-full"
              onClick={() => {
                logout();
                router.push("/");
              }}
            >
              <div className="flex items-center">
                <LogOut className="mr-2 h-4 w-4" />
                Log Out
              </div>
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}