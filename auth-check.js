// auth-check.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";

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

// ✅ Check login status
onAuthStateChanged(auth, (user) => {
  if (!user) {
    alert("You must log in to continue to checkout.");
    window.location.href = "login.html";
  } else {
    console.log("Logged in as:", user.email);

    // ✅ Show user email on page
    const userDisplay = document.getElementById('userEmailDisplay');
    if (userDisplay) {
      userDisplay.textContent = `Logged in as: ${user.email}`;
    }

    // ✅ Auto-fill the checkout email field
    const emailInput = document.getElementById('email');
    if (emailInput) {
      emailInput.value = user.email;
      emailInput.readOnly = true; // optional: prevent editing
    }
  }
});
