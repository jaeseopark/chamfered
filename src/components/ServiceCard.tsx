interface Props {
  icon: string;
  title: string;
  children: React.ReactNode;
}

export default function ServiceCard({ icon, title, children }: Props) {
  return (
    <div className="rounded-[1.5rem] border border-[hsl(180,15%,88%)] bg-white/95 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.06)] backdrop-blur">
      <h3 className="mb-3 flex items-center gap-3 text-[hsl(0,0%,9%)]">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[hsl(176,35%,63%)]/12 text-[hsl(176,56%,28%)]">
          <ion-icon name={icon} aria-hidden="true" />
        </span>
        <span className="font-semibold">{title}</span>
      </h3>
      <p className="text-sm leading-relaxed text-[hsl(0,0%,44%)]">{children}</p>
    </div>
  );
}
