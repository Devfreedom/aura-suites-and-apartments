import Link from "next/link";
import Footer from "@/components/Footer";

interface LegalPageLayoutProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  updatedAt: string;
  children: React.ReactNode;
}

export default function LegalPageLayout({
  eyebrow,
  title,
  subtitle,
  updatedAt,
  children,
}: LegalPageLayoutProps) {
  return (
    <main className="flex min-h-screen flex-col bg-white selection:bg-gold selection:text-white">
      <section className="relative overflow-hidden bg-navy py-20 text-white">
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-gold/20 to-transparent" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-gold/20 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-gold">
            {eyebrow}
          </div>
          <h1 className="font-serif text-4xl font-bold tracking-tight sm:text-5xl">
            {title}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base font-light text-gray-300 sm:text-lg">
            {subtitle}
          </p>
          <p className="mt-6 text-xs uppercase tracking-[0.2em] text-gold/80">
            Last updated: {updatedAt}
          </p>
        </div>
      </section>

      <section className="flex-1 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div
            className="space-y-8 text-sm leading-relaxed text-gray-600 sm:text-base
              [&_a]:text-gold [&_a]:underline [&_a]:underline-offset-2
              [&_h2]:mt-10 [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-navy
              [&_h3]:mt-6 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-navy
              [&_li]:mb-2 [&_li]:pl-1
              [&_p]:leading-relaxed
              [&_strong]:font-semibold [&_strong]:text-navy
              [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6"
          >
            {children}
          </div>

          <div className="mt-14 rounded-2xl border border-gold/30 bg-[#FBF7EC] p-6 text-center sm:p-8">
            <h2 className="font-serif text-xl font-bold text-navy">
              Questions about this policy?
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Our reservations team is happy to help.
            </p>
            <div className="mt-4 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-xl bg-navy px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#152A49]"
              >
                Contact Us
              </Link>
              <a
                href="mailto:reservations@aurasuitessapartments.com"
                className="inline-flex items-center justify-center rounded-xl border border-navy/20 px-6 py-3 text-sm font-semibold text-navy transition-colors hover:border-navy/40"
              >
                reservations@aurasuitessapartments.com
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
