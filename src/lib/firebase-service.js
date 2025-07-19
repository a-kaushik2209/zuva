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
    
    // Delete the document from Firestore
    await deleteDoc(walletRef);
    
    // Return success only after confirmed deletion
    const checkDeleted = await getDoc(walletRef);
    if (checkDeleted.exists()) {
      throw new Error('Failed to delete wallet');
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting wallet:', error);
    throw error;
  }
}

export function subscribeToWallets(userId, callback) {
  if (!userId) return () => {};

  const walletsRef = collection(db, 'users', userId, 'wallets');
  
  // Use unsubscribe to clean up the listener
  const unsubscribe = onSnapshot(
    walletsRef,
    (snapshot) => {
      // Map only existing documents
      const wallets = snapshot.docs
        .filter(doc => doc.exists())
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      callback(wallets);
    },
    (error) => {
      console.error('Error in wallet subscription:', error);
      callback([]);
    }
  );

  return unsubscribe;
}