import { useState, useRef } from 'react';
import { useParams, Link } from 'react-router';
import { marked } from 'marked';
import { getProduct } from '../utils/content';
import { PAYPAL_DONATION_URL } from '../consts';

type DialogStage = 'donation' | 'downloads';

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const product = getProduct(slug ?? '');

  const [dialogStage, setDialogStage] = useState<DialogStage>('donation');
  const dialogRef = useRef<HTMLDialogElement>(null);

  if (!product) {
    return (
      <main className="min-h-[70vh] pb-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-3xl font-bold text-[hsl(0,0%,9%)]">Product not found</h1>
          <Link
            to="/products"
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[hsl(176,35%,45%)] hover:text-[hsl(176,35%,35%)]"
          >
            <ion-icon name="arrow-back-outline" aria-hidden="true" />
            Back to products
          </Link>
        </div>
      </main>
    );
  }

  const { data, body } = product;

  const physicalPurchaseLinks = [
    data.purchase.physical?.ebay
      ? { href: data.purchase.physical.ebay, label: 'Buy on eBay', icon: 'pricetag-outline', accent: 'bg-[#e53238]' }
      : null,
    data.purchase.physical?.amazon
      ? { href: data.purchase.physical.amazon, label: 'Buy on Amazon', icon: 'logo-amazon', accent: 'bg-[#ff9900]' }
      : null,
    data.purchase.physical?.etsy
      ? { href: data.purchase.physical.etsy, label: 'Buy on Etsy', icon: 'bag-handle-outline', accent: 'bg-[#f1641e]' }
      : null,
  ].filter((link): link is NonNullable<typeof link> => link !== null);

  const digitalPurchaseLinks = [
    data.purchase.digital?.makerworld
      ? { href: data.purchase.digital.makerworld, label: 'Download from MakerWorld', icon: 'cube-outline', accent: 'bg-[#0f766e]' }
      : null,
    data.purchase.digital?.printables
      ? { href: data.purchase.digital.printables, label: 'Download from Printables', icon: 'print-outline', accent: 'bg-[#fa6831]' }
      : null,
    data.purchase.digital?.thingiverse
      ? { href: data.purchase.digital.thingiverse, label: 'Download from Thingiverse', icon: 'layers-outline', accent: 'bg-[#248bfb]' }
      : null,
  ].filter((link): link is NonNullable<typeof link> => link !== null);

  const productMode =
    physicalPurchaseLinks.length > 0 && digitalPurchaseLinks.length > 0
      ? 'Physical + digital'
      : digitalPurchaseLinks.length > 0
        ? 'Digital file'
        : 'Physical product';

  const bodyHtml = marked.parse(body) as string;

  const openDialog = () => {
    setDialogStage('donation');
    dialogRef.current?.showModal();
  };

  const closeDialog = () => {
    dialogRef.current?.close();
    setDialogStage('donation');
  };

  return (
    <>
      <main className="min-h-[70vh] bg-white pb-20">
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/#shop"
            className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-[hsl(176,35%,45%)] transition-colors hover:text-[hsl(176,35%,35%)]"
          >
            <ion-icon name="arrow-back-outline" aria-hidden="true" />
            Back to products
          </Link>

          <article className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)] lg:gap-12">
            <div className="space-y-6">
              <div className="overflow-hidden rounded-[1.5rem] border border-[hsl(0,0%,90%)] bg-[hsl(0,0%,97%)]">
                <img
                  src={data.image}
                  alt={data.title}
                  className="aspect-[4/5] w-full object-cover"
                />
              </div>

              <div className="rounded-[1.5rem] border border-[hsl(0,0%,90%)] bg-[hsl(0,0%,99%)] p-6">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex rounded-full bg-[hsl(176,35%,63%)]/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-[hsl(176,56%,28%)]">
                    {productMode}
                  </span>
                  {data.badge && (
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold text-white ${data.badgeColor === 'red' ? 'bg-[hsl(356,65%,63%)]' : 'bg-[hsl(148,45%,58%)]'}`}
                    >
                      {data.badge}
                    </span>
                  )}
                </div>

                <div
                  className="prose prose-sm mt-5 max-w-none text-[hsl(0,0%,30%)]"
                  dangerouslySetInnerHTML={{ __html: bodyHtml }}
                />
              </div>
            </div>

            <div className="lg:sticky lg:top-24">
              <div className="rounded-[1.5rem] border border-[hsl(0,0%,90%)] bg-white p-6 shadow-sm">
                <h1 className="text-3xl font-bold leading-tight text-[hsl(0,0%,9%)] sm:text-4xl">
                  {data.title}
                </h1>

                <div className="mt-4 flex items-center gap-3">
                  <p className="text-2xl font-bold text-[hsl(0,0%,9%)]">
                    ${data.price.toFixed(2)}
                  </p>
                  {data.originalPrice && (
                    <p className="text-base text-[hsl(0,0%,44%)] line-through">
                      ${data.originalPrice.toFixed(2)}
                    </p>
                  )}
                </div>

                <div className="mt-6 rounded-2xl border border-[hsl(0,0%,92%)] bg-[hsl(0,0%,99%)] p-4 text-sm text-[hsl(0,0%,35%)]">
                  <div className="flex items-center justify-between gap-3 border-b border-[hsl(0,0%,92%)] pb-3">
                    <span className="font-medium text-[hsl(0,0%,25%)]">Format</span>
                    <span>{productMode}</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-3 border-b border-[hsl(0,0%,92%)] pb-3">
                    <span className="font-medium text-[hsl(0,0%,25%)]">Physical marketplaces</span>
                    <span>{physicalPurchaseLinks.length}</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <span className="font-medium text-[hsl(0,0%,25%)]">Digital download links</span>
                    <span>{digitalPurchaseLinks.length}</span>
                  </div>
                </div>

                {physicalPurchaseLinks.length > 0 && (
                  <div className="mt-8">
                    <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-[hsl(0,0%,38%)]">
                      Buy a finished part
                    </h2>
                    <div className="mt-4 flex flex-wrap gap-3">
                      {physicalPurchaseLinks.map((link) => (
                        <a
                          key={link.href}
                          href={link.href}
                          target="_blank"
                          rel="noreferrer noopener"
                          className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white transition duration-200 hover:brightness-95 ${link.accent}`}
                        >
                          <ion-icon name={link.icon} aria-hidden="true" />
                          {link.label}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {digitalPurchaseLinks.length > 0 && (
                  <div className="mt-8">
                    <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-[hsl(0,0%,38%)]">
                      Download the design
                    </h2>
                    <p className="mt-3 text-sm text-[hsl(0,0%,44%)]">
                      Use the support prompt before revealing the available download platforms.
                    </p>
                    <button
                      type="button"
                      onClick={openDialog}
                      className="mt-4 inline-flex items-center gap-2 rounded-full bg-[hsl(176,35%,63%)] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[hsl(176,35%,50%)]"
                      aria-haspopup="dialog"
                    >
                      <ion-icon name="download-outline" aria-hidden="true" />
                      Download design file
                    </button>
                  </div>
                )}
              </div>
            </div>
          </article>
        </section>
      </main>

      {digitalPurchaseLinks.length > 0 && (
        <dialog
          ref={dialogRef}
          className="w-full max-w-md rounded-2xl border border-[hsl(0,0%,85%)] p-0 shadow-2xl backdrop:bg-black/50"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeDialog();
          }}
        >
          <div className="p-6 sm:p-7">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[hsl(176,56%,28%)]">
                  Digital support
                </p>
                <h2 className="mt-2 text-2xl font-bold text-[hsl(0,0%,9%)]">
                  Support this design
                </h2>
              </div>
              <button
                type="button"
                onClick={closeDialog}
                className="rounded-full border border-[hsl(0,0%,85%)] px-3 py-1 text-sm font-medium text-[hsl(0,0%,35%)]"
              >
                Close
              </button>
            </div>

            {dialogStage === 'donation' ? (
              <div>
                <p className="mb-5 text-sm text-[hsl(0,0%,35%)]">
                  Would you like to support Chamfered with a donation before downloading?
                </p>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <a
                    href={PAYPAL_DONATION_URL}
                    target="_blank"
                    rel="noreferrer noopener"
                    onClick={() => setDialogStage('downloads')}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition duration-200"
                    style={{ backgroundColor: 'rgb(255, 209, 64)', color: 'rgb(0, 48, 135)' }}
                  >
                    <ion-icon name="logo-paypal" aria-hidden="true" />
                    Donate
                  </a>
                  <button
                    type="button"
                    onClick={() => setDialogStage('downloads')}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[hsl(176,35%,63%)] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[hsl(176,35%,50%)]"
                  >
                    <ion-icon name="arrow-forward-outline" aria-hidden="true" />
                    Skip
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <p className="mb-5 text-sm text-[hsl(0,0%,35%)]">
                  Download links are available below.
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  {digitalPurchaseLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white transition duration-200 hover:brightness-95 ${link.accent}`}
                    >
                      <ion-icon name={link.icon} aria-hidden="true" />
                      {link.label}
                    </a>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setDialogStage('donation')}
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[hsl(0,0%,90%)] px-5 py-3 text-sm font-semibold text-[hsl(0,0%,25%)] transition-colors hover:bg-[hsl(0,0%,80%)]"
                >
                  <ion-icon name="arrow-back-outline" aria-hidden="true" />
                  Back
                </button>
              </div>
            )}
          </div>
        </dialog>
      )}
    </>
  );
}
