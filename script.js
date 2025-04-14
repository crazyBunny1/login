// script.js
document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart from session storage
    let cart = JSON.parse(sessionStorage.getItem('cart')) || [];
    
    // Update cart display on page load
    updateCartDisplay();
    
    // Order Now buttons functionality
    const orderButtons = document.querySelectorAll('.order, .btn-card, .btn.primary');
    orderButtons.forEach(button => {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        const orderSection = document.getElementById('order');
        if (orderSection) {
          orderSection.scrollIntoView({
            behavior: 'smooth'
          });
        } else {
          window.location.href = 'index.html#order';
        }
      });
    });
  
    // Menu navigation buttons
    const menuButtons = document.querySelectorAll('.btn.secondary, .nav a[href="#menu"]');
    menuButtons.forEach(button => {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        const menuSection = document.querySelector('.menu-preview');
        if (menuSection) {
          menuSection.scrollIntoView({
            behavior: 'smooth'
          });
        }
      });
    });
  
    // Build Pizza form submission
    const pizzaForm = document.getElementById('pizza-form');
    if (pizzaForm) {
      pizzaForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Show loading state
        const submitBtn = pizzaForm.querySelector('.btn-submit');
        const originalText = submitBtn.textContent;
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        
        // Get form values
        const size = pizzaForm.querySelector('input[name="size"]:checked')?.value;
        const crust = pizzaForm.querySelector('input[name="crust"]:checked')?.value;
        const toppings = Array.from(pizzaForm.querySelectorAll('input[name="toppings"]:checked'))
                           .map(el => el.value);
        
        if (!size || !crust) {
          alert('Please select size and crust');
          submitBtn.classList.remove('loading');
          submitBtn.disabled = false;
          return;
        }
        
        // Calculate price
        let price = pizzaPrices[size] + pizzaPrices[crust];
        toppings.forEach(topping => {
          price += pizzaPrices.toppings[topping] || 0;
        });
        
        // Add to cart
        cart.push({
          name: 'Custom Pizza',
          size: size.charAt(0).toUpperCase() + size.slice(1),
          crust: crust.charAt(0).toUpperCase() + crust.slice(1),
          toppings: toppings.join(', '),
          price: price,
          quantity: 1
        });
        
        // Save cart to session storage
        sessionStorage.setItem('cart', JSON.stringify(cart));
        
        // Update cart and reset form
        updateCartDisplay();
        pizzaForm.reset();
        
        // Show confirmation
        submitBtn.textContent = 'Added!';
        setTimeout(() => {
          submitBtn.textContent = originalText;
          submitBtn.classList.remove('loading');
          submitBtn.disabled = false;
        }, 1500);
        
        // Open cart dropdown
        document.getElementById('cart-dropdown').classList.add('active');
      });
    }
  
    // Newsletter form submission
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
      newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const emailInput = newsletterForm.querySelector('input[type="email"]');
        const email = emailInput.value.trim();
        const submitBtn = newsletterForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        if (!email) {
          alert('Please enter a valid email address');
          return;
        }
        
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        
        // Simulate API call (replace with actual fetch)
        setTimeout(() => {
          try {
            // This would be your actual fetch call in a real implementation
            submitBtn.textContent = 'Subscribed!';
            newsletterForm.reset();
            setTimeout(() => {
              submitBtn.textContent = originalText;
              submitBtn.disabled = false;
            }, 1500);
          } catch (error) {
            console.error('Error subscribing to newsletter:', error);
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            alert('There was an error subscribing. Please try again.');
          }
        }, 1000);
      });
    }
  
    // Store locator search
    const storeLocatorBtn = document.getElementById('search-button');
    if (storeLocatorBtn) {
      storeLocatorBtn.addEventListener('click', function() {
        const searchInput = document.querySelector('.locator-search input');
        const query = searchInput.value.trim();
        
        if (!query) {
          alert('Please enter a location to search');
          return;
        }
        
        // Show loading state
        const originalText = this.textContent;
        this.disabled = true;
        this.innerHTML = 'Searching...';
        
        // Simulate API call (replace with actual fetch)
        setTimeout(() => {
          try {
            // Mock data for demo
            const mockStores = [
              {
                name: 'PizzaHut - Hazratganj',
                address: '91, Mahatma Gandhi Marg, opposite Governer House, Raj Bhavan Colony, Hazratganj, Lucknow',
                phone: '+91 18002022022',
                distance: '0.5 km'
              },
              {
                name: 'PizzaHut - Mahanagar',
                address: 'Prem Jyoti Tower, B 939/A, Gole Market, Mahanagar, Lucknow',
                phone: '+91 8448191079',
                distance: '2.1 km'
              }
            ];
            
            displayStores(mockStores);
          } catch (error) {
            console.error('Error searching stores:', error);
            alert('There was an error searching for stores. Please try again.');
          } finally {
            this.innerHTML = originalText;
            this.disabled = false;
          }
        }, 1500);
      });
      
      // Add geolocation button
      const geoLocateBtn = document.createElement('button');
      geoLocateBtn.textContent = '📍 Use My Location';
      geoLocateBtn.className = 'geo-locate';
      geoLocateBtn.setAttribute('aria-label', 'Use my current location');
      geoLocateBtn.addEventListener('click', function() {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            position => {
              const searchInput = document.querySelector('.locator-search input');
              searchInput.value = `${position.coords.latitude.toFixed(4)},${position.coords.longitude.toFixed(4)}`;
              storeLocatorBtn.click();
            },
            error => {
              console.error('Geolocation error:', error);
              alert('Unable to get your location: ' + error.message);
            },
            { timeout: 10000, enableHighAccuracy: true }
          );
        } else {
          alert('Geolocation is not supported by your browser');
        }
      });
  
      document.querySelector('.locator-search').appendChild(geoLocateBtn);
    }
  
    // Toggle cart dropdown
    const cartToggle = document.getElementById('cart-toggle');
    if (cartToggle) {
      cartToggle.addEventListener('click', function(e) {
        e.preventDefault();
        const dropdown = document.getElementById('cart-dropdown');
        const isActive = dropdown.classList.toggle('active');
        this.setAttribute('aria-expanded', isActive);
        dropdown.setAttribute('aria-hidden', !isActive);
      });
    }
  
    // Close cart when clicking outside
    document.addEventListener('click', function(e) {
      const cartDropdown = document.getElementById('cart-dropdown');
      const cartToggle = document.getElementById('cart-toggle');
      if (cartDropdown && !e.target.closest('.cart-icon') && cartDropdown.classList.contains('active')) {
        cartDropdown.classList.remove('active');
        if (cartToggle) {
          cartToggle.setAttribute('aria-expanded', 'false');
        }
        cartDropdown.setAttribute('aria-hidden', 'true');
      }
    });
  
    // Pizza form prices
    const pizzaPrices = {
      small: 199,
      medium: 299,
      large: 399,
      thin: 0,
      pan: 50,
      stuffed: 100,
      toppings: {
        pepperoni: 30,
        mushrooms: 20,
        onions: 15,
        bacon: 40,
        'extra-cheese': 35
      }
    };
    function calculateLivePrice() {
      const size = document.querySelector('input[name="size"]:checked')?.value;
      const crust = document.querySelector('input[name="crust"]:checked')?.value;
      const toppings = Array.from(document.querySelectorAll('input[name="toppings"]:checked'))
                            .map(el => el.value);
    
      let price = 0;
    
      if (size) price += pizzaPrices[size] || 0;
      if (crust) price += pizzaPrices[crust] || 0;
      toppings.forEach(topping => {
        price += pizzaPrices.toppings[topping] || 0;
      });
    
      document.getElementById('live-price').textContent = price.toFixed(2);
    }
    
  
    // Function to update cart display
    function updateCartDisplay() {
      const cartCount = document.getElementById('cart-count');
      const cartItems = document.getElementById('cart-items');
      const cartTotal = document.getElementById('cart-total');
      
      if (!cartCount || !cartItems || !cartTotal) return;
      
      cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
      
      // Calculate total
      const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      cartTotal.textContent = total.toFixed(2);
      
      // Update cart items list
      cartItems.innerHTML = '';
      
      if (cart.length === 0) {
        cartItems.innerHTML = '<p>Your cart is empty</p>';
        return;
      }
      
      cart.forEach((item, index) => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
          <div>
            <strong>${item.name}</strong> (${item.size})<br>
            ₹${item.price.toFixed(2)} x ${item.quantity}
          </div>
          <div class="cart-item-remove" data-index="${index}" aria-label="Remove ${item.name} from cart">×</div>
        `;
        cartItems.appendChild(cartItem);
      });
      
      // Add event listeners to remove buttons
      document.querySelectorAll('.cart-item-remove').forEach(btn => {
        btn.addEventListener('click',function() {
          const index = parseInt(this.dataset.index);
          if (!isNaN(index) && index >= 0 && index < cart.length) {
            cart.splice(index, 1);
            sessionStorage.setItem('cart', JSON.stringify(cart));
            updateCartDisplay();
          }
        });
      });
    }
  
    // Function to display stores
    function displayStores(stores) {
      const storeContainer = document.getElementById('store-results');
      if (!storeContainer) return;
      
      storeContainer.innerHTML = '';
      
      if (stores.length === 0) {
        storeContainer.innerHTML = '<p>No stores found near your location. Try a different search.</p>';
        return;
      }
      
      stores.forEach(store => {
        const storeElement = document.createElement('div');
        storeElement.className = 'store-item';
        storeElement.innerHTML = `
          <h3>${store.name}</h3>
          <p>${store.address}</p>
          <p>📞 ${store.phone}</p>
          <p class="distance">${store.distance} away</p>
        `;
        storeContainer.appendChild(storeElement);
      });
    }
  });

  // Smooth scrolling for all internal anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const targetId = this.getAttribute('href').slice(1);
    const targetEl = document.getElementById(targetId);
    
    if (targetEl) {
      e.preventDefault();
      targetEl.scrollIntoView({
        behavior: 'smooth'
      });
    }
  });
});
// Trigger price update when options are changed
const priceInputs = document.querySelectorAll('#pizza-form input');
priceInputs.forEach(input => {
  input.addEventListener('change', calculateLivePrice);
});

// Initial calculation
calculateLivePrice();


// Removed duplicate declaration of validCoupons

document.getElementById('apply-promo')?.addEventListener('click', () => {
  const input = document.getElementById('promo-code');
  const msg = document.getElementById('promo-msg');
  const code = input.value.trim().toUpperCase();
  const totalElem = document.getElementById('cart-total');
  let cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (!code || !validCoupons[code]) {
    msg.textContent = "Invalid promo code.";
    return;
  }

  const discount = validCoupons[code];
  let finalTotal = discount < 1 ? cartTotal * (1 - discount) : cartTotal - discount;
  finalTotal = finalTotal < 0 ? 0 : finalTotal;

  totalElem.textContent = finalTotal.toFixed(2);
  msg.textContent = `Promo applied! You saved ₹${(cartTotal - finalTotal).toFixed(2)} 🎉`;
});


// Favorite Pizza Save
document.getElementById("save-fav")?.addEventListener("click", () => {
  const size = document.querySelector('input[name="size"]:checked')?.value;
  const crust = document.querySelector('input[name="crust"]:checked')?.value;
  const toppings = Array.from(document.querySelectorAll('input[name="toppings"]:checked')).map(el => el.value);
  if (!size || !crust) {
    alert("Please select size and crust to save pizza.");
    return;
  }

  const favPizza = {
    size,
    crust,
    toppings
  };

  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  favorites.push(favPizza);
  localStorage.setItem("favorites", JSON.stringify(favorites));
  alert("Pizza saved to favorites!");
});


// Add-to-order logic for menu.html
document.querySelectorAll('.add-to-order').forEach(button => {
  button.addEventListener('click', function () {
    const name = this.getAttribute('data-name') || 'Custom Pizza';
    const price = parseFloat(this.getAttribute('data-price') || 299);

    const cart = JSON.parse(sessionStorage.getItem('cart')) || [];
    cart.push({
      name,
      size: 'Standard',
      crust: 'Regular',
      toppings: 'Default',
      price,
      quantity: 1
    });

    sessionStorage.setItem('cart', JSON.stringify(cart));
    alert(`${name} added to cart!`);
  });
});


// Update cart logic to support quantity selection
document.querySelectorAll('.add-to-order').forEach(button => {
  button.addEventListener('click', function () {
    const name = this.getAttribute('data-name') || 'Custom Pizza';
    const price = parseFloat(this.getAttribute('data-price') || 299);
    const qtyInput = this.parentElement.querySelector('.item-qty');
    const quantity = parseInt(qtyInput?.value || "1");

    const cart = JSON.parse(sessionStorage.getItem('cart')) || [];
    cart.push({
      name,
      size: 'Standard',
      crust: 'Regular',
      toppings: 'Default',
      price,
      quantity
    });

    sessionStorage.setItem('cart', JSON.stringify(cart));
    alert(`${name} x${quantity} added to cart!`);
  });
});


// Display cart items with quantity and subtotal
function updateCartDisplay() {
  const cart = JSON.parse(sessionStorage.getItem("cart")) || [];
  const cartList = document.getElementById("cart-items-list");
  const totalElem = document.getElementById("cart-total");
  if (!cartList || !totalElem) return;

  cartList.innerHTML = "";

  let total = 0;
  cart.forEach(item => {
    const itemElem = document.createElement("div");
    itemElem.className = "cart-item";
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    itemElem.innerHTML = 
      <p><strong>\${item.name}</strong> x\${item.quantity} - ₹\${itemTotal.toFixed(2)}</p>
    ;
    cartList.appendChild(itemElem);
  });

  totalElem.textContent = total.toFixed(2);
}


// Enhanced Coupon Logic - works with cart total
const validCoupons = {
  'FIRST50': 50,
  'SAVE10': 0.10 // 10% off}
 // Retained this declaration
document.getElementById('apply-promo')?.addEventListener('click', () => {
  const input = document.getElementById('promo-code');
  const msg = document.getElementById('promo-msg');
  const code = input.value.trim().toUpperCase();
  const cart = JSON.parse(sessionStorage.getItem("cart")) || [];
  let total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (!validCoupons[code]) {
    msg.textContent = "❌ Invalid promo code.";
    appliedDiscount = 0;
    updateCartDisplay(); // Recalculate full price if discount is removed
    return;
  }

  appliedDiscount = validCoupons[code];
  let discountAmount = typeof appliedDiscount === 'number' && appliedDiscount < 1
    ? total * appliedDiscount
    : appliedDiscount;

  discountAmount = Math.min(discountAmount, total);
  const finalTotal = total - discountAmount;

  msg.textContent = ✅ Promo applied! You saved ₹${discountAmount.toFixed(2)};
  updateCartDisplay(finalTotal.toFixed(2));
});

//date cart display override to include discounted total
function updateCartDisplay(finalTotalOverride) {
  const cart = JSON.parse(sessionStorage.getItem("cart")) || [];
  const cartList = document.getElementById("cart-items-list");
  const totalElem = document.getElementById("cart-total");
  if (!cartList || !totalElem) return;

  cartList.innerHTML = "";

  let total = 0;
  cart.forEach(item => {
    const itemElem = document.createElement("div");
    itemElem.className = "cart-item";
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    itemElem.innerHTML = `<p><strong>${item.name}</strong> x${item.quantity} - ₹${itemTotal.toFixed(2)}</p>`;
    cartList.appendChild(itemElem);
  });

  if (typeof finalTotalOverride === 'string') {
    totalElem.textContent = finalTotalOverride;
  } else {
    totalElem.textContent = total.toFixed(2);
  }
}
