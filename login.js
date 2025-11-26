// login.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyC-ExpJfS0Gc-WEy7_6_pIz2g_WsyVsQDA",
  authDomain: "keynected-store.firebaseapp.com",
  projectId: "keynected-store",
  storageBucket: "keynected-store.firebasestorage.app",
  messagingSenderId: "1008100804573",
  appId: "1:1008100804573:web:c2e87fa8f8f28fadedd834",
  measurementId: "G-R17C0EMD2D"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Keep user logged in after redirect
setPersistence(auth, browserLocalPersistence);

document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  try {
    await signInWithEmailAndPassword(auth, email, password);

    // Small delay ensures Firebase saves session before redirect
    setTimeout(() => {
      window.location.href = "index.html";
    }, 200);

  } catch (error) {
    alert(error.message);
  }
});
