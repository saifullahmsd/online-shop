import React from "react";

const brandLogos = [
  {
    name: "Apple",
    logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
  },
  {
    name: "Samsung",
    logo: "https://upload.wikimedia.org/wikipedia/commons/9/9d/L%27Or%C3%A9al_logo.svg",
  },
  {
    name: "Sony",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg",
  },
  {
    name: "Adidas",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg",
  },
  {
    name: "Nike",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg",
  },
  {
    name: "L'Oréal",
    logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
  },
  {
    name: "Rolex",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg",
  },
];

const BrandsStrip = () => {
  return (
    <section className="py-10 border-y border-gray-100 bg-white dark:bg-slate-900 dark:border-slate-800 transition-colors">
      <div className="container mx-auto px-4">
        <h3 className="text-center text-sm font-bold tracking-widest text-gray-400 uppercase mb-8 dark:text-gray-500">
          Trusted by Top Brands
        </h3>

        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
          {brandLogos.map((brand, index) => (
            <div
              key={index}
              className="group flex items-center justify-center opacity-50 grayscale transition-all duration-300 hover:grayscale-0 hover:opacity-100"
            >
              {/* Added dark:invert to make black logos white in dark mode */}
              <img
                src={brand.logo}
                alt={`${brand.name} logo`}
                className="h-8 md:h-12 w-auto object-contain dark:invert"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandsStrip;
