"use client";

import { createContext, useContext, useState, useEffect } from 'react';

const MOCK_PASS_SUFFIX = '_secret';

const createRandomHash = (length) => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
  }, []);

  const loadWallets = (userEmail) => {
    try {
      const storedWallets = localStorage.getItem(`zuva-wallets-${userEmail}`);
      if (storedWallets) {
        setWallets(JSON.parse(storedWallets));
      } else {
        setWallets([]);
      }
    } catch (error) {
      console.error(error);
      setWallets([]);
    }
  };

  const signup = (email, pass) => {
    try {
      const storedUsers = localStorage.getItem('zuva-users') || '{}';
      const users = JSON.parse(storedUsers);
      
      if (users[email]) {
        return null;
      }

      const newUser = { email };
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
        const loggedInUser = { email };
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
  
  const verifyPassword = (pass) => {
    if (!user) return false;
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

  const logout = () => {
    localStorage.removeItem('zuva-user');
    setUser(null);
    setWallets([]);
  };

  const addWallet = (wallet) => {
    if (!user) return;
    
    const newWallet = { 
        ...wallet, 
        id: `${wallet.chain}-${createRandomHash(4)}`,
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
  
  const value = { user, wallets, loading, signup, login, logout, addWallet, deleteWallet, verifyPassword };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};