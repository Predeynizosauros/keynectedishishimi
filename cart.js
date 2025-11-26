import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";

// Firebase Config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_DOMAIN",
  projectId: "YOUR_PROJECT_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

let userId = null;

// Toast Utility
export function showToast(msg) {
  const t = document.createElement("div");
  t.className = "toast-msg";
  t.textContent = msg;
  document.body.appendChild(t);

  setTimeout(() => t.classList.add("show"), 10);
  setTimeout(() => {
    t.classList.remove("show");
    setTimeout(() => t.remove(), 300);
  }, 2500);
}

// Listen for Login
onAuthStateChanged(auth, (user) => {
  userId = user ? user.uid : null;
});

// ---------------------------------------------
// CART FUNCTIONS
// ---------------------------------------------

export async function addItem({ id, name, price, color, qty, img }) {
  if (!userId) return showToast("⚠️ Please log in first.");

  const ref = collection(db, "users", userId, "cart");
  const q = query(ref, where("id", "==", id), where("color", "==", color));
  const snap = await getDocs(q);

  if (!snap.empty) {
    const docRef = snap.docs[0].ref;
    const newQty = snap.docs[0].data().qty + qty;
    await updateDoc(docRef, { qty: newQty });
  } else {
    await addDoc(ref, { id, name, price, color, qty, img });
  }

  showToast("Added to cart!");
  loadCart();
}

export async function removeItem(docId) {
  if (!userId) return;
  await deleteDoc(doc(db, "users", userId, "cart", docId));
  showToast("Item removed");
  loadCart();
}

export async function clearCart() {
  if (!userId) return;
  const ref = collection(db, "users", userId, "cart");
  const snap = await getDocs(ref);
  snap.forEach(d => deleteDoc(d.ref));
  loadCart();
}

// LOAD CART
export async function loadCart() {
  if (!userId) return;

  const wrap = document.getElementById("cartItemsWrap");
  const totalLabel = document.getElementById("cartTotal");
  const ref = collection(db, "users", userId, "cart");
  const snap = await getDocs(ref);

  wrap.innerHTML = "";

  let total = 0;
  snap.forEach(d => {
    const item = d.data();
    total += item.qty * item.price;

    wrap.innerHTML += `
      <div class="cart-item">
        <img src="${item.img}">
        <div>
          <strong>${item.name}</strong><br>
          ${item.color} — ₱${item.price} × ${item.qty}
        </div>
        <button onclick="cartAPI.removeItem('${d.id}')" class="danger small">Remove</button>
      </div>
    `;
  });

  totalLabel.textContent = "₱" + total;

  // Update Cart Badge
  document.getElementById("topCartCount").textContent = snap.size;
}

window.cartAPI = {
  addItem,
  removeItem,
  clearCart,
  loadCart,
  showToast
};

// Modal Toggle
document.getElementById("topCartBtn").onclick = () => {
  document.getElementById("cartModal").style.display = "flex";
  loadCart();
};

document.querySelectorAll(".modal-close").forEach(btn => {
  btn.onclick = () => {
    btn.closest(".modal").style.display = "none";
  };
});
