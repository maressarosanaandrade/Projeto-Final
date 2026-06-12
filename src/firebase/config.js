import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyAMCKBBzcmJSfWBqX48j_2Bgzds8bK0MyE",
  authDomain: "meu-pet-1ff93.firebaseapp.com",
  projectId: "meu-pet-1ff93",
  storageBucket: "meu-pet-1ff93.firebasestorage.app",
  messagingSenderId: "1017013117706",
  appId: "1:1017013117706:web:ba5c3554209ebc142410f3"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { auth, db };