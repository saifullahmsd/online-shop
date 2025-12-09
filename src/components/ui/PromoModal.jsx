import React, { useState, useEffect } from "react";
import { X, EnvelopeSimple, Copy } from "phosphor-react";
import { toast } from "react-hot-toast";

const PromoModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    // 1. Check if user has already seen the popup in this session
    const hasSeenPromo = sessionStorage.getItem("hasSeenPromo");

    if (!hasSeenPromo) {
      // 2. If not, set a timer to show it after 5 seconds
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem("hasSeenPromo", "true");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;

    // Simulate API call
    setTimeout(() => {
      setIsSubmitted(true);

      sessionStorage.setItem("hasSeenPromo", "true");
    }, 500);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText("WELCOME10");
    toast.success("Code copied to clipboard!");
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={handleClose}
      >
        {/* Modal Card */}
        <div
          className="relative mx-4 flex w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl transition-transform duration-300 md:h-[450px]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute right-4 top-4 z-10 rounded-full bg-white/80 p-2 text-gray-500 hover:bg-white hover:text-red-500"
          >
            <X size={20} weight="bold" />
          </button>

          {/* LEFT: Image (Hidden on mobile) */}
          <div className="hidden w-1/2 bg-gray-100 md:block">
            <img
              src="https://images.unsplash.com/photo-1555529771-835f59fc5efe?q=80&w=1000&auto=format&fit=crop"
              alt="Gift"
              className="h-full w-full object-cover"
            />
          </div>

          {/* RIGHT: Content */}
          <div className="flex w-full flex-col justify-center p-8 md:w-1/2 md:p-12">
            {!isSubmitted ? (
              // STEP 1: Signup Form
              <>
                <div className="mb-2 text-sm font-bold uppercase tracking-wider text-primary">
                  Limited Time Offer
                </div>
                <h2 className="mb-4 text-3xl font-bold text-gray-900">
                  Get 10% Off Your First Order!
                </h2>
                <p className="mb-8 text-gray-500">
                  Join the FlavorFusion family and be the first to know about
                  new arrivals and exclusive sales.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="relative">
                    <EnvelopeSimple
                      size={20}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full rounded-lg bg-gray-900 py-3 font-bold text-white transition hover:bg-gray-800"
                  >
                    Unlock My 10% Off
                  </button>
                </form>
                <p className="mt-4 text-center text-xs text-gray-400">
                  No spam, we promise. Unsubscribe anytime.
                </p>
              </>
            ) : (
              // STEP 2: Success & Coupon Code
              <div className="text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-500">
                  <EnvelopeSimple size={32} weight="fill" />
                </div>
                <h2 className="mb-2 text-2xl font-bold text-gray-900">
                  You're on the list!
                </h2>
                <p className="mb-6 text-gray-500">
                  Here is your discount code:
                </p>

                <div
                  onClick={copyToClipboard}
                  className="group relative mx-auto flex max-w-xs cursor-pointer items-center justify-between rounded-lg border-2 border-dashed border-primary bg-blue-50 px-4 py-3 hover:bg-blue-100"
                >
                  <span className="font-mono text-xl font-bold tracking-widest text-primary">
                    WELCOME10
                  </span>
                  <Copy
                    size={20}
                    className="text-gray-400 group-hover:text-primary"
                  />

                  {/* Tooltip */}
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-xs text-white opacity-0 transition group-hover:opacity-100">
                    Click to copy
                  </div>
                </div>

                <button
                  onClick={handleClose}
                  className="mt-8 text-sm font-semibold text-gray-500 underline hover:text-gray-800"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PromoModal;
