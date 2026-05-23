import { Link } from 'react-router';
import { useMemo } from 'react';
import { getProducts } from '../utils/content';
import ProductCard from '../components/ProductCard';
import HeroSection from '../components/HeroSection';
import ContactSection from '../components/ContactSection';

export default function HomePage() {
  const featuredProducts = useMemo(
    () =>
      getProducts()
        .filter((p) => p.data.featured || p.data.badge === 'New')
        .sort((a, b) => (a.data.order ?? 99) - (b.data.order ?? 99)),
    []
  );

  return (
    <main>
      <HeroSection
        backgroundImage="/images/hero-product.jpg"
        title="Practical 3D prints and digital files for everyday use."
        description="Browse printed parts, downloadable STL files, and custom fabrication work. Designed for everyday utility, built for makers."
        ctaText="Shop products"
        ctaHref="/products"
        secondaryCtaText="Learn more"
        secondaryCtaHref="/about"
      />

      {/* Featured products */}
      <section id="shop" className="scroll-mt-20 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <span className="inline-flex rounded-full bg-[hsl(176,35%,63%)]/12 px-4 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-[hsl(176,56%,28%)]">
              Featured products
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4 xl:grid-cols-5">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 rounded-full bg-[hsl(176,35%,63%)] px-6 py-3 text-sm font-semibold text-white shadow-md hover:-translate-y-0.5 hover:bg-[hsl(176,35%,50%)] hover:shadow-lg"
            >
              See more
              <ion-icon name="arrow-forward-outline" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <ContactSection />
    </main>
  );
}
