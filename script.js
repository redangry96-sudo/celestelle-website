
/* =========================================
   CELESTELLE JEWELLERY
   Vanilla JavaScript Storefront
========================================= */


/* CONFIGURATION */

const CONTACT_EMAIL = "";
// Add your real customer support email here.

const CURRENCY = "Rs.";


/* =========================================
   PRODUCT DATABASE
========================================= */

const products = [

    {
        id: "necklace-01",
        name: "Pearl Heritage Necklace",
        category: "Necklaces",
        price: 4750,
        tag: "Bestseller",
        description: "An elegant pearl-inspired necklace for special occasions.",
        details: "A timeless statement piece designed to bring a soft and elegant finish to your look.",
        image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=85"
    },

    {
        id: "earrings-01",
        name: "Blush Bloom Earrings",
        category: "Earrings",
        price: 2850,
        tag: "New Arrival",
        description: "Beautiful floral earrings with a delicate finish.",
        details: "A romantic pair for celebrations, dinners and thoughtful gifting.",
        image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&q=85"
    },

    {
        id: "ring-01",
        name: "Elegant Solitaire Ring",
        category: "Rings",
        price: 3450,
        tag: "Bestseller",
        description: "A timeless ring for your everyday collection.",
        details: "Clean lines and a classic solitaire-inspired design make this ring easy to wear.",
        image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=85"
    },

    {
        id: "bracelet-01",
        name: "Classic Diamond Bracelet",
        category: "Bracelets",
        price: 3950,
        tag: "Popular",
        description: "A refined finishing touch for every occasion.",
        details: "An elegant bracelet designed to complement your personal jewellery collection.",
        image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=900&q=85"
    },

    {
        id: "pendant-01",
        name: "Petal Drop Pendant",
        category: "Pendants",
        price: 2250,
        tag: "",
        description: "A graceful pendant with beautiful little details.",
        details: "An easy-to-style pendant that brings a soft accent to everyday outfits.",
        image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=900&q=85"
    },

    {
        id: "necklace-02",
        name: "Rose Gold Chain",
        category: "Necklaces",
        price: 3150,
        tag: "New",
        description: "A minimal chain made for effortless layering.",
        details: "A simple and versatile chain for layering or wearing alone.",
        image: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=900&q=85"
    },

    {
        id: "earrings-02",
        name: "Everyday Pearl Hoops",
        category: "Earrings",
        price: 1950,
        tag: "",
        description: "A little glow for everyday moments.",
        details: "A classic hoop-inspired design with a soft pearl finish.",
        image: "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=900&q=85"
    },

    {
        id: "ring-02",
        name: "Twilight Stack Ring",
        category: "Rings",
        price: 2650,
        tag: "",
        description: "A delicate ring to wear alone or stack.",
        details: "Designed to complement your personal collection and everyday style.",
        image: "https://images.unsplash.com/photo-1603561596112-0a132b757442?auto=format&fit=crop&w=900&q=85"
    }

];


/* =========================================
   CATEGORIES
========================================= */

const categories = [
    "Necklaces",
    "Earrings",
    "Rings",
    "Bracelets",
    "Pendants"
];


/* =========================================
   DOM ELEMENTS
========================================= */

const app = document.querySelector("#app");

const cartDrawer = document.querySelector("#cartDrawer");
const cartItems = document.querySelector("#cartItems");
const cartFooter = document.querySelector("#cartFooter");
const overlay = document.querySelector("#overlay");

const searchModal = document.querySelector("#searchModal");
const searchInput = document.querySelector("#searchInput");
const searchResults = document.querySelector("#searchResults");

const toast = document.querySelector("#toast");



/* =========================================
   APPLICATION STATE
========================================= */

let activeCategory = "All";
let sortMode = "featured";

let detailQuantity = 1;

let cart = loadStorage("celestelleCart", []);
let wishlist = loadStorage("celestelleWishlist", []);


/* =========================================
   STORAGE
========================================= */

function loadStorage(key, fallback) {

    try {

        const data = localStorage.getItem(key);

        return data ? JSON.parse(data) : fallback;

    } catch (error) {

        console.error("Storage error:", error);

        return fallback;

    }

}


function saveStorage() {

    localStorage.setItem(
        "celestelleCart",
        JSON.stringify(cart)
    );

    localStorage.setItem(
        "celestelleWishlist",
        JSON.stringify(wishlist)
    );

    updateCartCount();

}


/* =========================================
   HELPERS
========================================= */

function formatPrice(price) {

    return `${CURRENCY} ${price.toLocaleString("en-PK")}`;

}


function escapeHTML(value) {

    return String(value).replace(/[&<>"']/g, char => {

        const entities = {

            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"

        };

        return entities[char];

    });

}


function showToast(message) {

    toast.textContent = message;

    toast.classList.add("show");

    clearTimeout(showToast.timer);

    showToast.timer = setTimeout(() => {

        toast.classList.remove("show");

    }, 2300);

}


function getProduct(id) {

    return products.find(product => product.id === id);

}


/* =========================================
   CART COUNT
========================================= */

function updateCartCount() {

    const total = cart.reduce(
        (sum, item) => sum + item.quantity,
        0
    );

    document.querySelector("#cartCount").textContent = total;

}



/* =========================================
   PRODUCT CARD COMPONENT
========================================= */

function productCard(product) {

    const isSaved = wishlist.includes(product.id);

    return `

    <article class="product-card">

      <div class="product-image">

        <a href="#product/${product.id}">

          <img
            src="${product.image}"
            alt="${escapeHTML(product.name)}"
            loading="lazy"
          >

        </a>

        ${product.tag
            ? `<span class="product-tag">${escapeHTML(product.tag)}</span>`
            : ""
        }

        <button
          class="wishlist-btn ${isSaved ? "active" : ""}"
          data-wishlist="${product.id}"
          aria-label="Toggle wishlist"
        >
          ${isSaved ? "♥" : "♡"}
        </button>

        <button
          class="quick-add"
          data-add="${product.id}"
        >
          ADD TO BAG +
        </button>

      </div>


      <div class="product-info">

        <h3>
          <a href="#product/${product.id}">
            ${escapeHTML(product.name)}
          </a>
        </h3>

        <p>${escapeHTML(product.description)}</p>

        <div class="product-meta">

          <span class="product-price">
            ${formatPrice(product.price)}
          </span>

          <span class="product-category">
            ${escapeHTML(product.category)}
          </span>

        </div>

        <div class="stars">★★★★★</div>

      </div>

    </article>

  `;

}



/* =========================================
   HOME PAGE
========================================= */

function homePage() {

    return `

    <!-- HERO -->

    <section class="hero">

      <div class="hero-content">

        <span class="eyebrow">
          CRAFTED TO CELEBRATE YOU
        </span>

        <h1>
          Timeless Elegance.
          <em>Forever You.</em>
        </h1>

        <p>
          Discover exquisite jewellery that brings
          beautiful traditions together with modern
          elegance. Find the perfect piece for every
          special moment.
        </p>

        <a href="#collections" class="primary-btn">
          EXPLORE COLLECTIONS →
        </a>

        <div class="hero-features">
          <span>✧ Carefully Selected</span>
          <span>♡ Beautiful Details</span>
          <span>◇ Customer Care</span>
        </div>

      </div>


      <div class="hero-image">

        <div class="hero-image-note">

          <span>THE CELESTELLE EDIT</span>

          <strong>Made to make you shine.</strong>

        </div>

      </div>

    </section>



    <!-- BENEFITS -->

    <section class="benefits">

      <div class="benefit">

        <span>◇</span>

        <div>
          <strong>Thoughtful Details</strong>
          <small>Pieces selected with care</small>
        </div>

      </div>


      <div class="benefit">

        <span>♡</span>

        <div>
          <strong>Beautiful Collections</strong>
          <small>Styles for every occasion</small>
        </div>

      </div>


      <div class="benefit">

        <span>✧</span>

        <div>
          <strong>Customer Support</strong>
          <small>Here to help you</small>
        </div>

      </div>

    </section>



    <!-- CATEGORIES -->

    <section class="section">

      <div class="section-heading">

        <span class="eyebrow">
          EXPLORE OUR WORLD
        </span>

        <h2>Find Your Perfect Piece</h2>

        <p>
          Discover jewellery that matches
          your personality.
        </p>

      </div>


      <div class="category-grid">

        ${categories.map((category, index) => {

        const images = [

            "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=85",

            "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&q=85",

            "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=85",

            "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&q=85",

            "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=600&q=85"

        ];

        return `

            <a
              href="#collections?category=${encodeURIComponent(category)}"
              class="category-card"
            >

              <img
                src="${images[index]}"
                alt="${category}"
                loading="lazy"
              >

              <h3>${category}</h3>

              <span>Explore More →</span>

            </a>

          `;

    }).join("")}

      </div>

    </section>



    <!-- FEATURED PRODUCTS -->

    <section class="section featured-section">

      <div class="section-top">

        <div class="section-heading left-heading">

          <span class="eyebrow">
            OUR BESTSELLERS
          </span>

          <h2>Handpicked For You</h2>

          <p>
            Discover the pieces everyone loves.
          </p>

        </div>

        <a href="#collections" class="text-link">
          VIEW ALL PRODUCTS →
        </a>

      </div>


      <div class="product-grid">

        ${products.slice(0, 4).map(productCard).join("")}

      </div>

    </section>



    <!-- BRAND PROMOTION -->

    <section class="promo-banner">

      <div class="promo-image"></div>

      <div class="promo-content">

        <span class="eyebrow">
          A LITTLE SOMETHING SPECIAL
        </span>

        <h2>
          Beauty Is In
          <em>Every Detail.</em>
        </h2>

        <p>
          Jewellery is more than an accessory.
          It is a beautiful way to express your style,
          celebrate your story and create memories.
        </p>

        <a href="#about" class="primary-btn">
          DISCOVER OUR STORY →
        </a>

      </div>

    </section>



    <!-- TRUST -->

    <section class="section">

      <div class="section-heading">

        <span class="eyebrow">
          THE CELESTELLE PROMISE
        </span>

        <h2>A Little More To Love</h2>

      </div>


      <div class="trust-grid">

        <div class="trust-card">

          <span>✧</span>

          <h3>Curated With Care</h3>

          <p>
            Explore carefully selected jewellery
            with beautiful details.
          </p>

        </div>


        <div class="trust-card">

          <span>♡</span>

          <h3>Perfect For Gifting</h3>

          <p>
            Find thoughtful gifts for birthdays,
            celebrations and special moments.
          </p>

        </div>


        <div class="trust-card">

          <span>◇</span>

          <h3>Customer Support</h3>

          <p>
            Our team is here to assist you
            with your shopping questions.
          </p>

        </div>

      </div>

    </section>

  `;

}



/* =========================================
   COLLECTION PAGE
========================================= */

function collectionsPage() {

    const params = new URLSearchParams(
        location.hash.split("?")[1] || ""
    );

    activeCategory = params.get("category") || "All";

    const filterOptions = ["All", ...categories];

    return `

    <section class="page-banner">

      <span class="eyebrow">
        THE CELESTELLE EDIT
      </span>

      <h1>Our Collections</h1>

      <p>
        Find the piece that feels like you.
      </p>

    </section>


    <section class="section">

      <div class="collection-toolbar">

        <div class="filter-list">

          ${filterOptions.map(category => `

            <button
              class="filter-btn ${activeCategory === category ? "active" : ""}"
              data-filter="${category}"
            >

              ${category}

            </button>

          `).join("")}

        </div>


        <label class="sort-control">

          Sort By

          <select id="sortProducts">

            <option value="featured">Featured</option>

            <option value="low">Price: Low to High</option>

            <option value="high">Price: High to Low</option>

            <option value="name">Name</option>

          </select>

        </label>

      </div>


      <p class="results-count" id="resultsCount"></p>


      <div class="product-grid" id="collectionGrid">

      </div>

    </section>

  `;

}



function renderCollectionProducts() {

    const grid = document.querySelector("#collectionGrid");

    if (!grid) return;


    let filtered = [...products];


    if (activeCategory !== "All") {

        filtered = filtered.filter(product => {

            return product.category === activeCategory;

        });

    }


    if (sortMode === "low") {

        filtered.sort((a, b) => a.price - b.price);

    }


    if (sortMode === "high") {

        filtered.sort((a, b) => b.price - a.price);

    }


    if (sortMode === "name") {

        filtered.sort((a, b) => a.name.localeCompare(b.name));

    }


    document.querySelector("#resultsCount").textContent =
        `${filtered.length} products found`;


    grid.innerHTML = filtered.length

        ? filtered.map(productCard).join("")

        : `

      <div class="empty-state">

        <h2>No Products Found</h2>

        <p>Try selecting another category.</p>

      </div>

    `;

}



/* =========================================
   PRODUCT DETAIL PAGE
========================================= */

function productDetailPage(id) {

    const product = getProduct(id);


    if (!product) {

        return `

      <section class="section empty-state">

        <h2>Product Not Found</h2>

        <a href="#collections" class="primary-btn">
          BACK TO COLLECTIONS
        </a>

      </section>

    `;

    }


    detailQuantity = 1;


    const saved = wishlist.includes(product.id);


    return `

    <section class="section">

      <div class="breadcrumb">

        <a href="#home">Home</a>
        /
        <a href="#collections">Collections</a>
        /
        ${escapeHTML(product.name)}

      </div>


      <div class="product-detail">


        <div class="detail-image">

          <img
            src="${product.image}"
            alt="${escapeHTML(product.name)}"
          >

        </div>


        <div class="detail-info">

          <span class="eyebrow">
            ${escapeHTML(product.category)}
          </span>


          <h1>
            ${escapeHTML(product.name)}
          </h1>


          <div class="stars">
            ★★★★★
          </div>


          <div class="detail-price">
            ${formatPrice(product.price)}
          </div>


          <p class="detail-description">
            ${escapeHTML(product.details)}
          </p>


          <div class="quantity-row">

            <div class="quantity-control">

              <button id="quantityMinus">−</button>

              <span id="detailQuantity">1</span>

              <button id="quantityPlus">+</button>

            </div>


            <button
              class="primary-btn add-detail"
              data-add="${product.id}"
              id="detailAdd"
            >

              ADD TO BAG →

            </button>

          </div>


          <button
            class="detail-wishlist"
            data-wishlist="${product.id}"
          >

            ${saved ? "♥ SAVED TO WISHLIST" : "♡ ADD TO WISHLIST"}

          </button>


          <div class="detail-extra">

            <strong>Product Information</strong>

            <p>
              Please confirm product specifications
              and availability before ordering.
            </p>

            <strong>Need Help?</strong>

            <p>
              <a href="#contact">Contact Celestelle Customer Care →</a>
            </p>

          </div>

        </div>

      </div>

    </section>


    <section class="section featured-section">

      <div class="section-heading">

        <span class="eyebrow">
          MORE TO LOVE
        </span>

        <h2>You May Also Like</h2>

      </div>


      <div class="product-grid">

        ${products
            .filter(item => item.id !== product.id)
            .slice(0, 4)
            .map(productCard)
            .join("")}

      </div>

    </section>

  `;

}



/* =========================================
   ABOUT PAGE
========================================= */

function aboutPage() {

    return `

    <section class="page-banner">

      <span class="eyebrow">OUR STORY</span>

      <h1>Made For Your Moments</h1>

      <p>
        Jewellery that celebrates the beauty of being you.
      </p>

    </section>


    <section class="section">

      <div class="about-layout">

        <img
          src="https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=1200&q=85"
          alt="Celestelle jewellery collection"
        >


        <div class="about-content">

          <span class="eyebrow">
            THE HEART OF CELESTELLE
          </span>

          <h2>
            Every Piece Holds A Feeling.
          </h2>

          <p>
            Celestelle was imagined for those little
            moments when you want to feel a little
            more like yourself.
          </p>

          <p>
            From delicate everyday details to pieces
            that make an occasion memorable, our
            collections are chosen to bring beauty
            into your day.
          </p>

          <p>
            We believe jewellery is a personal expression
            of style, confidence and memories.
          </p>

          <a href="#collections" class="primary-btn">
            EXPLORE OUR COLLECTION →
          </a>

        </div>

      </div>

    </section>


    <section class="quote-section">

      <span class="eyebrow" style="color:#efbfd0">
        OUR PHILOSOPHY
      </span>

      <blockquote>
        "The most beautiful details are the ones
        that make you feel like yourself."
      </blockquote>

    </section>


    <section class="section">

      <div class="trust-grid">

        <div class="trust-card">
          <span>✧</span>
          <h3>Timeless Details</h3>
          <p>Styles selected to feel special beyond a single season.</p>
        </div>

        <div class="trust-card">
          <span>♡</span>
          <h3>Personal Expression</h3>
          <p>Pieces that let your own style and story take the lead.</p>
        </div>

        <div class="trust-card">
          <span>◇</span>
          <h3>Little Celebrations</h3>
          <p>Jewellery for milestones, everyday joys and everything between.</p>
        </div>

      </div>

    </section>

  `;

}



/* =========================================
   CONTACT PAGE
========================================= */

function contactPage() {

    return `

    <section class="page-banner">

      <span class="eyebrow">
        WE WOULD LOVE TO HEAR FROM YOU
      </span>

      <h1>Let's Connect</h1>

      <p>
        Questions, feedback or jewellery advice?
        Send us a message.
      </p>

    </section>


    <section class="section">

      <div class="contact-layout">


        <div class="contact-copy">

          <span class="eyebrow">
            GET IN TOUCH
          </span>

          <h2>
            Here For The Little Details.
          </h2>

          <p>
            Have a question about a piece or need
            help choosing a gift? Get in touch
            with the Celestelle team.
          </p>


          <div class="contact-detail">

            <strong>Email</strong>

            <span>
              ${CONTACT_EMAIL || "Add your business email in script.js"}
            </span>

          </div>


          <div class="contact-detail">

            <strong>Social Media</strong>

            <span>
              Add your official Instagram and TikTok links.
            </span>

          </div>


          <div class="contact-detail">

            <strong>Customer Support</strong>

            <span>
              We are here to help with your questions.
            </span>

          </div>

        </div>



        <form id="contactForm" class="contact-form">

          <label for="contactName">
            Your Name

            <input
              type="text"
              id="contactName"
              name="name"
              placeholder="Your name"
              required
            >

          </label>


          <label for="contactEmail">
            Email Address

            <input
              type="email"
              id="contactEmail"
              name="email"
              placeholder="you@example.com"
              required
            >

          </label>


          <label for="contactSubject">
            Subject

            <input
              type="text"
              id="contactSubject"
              name="subject"
              placeholder="How can we help?"
              required
            >

          </label>


          <label for="contactMessage">
            Message

            <textarea
              id="contactMessage"
              name="message"
              placeholder="Write your message..."
              required
            ></textarea>

          </label>


          <button class="primary-btn" type="submit">
            PREPARE MESSAGE →
          </button>


          <small id="contactHelp">
            Configure your business email in script.js
            before enabling this form.
          </small>

        </form>


      </div>

    </section>

  `;

}



/* =========================================
   WISHLIST PAGE
========================================= */

function wishlistPage() {

    const savedProducts = products.filter(product => {

        return wishlist.includes(product.id);

    });


    return `

    <section class="page-banner">

      <span class="eyebrow">
        YOUR SAVED PIECES
      </span>

      <h1>Your Wishlist</h1>

      <p>
        Keep the pieces you love close.
      </p>

    </section>


    <section class="section">

      <div class="product-grid">

        ${savedProducts.length

            ? savedProducts.map(productCard).join("")

            : `

              <div class="empty-state">

                <h2>Your Wishlist Is Empty</h2>

                <p>
                  Tap the heart icon on any product
                  to save it here.
                </p>

                <a class="primary-btn" href="#collections">
                  EXPLORE COLLECTIONS →
                </a>

              </div>

            `

        }

      </div>

    </section>

  `;

}



/* =========================================
   ROUTER
========================================= */

function renderPage() {

    const hash = location.hash.slice(1) || "home";

    const path = hash.split("?")[0];


    if (path === "home") {

        app.innerHTML = homePage();

    }

    else if (path === "collections") {

        app.innerHTML = collectionsPage();

        renderCollectionProducts();

    }

    else if (path === "about") {

        app.innerHTML = aboutPage();

    }

    else if (path === "contact") {

        app.innerHTML = contactPage();

    }

    else if (path === "wishlist") {

        app.innerHTML = wishlistPage();

    }

    else if (path.startsWith("product/")) {

        const id = path.split("/")[1];

        app.innerHTML = productDetailPage(id);

    }

    else {

        app.innerHTML = homePage();

    }


    const activePage =

        path.startsWith("product/") || path === "wishlist"

            ? "collections"

            : path;


    document.querySelectorAll(".navbar nav a").forEach(link => {

        const linkPage = link.getAttribute("href").split("?")[0].slice(1);

        link.classList.toggle(
            "active",
            linkPage === activePage
        );

    });


    document.querySelector("#mainNav").classList.remove("open");

    updateCartCount();

}



/* =========================================
   ADD TO CART
========================================= */

function addToCart(id, quantity = 1) {

    const product = getProduct(id);

    if (!product) return;


    const existingItem = cart.find(item => item.id === id);


    if (existingItem) {

        existingItem.quantity += quantity;

    }

    else {

        cart.push({

            id: id,
            quantity: quantity

        });

    }


    saveStorage();

    showToast(`${product.name} added to your bag!`);

}



/* =========================================
   WISHLIST
========================================= */

function toggleWishlist(id) {

    const product = getProduct(id);

    if (!product) return;


    if (wishlist.includes(id)) {

        wishlist = wishlist.filter(item => item !== id);

        showToast("Removed from wishlist");

    }

    else {

        wishlist.push(id);

        showToast("Added to wishlist");

    }


    saveStorage();


    const currentPage = location.hash.split("?")[0].slice(1);


    if (
        currentPage === "wishlist" ||
        currentPage.startsWith("product/")
    ) {

        renderPage();

    }

    else {

        const saved = wishlist.includes(id);

        document.querySelectorAll(`[data-wishlist="${id}"]`).forEach(button => {

            button.classList.toggle("active", saved);

            if (button.classList.contains("detail-wishlist")) {

                button.textContent = saved
                    ? "♥ SAVED TO WISHLIST"
                    : "♡ ADD TO WISHLIST";

            }

            else {

                button.textContent = saved ? "♥" : "♡";

            }

        });

    }

}



/* =========================================
   OPEN CART
========================================= */

function openCart() {

    renderCart();

    cartDrawer.classList.add("active");

    overlay.classList.add("active");

    document.body.classList.add("no-scroll");

}


function closeCart() {

    cartDrawer.classList.remove("active");

    overlay.classList.remove("active");

    document.body.classList.remove("no-scroll");

}



/* =========================================
   RENDER CART
========================================= */

function renderCart() {


    if (cart.length === 0) {

        cartItems.innerHTML = `

      <div class="empty-state">

        <h2>Your Bag Is Empty</h2>

        <p>
          There is room for something beautiful.
        </p>

        <a href="#collections" class="primary-btn" id="continueShopping">
          EXPLORE COLLECTIONS →
        </a>

      </div>

    `;

        cartFooter.innerHTML = "";

        return;

    }



    cartItems.innerHTML = cart.map(item => {

        const product = getProduct(item.id);

        if (!product) return "";


        return `

      <div class="cart-item">

        <img
          src="${product.image}"
          alt="${escapeHTML(product.name)}"
        >


        <div>

          <h3>
            ${escapeHTML(product.name)}
          </h3>

          <p>
            ${formatPrice(product.price)}
          </p>


          <div class="cart-quantity">

            <button data-cart-minus="${product.id}">
              −
            </button>

            <span>${item.quantity}</span>

            <button data-cart-plus="${product.id}">
              +
            </button>

          </div>

        </div>


        <div class="cart-item-total">

          ${formatPrice(product.price * item.quantity)}

          <button
            class="remove-item"
            data-cart-remove="${product.id}"
          >
            ×
          </button>

        </div>

      </div>

    `;

    }).join("");



    const subtotal = cart.reduce((sum, item) => {

        const product = getProduct(item.id);

        return sum + (
            product
                ? product.price * item.quantity
                : 0
        );

    }, 0);



    cartFooter.innerHTML = `

    <div class="cart-subtotal">

      <span>Subtotal</span>

      <strong>${formatPrice(subtotal)}</strong>

    </div>


    <p>
      Shipping and final order details can be confirmed
      when checkout is connected.
    </p>


    <button class="cart-checkout" id="checkoutBtn">
      CONTINUE TO CHECKOUT →
    </button>

  `;

}



/* =========================================
   CART QUANTITY AND REMOVE
========================================= */

function changeCartQuantity(id, action) {

    const item = cart.find(product => product.id === id);

    if (!item) return;


    if (action === "plus") {

        item.quantity++;

    }

    else if (action === "minus") {

        item.quantity--;

    }


    cart = cart.filter(item => item.quantity > 0);


    saveStorage();

    renderCart();

}



/* =========================================
   SEARCH MODAL
========================================= */

function openSearch() {

    searchModal.classList.add("active");

    document.body.classList.add("no-scroll");

    searchInput.focus();

}


function closeSearch() {

    searchModal.classList.remove("active");

    document.body.classList.remove("no-scroll");

}



function searchProducts(query) {

    if (!query.trim()) {

        searchResults.innerHTML = "";

        return;

    }


    const results = products.filter(product => {

        return (

            product.name.toLowerCase().includes(query.toLowerCase()) ||

            product.category.toLowerCase().includes(query.toLowerCase())

        );

    });


    if (results.length === 0) {

        searchResults.innerHTML = `

      <p class="search-empty">
        No matching products found.
      </p>

    `;

        return;

    }


    searchResults.innerHTML = results.map(product => `

    <a
      href="#product/${product.id}"
      class="search-result"
    >

      <span>${escapeHTML(product.name)}</span>

      <strong>${formatPrice(product.price)}</strong>

    </a>

  `).join("");

}



/* =========================================
   EVENT LISTENERS
========================================= */

document.addEventListener("click", event => {


    // ADD TO CART

    const addButton = event.target.closest("[data-add]");

    if (addButton) {

        const quantity = addButton.id === "detailAdd"
            ? detailQuantity
            : 1;

        addToCart(addButton.dataset.add, quantity);

    }



    // WISHLIST

    const wishButton = event.target.closest("[data-wishlist]");

    if (wishButton) {

        toggleWishlist(wishButton.dataset.wishlist);

    }



    // CATEGORY FILTER

    const filterButton = event.target.closest("[data-filter]");

    if (filterButton) {

        activeCategory = filterButton.dataset.filter;

        document.querySelectorAll("[data-filter]").forEach(button => {

            button.classList.toggle("active", button === filterButton);

        });

        renderCollectionProducts();

    }



    // CART PLUS

    const cartPlus = event.target.closest("[data-cart-plus]");

    if (cartPlus) {

        changeCartQuantity(cartPlus.dataset.cartPlus, "plus");

    }



    // CART MINUS

    const cartMinus = event.target.closest("[data-cart-minus]");

    if (cartMinus) {

        changeCartQuantity(cartMinus.dataset.cartMinus, "minus");

    }



    // REMOVE CART ITEM

    const cartRemove = event.target.closest("[data-cart-remove]");

    if (cartRemove) {

        cart = cart.filter(item => {

            return item.id !== cartRemove.dataset.cartRemove;

        });

        saveStorage();

        renderCart();

    }



    // CLOSE CART AFTER CONTINUE SHOPPING

    if (event.target.closest("#continueShopping")) {

        closeCart();

    }



    // DEMO CHECKOUT

    if (event.target.closest("#checkoutBtn")) {

        showToast(
            "Checkout demo only. Connect an order and payment backend before launch."
        );

    }



    // PRODUCT DETAIL QUANTITY

    if (event.target.closest("#quantityMinus")) {

        detailQuantity = Math.max(1, detailQuantity - 1);

        document.querySelector("#detailQuantity").textContent =
            detailQuantity;

    }


    if (event.target.closest("#quantityPlus")) {

        detailQuantity++;

        document.querySelector("#detailQuantity").textContent =
            detailQuantity;

    }

});



/* =========================================
   SORT PRODUCTS
========================================= */

document.addEventListener("change", event => {

    if (event.target.id === "sortProducts") {

        sortMode = event.target.value;

        renderCollectionProducts();

    }

});



/* =========================================
   NAVIGATION MENU
========================================= */

document.querySelector("#menuToggle").addEventListener("click", () => {

    document.querySelector("#mainNav").classList.toggle("open");

});



/* =========================================
   CART BUTTONS
========================================= */

document.querySelector("#cartOpen").addEventListener("click", openCart);

document.querySelector("#cartClose").addEventListener("click", closeCart);

overlay.addEventListener("click", closeCart);



/* =========================================
   SEARCH BUTTONS
========================================= */

document.querySelector("#searchOpen").addEventListener("click", openSearch);

document.querySelector("#searchClose").addEventListener("click", closeSearch);


searchModal.addEventListener("click", event => {

    if (event.target === searchModal) {

        closeSearch();

    }

});


searchInput.addEventListener("input", event => {

    searchProducts(event.target.value);

});


searchInput.addEventListener("keydown", event => {

    if (event.key === "Enter") {

        const firstResult = searchResults.querySelector("a");

        if (firstResult) firstResult.click();

    }

});



/* =========================================
   ESC KEY
========================================= */

document.addEventListener("keydown", event => {

    if (event.key === "Escape") {

        closeCart();

        closeSearch();

    }

});



/* =========================================
   NEWSLETTER
========================================= */

document.querySelector("#newsletterForm").addEventListener("submit", event => {

    event.preventDefault();

    document.querySelector("#newsletterMessage").textContent =
        "Thank you! Connect an email marketing service to save subscribers.";

    event.target.reset();

});



/* =========================================
   CONTACT FORM
========================================= */

document.addEventListener("submit", event => {

    if (event.target.id !== "contactForm") return;

    event.preventDefault();


    if (!CONTACT_EMAIL) {

        document.querySelector("#contactHelp").textContent =
            "Add your real business email in CONTACT_EMAIL near the top of script.js. This form is not connected yet.";

        showToast("Configure your business email first.");

        return;

    }


    const data = new FormData(event.target);


    const subject = encodeURIComponent(
        data.get("subject")
    );


    const body = encodeURIComponent(

        `Name: ${data.get("name")}\n` +

        `Email: ${data.get("email")}\n\n` +

        `${data.get("message")}`

    );


    window.location.href =

        `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;

});



/* =========================================
   ROUTER EVENT
========================================= */

window.addEventListener("hashchange", () => {

    renderPage();

    closeCart();

    closeSearch();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

});



/* =========================================
   INITIALIZATION
========================================= */

document.querySelector("#year").textContent =
    new Date().getFullYear();

updateCartCount();

renderPage();
