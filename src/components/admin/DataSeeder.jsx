import React, { useState } from "react";
import { db } from "../../firebase/firebaseConfig";
import { writeBatch, doc, collection } from "firebase/firestore";
import { toast } from "react-hot-toast";

const DataSeeder = () => {
  const [isLoading, setIsLoading] = useState(false);

  const seedData = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch data from DummyJSON
      const response = await fetch("https://dummyjson.com/products?limit=100");
      const data = await response.json();
      const products = data.products;

      // 2. Upload to Firestore (Batch writes for speed)
      const batch = writeBatch(db);

      products.forEach((product) => {
        // Use the product ID as the document ID
        const docRef = doc(db, "products", product.id.toString());
        batch.set(docRef, {
          ...product,
          // Ensure numbers are numbers
          price: Number(product.price),
          stock: Number(product.stock),
          rating: Number(product.rating),
          discountPercentage: Number(product.discountPercentage),
          createdAt: new Date().toISOString(),
        });
      });

      await batch.commit();
      toast.success(
        `Successfully uploaded ${products.length} products to Firestore!`
      );
    } catch (error) {
      console.error(error);
      toast.error("Failed to seed data: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-xl bg-yellow-50 border-yellow-200 my-4">
      <h3 className="font-bold text-yellow-800">⚠️ Admin Database Tool</h3>
      <p className="text-sm text-yellow-700 mb-4">
        Your database is currently empty. Click below to fetch products from
        DummyJSON and upload them to your Firebase.
      </p>
      <button
        onClick={seedData}
        disabled={isLoading}
        className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 disabled:opacity-50"
      >
        {isLoading ? "Uploading..." : "Seed Database with Products"}
      </button>
    </div>
  );
};

export default DataSeeder;
