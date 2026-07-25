// "use client";

// import { motion } from "framer-motion";
// import { ArrowRight } from "lucide-react";
// import { Button } from "@/components/ui/Button";
// // add this import at the top
// import { HeroScrollStrip } from "./HeroScrollStrip";
// import { BannerSlider } from "./BannerSlider";


// export function Hero() {
//   return (
//   <>
//     <BannerSlider />
//     <section className="relative overflow-hidden bg-satin">
//       <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white/45 to-transparent" />
//       <div className="pointer-events-none absolute -left-16 top-24 h-64 w-64 rounded-full bg-champagne/35 blur-3xl" />
//       <div className="pointer-events-none absolute right-0 top-16 h-72 w-72 rounded-full bg-gold/20 blur-3xl" />
//       <div className="luxury-container grid min-h-[calc(100vh-80px)] items-center gap-12 py-12 md:grid-cols-[0.95fr_1.05fr]">
//         <motion.div
//           initial={{ opacity: 0, y: 24 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.7 }}
//           className="relative z-10"
//         >
//           <p className="mb-5 text-xs font-semibold uppercase tracking-[0.32em] text-gold">
//             Exquisite. Elegant. Enchanting.
//           </p>
//           <div className="flex flex-col">
//             <h1 className="max-w-3xl font-serif text-6xl leading-[0.95] text-forest md:text-8xl">
//               KOTA KARIGARI
//             </h1>
//             <p className="mt-1 bg-gradient-to-r from-forest via-rose to-gold bg-clip-text text-2xl font-medium tracking-[0.07em] text-transparent">fashion</p>
//           </div>
//           <p className="mt-6 max-w-xl text-lg leading-8 text-moss">
//             A contemporary ethnic and Indo-western fashion brand offering elegant, comfort-driven apparel in breathable fabrics like cotton, Kota doriya and Mal cotton, blending traditional Indian craftsmanship with modern style.
//           </p>
//           <div className="mt-9 flex flex-wrap gap-4">
//             <Button href="/shop">
//               Shop Collection <ArrowRight size={17} />
//             </Button>
//             <Button href="/shop?sort=newest" variant="secondary">
//               New Arrivals
//             </Button>
//           </div>
//         </motion.div>
//         <motion.div
//           initial={{ opacity: 0, scale: 0.97 }}
//           animate={{ opacity: 1, scale: 1 }}
//           transition={{ duration: 0.8, delay: 0.1 }}
//           className="relative min-h-[420px] md:min-h-[620px]"
//         >
//           <div className="absolute right-0 top-0 h-[86%] w-[74%] overflow-hidden rounded-[2rem] border border-white/50 shadow-luxury">
//             <img
//               src="/pics/IMG-20260512-WA0295.jpg"
//               alt="KOTA KARIGARI ivory ethnic wear"
//               className="h-full w-full object-cover object-top"
//             />
//           </div>
//           <div className="absolute bottom-0 left-0 h-[48%] w-[52%] overflow-hidden rounded-[1.5rem] border-8 border-pearl shadow-silk">
//             <img
//               src="/pics/pic_1.jpeg"
//               alt="KOTA KARIGARI festive silk detail"
//               className="h-full w-full object-cover object-top"
//             />
//           </div>
//         </motion.div>
//       </div>
//       <div className="border-t border-forest/8">
//         <HeroScrollStrip />
//       </div>
//     </section>
//   </>
// );
// }

// "use client";

// import { motion, useReducedMotion } from "framer-motion";
// import { ArrowRight } from "lucide-react";
// import { Button } from "@/components/ui/Button";
// import { HeroScrollStrip } from "./HeroScrollStrip";
// import { BannerSlider } from "./BannerSlider";

// const headlineWords = ["KOTA", "KARIGARI"];

// function WeavePattern({ className }: { className?: string }) {
//   return (
//     <svg className={className} viewBox="0 0 400 400" fill="none" aria-hidden="true">
//       <defs>
//         <pattern id="weave" width="28" height="28" patternUnits="userSpaceOnUse">
//           <path d="M0 14H28" stroke="currentColor" strokeWidth="0.5" />
//           <path d="M14 0V28" stroke="currentColor" strokeWidth="0.5" />
//         </pattern>
//       </defs>
//       <rect width="400" height="400" fill="url(#weave)" />
//     </svg>
//   );
// }

// export function Hero() {
//   const shouldReduceMotion = useReducedMotion();

//   return (
//     <>
//       <BannerSlider />
//       <section className="relative overflow-hidden bg-satin">
//         {/* woven texture — stands in for the blurred-blob decoration */}
//         <WeavePattern className="pointer-events-none absolute inset-0 h-full w-full text-forest/[0.05]" />
//         <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white/50 to-transparent" />

//         <div className="luxury-container relative grid min-h-[calc(100vh-80px)] items-center gap-16 py-14 md:grid-cols-[1fr_0.9fr]">
//           {/* selvedge tag — rotated side label, the signature element */}
//           <span className="pointer-events-none absolute -left-2 top-1/2 hidden -translate-y-1/2 -rotate-90 text-[10px] font-semibold uppercase tracking-[0.5em] text-gold/60 md:block">
//             Hand-loomed · Kota, Rajasthan
//           </span>

//           <motion.div
//             initial={{ opacity: 0, y: 24 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.7 }}
//             className="relative z-10"
//           >
//             <p className="mb-5 text-xs font-semibold uppercase tracking-[0.32em] text-gold">
//               Exquisite. Elegant. Enchanting.
//             </p>

//             <h1 className="flex flex-col font-serif leading-[0.9] text-forest">
//               {headlineWords.map((word, i) => (
//                 <motion.span
//                   key={word}
//                   initial={{ opacity: 0, y: 40 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{
//                     duration: 0.7,
//                     delay: shouldReduceMotion ? 0 : 0.15 + i * 0.12,
//                   }}
//                   className="text-6xl md:text-8xl"
//                 >
//                   {word}
//                 </motion.span>
//               ))}
//             </h1>

//             <motion.p
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ duration: 0.6, delay: 0.5 }}
//               className="mt-1 bg-gradient-to-r from-forest via-rose to-gold bg-clip-text text-2xl font-medium tracking-[0.07em] text-transparent"
//             >
//               fashion
//             </motion.p>

//             <p className="mt-6 max-w-xl text-lg leading-8 text-moss">
//               A contemporary ethnic and Indo-western fashion brand offering elegant,
//               comfort-driven apparel in breathable fabrics like cotton, Kota doriya
//               and Mal cotton, blending traditional Indian craftsmanship with modern style.
//             </p>

//             <div className="mt-9 flex flex-wrap gap-4">
//               <Button href="/shop">
//                 Shop Collection <ArrowRight size={17} />
//               </Button>
//               <Button href="/shop?sort=newest" variant="secondary">
//                 New Arrivals
//               </Button>
//             </div>
//           </motion.div>

//           {/* image treated like a fabric swatch card, not a rounded photo stack */}
//           <motion.div
//             initial={{ opacity: 0, scale: 0.97 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ duration: 0.8, delay: 0.2 }}
//             className="relative min-h-[440px] md:min-h-[640px]"
//           >
//             <div
//               className="absolute right-0 top-0 h-[82%] w-[72%] overflow-hidden border border-gold/30 shadow-luxury"
//               style={{
//                 clipPath: "polygon(0 0, 100% 0, 100% 100%, 8% 100%, 0 88%)",
//               }}
//             >
//               <img
//                 src="/pics/IMG-20260512-WA0295.jpg"
//                 alt="KOTA KARIGARI ivory ethnic wear"
//                 className="h-full w-full object-cover object-top"
//               />
//               <span className="absolute bottom-4 left-4 bg-forest/85 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#f8ecd9]">
//                 No. 01 — Kota Doriya
//               </span>
//             </div>

//             <motion.div
//               initial={{ opacity: 0, x: -16 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ duration: 0.7, delay: 0.6 }}
//               className="absolute bottom-0 left-0 h-[44%] w-[50%] overflow-hidden border-2 border-pearl shadow-silk"
//               style={{
//                 clipPath: "polygon(0 0, 92% 0, 100% 12%, 100% 100%, 0 100%)",
//               }}
//             >
//               <img
//                 src="/pics/pic_1.jpeg"
//                 alt="KOTA KARIGARI festive silk detail"
//                 className="h-full w-full object-cover object-top"
//               />
//             </motion.div>

//             {/* loom-pin accent */}
//             <span className="absolute -top-3 right-[26%] h-6 w-6 rounded-full border border-gold/50" />
//           </motion.div>
//         </div>

//         <div className="border-t border-forest/8">
//           <HeroScrollStrip />
//         </div>
//       </section>
//     </>
//   );
// }

"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { HeroScrollStrip } from "./HeroScrollStrip";
import { BannerSlider } from "./BannerSlider";

const headlineWords = ["KOTA", "KARIGARI"];

function WeavePattern({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 400 400" fill="none" aria-hidden="true">
      <defs>
        <pattern id="weave" width="28" height="28" patternUnits="userSpaceOnUse">
          <path d="M0 14H28" stroke="currentColor" strokeWidth="0.5" />
          <path d="M14 0V28" stroke="currentColor" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="400" height="400" fill="url(#weave)" />
    </svg>
  );
}

export function Hero() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <>
      <BannerSlider />
      <section className="relative overflow-hidden bg-satin">
        <WeavePattern className="pointer-events-none absolute inset-0 h-full w-full text-forest/[0.05]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white/50 to-transparent" />

        <div className="luxury-container relative grid min-h-[calc(100vh-80px)] items-center gap-16 py-14 md:grid-cols-[1fr_0.85fr]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="relative z-10"
          >
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.32em] text-gold">
              Exquisite. Elegant. Enchanting.
            </p>

            <h1 className="flex flex-col font-serif leading-[0.9] text-forest">
              {headlineWords.map((word, i) => (
                <motion.span
                  key={word}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.7,
                    delay: shouldReduceMotion ? 0 : 0.15 + i * 0.12,
                  }}
                  className="text-6xl md:text-8xl"
                >
                  {word}
                </motion.span>
              ))}
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-1 bg-gradient-to-r from-forest via-rose to-gold bg-clip-text text-2xl font-medium tracking-[0.07em] text-transparent"
            >
              {/* fashion */}
            </motion.p>

            <p className="mt-6 max-w-xl text-lg leading-8 text-moss">
              A contemporary ethnic and Indo-western fashion brand offering elegant,
              comfort-driven apparel in breathable fabrics like cotton, Kota doriya
              and Mal cotton, blending traditional Indian craftsmanship with modern style.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <Button href="/shop">
                Shop Collection <ArrowRight size={17} />
              </Button>
              <Button href="/shop?sort=newest" variant="secondary">
                New Arrivals
              </Button>
            </div>
          </motion.div>

          {/* single hero shot, offset right, swatch-card framing */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative min-h-[440px] md:min-h-[640px]"
          >
            <div
              className="absolute right-0 top-0 h-full w-[86%] overflow-hidden border border-gold/30 shadow-luxury"
              style={{
                clipPath: "polygon(0 0, 100% 0, 100% 100%, 10% 100%, 0 90%)",
              }}
            >
              <img
                src="/pics/IMG-20260512-WA0295.jpg"
                alt="KOTA KARIGARI ivory ethnic wear in Kota doriya"
                className="h-full w-full object-cover object-top"
              />
            </div>

            {/* loom-pin accent, top-left of the frame */}
            <span className="absolute -left-3 top-10 h-6 w-6 rounded-full border border-gold/50 bg-satin" />
          </motion.div>
        </div>

        <div className="border-t border-forest/8">
          <HeroScrollStrip />
        </div>
      </section>
    </>
  );
}