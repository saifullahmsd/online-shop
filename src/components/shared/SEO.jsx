import React from "react";
import { Helmet } from "react-helmet";

const SEO = ({ title, description, keywords, image, url }) => {
  const siteName = "OnlineShop";
  const siteUrl = window.location.origin;

  const defaultDescription = "Shop the best products at unbeatable prices.";

  const defaultImage =
    "https://placehold.co/1200x630/2563EB/FFFFFF.png?text=OnlineShop";

  const metaTitle = title ? `${title} | ${siteName}` : siteName;
  const metaDescription = description || defaultDescription;
  const metaImage = image || defaultImage;
  const metaUrl = url || siteUrl;

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{metaTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta
        name="keywords"
        content={keywords || "ecommerce, shop, online store, deals"}
      />

      {/* Open Graph (Facebook/WhatsApp) */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:url" content={metaUrl} />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaImage} />
    </Helmet>
  );
};

export default SEO;
