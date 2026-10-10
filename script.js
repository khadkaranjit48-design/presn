// --- Cafe Menu Database (KRW / ₩ Pricing) ---
const MENU_DATA = [
  {
    id: 1,
    name: "Rajesh Dai Special Espresso",
    category: "coffee",
    price: 3800,
    desc: "Single-origin Nepalese Himalayan coffee beans roasted to rich perfection.",
    image: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=600&q=80",
    badge: "Bestseller"
  },
  {
    id: 2,
    name: "Himalayan Milk Tea (Chiya)",
    category: "coffee",
    price: 4200,
    desc: "Aromatic spiced milk tea infused with cardamom, cinnamon, and fresh ginger.",
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80",
    badge: "Popular"
  },
  {
    id: 3,
    name: "Artisan Butter Bun / Bread",
    category: "bakery",
    price: 4800,
    desc: "Warm oven-baked golden bread bun stuffed with rich, soft salted butter.",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80",
    badge: "Fresh Baked"
  },
  {
    id: 4,
    name: "Fresh Sourdough Loaf",
    category: "bakery",
    price: 6500,
    desc: "Naturally fermented sourdough bread with a crispy crust and soft airy interior.",
    image: "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?auto=format&fit=crop&w=600&q=80",
    badge: "Daily"
  },
  {
    id: 5,
    name: "Steam Chicken Momo (8 Pcs)",
    category: "nepalese",
    price: 10500,
    desc: "Handcrafted Nepalese dumplings served with spicy tomato sesame chutney.",
    image: "https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?auto=format&fit=crop&w=600&q=80",
    badge: "Chef Choice"
  },
  {
    id: 6,
    name: "Special Hamal Breakfast Combo",
    category: "combos",
    price: 13500,
    desc: "Espresso coffee, fresh butter bread, organic fried egg, and chicken sausages.",
    image: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=600&q=80",
    badge: "Value Deal"
  }
];

// Shopping Cart State
let cart = [];

// DOM Element Selectors
const menuGrid = document.getElementById('menu-grid');
const menuSearch = document.getElementById('menu-search');
const filterBtns = document.querySelectorAll('.tab-btn');
const themeToggleBtn = document.getElementById('theme-toggle');
const mobileToggleBtn = document.getElementById('mobile-toggle');
const navMenu = document.getElementById('nav-menu');
const cartBtn = document.getElementById('cart-btn');
const cartCloseBtn = document.getElementById('cart-close');
const cartDrawer = document.getElementById('cart-drawer');
const cartOverlay = document.getElementById('cart-overlay');
const cartItemsContainer = document.getElementById('cart-items-container');
const cartCount = document.getElementById('cart-count');
const cartSubtotal = document.getElementById('cart-subtotal');
const cartTotal = document.getElementById('cart-total');

// --- Helper Functions ---
function formatKRW(amount) {
  return '₩' + amount.toLocaleString('en-KR');
}

// Render Menu Items
function renderMenu(items) {
  if (!menuGrid) return;
  menuGrid.innerHTML = '';
  
  if (items.length === 0) {
    menuGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted);">No items match your search.</p>`;
    return;
  }

  items.forEach(item => {
    const card = document.createElement('div');
    card.className = 'menu-card';
    card.innerHTML = `
      <div class="card-img-wrapper">
        <img src="${item.image}" alt="${item.name}">
        ${item.badge ? `<span class="badge-tag">${item.badge}</span>` : ''}
      </div>
      <div class="card-body">
        <h3 class="card-title">${item.name}</h3>
        <p class="card-desc">${item.desc}</p>
        <div class="card-footer">
          <span class="card-price">${formatKRW(item.price)}</span>
          <button class="btn-add" onclick="addToCart(${item.id})">+ Add to Order</button>
        </div>
      </div>
    `;
    menuGrid.appendChild(card);
  });
}

// Filter and Search
function filterMenu() {
  const query = menuSearch.value.toLowerCase();
  const activeTab = document.querySelector('.tab-btn.active').dataset.category;

  const filtered = MENU_DATA.filter(item => {
    const matchesCategory = (activeTab === 'all') || (item.category === activeTab);
    const matchesQuery = item.name.toLowerCase().includes(query) || item.desc.toLowerCase().includes(query);
    return matchesCategory && matchesQuery;
  });

  renderMenu(filtered);
}

// Cart Logic
function addToCart(itemId) {
  const product = MENU_DATA.find(p => p.id === itemId);
  if (!product) return;

  const existingItem = cart.find(c => c.id === itemId);
  if (existingItem) {
    existingItem.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  updateCartUI();
  openCartDrawer();
}

function addComboToCart() {
  addToCart(6); // Hamal Special Breakfast Combo ID
}

function updateCartUI() {
  cartCount.textContent = cart.reduce((acc, item) => acc + item.qty, 0);
  cartItemsContainer.innerHTML = '';

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p style="text-align: center; color: var(--text-muted); margin-top: 30px;">Your shopping cart is empty.</p>';
    cartSubtotal.textContent = '₩0';
    cartTotal.textContent = '₩0';
    return;
  }

  let subtotal = 0;

  cart.forEach(item => {
    const itemSubtotal = item.price * item.qty;
    subtotal += itemSubtotal;

    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div class="cart-item-details">
        <div class="cart-item-title">${item.name}</div>
        <div class="cart-item-price">${formatKRW(item.price)}</div>
        <div class="cart-item-qty">
          <button class="qty-btn" onclick="changeCartQty(${item.id}, -1)">-</button>
          <span>${item.qty}</span>
          <button class="qty-btn" onclick="changeCartQty(${item.id}, 1)">+</button>
        </div>
      </div>
    `;
    cartItemsContainer.appendChild(div);
  });

  const deliveryFee = 2000;
  cartSubtotal.textContent = formatKRW(subtotal);
  cartTotal.textContent = formatKRW(subtotal + deliveryFee);
}

function changeCartQty(id, delta) {
  const item = cart.find(c => c.id === id);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter(c => c.id !== id);
  }

  updateCartUI();
}

function openCartDrawer() {
  cartDrawer.classList.add('active');
  cartOverlay.classList.add('active');
}

function closeCartDrawer() {
  cartDrawer.classList.remove('active');
  cartOverlay.classList.remove('active');
}

function processCheckout() {
  if (cart.length === 0) {
    alert("Your cart is empty! Please add items before checking out.");
    return;
  }
  
  alert("Thank you for your order at Rajesh Dai Ko Cafe! Your food & coffee will be prepared shortly.");
  cart = [];
  updateCartUI();
  closeCartDrawer();
}

// Countdown Timer Simulation
function startCountdown() {
  let hours = 5, minutes = 24, seconds = 42;
  const hEl = document.getElementById('hours');
  const mEl = document.getElementById('minutes');
  const sEl = document.getElementById('seconds');

  setInterval(() => {
    if (seconds > 0) {
      seconds--;
    } else {
      seconds = 59;
      if (minutes > 0) {
        minutes--;
      } else {
        minutes = 59;
        if (hours > 0) hours--;
      }
    }

    if (hEl) hEl.textContent = String(hours).padStart(2, '0');
    if (mEl) mEl.textContent = String(minutes).padStart(2, '0');
    if (sEl) sEl.textContent = String(seconds).padStart(2, '0');
  }, 1000);
}

// --- Event Listeners ---
document.addEventListener('DOMContentLoaded', () => {
  renderMenu(MENU_DATA);
  startCountdown();

  // Category Tabs
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterMenu();
    });
  });

  // Live Search Input
  if (menuSearch) {
    menuSearch.addEventListener('input', filterMenu);
  }

  // Theme Switcher Toggle
  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.body.setAttribute('data-theme', newTheme);
    themeToggleBtn.innerHTML = newTheme === 'dark' ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
  });

  // Mobile Menu Toggle
  if (mobileToggleBtn) {
    mobileToggleBtn.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });
  }

  // Cart Open & Close
  cartBtn.addEventListener('click', openCartDrawer);
  cartCloseBtn.addEventListener('click', closeCartDrawer);
  cartOverlay.addEventListener('click', closeCartDrawer);

  // Reservation Form Handler
  const resForm = document.getElementById('res-form');
  if (resForm) {
    resForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('res-name').value;
      const date = document.getElementById('res-date').value;
      const time = document.getElementById('res-time').value;
      
      alert(`Reservation Confirmed for ${name} on ${date} at ${time}! We look forward to welcoming you at Rajesh Dai Ko Cafe.`);
      resForm.reset();
    });
  }
});

