import React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle2, ShieldCheck, X } from "lucide-react";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const type = searchParams.get("type");
  const isPayForMe = type === "pay-for-me";

  const handleClose = () => {
    if (isPayForMe) {
      window.close();
      window.location.replace("about:blank");
    } else {
      navigate("/orders");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 select-none">
      <div className="relative max-w-md w-full p-8 sm:p-10 rounded-[32px] bg-white dark:bg-[#150d11] border border-slate-200/80 dark:border-white/10 shadow-2xl text-center space-y-6">
        
        {isPayForMe && (
          <button
            onClick={handleClose}
            className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white bg-slate-100 dark:bg-white/5 transition cursor-pointer"
            aria-label="Close Window"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Success Icon */}
        <div className="w-20 h-20 mx-auto rounded-3xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        {/* Heading & Thank You Message */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Thank You!
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-rose-200/60 leading-relaxed">
            {isPayForMe
              ? "Your payment for this gift order has been successfully completed. You have made someone's day wonderful!"
              : "Your payment has been processed successfully."}
          </p>
        </div>

        {/* Safe Exit Notice */}
        {/* {isPayForMe && (
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 text-xs text-slate-500 dark:text-rose-200/70">
            You can now safely close this window using the cross icon or your browser tab.
          </div>
        )} */}
      </div>
    </div>
  );
};

export default PaymentSuccess;