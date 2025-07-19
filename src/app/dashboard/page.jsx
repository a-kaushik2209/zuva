"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Input,
  Label,
} from "@/components/ui";
import {
  Hexagon,
  LogOut,
  PlusCircle,
  User,
  Waves,
  View,
  KeyRound,
  Eye,
  EyeOff,
  Copy,
  Wallet,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { useHotkeys } from 'react-hotkeys-hook';

export default function DashboardPage() {
  const { user, logout, wallets, loading, deleteWallet } = useAuth();
  const router = useRouter();

  const [visiblePrivateKey, setVisiblePrivateKey] = useState(null);
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [walletToDelete, setWalletToDelete] = useState(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const handleCopyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to Clipboard", {
      description: `${label} has been copied.`,
    });
  };

  const togglePrivateKeyVisibility = (id) => {
    setVisiblePrivateKey(visiblePrivateKey === id ? null : id);
  };

  const handleViewClick = (wallet) => {
    setSelectedWallet(wallet);
    setIsViewDialogOpen(true);
  };

  const handleDeleteClick = (wallet) => {
    setWalletToDelete(wallet);
    setDeleteConfirmText('');
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (deleteConfirmText !== 'confirm') {
      toast.error('Please type "confirm" to delete the wallet');
      return;
    }

    try {
      await deleteWallet(walletToDelete.id);
      setIsDeleteDialogOpen(false);
      setWalletToDelete(null);
      setDeleteConfirmText('');
      toast.success("Wallet Deleted", {
        description: `Wallet ${walletToDelete.publicKey.slice(0, 12)}... has been removed.`,
      });
    } catch (error) {
      toast.error("Failed to delete wallet");
    }
  };

  const resetViewDialogState = () => {
    setIsViewDialogOpen(false);
    setSelectedWallet(null);
    setVisiblePrivateKey(null);
  };

  const handleKeyboardCopy = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to Clipboard");
  };

  useHotkeys('ctrl+c', () => {
    if (selectedWallet) {
      const activeElement = document.activeElement;
      if (activeElement?.tagName === 'CODE') {
        handleKeyboardCopy(activeElement.textContent);
      }
    }
  });

  const handleDeleteKeySubmit = (e) => {
    if (e.key === 'Enter' && deleteConfirmText === 'confirm') {
      handleDeleteConfirm();
    }
  };

  if (loading || !user) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
        <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
        <p>Loading...</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-6 lg:p-8 bg-background">
      <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
      <div className="w-full max-w-6xl">
        {/* Header Section */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold font-headline tracking-tighter">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user.email}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline">
              <Link href="/profile">
                <span className="flex items-center">
                  <User className="mr-2 h-4 w-4" /> Profile
                </span>
              </Link>
            </Button>

            <Button variant="outline" onClick={() => { logout(); router.push('/'); }}>
              <span className="flex items-center">
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </span>
            </Button>
          </div>
        </header>

        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Your Wallets</CardTitle>
              <CardDescription>Here are the wallets you have saved.</CardDescription>
            </div>
            <Button asChild>
              <Link href="/generate-wallet">
                <span className="flex items-center">
                  <PlusCircle className="mr-2 h-4 w-4" /> Create New Wallet
                </span>
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {wallets.length > 0 ? (
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[120px]">Chain</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead>Created At</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {wallets.map(wallet => (
                      <TableRow key={wallet.id}>
                        <TableCell>
                          <div className="flex items-center gap-2 font-medium">
                            {wallet.chain === 'ethereum'
                              ? <Hexagon className="h-5 w-5 text-primary/80" />
                              : <Waves className="h-5 w-5 text-primary/80" />}
                            {wallet.chain ? wallet.chain.charAt(0).toUpperCase() + wallet.chain.slice(1) : 'N/A'}
                          </div>
                        </TableCell>
                        <TableCell className="font-mono truncate max-w-xs">{wallet.publicKey}</TableCell>
                        <TableCell>{new Date(wallet.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => handleViewClick(wallet)}>
                            <span className="flex items-center">
                              <View className="mr-2 h-4 w-4" /> View
                            </span>
                          </Button>
                          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => handleDeleteClick(wallet)}>
                            <span className="flex items-center">
                              <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12 border-2 border-dashed rounded-lg flex flex-col items-center justify-center">
                <Wallet className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium">No Wallets Found</h3>
                <p className="text-muted-foreground mt-2 mb-4">Get started by creating your first wallet.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[625px] p-6">
          <DialogHeader>
            <DialogTitle>Wallet Details</DialogTitle>
            <DialogDescription>
              View your wallet's public and private keys.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Public Key</Label>
              <div className="relative flex items-center gap-2">
                <code 
                  className="w-full p-3 bg-muted rounded-md font-mono text-sm break-all"
                  tabIndex={0}
                  role="textbox"
                  aria-label="Public Key"
                >
                  {selectedWallet?.publicKey}
                </code>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2"
                  onClick={() => handleCopyToClipboard(selectedWallet?.publicKey, 'Public Key')}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Private Key</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => togglePrivateKeyVisibility(selectedWallet?.id)}
                  className="h-8 px-2"
                >
                  <span className="flex items-center gap-2">
                    {visiblePrivateKey === selectedWallet?.id ? (
                      <>
                        <EyeOff className="h-4 w-4" />
                        Hide
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4" />
                        Show
                      </>
                    )}
                  </span>
                </Button>
              </div>
              <div className="relative flex items-center gap-2">
                <code 
                  className="w-full p-3 bg-muted rounded-md font-mono text-sm break-all"
                  tabIndex={0}
                  role="textbox"
                  aria-label="Private Key"
                >
                  {visiblePrivateKey === selectedWallet?.id 
                    ? selectedWallet?.privateKey 
                    : '••••••••••••••••••••••••••••••••'}
                </code>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2"
                  onClick={() => handleCopyToClipboard(selectedWallet?.privateKey, 'Private Key')}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="sm:max-w-[500px] p-6">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-headline text-destructive">
              Delete Wallet
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base">
              This action cannot be undone. Type "confirm" to delete this wallet.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-4 py-4">
            <Input
              placeholder='Type "confirm" to delete'
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              onKeyDown={handleDeleteKeySubmit}
              className="h-11"
            />
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setDeleteConfirmText('');
              setIsDeleteDialogOpen(false);
            }}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive hover:bg-destructive/90"
              disabled={deleteConfirmText !== 'confirm'}
            >
              Delete Wallet
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}