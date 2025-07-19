"use client";

import { useState, useEffect, createContext, useContext } from 'react';
import { 
  signInWithPopup, 
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut 
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { createUserDocument, getUserWallets } from '@/lib/firebase-service';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        await createUserDocument(firebaseUser);
        const userWallets = await getUserWallets(firebaseUser.uid);
        setWallets(userWallets);
        setUser(firebaseUser);
      } else {
        setUser(null);
        setWallets([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signup = async (email, password) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await createUserDocument(result.user);
      return result.user;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result.user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      await createUserDocument(result.user);
      return result.user;
    } catch (error) {
      console.error('Google sign in error:', error);
      throw error;
    }
  };

  const logout = () => signOut(auth);

  const addWallet = async (walletData) => {
    if (!user) return;
    
    const newWallet = await addWallet(user.uid, walletData);
    setWallets([...wallets, newWallet]);
    return newWallet;
  };

  const deleteWallet = async (walletId) => {
    if (!user) return;
    
    await deleteWallet(user.uid, walletId);
    setWallets(wallets.filter(w => w.id !== walletId));
  };

  const value = {
    user,
    wallets,
    loading,
    signup,
    login,
    logout,
    signInWithGoogle,
    addWallet,
    deleteWallet
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};