import React, { memo, useCallback } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../features/cart/cartSlice";
import { toggleWishlist } from "../../features/wishlist/wishlistSlice";
import { ShoppingCart, Heart, Star } from "phosphor-react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";

const ProductCard = ({ product, priority = false }) => {
  const dispatch = useDispatch();

  const isWishlisted = useSelector(
    useCallback(
      (state) => state.wishlist.items.some((item) => item.id === product.id),
      [product.id]
    )
  );

  const handleAddToCart = (e) => {
    e.preventDefault();
    dispatch(addToCart(product));
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    dispatch(toggleWishlist(product));
  };

  const originalPrice = product.price / (1 - product.discountPercentage / 100);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      viewport={{ once: true }}
      className="group relative flex h-full flex-col rounded-xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-md dark:bg-slate-800 dark:border-slate-700"
    >
      {/* Discount Badge */}
      {product.discountPercentage > 0 && (
        <span className="absolute top-3 left-3 z-10 rounded-full bg-red-500 px-2 py-1 text-xs font-bold text-white shadow-sm">
          -{Math.round(product.discountPercentage)}%
        </span>
      )}

      {/* Wishlist Button */}
      <button
        onClick={handleWishlist}
        className="absolute top-3 right-3 z-10 rounded-full bg-white/80 p-2 text-gray-400 backdrop-blur-sm transition-all hover:bg-red-50 hover:text-red-500 dark:bg-slate-900/80 dark:hover:bg-red-900/20"
        title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
      >
        <Heart
          size={20}
          weight={isWishlisted ? "fill" : "bold"}
          className={isWishlisted ? "text-red-500" : ""}
        />
      </button>

      {/* Image Section */}
      <Link
        to={`/products/${product.id}`}
        className="relative block h-48 overflow-hidden rounded-t-xl bg-gray-50 p-4 dark:bg-slate-700/50"
      >
        <img
          src={product.thumbnail}
          alt={product.title}
          priority={priority}
          loading="lazy"
          className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
        />
      </Link>

      {/* Content Section */}
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex items-center gap-1 text-yellow-400">
          <Star weight="fill" size={14} />
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
            {product.rating} ({product.reviews?.length || 0})
          </span>
        </div>

        <Link
          to={`/products/${product.id}`}
          className="mb-2 text-sm font-bold text-gray-800 transition-colors hover:text-primary line-clamp-2 dark:text-white"
        >
          {product.title}
        </Link>

        <p className="mb-4 text-xs text-gray-500 line-clamp-2 dark:text-gray-400">
          {product.description}
        </p>

        <div className="mt-auto flex items-end justify-between">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              ${product.price}
            </span>
            {product.discountPercentage > 0 && (
              <span className="text-xs text-gray-400 line-through">
                ${originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            className="rounded-lg bg-primary/10 p-2.5 text-primary transition-colors hover:bg-primary hover:text-white dark:bg-slate-700 dark:text-blue-400 dark:hover:bg-blue-600 dark:hover:text-white"
            title="Add to Cart"
          >
            <ShoppingCart size={20} weight="bold" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    thumbnail: PropTypes.string.isRequired,
    description: PropTypes.string,
    discountPercentage: PropTypes.number,
    rating: PropTypes.number,
    brand: PropTypes.string,
    reviews: PropTypes.array,
  }).isRequired,

  priority: PropTypes.bool,
};

export default memo(ProductCard);
