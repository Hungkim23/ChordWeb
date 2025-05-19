// Cấu hình Firebase cho app hợp âm chuẩn
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCFBeZmYLhbmSLfKIwzFZqRU7CskCSSrqo",
  authDomain: "chordweb-7ad2f.firebaseapp.com",
  projectId: "chordweb-7ad2f",
  storageBucket: "chordweb-7ad2f.firebasestorage.app",
  messagingSenderId: "678857256587",
  appId: "1:678857256587:web:e167d3e905d76e60af6e8e",
  measurementId: "G-FZL1BNDBQR"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db }; 