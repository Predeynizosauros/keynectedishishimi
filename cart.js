// cart.js — Shared cart logic for Keynected
(() => {
  const CART_KEY = 'keynected_cart_v1';

  const loadCart = () => JSON.parse(localStorage.getItem(CART_KEY) || '[]');
  const saveCart = (cart) => localStorage.setItem(CART_KEY, JSON.stringify(cart));

  // Toast notification (top right)
  const showToast = (msg) => {
    let toast = document.createElement('div');
    toast.className = 'toast-msg';
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 50);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 2500);
  };

  const updateCartCount = () => {
    const cart = loadCart();
    const count = cart.reduce((sum, i) => sum + i.qty, 0);
    const badge = document.getElementById('topCartCount');
    if (badge) badge.textContent = count;
  };

  const renderCartModal = () => {
    const wrap = document.getElementById('cartItemsWrap');
    const totalEl = document.getElementById('cartTotal');
    const cart = loadCart();

    if (!wrap) return;

    if (cart.length === 0) {
      wrap.innerHTML = '<p class="empty-cart">Your cart is empty 🛒</p>';
      if (totalEl) totalEl.textContent = '₱0';
      return;
    }

    let total = 0;
    wrap.innerHTML = cart
      .map((item, index) => {
        const itemTotal = item.price * item.qty;
        total += itemTotal;
        return `
        <div class="cart-item">
          <img src="${item.img}" alt="${item.name}" />
          <div class="cart-item-info">
            <h4>${item.name}</h4>
            <p>${item.color}</p>
            <p>₱${item.price} x ${item.qty}</p>
          </div>
          <button class="remove-item" data-index="${index}">×</button>
        </div>`;
      })
      .join('');

    if (totalEl) totalEl.textContent = '₱' + total.toLocaleString();

    // Wire up remove buttons
    wrap.querySelectorAll('.remove-item').forEach((btn) =>
      btn.addEventListener('click', () => {
        const index = +btn.dataset.index;
        const cart = loadCart();
        cart.splice(index, 1);
        saveCart(cart);
        renderCartModal();
        updateCartCount();
        showToast('Item removed');
      })
    );
  };

  const openCart = () => {
    const modal = document.getElementById('cartModal');
    if (!modal) return;
    renderCartModal();
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  };

  const closeCart = () => {
    const modal = document.getElementById('cartModal');
    if (!modal) return;
    modal.style.display = 'none';
    document.body.style.overflow = '';
  };

  // Public API
  window.cartAPI = {
    addItem({ id, name, price, color, qty, img }) {
      const cart = loadCart();
      const existing = cart.find((i) => i.id === id && i.color === color);
      if (existing) {
        existing.qty += qty;
      } else {
        cart.push({ id, name, price, color, qty, img });
      }
      saveCart(cart);
      updateCartCount();
      showToast(`${name} added to cart!`);
    },
    clearCart() {
      localStorage.removeItem(CART_KEY);
      updateCartCount();
      renderCartModal();
      showToast('Cart cleared.');
    },
    showToast,
  };

  // Setup listeners once DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();

    const topCartBtn = document.getElementById('topCartBtn');
    const cartModal = document.getElementById('cartModal');
    const modalClose = cartModal?.querySelector('.modal-close');

    if (topCartBtn) topCartBtn.addEventListener('click', openCart);
    if (modalClose) modalClose.addEventListener('click', closeCart);

    // Close on outside click
    cartModal?.addEventListener('click', (e) => {
      if (e.target === cartModal) closeCart();
    });
  });
})();
