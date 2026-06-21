// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBsYTCZ28-2LxoKcF3_MZ9dndrqAnZx_94",
  authDomain: "taskflow-todo-11418014.firebaseapp.com",
  projectId: "taskflow-todo-11418014",
  storageBucket: "taskflow-todo-11418014.firebasestorage.app",
  messagingSenderId: "1027653796489",
  appId: "1:1027653796489:web:f3e160aac713cba0e47c58"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// 匯出登入驗證 & 雲端資料庫
export const auth = getAuth(app);
export const db = getFirestore(app);