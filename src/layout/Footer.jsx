import React from "react";
import { Link } from "react-router-dom";
import {
  FacebookLogo,
  TwitterLogo,
  InstagramLogo,
  LinkedinLogo,
} from "phosphor-react";

const Footer = () => {
  return (
    <footer className="bg-gray-100 p-8 text-gray-600 md:p-12 dark:bg-slate-900 dark:text-gray-400 border-t border-gray-200 dark:border-slate-800 transition-colors duration-300">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <h3 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
              OnlineShop
            </h3>
            <p className="text-sm leading-relaxed">
              Your one-stop shop for the finest products. Quality and customer
              satisfaction are our top priorities.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="hover:text-primary dark:hover:text-white"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  className="hover:text-primary dark:hover:text-white"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  to="/categories"
                  className="hover:text-primary dark:hover:text-white"
                >
                  Categories
                </Link>
              </li>
              <li>
                <Link
                  to="/cart"
                  className="hover:text-primary dark:hover:text-white"
                >
                  My Cart
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              Categories
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/products?category=smartphones"
                  className="hover:text-primary dark:hover:text-white"
                >
                  Electronics
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=mens-shirts"
                  className="hover:text-primary dark:hover:text-white"
                >
                  Apparel
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=groceries"
                  className="hover:text-primary dark:hover:text-white"
                >
                  Groceries
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=home-decoration"
                  className="hover:text-primary dark:hover:text-white"
                >
                  Home & Kitchen
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              Customer Support
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/contact"
                  className="hover:text-primary dark:hover:text-white"
                >
                  Contact Us
                </Link>
              </li>
              <li>FAQ</li>
              <li>Shipping & Returns</li>
              <li>Privacy Policy</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-200 pt-8 dark:border-slate-800">
          <div className="flex flex-col items-center justify-between sm:flex-row">
            <p className="text-sm">© 2025 OnlineShop. All rights reserved.</p>
            <div className="mt-4 flex space-x-4 sm:mt-0">
              <a href="#" className="hover:text-primary dark:hover:text-white">
                <FacebookLogo size={24} />
              </a>
              <a href="#" className="hover:text-primary dark:hover:text-white">
                <TwitterLogo size={24} />
              </a>
              <a href="#" className="hover:text-primary dark:hover:text-white">
                <InstagramLogo size={24} />
              </a>
              <a href="#" className="hover:text-primary dark:hover:text-white">
                <LinkedinLogo size={24} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
