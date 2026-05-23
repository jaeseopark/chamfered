import { useState, useMemo } from 'react';
import { getProducts } from '../utils/content';
import ProductCard from '../components/ProductCard';

type SortKey = 'newest' | 'nameAsc' | 'nameDec' | 'priceAsc' | 'priceDec';

export default function ProductsPage() {
  const products = useMemo(() => getProducts(), []);
  const [sortKey, setSortKey] = useState<SortKey>('newest');

  const sortedProducts = useMemo(() => {
    const arr = [...products];
    switch (sortKey) {
      case 'nameAsc':
        return arr.sort((a, b) => a.data.title.localeCompare(b.data.title));
      case 'nameDec':
        return arr.sort((a, b) => b.data.title.localeCompare(a.data.title));
      case 'priceAsc':
        return arr.sort((a, b) => a.data.price - b.data.price);
      case 'priceDec':
        return arr.sort((a, b) => b.data.price - a.data.price);
      default:
        return arr.sort((a, b) =>
          (b.data.launchDate ?? '').localeCompare(a.data.launchDate ?? '')
        );
    }
  }, [products, sortKey]);

  return (
    <main className="min-h-[70vh] bg-white pb-20">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="my-8 flex items-center justify-between gap-4">
          <h1 className="text-4xl font-medium text-[hsl(0,0%,9%)]">Products</h1>
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
            className="rounded-xl border border-[hsl(0,0%,88%)] bg-white px-3 py-2 text-sm text-[hsl(0,0%,25%)] focus:border-[hsl(176,35%,63%)] focus:outline-none"
          >
            <option value="newest">Newest first</option>
            <option value="nameAsc">Name A–Z</option>
            <option value="nameDec">Name Z–A</option>
            <option value="priceAsc">Price: low to high</option>
            <option value="priceDec">Price: high to low</option>
          </select>
        </div>
      </div>

      <section>
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4 xl:grid-cols-5">
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
