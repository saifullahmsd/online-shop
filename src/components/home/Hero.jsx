import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ShoppingBag } from "phosphor-react";

function Hero() {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-linear-to-r from-blue-600 to-blue-800 text-white shadow-lg dark:from-blue-900 dark:to-slate-900">
      <div className="container mx-auto flex flex-col items-center px-6 py-16 text-center md:flex-row md:text-left">
        {/* Text Content */}
        <div className="z-10 w-full md:w-1/2">
          <span className="mb-2 inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
            New Arrivals 2025
          </span>
          <h1 className="mb-4 text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
            Discover the Best <br />
            <span className="text-yellow-400">Deals Online</span>
          </h1>
          <p className="mb-8 text-lg text-blue-100 md:max-w-lg">
            Shop the latest trends in electronics, fashion, and home essentials.
            Enjoy free shipping on orders over $50.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center md:justify-start">
            <Link
              to="/products"
              className="flex items-center justify-center gap-2 rounded-full bg-yellow-400 px-8 py-3 font-bold text-blue-900 transition-transform hover:scale-105 hover:bg-yellow-300"
            >
              Shop Now <ShoppingBag weight="fill" size={20} />
            </Link>
            <Link
              to="/categories"
              className="flex items-center justify-center gap-2 rounded-full border-2 border-white px-8 py-3 font-bold text-white transition-all hover:bg-white hover:text-blue-600"
            >
              Explore Categories <ArrowRight weight="bold" size={20} />
            </Link>
          </div>
        </div>

        {/* Decorative Background */}
        <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-white/10 blur-3xl md:h-[500px] md:w-[500px]"></div>
        <div className="absolute -bottom-20 left-0 h-64 w-64 rounded-full bg-yellow-400/20 blur-3xl"></div>
      </div>
    </section>
  );
}

export default Hero;
