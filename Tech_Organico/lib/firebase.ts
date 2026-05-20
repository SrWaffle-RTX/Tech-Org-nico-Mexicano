import { initializeApp } from 'firebase/app';
import { initializeAuth, indexedDBLocalPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyA6is2W_n-8vyMPzVJQV_Rbnpguvdnm478',
  authDomain: 'tech-organico-mexicano.firebaseapp.com',
  projectId: 'tech-organico-mexicano',
  storageBucket: 'tech-organico-mexicano.firebasestorage.app',
  messagingSenderId: '780410930704',
  appId: '1:780410930704:web:e041c7e7dbadbcf9bbac95',
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: indexedDBLocalPersistence,
});

export const db = getFirestore(app);
