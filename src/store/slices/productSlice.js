import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";

export const fetchAllProducts = createAsyncThunk(
  "product/fetchAll",
  async (
    {
      availability = "",
      price = "0-10000",
      category = "",
      ratings = "",
      search = "",
      page = 1,
    } = {},
    thunkAPI
  ) => {
    try {
      const params = new URLSearchParams();
      if (category) params.append("category", category);
      if (price) params.append("price", price);
      if (ratings) params.append("ratings", ratings);
      if (search) params.append("search", search);
      if (availability) params.append("availability", availability);
      if (page) params.append("page", page);

      const res = await axiosInstance.get(`/product?${params.toString()}`);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch products."
      );
    }
  }
);

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

export const postReview = createAsyncThunk(
  "product/post-new/review",
  async ({ productId, review }, thunkAPI) => {
    try {
const res = await axiosInstance.put(`/product/post-new/review/${productId}`, review);
toast.success(res.data.message || "Review posted successfully!");
      return res.data.review || res.data;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to post review.";
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const deleteReview = createAsyncThunk(
  "product/delete/Review",
  async ({ productId, reviewId }, thunkAPI) => {
    try {
      const res = await axiosInstance.delete(`/delete/review/${productId}`);
      toast.success(res.data.message || "Review deleted successfully.");
      return { productId, reviewId };
    } catch (error) {
      const message = error.response?.data?.message || "Failed to delete review.";
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const fetchProductWithAI = createAsyncThunk(
  "product/ai-search",
  async (userPrompt, thunkAPI) => {
    try {
      const payload = typeof userPrompt === "string" ? { prompt: userPrompt } : userPrompt;
      const res = await axiosInstance.post("/product/ai-search", payload);
      return res.data.products || res.data;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to fetch AI-recommended products.";
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
      // All Products
      .addCase(fetchAllProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products || [];
        state.newProducts = action.payload.newProducts || [];
        state.topRatedProducts = action.payload.topRatedProducts || [];
        state.totalProducts = action.payload.totalProducts || 0;
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
      .addCase(deleteReview.pending, (state) => {
        state.isReviewDeleting = true;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.isReviewDeleting = false;
        state.productReviews = state.productReviews.filter(
          (review) =>
            (review._id || review.id || review.review_Id) !== action.payload.reviewId
        );
      })
      .addCase(deleteReview.rejected, (state) => {
        state.isReviewDeleting = false;
      })

      //  AI Search
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