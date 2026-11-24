
const products = [
  {
    id: 1,
    name: "Air Jordan 1 Retro High",
    category: "Jordan 1",
    price: 180,
    tag: "BEST SELLER",
    image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800"
  },
  {
    id: 2,
    name: "Air Jordan 4 Retro",
    category: "Jordan 4",
    price: 210,
    tag: "NEW",
    image: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800"
  },
  {
    id: 3,
    name: "Air Jordan 3 Classic",
    category: "Jordan 3",
    price: 195,
    tag: "POPULAR",
    image: "https://images.unsplash.com/photo-1495555961986-6d4c1ecb7be3?w=800"
  },
  {
    id: 4,
    name: "Air Jordan 1 Low",
    category: "Jordan 1",
    price: 130,
    tag: "CLASSIC",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800"
  },
  {
    id: 5,
    name: "Air Jordan 4 Black",
    category: "Jordan 4",
    price: 220,
    tag: "LIMITED",
    image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800"
  },
  {
    id: 6,
    name: "Air Jordan 3 White",
    category: "Jordan 3",
    price: 190,
    tag: "TRENDING",
    image: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800"
  }
];

let selectedCategory = "all";
let cart = JSON.parse(localStorage.getItem("jordanCart")) || [];
let isLogin = false;

const productGrid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const cartCount = document.getElementById("cartCount");

// Display products
function renderProducts() {
  const search = searchInput.value.toLowerCase();

  const filtered = products.filter(product => {
    const matchesCategory =
      selectedCategory === "all" ||
      product.category === selectedCategory;

    const matchesSearch =
      product.name.toLowerCase().includes(search) ||
      product.category.toLowerCase().includes(search);

    return matchesCategory && matchesSearch;
  });

  if (filtered.length === 0) {
    productGrid.innerHTML =
      '<p class="empty-state">No sneakers found.</p>';
    return;
  }

  productGrid.innerHTML = filtered.map(product => `
    <article class="product-card">
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
        <span class="product-tag">${product.tag}</span>
      </div>
      <div class="product-info">
        <p class="product-category">${product.category}</p>
        <h3>${product.name}</h3>
        <div class="product-bottom">
          <span class="product-price">$${product.price}</span>
          <button class="add-btn" data-id="${product.id}">
            ADD TO BAG +
          </button>
        </div>
      </div>
    </article>
  `).join("");
}

// Category filters
document.querySelectorAll(".filter").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach(item =>
      item.classList.remove("active")
    );

    button.classList.add("active");
    selectedCategory = button.dataset.category;
    renderProducts();
  });
});

searchInput.addEventListener("input", renderProducts);

// Cart functions
function saveCart() {
  localStorage.setItem("jordanCart", JSON.stringify(cart));
  renderCart();
}

function addToCart(id) {
  const product = products.find(item => item.id === Number(id));
  if (!product) return;

  const existing = cart.find(item => item.id === product.id);

  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  saveCart();
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== Number(id));
  saveCart();
}

function renderCart() {
  const totalItems = cart.reduce(
    (sum, item) => sum + item.quantity, 0
  );

  cartCount.textContent = totalItems;

  const cartItems = document.getElementById("cartItems");

  if (cart.length === 0) {
    cartItems.innerHTML =
      '<p class="empty-state">Your bag is empty.</p>';
  } else {
    cartItems.innerHTML = cart.map(item => `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}">
        <div>
          <h3>${item.name}</h3>
          <p>$${item.price} × ${item.quantity}</p>
          <button class="remove-btn" data-remove="${item.id}">
            REMOVE
          </button>
        </div>
      </div>
    `).join("");
  }

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity, 0
  );

  document.getElementById("cartTotal").textContent =
    "$" + total.toFixed(2);
}

// Event delegation
productGrid.addEventListener("click", event => {
  const button = event.target.closest("[data-id]");
  if (button) addToCart(button.dataset.id);
});

document.getElementById("cartItems").addEventListener("click", event => {
  const button = event.target.closest("[data-remove]");
  if (button) removeFromCart(button.dataset.remove);
});

// Cart panel
const cartOverlay = document.getElementById("cartOverlay");

document.getElementById("cartBtn").addEventListener("click", () => {
  cartOverlay.classList.add("show");
});

document.getElementById("closeCart").addEventListener("click", () => {
  cartOverlay.classList.remove("show");
});

cartOverlay.addEventListener("click", event => {
  if (event.target === cartOverlay) {
    cartOverlay.classList.remove("show");
  }
});

document.getElementById("checkoutBtn").addEventListener("click", () => {
  alert("Checkout is not connected yet. Online ordering will be added later.");
});

// Mobile menu
document.getElementById("menuBtn").addEventListener("click", () => {
  document.querySelector(".nav-links").classList.toggle("open");
});

document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", () => {
    document.querySelector(".nav-links").classList.remove("open");
  });
});

// Account modal
const accountModal = document.getElementById("accountModal");

document.getElementById("accountBtn").addEventListener("click", () => {
  accountModal.classList.add("show");
});

document.getElementById("closeAccount").addEventListener("click", () => {
  accountModal.classList.remove("show");
});

accountModal.addEventListener("click", event => {
  if (event.target === accountModal) {
    accountModal.classList.remove("show");
  }
});

document.getElementById("switchMode").addEventListener("click", () => {
  isLogin = !isLogin;

  document.getElementById("formTitle").textContent =
    isLogin ? "WELCOME BACK" : "CREATE ACCOUNT";

  document.getElementById("formSubmit").textContent =
    isLogin ? "LOGIN" : "CREATE ACCOUNT";

  document.getElementById("accountName").style.display =
    isLogin ? "none" : "block";

  document.getElementById("switchText").textContent =
    isLogin ? "New here?" : "Already have an account?";

  document.getElementById("switchMode").textContent =
    isLogin ? "Create account" : "Login";

  document.getElementById("formMessage").textContent = "";
});

document.getElementById("accountForm").addEventListener("submit", event => {
  event.preventDefault();

  document.getElementById("formMessage").textContent =
    "This is a demo form. Real account registration will be connected with Supabase.";
});

// Initial rendering
renderProducts();
renderCart();
