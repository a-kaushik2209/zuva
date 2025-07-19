"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { 
  GoogleAuthProvider, 
  signInWithPopup,
  onAuthStateChanged,
  signOut 
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

const MOCK_PASS_SUFFIX = '_secret';
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Firebase Auth State Monitor
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const userData = {
          email: firebaseUser.email,
          isGoogleUser: true
        };
        setUser(userData);
        loadWallets(userData.email);
      }
    });

    // Check local storage for existing session
    try {
      const storedUser = localStorage.getItem('zuva-user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        loadWallets(parsedUser.email);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }

    return () => unsubscribe();
  }, []);

  // Wallet Management Functions
  const loadWallets = (userEmail) => {
    try {
      const storedWallets = localStorage.getItem(`zuva-wallets-${userEmail}`);
      setWallets(storedWallets ? JSON.parse(storedWallets) : []);
    } catch (error) {
      console.error(error);
      setWallets([]);
    }
  };

  // Authentication Functions
  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      // Add these options to handle popup behavior
      provider.setCustomParameters({
        prompt: 'select_account',
        popupType: 'center'
      });

      const result = await signInWithPopup(auth, provider);
      return result.user;
    } catch (error) {
      console.error('Google sign in error:', error);
      if (error.code === 'auth/popup-closed-by-user') {
        throw new Error('Sign-in cancelled');
      }
      throw error;
    }
  };

  const signup = (email, pass) => {
    try {
      const storedUsers = localStorage.getItem('zuva-users') || '{}';
      const users = JSON.parse(storedUsers);
      
      if (users[email]) return null;

      const newUser = { email, isGoogleUser: false };
      users[email] = { email, password: pass + MOCK_PASS_SUFFIX };
      
      localStorage.setItem('zuva-users', JSON.stringify(users));
      localStorage.setItem('zuva-user', JSON.stringify(newUser));
      setUser(newUser);
      setWallets([]);
      
      return newUser;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const login = (email, pass) => {
    try {
      const storedUsers = localStorage.getItem('zuva-users') || '{}';
      const users = JSON.parse(storedUsers);
      const userData = users[email];

      if (userData && userData.password === pass + MOCK_PASS_SUFFIX) {
        const loggedInUser = { email, isGoogleUser: false };
        localStorage.setItem('zuva-user', JSON.stringify(loggedInUser));
        setUser(loggedInUser);
        loadWallets(email);
        return loggedInUser;
      }
      return null;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const logout = async () => {
    try {
      const currentUser = user;
      if (currentUser?.isGoogleUser) {
        await signOut(auth);
      }
      localStorage.removeItem('zuva-user');
      setUser(null);
      setWallets([]);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  // Wallet Functions
  const addWallet = (wallet) => {
    if (!user) return;
    
    const newWallet = { 
      ...wallet, 
      id: `${wallet.chain}-${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date().toISOString() 
    };
    const updatedWallets = [...wallets, newWallet];

    try {
      localStorage.setItem(`zuva-wallets-${user.email}`, JSON.stringify(updatedWallets));
      setWallets(updatedWallets);
    } catch (error) {
      console.error(error);
    }
  };
  
  const deleteWallet = (walletId) => {
    if (!user) return;
    
    const updatedWallets = wallets.filter(w => w.id !== walletId);
    
    try {
      localStorage.setItem(`zuva-wallets-${user.email}`, JSON.stringify(updatedWallets));
      setWallets(updatedWallets);
    } catch (error) {
      console.error(error);
    }
  };

  const verifyPassword = (pass) => {
    if (!user || user.isGoogleUser) return false;
    try {
      const storedUsers = localStorage.getItem('zuva-users') || '{}';
      const users = JSON.parse(storedUsers);
      const userData = users[user.email];
      return userData && userData.password === pass + MOCK_PASS_SUFFIX;
    } catch (error) {
      console.error(error);
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