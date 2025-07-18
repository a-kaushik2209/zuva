"use client";

import { Button } from "@/components/ui/button";
import { KeyRound, LogIn, User, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";

export default function Home() {
  const { user, loading } = useAuth();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-6 lg:p-8 text-center bg-background relative overflow-hidden">
      <div className="absolute inset-0 -z-10 h-full w-full animated-gradient"></div>
      
      <div className="w-full max-w-[85rem] mx-auto space-y-8 md:space-y-12 z-10 px-4 sm:px-6 lg:px-8">
        <div className="inline-flex items-center justify-center rounded-lg bg-primary/10 px-4 py-2 text-sm font-medium text-primary transform hover:scale-105 transition-transform">
          <ShieldCheck className="mr-2 h-4 w-4" />
          Your Keys, Your Crypto
        </div>

        <div className="space-y-6 md:space-y-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-headline font-bold tracking-tighter text-primary max-w-[20ch] mx-auto leading-[1.1]">
            Zuva
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto leading-relaxed">
            Welcome to the future of self-custody. Zuva provides a secure, intuitive, and personal gateway to the world of crypto. Generate wallets, manage your assets, and interact with the decentralized web with confidence and complete control.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 w-full max-w-lg mx-auto pt-4">
          <Button 
            asChild 
            size="lg" 
            className="w-full sm:w-auto sm:flex-1 shadow-lg shadow-primary/20 py-6 text-base font-medium"
          >
            <Link href="/generate-wallet">
              <span className="flex items-center justify-center">
                <KeyRound className="mr-2.5 h-5 w-5"/>
                Create Your First Wallet
              </span>
            </Link>
          </Button>
          
          {!loading && (
            <>
              {user ? (
                <Button 
                  asChild 
                  size="lg" 
                  variant="outline" 
                  className="w-full sm:w-auto sm:flex-1 py-6 text-base font-medium hover:bg-primary/5"
                >
                  <Link href="/dashboard">
                    <span className="flex items-center justify-center">
                      <User className="mr-2.5 h-5 w-5"/>
                      Go to Dashboard
                    </span>
                  </Link>
                </Button>
              ) : (
                <Button 
                  asChild 
                  size="lg" 
                  variant="outline" 
                  className="w-full sm:w-auto sm:flex-1 py-6 text-base font-medium hover:bg-primary/5"
                >
                  <Link href="/login">
                    <span className="flex items-center justify-center">
                      <LogIn className="mr-2.5 h-5 w-5"/>
                      Login / Sign Up
                    </span>
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