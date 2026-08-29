import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Consistent page gutter and max width. */
export function Container({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-6xl px-5 sm:px-8", className)}>
      {children}
    </div>
  );
}

/**
 * A page section with the stencil number eyebrow used throughout the design.
 *
 * `id` doubles as the scroll anchor and the `aria-labelledby` target, so
 * every section is reachable and announced correctly.
 */
export function Section({
  id,
  index,
  eyebrow,
  title,
  lead,
  className,
  children,
}: {
  id: string;
  /** Stencil number, e.g. 3 renders as "03". */
  index?: number;
  eyebrow?: string;
  title?: ReactNode;
  lead?: ReactNode;
  className?: string;
  children?: ReactNode;
}) {
  const headingId = `${id}-heading`;

  return (
    <section
      id={id}
      aria-labelledby={title ? headingId : undefined}
      className={cn("py-20 sm:py-28", className)}
    >
      <Container>
        {/*
          The eyebrow, heading and lead are marked up for the reveal here
          rather than at each call site, so every section on the site animates
          in consistently. `data-animate` is inert until the motion layer adds
          `.js-motion` — the copy itself is plain server-rendered markup.
        */}
        {(eyebrow || index !== undefined) && (
          <p data-animate="up" className="eyebrow mb-4 flex items-center gap-3">
            {index !== undefined && (
              <span className="tabular-nums">
                {String(index).padStart(2, "0")}
              </span>
            )}
            {index !== undefined && eyebrow && (
              <span aria-hidden className="h-px w-8 bg-hazard/50" />
            )}
            {eyebrow}
          </p>
        )}

        {title && (
          <h2
            id={headingId}
            data-animate="up"
            className="max-w-3xl text-3xl leading-[1.1] font-semibold tracking-tight uppercase sm:text-5xl"
          >
            {title}
          </h2>
        )}

        {lead && (
          <p data-animate="up" className="mt-5 max-w-2xl text-lg text-steel">
            {lead}
          </p>
        )}

        {children}
      </Container>
    </section>
  );
}

type ButtonVariant = "primary" | "secondary" | "ghost";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-hazard text-void hover:bg-ember hover:text-paper focus-visible:bg-ember",
  secondary:
    "border border-hairline bg-surface text-paper hover:border-hazard hover:text-hazard",
  ghost: "text-steel hover:text-hazard",
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-sm px-6 py-3 font-display text-sm font-semibold tracking-[0.14em] uppercase transition-colors duration-200 disabled:opacity-50";

/**
 * Renders an `<a>` for external destinations and a `next/link` internally.
 *
 * Outbound links to Breely carry `data-conversion`, which the analytics layer
 * uses to track the handoff — Breely owns every transaction, so these clicks
 * are the site's actual conversion events.
 */
export function ButtonLink({
  href,
  variant = "primary",
  conversion,
  className,
  children,
  ...rest
}: {
  href: string;
  variant?: ButtonVariant;
  /** Conversion label, e.g. "book-tour". Set on outbound Breely links. */
  conversion?: string;
  className?: string;
  children: ReactNode;
} & Omit<ComponentProps<"a">, "href" | "className">) {
  const classes = cn(base, variants[variant], className);
  const isExternal = href.startsWith("http");

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        data-conversion={conversion}
        className={classes}
        {...rest}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} data-conversion={conversion} className={classes}>
      {children}
    </Link>
  );
}

/**
 * Diagonal caution-tape rule, used to separate major sections.
 *
 * Purely decorative, so `aria-hidden`: it marks a boundary visually, and the
 * headings either side already carry that structure for anyone not seeing it.
 */
export function HazardRule({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("hazard-stripe h-2.5 w-full opacity-90", className)}
    />
  );
}
