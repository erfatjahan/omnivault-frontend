import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { ShoppingBag, ShieldCheck, ArrowRight } from "lucide-react";

const PayForMe = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const { data } = await axios.get(
          `https://omnivault-backend-83uu.onrender.com/api/v1/order/pay-for-me/${token}`
        );
        if (data.success) {
          setOrder(data.order);
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Invalid or expired payment link.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [token]);

  const handlePayment = async () => {
    try {
      setPaying(true);
      toast.info("Initializing payment gateway...");
      const { data } = await axios.post(
        `https://omnivault-backend-83uu.onrender.com/api/v1/order/pay-for-me/pay/${token}`,
        {},
        { withCredentials: true }
      );

      if (data.success && data.paymentUrl) {
        window.location.href = data.paymentUrl; 
      } else {
        toast.success("Payment completed successfully!");
        navigate("/");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Payment failed. Please try again.");
    } finally {
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#9c5b6f]/30 border-t-[#9c5b6f] rounded-full animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md p-8 rounded-[32px] bg-white dark:bg-[#150d11] border border-slate-200 dark:border-white/10 shadow-xl space-y-4">
          <h2 className="text-2xl font-black text-rose-500">Invalid Link</h2>
          <p className="text-sm text-slate-500 dark:text-rose-200/60">
            This payment link is invalid, expired, or has already been paid.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f9] dark:bg-[#0f090c] py-12 px-4 select-none">
      <div className="max-w-xl mx-auto p-6 sm:p-8 bg-white dark:bg-[#150d11] rounded-[32px] shadow-xl border border-slate-200/80 dark:border-white/10 space-y-6">
        
        <div className="text-center space-y-2 pb-4 border-b border-slate-100 dark:border-white/10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#9c5b6f]/10 dark:bg-[#9c5b6f]/20 text-[#9c5b6f] dark:text-[#e4a8b8] text-[11px] font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Secure Gift Cart Payment</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100">
            Complete the Payment
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-rose-200/60">
            Someone has requested you to pay for their order. Review the items below.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Order Items:</h3>
          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {order.order_items.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-4 p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                <div className="flex items-center gap-3">
                  <img src={item.image} alt={item.title} className="w-14 h-14 object-cover rounded-xl border border-slate-200 dark:border-white/10" />
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 line-clamp-1">{item.title}</h4>
                    <p className="text-xs text-slate-400">Qty: {item.quantity}</p>
                  </div>
                </div>
                <p className="text-sm font-black text-[#9c5b6f] dark:text-[#e4a8b8]">
                  ৳{(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-white/10 flex justify-between items-baseline">
          <span className="text-base font-extrabold text-slate-900 dark:text-slate-100">Total Amount</span>
          <span className="text-2xl font-black text-[#9c5b6f] dark:text-[#e4a8b8]">
            ৳{order.total_price}
          </span>
        </div>

        <button
          onClick={handlePayment}
          disabled={paying}
          className="w-full inline-flex items-center justify-center gap-2 py-4 px-6 rounded-2xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-[#9c5b6f] to-[#b36b81] hover:from-[#854b5d] hover:to-[#9c5b6f] shadow-lg shadow-[#9c5b6f]/30 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
        >
          <span>{paying ? "Processing..." : `Pay ৳${order.total_price} Now`}</span>
          <ArrowRight className="w-4 h-4" />
        </button>

      </div>
    </div>
  );
};

export default PayForMe;