import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

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
          `http://localhost:5000/api/v1/orders/pay-for-me/${token}`
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
      toast.info("Redirecting to payment gateway...");
    } catch (error) {
      toast.error("Payment failed. Please try again.");
    } finally {
      setPaying(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-lg">Loading payment details...</div>;
  }

  if (!order) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-red-600">Invalid Link</h2>
        <p className="text-gray-600 mt-2">This payment link is invalid or has already been paid.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto my-10 p-6 bg-white rounded-lg shadow-md border">
      <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">Gift Cart Payment</h2>
      <p className="text-center text-gray-600 mb-6">
        Someone has requested you to pay for their order. Review the items below and complete the payment.
      </p>

      <div className="border-t border-b py-4 mb-6">
        <h3 className="font-semibold text-gray-700 mb-3">Order Items:</h3>
        <div className="space-y-4">
          {order.order_items.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img src={item.image} alt={item.title} className="w-16 h-16 object-cover rounded-md border" />
                <div>
                  <h4 className="font-medium text-gray-800">{item.title}</h4>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
              </div>
              <p className="font-semibold text-gray-800">৳{(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center mb-6 text-lg font-bold">
        <span>Total Amount to Pay:</span>
        <span className="text-purple-600">৳{order.total_price}</span>
      </div>

      <button
        onClick={handlePayment}
        disabled={paying}
        className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition duration-200 disabled:opacity-50"
      >
        {paying ? "Processing..." : `Pay ৳${order.total_price} Now`}
      </button>
    </div>
  );
};

export default PayForMe;