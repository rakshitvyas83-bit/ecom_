import Link from "next/link";

const links = ["About", "Shipping Policy", "Terms & Conditions"];

export function Footer() {
  return (
    <footer className="mt-20 border-t border-gold/20 bg-[linear-gradient(135deg,#6f402c_0%,#8a5a34_42%,#b88952_100%)] text-[#fff8ec]">
      <div className="luxury-container grid gap-10 py-14 md:grid-cols-[1.2fr_1fr]">
        <div>
          <p className="font-serif text-4xl tracking-[0.14em] text-[#fff3de]">KOTA KARIGARI</p>
          <p className="mt-3 max-w-md text-sm leading-7 text-[#f8e8c8]/85">
            Crafted by hands , Chosen by hearts
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2">
          <div className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#fff3de]">
              Contact
            </h2>
            <a
              href="https://www.instagram.com/kotakarigari.official?dmpr=bXVlZGRhMHlrcjFj"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-sm text-[#f8e8c8]/88 transition hover:text-white"
            >
              Instagram
            </a>
            <a
              href="mailto:care@kotakarigari.com"
              className="block break-all text-sm text-[#f8e8c8]/88 transition hover:text-white"
            >
              care@kotakarigari.com
            </a>
          </div>
          <div className="flex flex-col items-start gap-3">
            {links.map((link) => (
              <Link
                href={`/${link.toLowerCase().replaceAll(" ", "-")}`}
                key={link}
                className="text-sm text-[#f8e8c8]/88 transition hover:text-white"
              >
                {link}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
