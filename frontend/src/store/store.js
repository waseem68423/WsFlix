import { reactive } from 'vue';

export const store = reactive({
  token: localStorage.getItem('token') || null,
  user: JSON.parse(localStorage.getItem('user')) || null,

  // Getters to check the current state
  get isLoggedIn() {
    return !!this.token && !!this.user;
  },
  get isAdmin() {
    return this.isLoggedIn && this.user?.role === 'admin';
  },

  // Setters to update the state and localStorage
  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  },
  setUser(user) {
    this.user = user;
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  },

  logout() {
    this.setToken(null);
    this.setUser(null);
    this.clearCart();
  },

  // --- CART LOGIC ---
  cart: JSON.parse(localStorage.getItem('cart')) || [],
  get cartCount() {
    return this.cart.reduce((total, item) => total + item.quantity, 0);
  },
  get cartTotal() {
    return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  },
  addToCart(product) {
    const itemInCart = this.cart.find(item => item.id === product.id);
    if (itemInCart) {
      itemInCart.quantity++;
    } else {
      this.cart.push({ ...product, quantity: 1 });
    }
    this.saveCart();
  },
  removeFromCart(productId) {
    this.cart = this.cart.filter(item => item.id !== productId);
    this.saveCart();
  },
  updateQuantity(productId, quantity) {
    const itemInCart = this.cart.find(item => item.id === productId);
    if (itemInCart) {
      const newQuantity = Math.max(0, quantity);
      if (newQuantity === 0) {
        this.removeFromCart(productId);
      } else {
        itemInCart.quantity = newQuantity;
      }
    }
    this.saveCart();
  },
  clearCart() {
    this.cart = [];
    this.saveCart();
  },
  saveCart() {
    localStorage.setItem('cart', JSON.stringify(this.cart));
  },
});