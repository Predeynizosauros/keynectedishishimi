import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

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

// ✅ Detect login state
onAuthStateChanged(auth, (user) => {
  const loginBtn = document.querySelector(".login-btn");
  const userName = document.getElementById("userName");
  const userPhoto = document.getElementById("userPhoto");

  if (user) {
    const name = user.displayName || "User";

    // Update UI
    loginBtn.textContent = "Logout";
    loginBtn.href = "#";
    userName.textContent = `Hi, ${name.split(" ")[0]}!`;
    if (user.photoURL) {
      userPhoto.src = user.photoURL;
      userPhoto.style.display = "inline-block";
    }

    // Logout action
    loginBtn.onclick = async () => {
      await signOut(auth);
      alert("Logged out successfully!");
      location.reload();
    };
  } else {
    // Default (no user)
    loginBtn.textContent = "Login / Signup";
    loginBtn.href = "login.html";
    userName.textContent = "";
    userPhoto.style.display = "none";
  }
});
