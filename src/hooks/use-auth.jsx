"use client";

import { useState, useEffect, createContext, useContext } from 'react';
import { 
  signInWithPopup, 
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  EmailAuthProvider,
  reauthenticateWithCredential
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { 
  createUserDocument, 
  addWalletToUser, 
  deleteWalletFromUser,
  subscribeToWallets 
} from '@/lib/firebase-service';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeWallets = null;

    const unsubscribeAuth = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        await createUserDocument(firebaseUser);
        setUser(firebaseUser);
        
        unsubscribeWallets = subscribeToWallets(firebaseUser.uid, (updatedWallets) => {
          setWallets(updatedWallets);
        });
      } else {
        setUser(null);
        setWallets([]);
        if (unsubscribeWallets) {
          unsubscribeWallets();
        }
      }
      setLoading(false);
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeWallets) {
        unsubscribeWallets();
      }
    };
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
    
    try {
      const newWallet = await addWalletToUser(user.uid, walletData);
      return newWallet;
    } catch (error) {
      console.error('Error adding wallet:', error);
      throw error;
    }
  };

  const deleteWallet = async (walletId) => {
    if (!user) return;
    
    try {
      await deleteWalletFromUser(user.uid, walletId);
    } catch (error) {
      console.error('Error deleting wallet:', error);
      throw error;
    }
  };

  const verifyPassword = async (password) => {
    if (!user || user.isGoogleUser) return false;
    try {
      // For Firebase users, you might want to use reauthenticateWithCredential
      const credential = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(user, credential);
      return true;
    } catch (error) {
      console.error('Password verification failed:', error);
      return false;
    }
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
    deleteWallet,
    verifyPassword
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