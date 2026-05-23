export default function Footer() {
  return (
    <footer className="mt-20 border-t border-[hsl(180,15%,88%)] bg-[hsl(176,56%,12%)] text-white">
      <div className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="flex flex-col items-center justify-center gap-8 text-center">
          <p className="text-lg font-semibold">Chamfered</p>

          <a
            href="#"
            data-email-obfuscate
            className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-[hsl(176,56%,28%)] shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <ion-icon name="mail-outline" aria-hidden="true" />
            Send an Email
          </a>

          <ul className="flex flex-wrap items-center justify-center gap-3">
            <li>
              <a
                href="https://www.instagram.com/chamfered3d/"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2.5 text-sm font-medium text-white/85 transition hover:bg-white/15 hover:text-white"
                target="_blank"
                rel="noreferrer noopener"
                aria-label="Instagram"
              >
                <ion-icon name="logo-instagram" style={{ fontSize: '1.25rem' }} />
                <span>Instagram</span>
              </a>
            </li>
            <li>
              <a
                href="https://www.tiktok.com/@chamfered3d"
                className="group inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2.5 text-sm font-medium text-white/85 transition hover:bg-white/15 hover:text-white"
                target="_blank"
                rel="noreferrer noopener"
                aria-label="TikTok"
              >
                <img
                  src="/images/tiktok.svg"
                  alt=""
                  aria-hidden="true"
                  width="20"
                  height="20"
                  className="brightness-0 invert opacity-80 transition-opacity group-hover:opacity-100"
                />
                <span>TikTok</span>
              </a>
            </li>
            <li>
              <a
                href="https://www.youtube.com/@chamfered3d"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2.5 text-sm font-medium text-white/85 transition hover:bg-white/15 hover:text-white"
                target="_blank"
                rel="noreferrer noopener"
                aria-label="YouTube"
              >
                <ion-icon name="logo-youtube" style={{ fontSize: '1.25rem' }} />
                <span>YouTube</span>
              </a>
            </li>
          </ul>

          <p className="text-sm text-white/60">&copy; 2026 Chamfered. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
