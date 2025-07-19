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

export async function deleteWalletFromUser(userId, walletId) {
  try {
    if (!userId || !walletId) {
      throw new Error('User ID and Wallet ID are required');
    }

    const walletRef = doc(db, 'users', userId, 'wallets', walletId);
    const walletSnap = await getDoc(walletRef);
    
    if (!walletSnap.exists()) {
      throw new Error('Wallet not found');
    }

    await deleteDoc(walletRef);
    return true;
  } catch (error) {
    console.error('Error deleting wallet:', error);
    throw error;
  }
}

export function subscribeToWallets(userId, callback) {
  if (!userId) return () => {}; // Return empty cleanup function if no userId

  const walletsRef = collection(db, 'users', userId, 'wallets');
  return onSnapshot(walletsRef, (snapshot) => {
    const wallets = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(wallets);
  }, (error) => {
    console.error('Error in wallet subscription:', error);
    callback([]); // Return empty array on error
  });
}