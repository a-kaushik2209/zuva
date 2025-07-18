"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { generateMnemonic, deriveWallets } from "@/lib/crypto";
import { Copy, Hexagon, Waves, PlusCircle, KeyRound, Eye, EyeOff, Save, AlertTriangle, Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";

export default function WalletManager() {
  const [selectedChain, setSelectedChain] = useState("ethereum");
  const [generatedMnemonic, setGeneratedMnemonic] = useState("");
  const [derivedWallets, setDerivedWallets] = useState([]);
  const [visiblePrivateKey, setVisiblePrivateKey] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const { addWallet } = useAuth();

  const handleCopyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to Clipboard", {
      description: `${label} has been copied.`,
    });
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const newMnemonic = generateMnemonic();
      setGeneratedMnemonic(newMnemonic);
      const newWallets = await deriveWallets(newMnemonic, selectedChain, 1);
      setDerivedWallets(newWallets);
      toast.success("Mnemonic Generated", {
        description: `A new mnemonic and 1 wallet for ${selectedChain} has been generated.`,
      });
    } catch (error) {
      toast.error("Generation Failed", {
        description: error?.message || "An unknown error occurred.",
      });
      setGeneratedMnemonic("");
      setDerivedWallets([]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddAnotherWallet = async () => {
    setIsAdding(true);
    if (!generatedMnemonic) {
      toast.error("No Mnemonic", {
        description: "Please generate a mnemonic first.",
      });
      setIsAdding(false);
      return;
    }
    try {
      const newWallet = await deriveWallets(generatedMnemonic, selectedChain, 1, derivedWallets.length);
      setDerivedWallets([...derivedWallets, ...newWallet]);
    } catch (error) {
      toast.error("Failed to Add Wallet", {
        description: error?.message || "An unknown error occurred.",
      });
    } finally {
      setIsAdding(false);
    }
  };

  const handleSaveWallet = (wallet) => {
    addWallet({ ...wallet, chain: selectedChain });
    toast.success("Wallet Saved", {
      description: `Wallet ${wallet.publicKey.slice(0, 12)}... has been saved to your dashboard.`,
    });
  };

  const onChainChange = async (value) => {
    setSelectedChain(value);
    if (generatedMnemonic) {
      setIsGenerating(true);
      try {
        const newWallets = await deriveWallets(generatedMnemonic, value, derivedWallets.length || 1);
        setDerivedWallets(newWallets);
      } catch {
        toast.error("Derivation Failed", {
          description: "Could not derive wallets for the new chain.",
        });
        setDerivedWallets([]);
      } finally {
        setIsGenerating(false);
      }
    }
  };

  const togglePrivateKeyVisibility = (id) => {
    setVisiblePrivateKey(visiblePrivateKey === id ? null : id);
  };

  const ChainSelector = (
    <div className="mb-6">
      <h3 className="text-lg font-medium mb-3">Select Chain</h3>
      <RadioGroup
        defaultValue={selectedChain}
        onValueChange={onChainChange}
        className="flex items-center gap-4"
        disabled={isGenerating}
      >
        <Label
          htmlFor="ethereum"
          className="font-normal flex items-center gap-3 cursor-pointer text-base p-4 rounded-lg border-2 border-transparent transition-all hover:border-primary/50 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5"
        >
          <RadioGroupItem value="ethereum" id="ethereum" />
          <Hexagon className="w-6 h-6 text-primary" />
          <span className="font-medium">Ethereum</span>
        </Label>
        <Label
          htmlFor="solana"
          className="font-normal flex items-center gap-3 cursor-pointer text-base p-4 rounded-lg border-2 border-transparent transition-all hover:border-primary/50 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5"
        >
          <RadioGroupItem value="solana" id="solana" />
          <Waves className="w-6 h-6 text-primary" />
          <span className="font-medium">Solana</span>
        </Label>
      </RadioGroup>
    </div>
  );

  return (
    <div className="w-full mx-auto">
      <Card className="w-full bg-card/50 border-border/50 shadow-lg mt-4">
        <CardHeader>
          <CardTitle className="font-headline tracking-tighter">Generate a New Secure Wallet</CardTitle>
          <CardDescription>Start by selecting a chain and generating a new mnemonic phrase.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {ChainSelector}
            <Button onClick={handleGenerate} className="w-full sm:w-auto" size="lg" disabled={isGenerating}>
              {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />}
              {isGenerating ? "Generating..." : "Generate Mnemonic & Wallet"}
            </Button>
            {generatedMnemonic && (
              <div className="space-y-4 pt-4 border-t border-border/50">
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Save Your Mnemonic Phrase!</AlertTitle>
                  <AlertDescription>
                    This is the only time you will see this phrase. Write it down and store it somewhere safe. You will NOT be able to recover it later.
                  </AlertDescription>
                </Alert>
                <Card className="bg-background/50 p-4 border-accent">
                  <div className="flex flex-wrap gap-3 text-lg font-mono">
                    {generatedMnemonic.split(" ").map((word, index) => (
                      <span key={index} className="bg-accent/20 text-foreground px-3 py-1.5 rounded-md text-base">
                        {word}
                      </span>
                    ))}
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleCopyToClipboard(generatedMnemonic, "Mnemonic")} className="mt-4">
                    <Copy className="mr-2 h-4 w-4" /> Copy Phrase
                  </Button>
                </Card>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {derivedWallets.length > 0 && (
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-semibold font-headline tracking-tighter">Derived Wallets</h3>
            <Button onClick={handleAddAnotherWallet} variant="outline" disabled={isAdding}>
              {isAdding ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />}
              {isAdding ? "Adding..." : "Add Another Wallet"}
            </Button>
          </div>
          <Alert className="mb-4">
            <Save className="h-4 w-4" />
            <AlertTitle>Don't Forget to Save!</AlertTitle>
            <AlertDescription>
              Your generated wallets are not saved automatically. Click the save icon on any wallet to add it to your dashboard.
            </AlertDescription>
          </Alert>
          <div className="border rounded-lg overflow-hidden bg-background/50">
            <div className="overflow-x-auto">
              <table className="w-full table-fixed">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[60px]">Chain</TableHead>
                    <TableHead>Path</TableHead>
                    <TableHead>Public Key</TableHead>
                    <TableHead>Private Key</TableHead>
                    <TableHead className="text-right w-[160px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {derivedWallets.map((wallet) => (
                    <TableRow key={wallet.id}>
                      <TableCell>
                        <div className="flex items-center">
                          {selectedChain === "ethereum" ? (
                            <Hexagon className="h-5 w-5 text-primary/80" aria-label="Ethereum" />
                          ) : (
                            <Waves className="h-5 w-5 text-primary/80" aria-label="Solana" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">{wallet.path}</TableCell>
                      <TableCell className="font-mono text-sm break-all">{wallet.publicKey}</TableCell>
                      <TableCell className="font-mono text-sm">
                        <div className="flex items-center gap-2">
                          <p className="truncate flex-1">
                            {visiblePrivateKey === wallet.id ? wallet.privateKey : "••••••••••••••••••••••••••••••••"}
                          </p>
                          <Button variant="ghost" size="icon" onClick={() => togglePrivateKeyVisibility(wallet.id)}>
                            <span className="sr-only">Toggle Private Key Visibility</span>
                            {visiblePrivateKey === wallet.id ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleCopyToClipboard(wallet.publicKey, "Public Key")} title="Copy Public Key">
                          <span className="sr-only">Copy Public Key</span>
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleCopyToClipboard(wallet.privateKey, "Private Key")} title="Copy Private Key">
                          <span className="sr-only">Copy Private Key</span>
                          <KeyRound className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleSaveWallet(wallet)} title="Save Wallet">
                          <span className="sr-only">Save Wallet</span>
                          <Save className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}