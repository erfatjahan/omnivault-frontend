import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { 
  Package, 
  Calendar, 
  CreditCard, 
  MapPin, 
  CheckCircle2, 
  Search, 
  RefreshCw, 
  ShoppingBag,
  Star,
  X,
  MessageSquare,
  Send,
  XCircle,
  Loader2
} from "lucide-react";

import { fetchMyOrders, cancelMyOrder } from "../store/slices/orderSlice";
import { addToCart } from "../store/slices/cartSlice";
import { axiosInstance } from "../lib/axios";

const ORDER_STEPS = ["Pending", "Processing", "Shipped", "Delivered"];

const MyOrders = () => {
  const dispatch = useDispatch();

  const { myOrders = [], fetchingOrders: loading, cancellingOrder } = useSelector(
    (state) => state.order || {}
  );
  
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  const filteredOrders = useMemo(() => {
    return myOrders.filter((order) => {
      const orderStatus = String(order.order_status || order.status || "Pending").toLowerCase();
      const matchesFilter =
        filterStatus === "All" || orderStatus === filterStatus.toLowerCase();

      const orderId = String(order.id || "").toLowerCase();
      const matchesSearch =
        !searchQuery.trim() ||
        orderId.includes(searchQuery.toLowerCase()) ||
        order.order_items?.some((item) =>
          item.title?.toLowerCase().includes(searchQuery.toLowerCase())
        );

      return matchesFilter && matchesSearch;
    });
  }, [myOrders, filterStatus, searchQuery]);

  const handleReorder = (items) => {
    if (!items || items.length === 0) return;
    items.forEach((item) => {
      dispatch(
        addToCart({
          id: item.product_id || item.productId,
          name: item.title,
          price: item.price,
          image: item.image,
          quantity: item.quantity,
        })
      );
    });
    toast.success("All items added to cart!");
  };

  const handleCancelOrder = (orderId) => {
    if (window.confirm("Are you sure you want to cancel this order? Stock will be restored.")) {
      dispatch(cancelMyOrder(orderId));
    }
  };

  const handleOpenReview = (item) => {
    setSelectedProduct(item);
    setRating(5);
    setComment("");
    setIsReviewOpen(true);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    const productId = selectedProduct?.product_id || selectedProduct?.productId;

    if (!productId) {
      toast.error("Invalid Product ID!");
      return;
    }
    if (!comment.trim()) {
      toast.error("Please enter a comment.");
      return;
    }

    setSubmittingReview(true);
    try {
      const res = await axiosInstance.put(
        `/product/post-new/review/${productId}`,
        { rating: Number(rating), comment: comment.trim() }
      );

      toast.success(res.data?.message || "Review posted successfully!");
      setIsReviewOpen(false);
      setSelectedProduct(null);
      setComment("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to post review.");
    } finally {
      setSubmittingReview(false);
    }
  };

  const getStepIndex = (status) => {
    const index = ORDER_STEPS.findIndex(
      (s) => s.toLowerCase() === String(status).toLowerCase()
    );
    return index !== -1 ? index : 0;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white dark:bg-[#1e293b] p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
          <div>
            <h1 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-2">
              <ShoppingBag className="w-6 h-6 text-[#9c5b6f]" /> My Orders
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Track, manage, and review your past purchases.
            </p>
          </div>

          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Order ID or Product Name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-[#9c5b6f] dark:text-white"
            />
          </div>
        </div>

        {/* Filter Badges */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {["All", "Pending", "Processing", "Shipped", "Delivered", "Cancelled"].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                filterStatus === status
                  ? "bg-[#9c5b6f] text-white shadow-md shadow-[#9c5b6f]/20"
                  : "bg-white dark:bg-[#1e293b] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-[#1e293b] rounded-2xl">
            <RefreshCw className="w-8 h-8 text-[#9c5b6f] animate-spin mb-3" />
            <p className="text-xs font-semibold text-slate-500">Loading your orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
            <Package className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto" />
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-700 dark:text-slate-200">No orders found</h3>
              <p className="text-xs text-slate-400">Looks like you haven't placed any orders matching this filter.</p>
            </div>
            <Link
              to="/products"
              className="inline-block px-6 py-2.5 bg-[#9c5b6f] text-white text-xs font-bold rounded-xl shadow-md hover:bg-[#854b5d] transition-all"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => {
              const currentStatus = order.order_status || order.status || "Pending";
              const currentStep = getStepIndex(currentStatus);
              const isPending = currentStatus.toLowerCase() === "pending";
              const isCancelled = currentStatus.toLowerCase() === "cancelled";
              const isDelivered = currentStatus.toLowerCase() === "delivered";

              return (
                <div
                  key={order.id}
                  className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden transition-all hover:shadow-md"
                >
                  {/* Top Meta */}
                  <div className="flex flex-wrap items-center justify-between gap-4 p-5 bg-slate-50/50 dark:bg-slate-900/40 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex flex-wrap items-center gap-6">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Order ID</span>
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-100">#{order.id}</p>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Placed On</span>
                        <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {new Date(order.created_at || Date.now()).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric"
                          })}
                        </p>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Total</span>
                        <p className="text-xs font-black text-[#9c5b6f]">৳{Number(order.total_price || order.totalAmount || 0).toFixed(2)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[11px] font-bold px-3 py-1 rounded-full ${
                          order.payment_status === "Paid"
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                        }`}
                      >
                        {order.payment_status || "Unpaid"}
                      </span>
                      <span
                        className={`text-[11px] font-bold px-3 py-1 rounded-full ${
                          isCancelled
                            ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                            : "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20"
                        }`}
                      >
                        {currentStatus}
                      </span>
                      {isPending && (
                        <button
                          type="button"
                          onClick={() => handleCancelOrder(order.id)}
                          disabled={cancellingOrder}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20 rounded-full text-[11px] font-bold transition-all cursor-pointer active:scale-95 disabled:opacity-50"
                        >
                          {cancellingOrder ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <XCircle className="w-3.5 h-3.5" />
                          )}
                          <span>Cancel Order</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Tracking Timeline */}
                  {!isCancelled && (
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-[#1e293b]">
                      <div className="grid grid-cols-4 relative">
                        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-100 dark:bg-slate-700 -translate-y-1/2 z-0" />
                        {ORDER_STEPS.map((step, idx) => {
                          const isDone = idx <= currentStep;
                          const isCurrent = idx === currentStep;

                          return (
                            <div key={step} className="flex flex-col items-center relative z-10">
                              <div
                                className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                                  isDone
                                    ? "bg-[#9c5b6f] text-white ring-4 ring-[#9c5b6f]/10"
                                    : "bg-slate-200 dark:bg-slate-700 text-slate-500"
                                }`}
                              >
                                {isDone ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                              </div>
                              <span
                                className={`text-[10px] mt-2 font-bold ${
                                  isCurrent
                                    ? "text-[#9c5b6f]"
                                    : isDone
                                    ? "text-slate-700 dark:text-slate-200"
                                    : "text-slate-400"
                                }`}
                              >
                                {step}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Items List & Summary */}
                  <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-4">
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Ordered Items</h4>
                      <div className="divide-y divide-slate-100 dark:divide-slate-800">
                        {order.order_items?.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
                            <div className="flex items-center gap-4 min-w-0">
                              <img
                                src={item.image || "https://placehold.co/100x100?text=Product"}
                                alt={item.title}
                                className="w-14 h-14 object-cover rounded-xl border border-slate-100 dark:border-slate-700"
                              />
                              <div className="min-w-0">
                                <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                                  {item.title}
                                </p>
                                <p className="text-[11px] text-slate-400 mt-0.5">
                                  Qty: {item.quantity} × ৳{Number(item.price).toFixed(2)}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <p className="text-xs font-black text-slate-800 dark:text-slate-100">
                                ৳{(Number(item.quantity) * Number(item.price)).toFixed(2)}
                              </p>

                              {isDelivered && (
                                <button
                                  type="button"
                                  onClick={() => handleOpenReview(item)}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/20 rounded-xl text-[11px] font-bold transition-all cursor-pointer"
                                >
                                  <Star className="w-3 h-3 fill-current" />
                                  <span>Review</span>
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* ✅ অনলাইন পেমেন্ট করা থাকলে ক্যান্সেল অর্ডারের নিচে রিফান্ড নোটিশ বক্স */}
                      {isCancelled && order.payment_status === "Paid" && (
                        <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-[11px] leading-relaxed">
                          ℹ️ <strong>Refund Processing:</strong> Your refund of ৳{Number(order.total_price || 0).toFixed(2)} for this cancelled order is currently being processed and will be credited to your {order.payment_method || "original payment method"} within 3–7 business days.
                        </div>
                      )}
                    </div>

                    {/* Shipping Box */}
                    <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col justify-between space-y-4">
                      <div className="space-y-3">
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-[#9c5b6f]" /> Shipping Details
                          </p>
                          <p className="text-xs font-bold text-slate-700 dark:text-slate-200 mt-1">
                            {order.shipping_info?.full_name}
                          </p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5">
                            {order.shipping_info?.address}, {order.shipping_info?.city}, {order.shipping_info?.state}
                          </p>
                          <p className="text-[11px] text-slate-500 mt-0.5">📞 {order.shipping_info?.phone}</p>
                        </div>

                        <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                            <CreditCard className="w-3.5 h-3.5 text-[#9c5b6f]" /> Payment Method
                          </p>
                          <p className="text-xs font-bold text-slate-700 dark:text-slate-200 mt-0.5">
                            {order.payment_method || order.payment_details?.payment_type || "COD"}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 pt-2">
                        {order.payment_status === "Unpaid" && (order.payment_method === "SSLCommerz" || order.payment_details?.payment_type === "SSLCommerz") && (
                          <button
                            type="button"
                            onClick={() => {
                              if (order.payment_details?.payment_url) {
                                window.location.href = order.payment_details.payment_url;
                              } else {
                                toast.info("Redirecting to payment gateway...");
                              }
                            }}
                            className="flex-1 py-2 px-3 bg-[#9c5b6f] text-white text-[11px] font-bold rounded-xl shadow hover:bg-[#854b5d] transition-all text-center cursor-pointer"
                          >
                            Pay Now
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleReorder(order.order_items)}
                          className="flex-1 py-2 px-3 bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-bold rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-center cursor-pointer"
                        >
                          Buy Again
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Review Modal */}
        {isReviewOpen && selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white dark:bg-[#1e293b] w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-100 dark:border-slate-800 space-y-4">
              
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-sm font-black text-slate-800 dark:text-white flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#9c5b6f]" /> Rate & Review Product
                </h3>
                <button
                  type="button"
                  onClick={() => setIsReviewOpen(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/50">
                <img
                  src={selectedProduct.image || "https://placehold.co/100x100?text=Product"}
                  alt={selectedProduct.title}
                  className="w-12 h-12 object-cover rounded-xl border border-slate-200 dark:border-slate-700"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                    {selectedProduct.title}
                  </p>
                  <p className="text-[11px] text-[#9c5b6f] font-bold mt-0.5">
                    ৳{Number(selectedProduct.price).toFixed(2)}
                  </p>
                </div>
              </div>

              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Your Rating
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="p-1 text-amber-400 hover:scale-110 transition-transform cursor-pointer"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= rating ? "fill-current" : "stroke-current fill-none opacity-30"
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-black text-slate-700 dark:text-slate-200 ml-2">
                      {rating} Star{rating > 1 ? "s" : ""}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Review Comment
                  </label>
                  <textarea
                    rows="3"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your experience with this product..."
                    className="w-full p-3 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-[#9c5b6f] dark:text-white"
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsReviewOpen(false)}
                    className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="flex-1 py-2.5 bg-[#9c5b6f] hover:bg-[#854b5d] text-white text-xs font-bold rounded-xl shadow-md shadow-[#9c5b6f]/20 transition-all disabled:opacity-50 inline-flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{submittingReview ? "Submitting..." : "Submit Review"}</span>
                  </button>
                </div>
              </form>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default MyOrders;