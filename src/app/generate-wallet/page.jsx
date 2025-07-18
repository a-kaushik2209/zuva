"use client";

import WalletManager from "@/components/wallet-manager";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function GenerateWalletPage() {
  const { user, loading } = useAuth();
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
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-6 lg:p-8 bg-background">
      <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
      <div className="w-full max-w-5xl">
        <header className="relative flex justify-start mb-6 sm:mb-8 h-12 items-center">
          <Button
            asChild
            variant="ghost"
            className="hover:bg-primary/5 transition-colors"
          >
            <Link href="/dashboard">
              <span className="flex items-center">
                <ArrowLeft className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden sm:inline">Back to Dashboard</span>
                <span className="sm:hidden">Back</span>
              </span>
            </Link>
          </Button>
        </header>
        <WalletManager />
      </div>
    </main>
  );
}