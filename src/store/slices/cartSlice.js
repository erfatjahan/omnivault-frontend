import { createSlice } from "@reduxjs/toolkit";

const initialCart = localStorage.getItem("cartItems")
  ? JSON.parse(localStorage.getItem("cartItems"))
  : [];

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: initialCart,
  },
  reducers: {
    addToCart(state, action) {
      const payload = action.payload;
    
      const product = payload.product || payload;
      const quantity = Number(payload.quantity) || 1;
      const productId = product._id || product.id || product.productId;

      const existingItem = state.cart.find(
        (item) => (item._id || item.id || item.productId) === productId
      );

      if (existingItem) {
        existingItem.quantity = (Number(existingItem.quantity) || 1) + quantity;
      } else {
        state.cart.push({
          id: productId,
          productId: productId,
          name: product.name || product.title || "Untitled Product",
          price: Number(product.price) || 0,
          image:
            product.images?.[0]?.url ||
            product.images?.[0] ||
            product.image ||
            "https://placehold.co/200x200?text=Product",
          stock: product.stock !== undefined ? Number(product.stock) : 10,
          quantity: quantity,
        });
      }

      localStorage.setItem("cartItems", JSON.stringify(state.cart));
    },

    decreaseQuantity(state, action) {
      const idToDecrease = action.payload;
      const existingItem = state.cart.find(
        (item) => (item._id || item.id || item.productId) === idToDecrease
      );

      if (existingItem) {
        if (existingItem.quantity > 1) {
          existingItem.quantity -= 1;
        } else {
          state.cart = state.cart.filter(
            (item) => (item._id || item.id || item.productId) !== idToDecrease
          );
        }
      }

      localStorage.setItem("cartItems", JSON.stringify(state.cart));
    },

    removeFromCart(state, action) {
      const idToRemove = action.payload;
      state.cart = state.cart.filter(
        (item) => (item._id || item.id || item.productId) !== idToRemove
      );

      localStorage.setItem("cartItems", JSON.stringify(state.cart));
    },

    updateCartQuantity(state, action) {
      const { id, quantity } = action.payload;
      const item = state.cart.find(
        (item) => (item._id || item.id || item.productId) === id
      );
      if (item) {
        item.quantity = Number(quantity);
      }
      localStorage.setItem("cartItems", JSON.stringify(state.cart));
    },

    clearCart(state) {
      state.cart = [];
      localStorage.removeItem("cartItems");
    },
  },
});

export const {
  addToCart,
  decreaseQuantity,
  removeFromCart,
  updateCartQuantity,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;