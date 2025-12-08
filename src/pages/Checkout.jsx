import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearCart } from "../features/cart/cartSlice";
import { toast } from "react-hot-toast";
import { CircleNotch, ShieldCheck } from "phosphor-react";
import { useCreateOrderMutation } from "../api/dummyProductsApi";

// Components
import AddressForm from "../components/checkout/AddressForm";
import PaymentMethod from "../components/checkout/PaymentMethod";
import PageTransition from "../components/shared/PageTransition";

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const orderPlaced = useRef(false);

  const { items, totalAmount } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const [createOrder, { isLoading: isOrdering }] = useCreateOrderMutation();

  useEffect(() => {
    if (items.length === 0 && !orderPlaced.current) {
      navigate("/products");
      toast.error("Your cart is empty");
    }
  }, [items, navigate]);

  // Form State
  const [formData, setFormData] = useState({
    fullName: user ? `${user.firstName} ${user.lastName}` : "",
    email: user ? user.email : "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("card");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    //  Calculations
    const shipping = totalAmount > 50 ? 0 : 10;
    const tax = totalAmount * 0.05;
    const finalTotal = totalAmount + shipping + tax;

    //  Prepare Order Object
    const newOrder = {
      userId: user?.id || "guest",
      userInfo: {
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        address: `${formData.address}, ${formData.city}, ${formData.postalCode}`,
      },
      paymentMethod,
      products: items.map((item) => ({
        id: item.id,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
        thumbnail: item.image,
      })),
      totalAmount: parseFloat(finalTotal.toFixed(2)),
    };

    try {
      //  Send to Firebase
      await createOrder(newOrder).unwrap();

      //  Success Handling
      orderPlaced.current = true;
      dispatch(clearCart());
      toast.success("Order placed successfully!");
      navigate("/order-success");
    } catch (error) {
      toast.error("Order Failed: " + error.message);
    }
  };

  // Calculations for UI
  const shipping = totalAmount > 50 ? 0 : 10;
  const tax = totalAmount * 0.05;
  const finalTotal = totalAmount + shipping + tax;

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold text-gray-900 dark:text-white">
          Checkout
        </h1>

        <form
          onSubmit={handlePlaceOrder}
          className="grid grid-cols-1 gap-8 lg:grid-cols-3"
        >
          {/* LEFT COLUMN: FORMS */}
          <div className="lg:col-span-2">
            <AddressForm formData={formData} handleChange={handleInputChange} />
            <PaymentMethod
              selectedMethod={paymentMethod}
              setSelectedMethod={setPaymentMethod}
            />
          </div>

          {/* RIGHT COLUMN: SUMMARY */}
          <div className="lg:col-span-1">
            <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <h3 className="mb-4 text-lg font-bold text-gray-800 dark:text-white">
                Order Summary
              </h3>

              {/* Items List (Small) */}
              <div className="mb-4 max-h-60 overflow-y-auto space-y-3 custom-scrollbar">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded border bg-gray-50 dark:border-gray-600 dark:bg-gray-700">
                      <img
                        src={item.image}
                        alt=""
                        className="h-full w-full object-contain p-1"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="line-clamp-1 text-sm font-medium text-gray-800 dark:text-gray-100">
                        {item.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-200">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-2 text-sm dark:border-gray-700">
                <div className="flex justify-between text-gray-600 dark:text-gray-300">
                  <span>Subtotal</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-300">
                  <span>Shipping</span>
                  <span
                    className={
                      shipping === 0 ? "text-green-600 dark:text-green-400" : ""
                    }
                  >
                    {shipping === 0 ? "Free" : `$${shipping}`}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-300">
                  <span>Tax (5%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-4 flex justify-between border-t border-gray-100 pt-4 text-xl font-bold text-gray-900 dark:border-gray-700 dark:text-white">
                <span>Total</span>
                <span>${finalTotal.toFixed(2)}</span>
              </div>

              <button
                type="submit"
                disabled={isOrdering}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 font-bold text-white shadow-lg transition-transform hover:scale-[1.02] hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300 dark:disabled:bg-gray-600"
              >
                {isOrdering ? (
                  <>
                    <CircleNotch className="animate-spin" size={24} />{" "}
                    Processing...
                  </>
                ) : (
                  <>
                    Place Order <ShieldCheck size={24} />
                  </>
                )}
              </button>

              <p className="mt-4 text-center text-xs text-gray-400 dark:text-gray-500">
                Transaction is secured with 256-bit SSL encryption.
              </p>
            </div>
          </div>
        </form>
      </div>
    </PageTransition>
  );
};

export default Checkout;
