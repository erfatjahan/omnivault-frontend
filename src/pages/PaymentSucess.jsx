import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, ArrowRight, ShieldCheck, ShoppingBag } from "lucide-react";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type");
  const isPayForMe = type === "pay-for-me";

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 select-none">
      <div className="max-w-md w-full p-8 sm:p-10 rounded-[32px] bg-white dark:bg-[#150d11] border border-slate-200/80 dark:border-white/10 shadow-2xl text-center space-y-6">
        
        {/* Success Icon */}
        <div className="w-20 h-20 mx-auto rounded-3xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        {/* Heading & Subtitle */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Transaction Successful</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Payment Completed!
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-rose-200/60 leading-relaxed">
            {isPayForMe
              ? "Thank you so much! You have successfully completed the payment for this gift order. The recipient will be notified."
              : "Your payment has been processed successfully. Your order is now being prepared for shipping."}
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          {isPayForMe ? (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 text-xs text-slate-500 dark:text-rose-200/70">
              You can now safely close this window or explore our store.
            </div>
          ) : (
            <Link
              to="/orders"
              className="inline-flex items-center justify-center gap-2 w-full py-4 px-6 rounded-2xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-[#9c5b6f] to-[#b36b81] hover:from-[#854b5d] hover:to-[#9c5b6f] shadow-lg shadow-[#9c5b6f]/30 active:scale-95 transition-all"
            >
              <span>View My Orders</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}

          <div className="mt-4">
            <Link
              to="/products"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#9c5b6f] dark:text-[#e4a8b8] hover:underline"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Continue Shopping</span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PaymentSuccess;