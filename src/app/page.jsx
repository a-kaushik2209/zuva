"use client";

import { Button } from "@/components/ui/button";
import { KeyRound, LogIn, User, ShieldCheck, Lock, Sprout, Network } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  const { user, loading } = useAuth();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 md:p-12 text-center bg-background relative overflow-hidden">
      <div className="absolute inset-0 -z-10 h-full w-full animated-gradient"></div>
      <div className="w-full max-w-4xl space-y-6 z-10">
        <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
          <ShieldCheck className="inline-block mr-2 h-4 w-4" />
          Your Keys, Your Crypto
        </div>
        <h1 className="text-5xl font-headline font-bold tracking-tighter text-primary sm:text-6xl md:text-7xl">
          Zuva
        </h1>
        <p className="mt-4 text-lg text-foreground/80 max-w-3xl mx-auto">
          Welcome to the future of self-custody. Zuva provides a secure, intuitive, and personal gateway to the world of crypto. Generate wallets, manage your assets, and interact with the decentralized web with confidence and complete control.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
          <Button asChild size="lg" className="w-full sm:w-auto shadow-lg shadow-primary/20">
            <Link href="/generate-wallet">
              <div className="flex items-center">
                <KeyRound className="mr-2"/>
                Create Your First Wallet
              </div>
            </Link>
          </Button>
          
          {!loading && (
            <>
              {user ? (
                <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
                  <Link href="/dashboard">
                    <div className="flex items-center">
                      <User className="mr-2"/>
                      Go to Dashboard
                    </div>
                  </Link>
                </Button>
              ) : (
                <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
                  <Link href="/login">
                    <div className="flex items-center">
                      <LogIn className="mr-2"/>
                      Login / Sign Up
                    </div>
                  </Link>
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}