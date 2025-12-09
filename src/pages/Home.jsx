import React from "react";

// Components
import Hero from "../components/home/Hero";
import CategoriesSection from "../components/home/CategoriesSection";
import FeaturedProducts from "../components/home/FeaturedProducts";
import DealsBanner from "../components/home/DealsBanner";
import BrandsStrip from "../components/home/BrandsStrip";
import SEO from "../components/shared/SEO";
import PageTransition from "../components/shared/PageTransition";

const Home = () => {
  return (
    <PageTransition>
      <div className="space-y-8 pb-12">
        <SEO
          title="Home"
          description="Welcome to OnlineShop - the best place to buy everything you need"
        />

        <Hero />

        <BrandsStrip />

        <CategoriesSection />

        <DealsBanner />

        <FeaturedProducts />
      </div>
    </PageTransition>
  );
};

export default Home;
