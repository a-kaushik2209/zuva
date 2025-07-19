import { db } from './firebase';
import { 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  getDocs,
  deleteDoc,
  addDoc,
  onSnapshot 
} from 'firebase/firestore';

export async function createUserDocument(user) {
  const userRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    await setDoc(userRef, {
      email: user.email,
      createdAt: new Date().toISOString(),
      isGoogleUser: user.providerData[0].providerId === 'google.com'
    });
  }

  return userRef;
}

export async function getUserWallets(userId) {
  const walletsRef = collection(db, 'users', userId, 'wallets');
  const walletsSnap = await getDocs(walletsRef);
  
  return walletsSnap.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}

export async function addWallet(userId, walletData) {
  const walletsRef = collection(db, 'users', userId, 'wallets');
  const newWallet = {
    ...walletData,
    createdAt: new Date().toISOString()
  };
  
  const docRef = await addDoc(walletsRef, newWallet);
  return {
    id: docRef.id,
    ...newWallet
  };
}

export async function deleteWallet(userId, walletId) {
  const walletRef = doc(db, 'users', userId, 'wallets', walletId);
  await deleteDoc(walletRef);
}

export async function addWalletToUser(userId, walletData) {
  try {
    const walletsRef = collection(db, 'users', userId, 'wallets');
    const newWallet = {
      ...walletData,
      createdAt: new Date().toISOString()
    };
    
    const docRef = await addDoc(walletsRef, newWallet);
    return {
      id: docRef.id,
      ...newWallet
    };
  } catch (error) {
    console.error('Error adding wallet:', error);
    throw error;
  }
}

export function subscribeToWallets(userId, callback) {
  const walletsRef = collection(db, 'users', userId, 'wallets');
  return onSnapshot(walletsRef, (snapshot) => {
    const wallets = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(wallets);
  });
}

export async function deleteWalletFromUser(userId, walletId) {
  try {
    const walletRef = doc(db, 'users', userId, 'wallets', walletId);
    await deleteDoc(walletRef);
    return true;
  } catch (error) {
    console.error('Error deleting wallet:', error);
    throw error;
  }
}