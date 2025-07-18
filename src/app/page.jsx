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
          <Link href="/generate-wallet">
            <Button size="lg" className="w-full sm:w-auto shadow-lg shadow-primary/20">
              <KeyRound className="mr-2"/>
              Create Your First Wallet
            </Button>
          </Link>
          {!loading && (
            <>
              {user ? (
                <Link href="/dashboard">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    <User className="mr-2"/>
                    Go to Dashboard
                  </Button>
                </Link>
              ) : (
                <Link href="/login">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    <LogIn className="mr-2"/>
                    Login / Sign Up
                  </Button>
                </Link>
              )}
            </>
          )}
        </div>
      </div>
      <div className="w-full max-w-5xl mt-24 sm:mt-32 z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <Card className="bg-card/50 border-border/30">
            <CardHeader>
              <Lock className="h-8 w-8 text-primary mb-2"/>
              <CardTitle className="font-headline text-2xl">Unyielding Security</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Your privacy is paramount. Wallets are generated directly on your device, ensuring that your private keys never leave your browser. You are in absolute control of your assets, always.</p>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border/30">
            <CardHeader>
              <Sprout className="h-8 w-8 text-primary mb-2"/>
              <CardTitle className="font-headline text-2xl">Intuitive by Design</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">We believe crypto should be accessible to everyone. Zuva's clean, professional interface simplifies wallet creation and management, removing the complexity so you can focus on what matters.</p>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border/30">
            <CardHeader>
              <Network className="h-8 w-8 text-primary mb-2"/>
              <CardTitle className="font-headline text-2xl">Multi-Chain Ready</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Seamlessly manage assets across leading blockchains. Zuva provides the tools you need to interact with a diverse ecosystem of dApps and protocols, starting with Ethereum and Solana.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}