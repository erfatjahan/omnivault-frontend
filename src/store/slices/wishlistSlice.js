import { createSlice } from "@reduxjs/toolkit";

const initialWishlist = (() => {
  try {
    return localStorage.getItem("wishlistItems")
      ? JSON.parse(localStorage.getItem("wishlistItems"))
      : [];
  } catch {
    return [];
  }
})();

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    wishlist: initialWishlist,
  },
  reducers: {
    addToWishlist(state, action) {
      const product = action.payload;
      const productId = product._id || product.id || product.productId;

      const exists = state.wishlist.find(
        (item) => (item._id || item.id || item.productId) === productId
      );

      if (!exists) {
        state.wishlist.push({
          id: productId,
          productId: productId,
          name: product.name || product.title || "Untitled Product",
          price: Number(product.price) || 0,
          image:
            product.images?.[0]?.url ||
            product.images?.[0] ||
            product.image ||
            "https://placehold.co/200x200?text=Product",
        });
        localStorage.setItem("wishlistItems", JSON.stringify(state.wishlist));
      }
    },

    removeFromWishlist(state, action) {
      const idToRemove = action.payload;
      state.wishlist = state.wishlist.filter(
        (item) => (item._id || item.id || item.productId) !== idToRemove
      );
      localStorage.setItem("wishlistItems", JSON.stringify(state.wishlist));
    },

    clearWishlist(state) {
      state.wishlist = [];
      localStorage.removeItem("wishlistItems");
    },
  },
});

export const { addToWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;