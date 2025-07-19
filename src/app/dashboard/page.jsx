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
  AlertDialogDescription as AlertDialogDesc,
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

export default function DashboardPage() {
  const { user, logout, wallets, loading, verifyPassword, deleteWallet } = useAuth();
  const router = useRouter();

  const [visiblePrivateKey, setVisiblePrivateKey] = useState(null);
  const [password, setPassword] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [walletToDelete, setWalletToDelete] = useState(null);
  const [deletePassword, setDeletePassword] = useState('');

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

  const handlePasswordSubmit = () => {
    if (verifyPassword(password)) {
      setShowDetails(true);
    } else {
      toast.error("Incorrect Password", {
        description: "The password you entered is incorrect.",
      });
    }
  };

  const resetViewDialogState = () => {
    setIsViewDialogOpen(false);
    setSelectedWallet(null);
    setPassword('');
    setShowDetails(false);
    setVisiblePrivateKey(null);
  };

  const handleDeleteClick = (wallet) => {
    setWalletToDelete(wallet);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (verifyPassword(deletePassword)) {
      deleteWallet(walletToDelete.id);
      toast.success("Wallet Deleted", {
        description: `Wallet ${walletToDelete.publicKey.slice(0, 12)}... has been removed.`,
      });
      resetDeleteDialogState();
    } else {
      toast.error("Incorrect Password", {
        description: "The password you entered is incorrect.",
      });
    }
  };

  const resetDeleteDialogState = () => {
    setIsDeleteDialogOpen(false);
    setWalletToDelete(null);
    setDeletePassword('');
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

      <Dialog open={isViewDialogOpen} onOpenChange={resetViewDialogState}>
        <DialogContent className="sm:max-w-[625px] p-6">
          <div className="space-y-6">
            {!showDetails ? (
              <>
                <DialogHeader className="space-y-3">
                  <DialogTitle className="text-2xl font-headline">Verify Your Identity</DialogTitle>
                  <DialogDescription className="text-base">
                    For your security, please enter your password to view wallet details.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      className="h-11"
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handlePasswordSubmit()}
                    />
                  </div>
                  <Button 
                    onClick={handlePasswordSubmit}
                    className="w-full h-11 sm:h-12 transition-all"
                  >
                    <span className="flex items-center justify-center text-base">
                      Continue
                    </span>
                  </Button>
                </div>
              </>
            ) : (
              <>
                <DialogHeader className="space-y-3">
                  <DialogTitle className="text-2xl font-headline">Wallet Details</DialogTitle>
                  <DialogDescription className="text-base">
                    Manage your public and private keys. Keep your private key secure.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h4 className="font-semibold">Public Key</h4>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-muted-foreground font-mono break-all flex-1 p-2 bg-muted/50 rounded-md">{selectedWallet.publicKey}</p>
                      <Button variant="ghost" size="icon" onClick={() => handleCopyToClipboard(selectedWallet.publicKey, 'Public Key')}>
                        <span className="flex items-center">
                          <Copy className="h-4 w-4" />
                        </span>
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Private Key</h4>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-muted-foreground font-mono break-all flex-1 p-2 bg-muted/50 rounded-md">
                        {visiblePrivateKey === selectedWallet.id ? selectedWallet.privateKey : '••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••'}
                      </p>
                      <Button variant="ghost" size="icon" onClick={() => togglePrivateKeyVisibility(selectedWallet.id)}>
                        <span className="flex items-center">
                          {visiblePrivateKey === selectedWallet.id ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </span>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleCopyToClipboard(selectedWallet.privateKey, 'Private Key')}>
                        <span className="flex items-center">
                          <KeyRound className="h-4 w-4" />
                        </span>
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="sm:max-w-[500px] p-6">
          <div className="space-y-6">
            <AlertDialogHeader className="space-y-3">
              <AlertDialogTitle className="text-2xl font-headline text-destructive">
                Are you sure?
              </AlertDialogTitle>
              <AlertDialogDesc className="text-base">
                This action cannot be undone. This will permanently remove the wallet from your saved list. To confirm, please enter your password.
              </AlertDialogDesc>
            </AlertDialogHeader>
            <div className="space-y-2">
              <Label htmlFor="delete-password" className="text-sm font-medium">Password</Label>
              <Input
                id="delete-password"
                type="password"
                value={deletePassword}
                className="h-11"
                onChange={(e) => setDeletePassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleDeleteConfirm()}
              />
            </div>
            <AlertDialogFooter className="gap-2 sm:gap-3">
              <AlertDialogCancel 
                onClick={resetDeleteDialogState}
                className="h-11 sm:h-12 transition-all"
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDeleteConfirm} 
                className="h-11 sm:h-12 bg-destructive hover:bg-destructive/90 transition-all"
              >
                Delete Wallet
              </AlertDialogAction>
            </AlertDialogFooter>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}