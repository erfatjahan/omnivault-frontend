import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";

// Fetch All Products with filters and pagination
export const fetchAllProducts = createAsyncThunk(
  "product/fetchAll",
  async (params = {}, thunkAPI) => {
    try {
      const {
        availability = "",
        price = "",
        category = "",
        ratings = "",
        search = "",
        page = 1,
        limit = 100,
      } = params;

      const queryParams = new URLSearchParams();
      if (category) queryParams.append("category", category);
      if (price) queryParams.append("price", price);
      if (ratings) queryParams.append("ratings", ratings);
      if (search) queryParams.append("search", search);
      if (availability) queryParams.append("availability", availability);
      if (page) queryParams.append("page", page);
      if (limit) queryParams.append("limit", limit);

      const res = await axiosInstance.get(`/product?${queryParams.toString()}`);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch products."
      );
    }
  }
);

// Fetch Single Product Details
export const fetchProductDetails = createAsyncThunk(
  "product/singleProduct",
  async (id, thunkAPI) => {
    try {
      const res = await axiosInstance.get(`/product/singleProduct/${id}`);
      return res.data.product || res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch product details."
      );
    }
  }
);

// Post / Update Product Review
export const postReview = createAsyncThunk(
  "product/post-new/review",
  async ({ productId, review }, thunkAPI) => {
    try {
      const res = await axiosInstance.put(
        `/product/post-new/review/${productId}`,
        review
      );
      toast.success(res.data.message || "Review posted successfully!");
      return res.data.review || res.data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to post review.";
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete Product Review
export const deleteReview = createAsyncThunk(
  "product/delete/Review",
  async ({ productId, reviewId }, thunkAPI) => {
    try {
      const res = await axiosInstance.delete(
        `/product/delete/review/${productId}`
      );
      toast.success(res.data.message || "Review deleted successfully.");
      return { productId, reviewId };
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to delete review.";
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// AI Semantic Search
export const fetchProductWithAI = createAsyncThunk(
  "product/ai-search",
  async (userPrompt, thunkAPI) => {
    try {
      const queryText =
        typeof userPrompt === "string"
          ? userPrompt
          : userPrompt?.userPrompt || userPrompt?.prompt || "";

      const res = await axiosInstance.post("/product/ai-search", {
        userPrompt: queryText,
      });

      return res.data?.products || [];
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Failed to fetch AI-recommended products.";
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const productSlice = createSlice({
  name: "product",
  initialState: {
    loading: false,
    products: [],
    productDetails: null,
    totalProducts: 0,
    topRatedProducts: [],
    newProducts: [],
    aiSearching: false,
    isReviewDeleting: false,
    isPostingReview: false,
    productReviews: [],
    error: null,
  },
  reducers: {
    clearProductDetails: (state) => {
      state.productDetails = null;
      state.productReviews = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Products
      .addCase(fetchAllProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products =
          action.payload.products ||
          (Array.isArray(action.payload) ? action.payload : []);
        state.newProducts = action.payload.newProducts || [];
        state.topRatedProducts = action.payload.topRatedProducts || [];
        state.totalProducts =
          action.payload.totalProducts ||
          action.payload.totalCount ||
          state.products.length;
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Product Details
      .addCase(fetchProductDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.productDetails = action.payload;
        state.productReviews = action.payload?.reviews || [];
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Post Review
      .addCase(postReview.pending, (state) => {
        state.isPostingReview = true;
      })
      .addCase(postReview.fulfilled, (state, action) => {
        state.isPostingReview = false;
        state.productReviews = [action.payload, ...state.productReviews];
      })
      .addCase(postReview.rejected, (state) => {
        state.isPostingReview = false;
      })

      // Delete Review
      .addCase(deleteReview.pending, (state) => {
        state.isReviewDeleting = true;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.isReviewDeleting = false;
        state.productReviews = state.productReviews.filter(
          (review) =>
            (review._id || review.id || review.review_id) !==
            action.payload.reviewId
        );
      })
      .addCase(deleteReview.rejected, (state) => {
        state.isReviewDeleting = false;
      })

      // AI Product Search
      .addCase(fetchProductWithAI.pending, (state) => {
        state.aiSearching = true;
      })
      .addCase(fetchProductWithAI.fulfilled, (state, action) => {
        state.aiSearching = false;
        const result = Array.isArray(action.payload)
          ? action.payload
          : action.payload.products || [];
        state.products = result;
        state.totalProducts = result.length;
      })
      .addCase(fetchProductWithAI.rejected, (state) => {
        state.aiSearching = false;
      });
  },
});

export const { clearProductDetails } = productSlice.actions;
export default productSlice.reducer;