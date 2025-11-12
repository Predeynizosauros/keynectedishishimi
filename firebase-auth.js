// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// ✅ Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyC-ExpJfS0Gc-WEy7_6_pIz2g_WsyVsQDA",
  authDomain: "keynected-store.firebaseapp.com",
  projectId: "keynected-store",
  storageBucket: "keynected-store.firebasestorage.app",
  messagingSenderId: "1008100804573",
  appId: "1:1008100804573:web:c2e87fa8f8f28fadedd834",
  measurementId: "G-R17C0EMD2D"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ✅ Listen for login state changes
onAuthStateChanged(auth, (user) => {
  const loginBtn = document.querySelector(".login-btn");

  if (user) {
    // If user is logged in — show their name & logout
    loginBtn.textContent = `Logout (${user.displayName || "User"})`;
    loginBtn.href = "#";
    loginBtn.onclick = async () => {
      await signOut(auth);
      alert("Logged out successfully!");
      location.reload();
    };
  } else {
    // If no user — show normal login/signup link
    loginBtn.textContent = "Login / Signup";
    loginBtn.href = "login.html";
  }
});
