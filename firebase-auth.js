// firebase-auth.js (FULL FIXED VERSION)
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  setPersistence,
  browserLocalPersistence,
  GoogleAuthProvider,
  signInWithCredential
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";

console.log("firebase-auth.js loaded");

// ------------------------------------
// Firebase Init
// ------------------------------------
const firebaseConfig = {
  apiKey: "AIzaSyC-ExpJfS0Gc-WEy7_6_pIz2g_WsyVsQDA",
  authDomain: "keynected-store.firebaseapp.com",
  projectId: "keynected-store",
  storageBucket: "keynected-store.firebasestorage.app",
  messagingSenderId: "1008100804573",
  appId: "1:1008100804573:web:c2e87fa8f8f28fadedd834",
  measurementId: "G-R17C0EMD2D"
};

// prevent duplicate-app error
let app;
try {
  app = initializeApp(firebaseConfig);
} catch {
  console.warn("Firebase app already exists, using existing instance.");
}

const auth = getAuth();

// ------------------------------------
// Make login persistent
// ------------------------------------
setPersistence(auth, browserLocalPersistence)
  .then(() => console.log("Persistence set: local"))
  .catch(err => console.warn("Persistence error:", err));


// ------------------------------------
// 🔥 CRITICAL — Google Credential Handler
// ------------------------------------
window.handleGoogleCredential = async function (response) {
  try {
    console.log("Google credential received");

    const idToken = response.credential;
    const credential = GoogleAuthProvider.credential(idToken);

    await signInWithCredential(auth, credential);

    console.log("Firebase login success — redirecting…");
    window.location.href = "index.html";

  } catch (err) {
    console.error("Google credential sign-in FAILED:", err);
  }
};


// ------------------------------------
// Utility: Wait for navbar elements
// ------------------------------------
function waitFor(selector, retries = 20) {
  return new Promise(resolve => {
    let count = 0;
    const timer = setInterval(() => {
      const el = document.querySelector(selector);
      if (el) {
        clearInterval(timer);
        resolve(el);
      }
      if (++count >= retries) {
        clearInterval(timer);
        resolve(null);
      }
    }, 150);
  });
}


// ------------------------------------
// Navbar UI update
// ------------------------------------
async function initAuthUI() {
  const loginBtn = await waitFor("#userInfo .login-btn");
  const userName = await waitFor("#userName");
  const userPhoto = await waitFor("#userPhoto");

  if (!loginBtn) console.warn("Navbar not found yet…");

  onAuthStateChanged(auth, user => {
    console.log("Auth state changed:", user);

    if (user) {
      // USER LOGGED IN
      if (userName) {
        userName.textContent =
          user.displayName || (user.email ? user.email.split("@")[0] : "");
      }

      if (userPhoto) {
        if (user.photoURL) {
          userPhoto.src = user.photoURL;
          userPhoto.style.display = "block";
        } else {
          userPhoto.style.display = "none";
        }
      }

      // Update login button to logout
      if (loginBtn) {
        loginBtn.textContent = "Logout";
        loginBtn.href = "#";
        loginBtn.onclick = async e => {
          e.preventDefault();
          await signOut(auth);
          window.location.reload();
        };
      }

    } else {
      // USER LOGGED OUT
      if (userName) userName.textContent = "";
      if (userPhoto) userPhoto.style.display = "none";

      if (loginBtn) {
        loginBtn.textContent = "Login / Signup";
        loginBtn.href = "login.html";
        loginBtn.onclick = null;
      }
    }
  });
}

document.addEventListener("DOMContentLoaded", initAuthUI);
