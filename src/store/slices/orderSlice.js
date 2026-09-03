import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";

export const fetchMyOrders = createAsyncThunk(
  "order/fetchMyOrders",
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get("/order/my-orders");
      return res.data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to fetch your orders.";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const placeOrder = createAsyncThunk(
  "order/placeOrder",
  async (orderData, thunkAPI) => {
    try {
      const res = await axiosInstance.post("/order/new", orderData);
      toast.success(res.data.message || "Order placed successfully!");
      return res.data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to place your order.";
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const createPaymentIntent = createAsyncThunk(
  "order/createPaymentIntent",
  async (paymentData, thunkAPI) => {
    try {
      const res = await axiosInstance.post("/order/payment/process", paymentData);
      return res.data.client_secret || res.data.paymentIntent || res.data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Payment processing failed.";
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const fetchAllOrders = createAsyncThunk(
  "order/fetchAllOrders",
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get("/order/admin/orders");
      return res.data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to fetch all orders.";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  "order/updateOrderStatus",
  async ({ orderId, status, payment_status }, thunkAPI) => {
    try {
      const res = await axiosInstance.put(`/order/admin/order/${orderId}`, {
        status,
        order_status: status,
        payment_status,
      });
      toast.success(res.data.message || "Order status updated successfully!");
      return res.data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to update order status.";
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const deleteOrder = createAsyncThunk(
  "order/deleteOrder",
  async (orderId, thunkAPI) => {
    try {
      const res = await axiosInstance.delete(`/order/admin/delete/${orderId}`);
      toast.success(res.data.message || "Order deleted successfully!");
      return { orderId, ...res.data };
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to delete order.";
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const initialState = {
  orders: [],
  myOrders: [],
  fetchingOrders: false,
  placingOrder: false,
  updatingOrder: false,
  finalPrice: null,
  orderStep: 1,
  paymentIntent: "",
  error: null,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setOrderStep: (state, action) => {
      state.orderStep = action.payload;
    },
    setFinalPrice: (state, action) => {
      state.finalPrice = action.payload;
    },
    clearPaymentIntent: (state) => {
      state.paymentIntent = "";
    },
    resetOrder: (state) => {
      state.orders = [];
      state.myOrders = [];
      state.fetchingOrders = false;
      state.placingOrder = false;
      state.updatingOrder = false;
      state.finalPrice = null;
      state.orderStep = 1;
      state.paymentIntent = "";
      state.error = null;

      try {
        localStorage.removeItem("shippingInfo");
        localStorage.removeItem("shippingAddress");
        localStorage.removeItem("cart");
        localStorage.removeItem("cartItems");
        localStorage.removeItem("myOrders");
      } catch (e) {
        console.error(e);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Customer Orders (Filtered for Unique IDs)
      .addCase(fetchMyOrders.pending, (state) => {
        state.fetchingOrders = true;
        state.error = null;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.fetchingOrders = false;
        const payload = action.payload;
        const incomingOrders = Array.isArray(payload)
          ? payload
          : payload?.myOrders || payload?.orders || [];
        state.myOrders = incomingOrders.filter(
          (order, index, self) =>
            order?.id &&
            index === self.findIndex((o) => String(o.id) === String(order.id))
        );
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.fetchingOrders = false;
        state.error = action.payload;
      })

      // Place Order
      .addCase(placeOrder.pending, (state) => {
        state.placingOrder = true;
        state.error = null;
      })
      .addCase(placeOrder.fulfilled, (state) => {
        state.placingOrder = false;
        state.orderStep = 3;
        try {
          localStorage.removeItem("shippingInfo");
          localStorage.removeItem("shippingAddress");
        } catch (e) {
          console.error(e);
        }
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.placingOrder = false;
        state.error = action.payload;
      })

      // Admin: Fetch All Orders (Filtered for Unique IDs)
      .addCase(fetchAllOrders.pending, (state) => {
        state.fetchingOrders = true;
        state.error = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.fetchingOrders = false;
        const payload = action.payload;
        const incomingOrders = Array.isArray(payload)
          ? payload
          : payload?.orders || payload?.allOrders || [];

        state.orders = incomingOrders.filter(
          (order, index, self) =>
            order?.id &&
            index === self.findIndex((o) => String(o.id) === String(order.id))
        );
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.fetchingOrders = false;
        state.error = action.payload;
      })

      // Admin: Update Order Status
      .addCase(updateOrderStatus.pending, (state) => {
        state.updatingOrder = true;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.updatingOrder = false;
        const updated = action.payload?.updatedOrder || action.payload?.order;
        if (updated) {
          state.orders = state.orders.map((o) =>
            String(o.id) === String(updated.id) ? { ...o, ...updated } : o
          );
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.updatingOrder = false;
        state.error = action.payload;
      })

      // Admin: Delete Order
      .addCase(deleteOrder.fulfilled, (state, action) => {
        const deletedId = action.payload?.orderId;
        state.orders = state.orders.filter(
          (order) => String(order.id) !== String(deletedId)
        );
      })

      // Stripe Payment Intent
      .addCase(createPaymentIntent.pending, (state) => {
        state.placingOrder = true;
      })
      .addCase(createPaymentIntent.fulfilled, (state, action) => {
        state.placingOrder = false;
        state.paymentIntent = action.payload;
      })
      .addCase(createPaymentIntent.rejected, (state, action) => {
        state.placingOrder = false;
        state.error = action.payload;
      })
      .addMatcher(
        (action) =>
          typeof action.type === "string" &&
          action.type.toLowerCase().includes("logout"),
        (state) => {
          state.orders = [];
          state.myOrders = [];
          state.fetchingOrders = false;
          state.placingOrder = false;
          state.updatingOrder = false;
          state.finalPrice = null;
          state.orderStep = 1;
          state.paymentIntent = "";
          state.error = null;

          try {
            localStorage.removeItem("shippingInfo");
            localStorage.removeItem("shippingAddress");
            localStorage.removeItem("cart");
            localStorage.removeItem("cartItems");
            localStorage.removeItem("myOrders");
          } catch (e) {
            console.error(e);
          }
        }
      );
  },
});

export const {
  setOrderStep,
  setFinalPrice,
  clearPaymentIntent,
  resetOrder,
} = orderSlice.actions;

export default orderSlice.reducer;