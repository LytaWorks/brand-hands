import Image from "next/image";
import Link from "next/link";
import { ArrowDown } from "lucide-react";
import BakeWeek from "@/components/BakeWeek";
import Menu from "@/components/Menu";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6 sm:pt-12 lg:pt-16">
          <section className="grid items-center gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
            <div>
              <h1 className="animate-rise font-display text-[clamp(2.5rem,7vw,4.75rem)] font-semibold leading-[1.02] tracking-[-0.02em]">
                <span className="block">Baked Friday morning.</span>{" "}
                <span className="block">At your door by the weekend.</span>
              </h1>
              <p className="mt-5 max-w-xl animate-rise text-lg leading-relaxed text-mocha [animation-delay:80ms]">
                Loaf cakes and cupcakes made by hand, in small batches, with
                real butter and no preservatives. Order by Thursday 5pm and we
                deliver to your hostel on Friday afternoon or over the weekend.
              </p>
              <div className="mt-7 flex animate-rise flex-wrap items-center gap-x-6 gap-y-3 [animation-delay:160ms]">
                <a href="#menu" className="btn btn-primary">
                  See the menu
                  <ArrowDown className="size-4" aria-hidden />
                </a>
                <Link
                  href="/tracking"
                  className="py-2 font-semibold underline decoration-crust decoration-2 underline-offset-4 transition-colors duration-200 hover:decoration-cocoa"
                >
                  Track an order
                </Link>
              </div>
            </div>

            <div className="relative aspect-[3/2] w-full overflow-hidden rounded-card bg-oat lg:aspect-[4/5]">
              <Image
                src="/images/hero.jpg"
                alt="A glazed lemon loaf cake, sliced, on a cooling rack"
                fill
                preload
                fetchPriority="high"
                sizes="(min-width: 1152px) 500px, (min-width: 1024px) 45vw, 100vw"
                className="object-cover"
              />
            </div>
          </section>

          <div className="mt-8 animate-rise [animation-delay:240ms] sm:mt-12">
            <BakeWeek />
          </div>
        </div>

        <Menu />
      </main>
      <Footer />
    </>
  );
}
