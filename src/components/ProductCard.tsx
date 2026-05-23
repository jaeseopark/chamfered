import { Link } from 'react-router';
import type { Product } from '../utils/content';

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const { data, id } = product;
  const {
    title,
    price,
    originalPrice,
    badge,
    badgeColor = 'green',
    image,
    purchase,
  } = data;

  const hasPhysicalPurchase = !!(
    purchase?.physical?.ebay ||
    purchase?.physical?.amazon ||
    purchase?.physical?.etsy
  );
  const hasDigitalPurchase = !!(
    purchase?.digital?.makerworld ||
    purchase?.digital?.printables ||
    purchase?.digital?.thingiverse
  );

  const badgeBg = badgeColor === 'red' ? 'bg-[hsl(356,65%,63%)]' : 'bg-[hsl(148,45%,58%)]';
  const productHref = `/products/${id}`;

  let linkLabel = 'View product';
  if (hasDigitalPurchase && hasPhysicalPurchase) {
    linkLabel = 'Shop and download';
  } else if (hasDigitalPurchase) {
    linkLabel = 'Download options';
  } else if (hasPhysicalPurchase) {
    linkLabel = 'Purchase options';
  }

  let descriptionText = 'Marketplace links coming soon.';
  if (hasPhysicalPurchase && hasDigitalPurchase) {
    descriptionText = 'Includes both shipped product options and digital downloads.';
  } else if (hasPhysicalPurchase) {
    descriptionText = 'Compare live marketplace options for shipped parts and accessories.';
  } else if (hasDigitalPurchase) {
    descriptionText = 'Open the product page to access download links and the optional support flow.';
  }

  return (
    <div className="group overflow-hidden rounded-xl border border-[hsl(0,0%,90%)] bg-white shadow-sm transition-shadow duration-300 hover:shadow-lg">
      <Link to={productHref} className="block">
        <div className="relative overflow-hidden aspect-[4/5] bg-[hsl(0,0%,96%)]">
          <img
            src={image}
            alt={title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-3">
            {badge && (
              <span
                className={`inline-flex items-center rounded-full ${badgeBg} px-2.5 py-1 text-xs font-semibold text-white`}
              >
                {badge}
              </span>
            )}

            <div className="flex flex-wrap justify-end gap-2">
              {hasPhysicalPurchase && (
                <span className="inline-flex items-center rounded-full bg-white/90 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-[hsl(0,0%,25%)]">
                  Physical
                </span>
              )}
              {hasDigitalPurchase && (
                <span className="inline-flex items-center rounded-full bg-[hsl(176,35%,63%)]/90 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-white">
                  Digital
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>

      <div className="space-y-4 p-5 sm:p-4">
        <h3 className="line-clamp-2 text-sm font-semibold leading-6 text-[hsl(0,0%,9%)] sm:text-base">
          <Link to={productHref} className="transition-colors hover:text-[hsl(176,35%,50%)]">
            {title}
          </Link>
        </h3>

        <div className="flex items-end justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-[hsl(0,0%,9%)]">${price.toFixed(2)}</span>
            {originalPrice && (
              <span className="text-sm text-[hsl(0,0%,44%)] line-through">
                ${originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          <Link
            to={productHref}
            className="inline-flex items-center gap-2 rounded-full border border-[hsl(0,0%,90%)] px-3 py-2 text-xs font-semibold text-[hsl(0,0%,25%)] transition-colors hover:border-[hsl(176,35%,63%)] hover:text-[hsl(176,56%,28%)]"
          >
            {linkLabel}
            <ion-icon name="arrow-forward-outline" aria-hidden="true" />
          </Link>
        </div>

        <p className="text-sm text-[hsl(0,0%,44%)]">{descriptionText}</p>
      </div>
    </div>
  );
}
