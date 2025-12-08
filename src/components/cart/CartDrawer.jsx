import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { X, Trash, Plus, Minus, ShoppingBag } from "phosphor-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  closeCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
} from "../../features/cart/cartSlice";

const CartDrawer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, totalAmount, isCartOpen } = useSelector((state) => state.cart);

  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isCartOpen]);

  const handleCheckout = () => {
    dispatch(closeCart());
    navigate("/checkout");
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => dispatch(closeCart())}
            className="fixed inset-0 z-[99] bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 z-100 w-full max-w-md bg-white shadow-2xl dark:bg-slate-900"
          >
            <div className="flex h-full flex-col text-gray-900 dark:text-white">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-slate-800">
                <h2 className="text-lg font-bold">
                  Shopping Cart ({items.length})
                </h2>
                <button
                  onClick={() => dispatch(closeCart())}
                  className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-slate-800"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {items.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center space-y-4 text-gray-500">
                    <ShoppingBag size={64} className="text-gray-300" />
                    <p>Your cart is empty</p>
                    <button
                      onClick={() => dispatch(closeCart())}
                      className="font-semibold text-primary hover:underline"
                    >
                      Start Shopping
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {items.map((item) => (
                      <motion.div
                        layout //
                        key={item.id}
                        className="flex gap-4"
                      >
                        {/* Image */}
                        <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 bg-gray-50">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="h-full w-full object-contain"
                          />
                        </div>
                        {/* Info */}
                        <div className="flex flex-1 flex-col justify-between">
                          <div>
                            <h3 className="line-clamp-1 text-sm font-semibold">
                              {item.title}
                            </h3>
                            <p className="text-sm text-gray-500">
                              ${item.price}
                            </p>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center rounded-md border border-gray-200 dark:border-slate-700">
                              <button
                                onClick={() =>
                                  dispatch(decreaseQuantity(item.id))
                                }
                                className="p-1 hover:bg-gray-100 dark:hover:bg-slate-800"
                              >
                                <Minus size={14} />
                              </button>
                              <span className="w-8 text-center text-xs font-semibold">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  dispatch(increaseQuantity(item.id))
                                }
                                className="p-1 hover:bg-gray-100 dark:hover:bg-slate-800"
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                            <button
                              onClick={() => dispatch(removeFromCart(item.id))}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash size={18} />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {items.length > 0 && (
                <div className="border-t border-gray-100 bg-gray-50 p-6 dark:bg-slate-800 dark:border-slate-700">
                  <div className="mb-4 flex justify-between text-lg font-bold">
                    <span>Subtotal</span>
                    <span>${totalAmount.toFixed(2)}</span>
                  </div>
                  <button
                    onClick={handleCheckout}
                    className="w-full rounded-full bg-primary py-3 font-bold text-white shadow-lg transition-transform hover:scale-[1.02]"
                  >
                    Checkout Now
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
