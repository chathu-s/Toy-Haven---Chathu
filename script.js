
const productsData = [
  { id: 13, name: 'Luffy Adventure Figurine', category: 'Figurines', price: 39.99, image: 'figurines1.jpg' },
  { id: 14, name: 'Zoro Sword Master Figurine', category: 'Figurines', price: 44.99, image: 'figurines2.jpg' },
  { id: 15, name: 'Deadpool Collector Figurine', category: 'Figurines', price: 49.99, image: 'figurines3.jpg' },
  { id: 16, name: 'Leonardo Ninja Figurine', category: 'Figurines', price: 42.50, image: 'figurines4.jpg' },
  { id: 17, name: 'The Thing Hero Figurine', category: 'Figurines', price: 46.00, image: 'figurines5.jpg' },
  { id: 18, name: 'Naruto Ninja Figurine', category: 'Figurines', price: 37.50, image: 'figurines6.jpg' },
  { id: 19, name: 'Meliodas Collector Figurine', category: 'Figurines', price: 41.99, image: 'figurines7.jpg' },
  { id: 20, name: 'Stitch Cuddly Plush Toy', category: 'Toys', price: 24.99, image: 'toys.jpg' },
  { id: 21, name: 'Play-Doh Creative Set', category: 'Toys', price: 19.99, image: 'toys1.jpg' },
  { id: 22, name: 'LEGO Disney Stitch Set', category: 'Toys', price: 54.99, image: 'toys2.jpg' },
  { id: 23, name: 'Reversible Octopus Plushies', category: 'Toys', price: 17.50, image: 'toys3.jpg' },
  { id: 24, name: 'Blue Robot Action Toy', category: 'Toys', price: 32.99, image: 'toys4.jpg' },
  { id: 25, name: 'Remote Control Sports Car', category: 'Toys', price: 39.99, image: 'toys5.jpg' },
  { id: 26, name: 'Classic Monopoly Game', category: 'Board Games', price: 29.99, image: 'boardgames.jpg' },
  { id: 27, name: 'UNO Card Game Collection', category: 'Board Games', price: 14.99, image: 'boardgames1.jpg' },
  { id: 28, name: 'Who Is It? Guessing Game', category: 'Board Games', price: 25.99, image: 'boardgames2.jpg' },
  { id: 29, name: 'Magnetic Battle Chess', category: 'Board Games', price: 21.50, image: 'boardgames3.jpg' },
  { id: 30, name: 'Boom Boom Balloon Game', category: 'Board Games', price: 18.99, image: 'boardgames4.jpg' },
  { id: 31, name: 'Street Racer Diecast Car', category: 'Diecast Cars', price: 34.99, image: 'diecast car.jpg' },
  { id: 32, name: 'Classic Red Diecast Car', category: 'Diecast Cars', price: 29.99, image: 'diecast car1.jpg' },
  { id: 33, name: 'Blue Speedster Diecast Car', category: 'Diecast Cars', price: 32.50, image: 'diecast car2.jpg' },
  { id: 34, name: 'Yellow Rally Diecast Car', category: 'Diecast Cars', price: 36.99, image: 'diecast car3.jpg' },
  { id: 35, name: 'Silver Classic Diecast Car', category: 'Diecast Cars', price: 39.99, image: 'diecast car4.jpg' },
  { id: 36, name: 'Black Muscle Diecast Car', category: 'Diecast Cars', price: 42.50, image: 'diecast car5.jpg' }
];


function getStoredData(key, fallback = []) {
  try {
    return JSON.parse(localStorage.getItem(key)) || fallback;
  } catch (error) {
    return fallback;
  }
}

function saveStoredData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function getCart() {
  return getStoredData('toyhaven_cart');
}

function addToCart(productId) {
  const cart = getCart();
  const item = cart.find(entry => entry.id === productId);

  if (item) {
    item.qty += 1;
  } else {
    cart.push({ id: productId, qty: 1 });
  }

  saveStoredData('toyhaven_cart', cart);
  showToast('Added to cart!');
}

function updateCartQty(productId, amount) {
  let cart = getCart();
  const item = cart.find(entry => entry.id === productId);

  if (!item) return;
  item.qty += amount;
  cart = cart.filter(entry => entry.qty > 0);
  saveStoredData('toyhaven_cart', cart);
}

function removeFromCart(productId) {
  const cart = getCart().filter(item => item.id !== productId);
  saveStoredData('toyhaven_cart', cart);
  showToast('Item removed from cart.');
}

function clearCart() {
  saveStoredData('toyhaven_cart', []);
  updateCartBadge();
}

// Wishlist state and actions.
function getWishlist() {
  return getStoredData('toyhaven_wishlist');
}

function isInWishlist(productId) {
  return getWishlist().some(item => item.id === productId);
}

function toggleWishlist(productId) {
  const wishlist = getWishlist();
  const index = wishlist.findIndex(item => item.id === productId);

  if (index === -1) {
    wishlist.push({ id: productId, status: 'interested' });
    showToast('Added to wishlist!');
  } else {
    wishlist.splice(index, 1);
    showToast('Removed from wishlist.');
  }

  saveStoredData('toyhaven_wishlist', wishlist);
}

function setWishlistStatus(productId, status) {
  const wishlist = getWishlist();
  const item = wishlist.find(entry => entry.id === productId);

  if (item) {
    item.status = status;
    saveStoredData('toyhaven_wishlist', wishlist);
    showToast('Collection status updated.');
  }
}

function removeFromWishlist(productId) {
  const wishlist = getWishlist().filter(item => item.id !== productId);
  saveStoredData('toyhaven_wishlist', wishlist);
  showToast('Removed from wishlist.');
}

let currentCurrency = getStoredData('toyhaven_currency', ['LKR'])[0] || 'LKR';

const currencyRates = {
  USD: 1,
  LKR: 325
};

function convertPrice(amount, currency = currentCurrency) {
  const baseValue = amount * currencyRates.LKR;
  return currency === 'USD' ? baseValue / currencyRates.LKR : baseValue;
}

function formatCurrency(amount, currency = currentCurrency) {
  if (currency === 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  }

  return new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

function setCurrency(currency) {
  currentCurrency = currency;
  saveStoredData('toyhaven_currency', [currency]);
  const selector = document.getElementById('currency-select');
  if (selector) selector.value = currency;
  renderProducts();
  renderCart();
  renderCheckout();
  renderWishlist();
  renderOrderHistory();
}

function getCartTotals() {
  let subtotal = 0;
  getCart().forEach(item => {
    const product = productsData.find(product => product.id === item.id);
    if (product) subtotal += convertPrice(product.price, 'USD') * item.qty;
  });
  const shipping = subtotal === 0 || subtotal > 100 ? 0 : 8.99;
  return { subtotal, shipping, total: subtotal + shipping };
}

function updateCartBadge() {
  const cartCount = document.getElementById('cart-count');
  if (!cartCount) return;
  const count = getCart().reduce((total, item) => total + item.qty, 0);
  cartCount.textContent = count;
}

function showToast(message) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.style.cssText = 'position:fixed;bottom:25px;left:50%;transform:translate(-50%,20px);z-index:500;padding:12px 18px;border-radius:10px;background:#25233a;color:#fff;font:600 14px Poppins,sans-serif;opacity:0;transition:all .25s ease;box-shadow:0 10px 25px rgba(0,0,0,.2);';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.style.opacity = '1';
  toast.style.transform = 'translate(-50%, 0)';
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translate(-50%, 20px)';
  }, 2200);
}

// Page navigation: show one section at a time without reloading.
function showPage(pageId) {
  const targetPage = document.getElementById(pageId);
  if (!targetPage) return;

  document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.dataset.page === pageId);
  });

  targetPage.classList.add('active');
  window.location.hash = pageId;
  window.scrollTo({ top: 0, behavior: 'smooth' });

  const navLinks = document.querySelector('.nav-links');
  const hamburger = document.querySelector('.hamburger');
  navLinks.classList.remove('open');
  hamburger.classList.remove('open');

  if (pageId === 'products') renderProducts();
  if (pageId === 'cart') renderCart();
  if (pageId === 'wishlist') renderWishlist();
  if (pageId === 'checkout') renderCheckout();
  if (pageId === 'feedback') {
    renderOrderHistory();
    renderFeedback();
  }
  observeRevealElements();
}

// Product display and filtering.
let currentCategory = 'All';
let currentSearch = '';

function renderProducts() {
  const grid = document.getElementById('products-grid');
  if (!grid) return;

  const filteredProducts = productsData.filter(product => {
    const categoryMatch = currentCategory === 'All' || product.category === currentCategory;
    const searchMatch = product.name.toLowerCase().includes(currentSearch.toLowerCase());
    return categoryMatch && searchMatch;
  });

  if (filteredProducts.length === 0) {
    grid.innerHTML = '<p class="no-results">No products match your search.</p>';
    return;
  }

  grid.innerHTML = filteredProducts.map(product => {
    const inWishlist = isInWishlist(product.id);
    const displayPrice = convertPrice(product.price, currentCurrency);
    return `
      <article class="product-card reveal visible">
        <div class="product-image ${product.category === 'Figurines' ? 'figurine-image' : ''} ${product.category === 'Toys' ? 'toy-image' : ''} ${product.category === 'Board Games' ? 'board-game-image' : ''}">
          <img src="${product.image}" alt="${product.name}" loading="lazy">
          <button type="button" class="wishlist-btn" data-wishlist-toggle="${product.id}" aria-label="Add ${product.name} to wishlist">
            ${inWishlist ? '❤️' : '🤍'}
          </button>
        </div>
        <div class="product-info">
          <h3 class="product-name">${product.name}</h3>
          <p class="product-category">${product.category}</p>
          <p class="product-price">${formatCurrency(displayPrice, currentCurrency)}</p>
          <div class="product-actions">
            <button type="button" class="btn btn-primary" data-add-cart="${product.id}">Add to Cart</button>
            <button type="button" class="btn btn-outline" data-wishlist-toggle="${product.id}">${inWishlist ? 'In Wishlist' : 'Add to Wishlist'}</button>
          </div>
        </div>
      </article>`;
  }).join('');

  grid.querySelectorAll('[data-add-cart]').forEach(button => {
    button.addEventListener('click', () => {
      addToCart(Number(button.dataset.addCart));
      updateCartBadge();
    });
  });

  grid.querySelectorAll('[data-wishlist-toggle]').forEach(button => {
    button.addEventListener('click', () => {
      toggleWishlist(Number(button.dataset.wishlistToggle));
      renderProducts();
    });
  });
}

function renderCart() {
  const container = document.getElementById('cart-container');
  const summary = document.getElementById('cart-summary');
  const emptyMessage = document.getElementById('empty-cart-msg');
  const cart = getCart();

  if (!container) return;
  if (cart.length === 0) {
    container.innerHTML = '';
    summary.classList.add('hidden');
    emptyMessage.classList.remove('hidden');
    return;
  }

  emptyMessage.classList.add('hidden');
  summary.classList.remove('hidden');

  container.innerHTML = cart.map(item => {
    const product = productsData.find(entry => entry.id === item.id);
    if (!product) return '';
    const itemPrice = convertPrice(product.price, currentCurrency);
    const subtotal = itemPrice * item.qty;

    return `
      <article class="cart-item reveal visible">
        <div class="cart-item-image"><img src="${product.image}" alt="${product.name}"></div>
        <div class="cart-item-details">
          <h3>${product.name}</h3>
          <p class="muted">${product.category}</p>
          <p class="price-row"><span class="muted">Price:</span> ${formatCurrency(itemPrice, currentCurrency)}</p>
        </div>
        <div class="cart-item-qty">
          <button type="button" class="qty-btn" data-qty="-1" data-product-id="${product.id}" aria-label="Decrease quantity">−</button>
          <span class="qty-value">${item.qty}</span>
          <button type="button" class="qty-btn" data-qty="1" data-product-id="${product.id}" aria-label="Increase quantity">+</button>
        </div>
        <div class="cart-item-subtotal"><p class="muted">Subtotal</p><p>${formatCurrency(subtotal, currentCurrency)}</p></div>
        <button type="button" class="remove-btn" data-remove-cart="${product.id}">Remove</button>
      </article>`;
  }).join('');

  const totals = getCartTotals();
  document.getElementById('summary-subtotal').textContent = formatCurrency(convertPrice(totals.subtotal, currentCurrency), currentCurrency);
  document.getElementById('summary-shipping').textContent = totals.shipping === 0 ? 'FREE' : formatCurrency(convertPrice(totals.shipping, currentCurrency), currentCurrency);
  document.getElementById('summary-total').textContent = formatCurrency(convertPrice(totals.total, currentCurrency), currentCurrency);

  container.querySelectorAll('[data-qty]').forEach(button => {
    button.addEventListener('click', () => {
      updateCartQty(Number(button.dataset.productId), Number(button.dataset.qty));
      updateCartBadge();
      renderCart();
    });
  });

  container.querySelectorAll('[data-remove-cart]').forEach(button => {
    button.addEventListener('click', () => {
      removeFromCart(Number(button.dataset.removeCart));
      updateCartBadge();
      renderCart();
    });
  });

  updateCartBadge();
}

function renderCheckout() {
  const cart = getCart();
  const empty = document.getElementById('checkout-empty');
  const content = document.getElementById('checkout-content');
  const summaryItems = document.getElementById('order-summary-items');

  if (cart.length === 0) {
    empty.classList.remove('hidden');
    content.classList.add('hidden');
    return;
  }

  empty.classList.add('hidden');
  content.classList.remove('hidden');

  summaryItems.innerHTML = cart.map(item => {
    const product = productsData.find(entry => entry.id === item.id);
    const itemTotal = convertPrice(product.price, currentCurrency) * item.qty;
    return `<div class="order-summary-row"><div class="osr-main"><span class="osr-name">${product.name}</span><span class="osr-qty">× ${item.qty}</span></div><div class="osr-total">${formatCurrency(itemTotal, currentCurrency)}</div></div>`;
  }).join('');

  const totals = getCartTotals();
  document.getElementById('sum-subtotal').textContent = formatCurrency(convertPrice(totals.subtotal, currentCurrency), currentCurrency);
  document.getElementById('sum-shipping').textContent = totals.shipping === 0 ? 'FREE' : formatCurrency(convertPrice(totals.shipping, currentCurrency), currentCurrency);
  document.getElementById('sum-total').textContent = formatCurrency(convertPrice(totals.total, currentCurrency), currentCurrency);
}

function renderWishlist() {
  const grid = document.getElementById('wishlist-grid');
  const empty = document.getElementById('wishlist-empty');
  const wishlist = getWishlist();

  if (!grid) return;
  if (wishlist.length === 0) {
    grid.innerHTML = '';
    empty.classList.remove('hidden');
    return;
  }

  empty.classList.add('hidden');
  grid.innerHTML = wishlist.map(item => {
    const product = productsData.find(entry => entry.id === item.id);
    if (!product) return '';
    return `
      <article class="wishlist-card reveal visible">
        <div class="product-image ${product.category === 'Figurines' ? 'figurine-image' : ''} ${product.category === 'Toys' ? 'toy-image' : ''} ${product.category === 'Board Games' ? 'board-game-image' : ''}"><img src="${product.image}" alt="${product.name}"></div>
        <div class="wishlist-info">
          <h3>${product.name}</h3>
          <p class="muted">${product.category}</p>
          <p class="product-price">${formatCurrency(convertPrice(product.price, currentCurrency), currentCurrency)}</p>
          <div class="status-buttons">
            <button type="button" class="status-btn ${item.status === 'interested' ? 'active' : ''}" data-status="interested" data-product-id="${product.id}">Interested</button>
            <button type="button" class="status-btn ${item.status === 'owned' ? 'active' : ''}" data-status="owned" data-product-id="${product.id}">Owned</button>
            <button type="button" class="status-btn ${item.status === 'not-interested' ? 'active' : ''}" data-status="not-interested" data-product-id="${product.id}">Not Interested</button>
          </div>
          <div class="wishlist-actions">
            <button type="button" class="btn btn-primary" data-add-cart="${product.id}">Add to Cart</button>
            <button type="button" class="btn btn-outline" data-remove-wishlist="${product.id}">Remove</button>
          </div>
        </div>
      </article>`;
  }).join('');

  grid.querySelectorAll('[data-status]').forEach(button => {
    button.addEventListener('click', () => {
      setWishlistStatus(Number(button.dataset.productId), button.dataset.status);
      renderWishlist();
    });
  });
  grid.querySelectorAll('[data-add-cart]').forEach(button => {
    button.addEventListener('click', () => {
      addToCart(Number(button.dataset.addCart));
      updateCartBadge();
    });
  });
  grid.querySelectorAll('[data-remove-wishlist]').forEach(button => {
    button.addEventListener('click', () => {
      removeFromWishlist(Number(button.dataset.removeWishlist));
      renderWishlist();
    });
  });
}

function renderOrderHistory() {
  const list = document.getElementById('order-history-list');
  const orders = getStoredData('toyhaven_orders');
  if (!list) return;

  if (orders.length === 0) {
    list.innerHTML = '<p class="muted">No orders yet.</p>';
    return;
  }

  list.innerHTML = orders.slice().reverse().map(order => {
    const date = new Date(order.date).toLocaleString();
    const products = order.items.map(item => `${item.name} × ${item.qty}`).join(', ');
    return `
      <div class="order-history-item">
        <div class="ohi-head"><strong>${order.id}</strong><span class="muted">${date}</span></div>
        <div class="ohi-items">${products}</div>
        <div class="ohi-total">Total: ${formatCurrency(convertPrice(order.totals.total, currentCurrency), currentCurrency)} • ${order.payment === 'card' ? 'Card' : 'Cash on Delivery'}</div>
      </div>`;
  }).join('');
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  })[character]);
}

function renderFeedback() {
  const list = document.getElementById('feedback-list');
  if (!list) return;

  const feedback = getStoredData('toyhaven_feedback');
  if (feedback.length === 0) {
    list.innerHTML = '<p class="feedback-empty muted">Be the first customer to share feedback.</p>';
    return;
  }

  list.innerHTML = feedback.slice().reverse().map(entry => `
    <article class="feedback-item">
      <div class="feedback-item-head">
        <strong>${escapeHtml(entry.name)}</strong>
        <time datetime="${escapeHtml(entry.date)}">${new Date(entry.date).toLocaleString()}</time>
      </div>
      <p>${escapeHtml(entry.message)}</p>
    </article>`).join('');
}

function observeRevealElements() {
  document.querySelectorAll('.reveal:not(.visible)').forEach(element => {
    element.classList.add('visible');
  });
}

// Application startup: connect the UI to the store functions.
window.addEventListener('DOMContentLoaded', () => {
  // Restore shared page state.
  document.getElementById('year').textContent = new Date().getFullYear();
  renderFeedback();
  window.addEventListener('storage', event => {
    if (event.key === 'toyhaven_feedback') renderFeedback();
  });

  const currencySelector = document.getElementById('currency-select');
  currencySelector.value = currentCurrency;
  currencySelector.addEventListener('change', event => {
    setCurrency(event.target.value);
  });

  // Mobile navigation.
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    navLinks.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    hamburger.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      showPage(link.dataset.page);
    });
  });

  document.querySelectorAll('.nav-link-internal').forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      const target = link.getAttribute('href').replace('#', '');
      if (link.dataset.filter) {
        currentCategory = link.dataset.filter;
        document.querySelectorAll('.filter-btn').forEach(button => {
          button.classList.toggle('active', button.dataset.category === currentCategory);
        });
      }
      showPage(target);
    });
  });

  updateCartBadge();

  // Product filters and search.
  document.querySelectorAll('.filter-btn').forEach(button => {
    button.addEventListener('click', () => {
      currentCategory = button.dataset.category;
      document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      renderProducts();
    });
  });

  document.getElementById('search-input').addEventListener('input', event => {
    currentSearch = event.target.value.trim();
    renderProducts();
  });

  // Cart actions and checkout navigation.
  document.getElementById('clear-cart').addEventListener('click', () => {
    if (confirm('Clear all items from your cart?')) {
      clearCart();
      renderCart();
    }
  });
  document.getElementById('proceed-checkout').addEventListener('click', () => showPage('checkout'));

  // Newsletter subscription stored in localStorage.
  document.getElementById('newsletter-form').addEventListener('submit', event => {
    event.preventDefault();
    const input = document.getElementById('newsletter-email');
    const message = document.getElementById('newsletter-msg');
    const email = input.value.trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      message.textContent = 'Please enter a valid email address.';
      message.className = 'form-msg error';
      return;
    }

    const subscribers = getStoredData('toyhaven_newsletter');
    if (!subscribers.includes(email)) subscribers.push(email);
    saveStoredData('toyhaven_newsletter', subscribers);
    message.textContent = 'Subscribed successfully!';
    message.className = 'form-msg success';
    event.target.reset();
  });

  // Checkout validation and order history.
  document.getElementById('checkout-form').addEventListener('submit', event => {
    event.preventDefault();
    const message = document.getElementById('checkout-msg');
    const fullName = document.getElementById('full-name').value.trim();
    const email = document.getElementById('email').value.trim();
    const address = document.getElementById('address').value.trim();
    const payment = document.querySelector('input[name="payment"]:checked').value;

    if (fullName.length < 3) {
      message.textContent = 'Please enter your full name.';
      message.className = 'form-msg error';
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      message.textContent = 'Please enter a valid email address.';
      message.className = 'form-msg error';
      return;
    }
    if (address.length < 10) {
      message.textContent = 'Please enter a complete delivery address.';
      message.className = 'form-msg error';
      return;
    }

    const cart = getCart();
    if (cart.length === 0) {
      message.textContent = 'Your cart is empty.';
      message.className = 'form-msg error';
      return;
    }

    const totals = getCartTotals();
    const order = {
      id: `TH-${Date.now()}`,
      date: new Date().toISOString(),
      customer: { fullName, email, address },
      payment,
      items: cart.map(item => {
        const product = productsData.find(entry => entry.id === item.id);
        return { id: product.id, name: product.name, price: convertPrice(product.price, 'LKR'), qty: item.qty };
      }),
      totals
    };

    const orders = getStoredData('toyhaven_orders');
    orders.push(order);
    saveStoredData('toyhaven_orders', orders);
    clearCart();

    document.getElementById('success-order-id').textContent = `Order ID: ${order.id}`;
    document.getElementById('success-overlay').classList.remove('hidden');
    document.body.classList.add('no-scroll');
    event.target.reset();
  });

  // Feedback validation and persistence.
  document.getElementById('feedback-form').addEventListener('submit', event => {
    event.preventDefault();
    const messageBox = document.getElementById('feedback-msg');
    const name = document.getElementById('fb-name').value.trim();
    const email = document.getElementById('fb-email').value.trim();
    const message = document.getElementById('fb-message').value.trim();

    if (name.length < 2) {
      messageBox.textContent = 'Please enter your name.';
      messageBox.className = 'form-msg error';
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      messageBox.textContent = 'Please enter a valid email.';
      messageBox.className = 'form-msg error';
      return;
    }
    if (message.length < 5) {
      messageBox.textContent = 'Your message must have at least 5 characters.';
      messageBox.className = 'form-msg error';
      return;
    }

    const feedback = getStoredData('toyhaven_feedback');
    feedback.push({ id: `FB-${Date.now()}`, date: new Date().toISOString(), name, email, message });
    saveStoredData('toyhaven_feedback', feedback);
    renderFeedback();
    messageBox.textContent = 'Message sent! Thank you for your feedback.';
    messageBox.className = 'form-msg success';
    event.target.reset();
  });

  // FAQ accordion.
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const alreadyOpen = item.classList.contains('active');
      document.querySelectorAll('.accordion-item').forEach(entry => {
        entry.classList.remove('active');
        entry.querySelector('.accordion-header').setAttribute('aria-expanded', 'false');
      });
      if (!alreadyOpen) {
        item.classList.add('active');
        header.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // Auto-rotating home hero.
  const slides = document.querySelectorAll('.hero-slide');
  const dotsContainer = document.querySelector('.hero-dots');
  let currentSlide = 0;
  let sliderTimer;

  slides.forEach((slide, index) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = `hero-dot ${index === 0 ? 'active' : ''}`;
    dot.setAttribute('aria-label', `Go to banner ${index + 1}`);
    dot.addEventListener('click', () => goToSlide(index));
    dotsContainer.appendChild(dot);
  });

  function goToSlide(index) {
    slides[currentSlide].classList.remove('active');
    document.querySelectorAll('.hero-dot')[currentSlide].classList.remove('active');
    currentSlide = index;
    slides[currentSlide].classList.add('active');
    document.querySelectorAll('.hero-dot')[currentSlide].classList.add('active');
    clearInterval(sliderTimer);
    sliderTimer = setInterval(() => goToSlide((currentSlide + 1) % slides.length), 4500);
  }

  sliderTimer = setInterval(() => goToSlide((currentSlide + 1) % slides.length), 4500);

  // Open the page requested in the URL hash.
  const initialPage = window.location.hash.replace('#', '');
  if (initialPage && document.getElementById(initialPage)) {
    showPage(initialPage);
  } else {
    showPage('home');
  }

  // Register the service worker when the browser supports it.
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js').catch(() => {});
    });
  }
});
