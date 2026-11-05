"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Menu, ShoppingBag, User, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getCartCount, useCartStore } from "@/store/cart-store";
import {
  getWishlistCount,
  useWishlistStore,
} from "@/store/wishlist-store";
const links = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/collections", label: "Collections" },
  { href: "/about", label: "About" }
];

export function Navbar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [navVisible, setNavVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileInteracted, setMobileInteracted] = useState(false);

  const items = useCartStore((state) => state.items);
  const openCart = useCartStore((state) => state.openCart);

  const count = getCartCount(items);
  const wishlistItems = useWishlistStore(
  (state) => state.items
);

  const wishlistCount =
  getWishlistCount(wishlistItems);

  const accountHref = user ? "/account" : "/login";
  const initial = (user?.name || user?.email || "?").trim()[0]?.toUpperCase();

  const isHome = pathname === "/";
  const mobileTransparentMode = isHome && isMobile;
  const transparentMode = isHome;
  const showSolidNavbar =
    !transparentMode || scrolled || hovered || menuOpen || mobileInteracted;

  useEffect(() => {
    const updateViewport = () => setIsMobile(window.innerWidth < 640);

    updateViewport();
    window.addEventListener("resize", updateViewport);

    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  useEffect(() => {
    if (!mobileTransparentMode) {
      setMobileInteracted(false);
    }
  }, [mobileTransparentMode]);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let showTimeout: ReturnType<typeof setTimeout> | null = null;

    const onScroll = () => {
      const currentScrollY = window.scrollY;

      setScrolled(currentScrollY > 18);

      if (menuOpen) {
        setNavVisible(true);
        lastScrollY = currentScrollY;
        return;
      }

      if (currentScrollY <= 24 && mobileTransparentMode) {
        setMobileInteracted(false);
      }

      if (currentScrollY <= 24) {
        if (showTimeout) {
          clearTimeout(showTimeout);
          showTimeout = null;
        }
        setNavVisible(true);
        lastScrollY = currentScrollY;
        return;
      }

      if (currentScrollY > lastScrollY + 8) {
        if (showTimeout) {
          clearTimeout(showTimeout);
          showTimeout = null;
        }
        setNavVisible(false);
      } else if (currentScrollY < lastScrollY - 8) {
        if (showTimeout) {
          clearTimeout(showTimeout);
        }
        showTimeout = setTimeout(() => {
          setNavVisible(true);
        }, 140);
      }

      lastScrollY = currentScrollY;
    };

    onScroll();

    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (showTimeout) {
        clearTimeout(showTimeout);
      }
    };
  }, [menuOpen, mobileTransparentMode]);

  useEffect(() => {
    if (menuOpen || hovered) {
      setNavVisible(true);
    }
  }, [hovered, menuOpen]);

  return (
    <>
      <header
  onMouseEnter={() => {
    if (!isMobile) {
      setHovered(true);
    }
  }}
  onMouseLeave={() => setHovered(false)}
  className={`top-0 z-40 border-b transition-[transform,background-color,border-color,box-shadow,backdrop-filter] duration-500 ${
    isHome ? "fixed left-0 right-0" : "sticky"
  } ${
    navVisible ? "translate-y-0" : "-translate-y-full"
  } ${
    showSolidNavbar
      ? "border-[#b88952]/30 bg-[#f8ecd9] shadow-[0_16px_40px_rgba(97,57,25,0.14)]"
      : "border-transparent bg-transparent shadow-none backdrop-blur-0"
  }`}
>
        <nav className="luxury-container grid h-16 grid-cols-[auto_1fr_auto] items-center gap-3 sm:flex sm:h-24 sm:justify-between sm:gap-4">
  <Link
    href="/"
    className="col-start-1 justify-self-start transition hover:-translate-y-0.5 sm:justify-self-auto"
  >
    <img
      src={showSolidNavbar ? "/pics/logo.png" : "/pics/logo2.png"}
      alt="Kota Karigari"
      className="relative h-14 w-auto drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)] sm:h-24 sm:w-[190px]"
    />
  </Link>

  <div className="hidden items-center gap-8 md:flex">
    {links.map((link) => (
      <Link
        key={link.href}
        href={link.href}
        className={`font-serif text-base tracking-[0.08em] transition ${
          showSolidNavbar
            ? "text-[#6f402c] hover:text-[#173f6b]"
            : "text-[#fff4e3] hover:text-[#f6c88b]"
        }`}
      >
        {link.label}
      </Link>
    ))}
  </div>

  <div className="col-start-3 flex items-center justify-self-end gap-2">
    <Link
      href={accountHref}
      aria-label={user ? "Manage your account" : "Log in to your account"}
      className={`relative flex items-center gap-1.5 rounded-full px-2.5 py-2.5 text-xs font-medium transition sm:gap-2 sm:px-3 sm:text-sm ${
        showSolidNavbar
          ? "border border-[#b88952]/25 bg-white/40 text-[#6f402c] hover:bg-[#f6e7ca]"
          : "border border-white/25 bg-black/20 text-[#fff4e3] hover:bg-white/16"
      }`}
    >
      {user ? (
        <span className="grid h-[19px] w-[19px] shrink-0 place-items-center text-[15px] font-semibold leading-none">
          {initial}
        </span>
      ) : (
        <User size={18} />
      )}
      <span>{user ? "Account" : "Log in"}</span>
    </Link>

    <Link
      href="/wishlist"
      className={`relative rounded-full p-3 transition ${
        showSolidNavbar
          ? "border border-[#b88952]/25 bg-white/40 text-[#6f402c] hover:bg-[#f6e7ca]"
          : "border border-white/25 bg-black/20 text-[#fff4e3] hover:bg-white/16"
      }`}
    >
      <Heart size={19} />

      {wishlistCount > 0 && (
        <span className="absolute right-1 top-1 grid h-5 min-w-5 place-items-center rounded-full bg-[#a02f2f] px-1 text-[11px] font-bold text-[#fff5e8]">
          {wishlistCount}
        </span>
      )}
    </Link>

    <button
      aria-label="Cart"
      onClick={openCart}
      className={`relative rounded-full p-3 transition ${
        showSolidNavbar
          ? "border border-[#b88952]/25 bg-white/40 text-[#6f402c] hover:bg-[#f6e7ca]"
          : "border border-white/25 bg-black/20 text-[#fff4e3] hover:bg-white/16"
      }`}
    >
      <ShoppingBag size={19} />

      {count > 0 ? (
        <span className="absolute right-1 top-1 grid h-5 min-w-5 place-items-center rounded-full bg-[#a02f2f] px-1 text-[11px] font-bold text-[#fff5e8]">
          {count}
        </span>
      ) : null}
    </button>

    <button
      className={`rounded-full p-2.5 md:hidden ${
        showSolidNavbar
          ? "border border-[#b88952]/30 bg-white/45 text-[#6f402c]"
          : "border border-white/30 bg-black/20 text-[#fff4e3]"
      }`}
      aria-label="Open menu"
      onClick={() => {
        if (mobileTransparentMode) {
          setMobileInteracted(true);
        }
        setMenuOpen(true);
      }}
    >
      <Menu />
    </button>
  </div>
</nav>
      </header>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="fixed inset-0 z-[9999] bg-[linear-gradient(180deg,#fff7ea_0%,#f7ead2_100%)] md:hidden">
          <div className="flex items-center justify-between border-b border-[#b88952]/20 bg-[#f8ecd9]/90 p-6 backdrop-blur-md">
            <Link
              href="/"
              className="rounded-[1.2rem] border border-[#b88952]/45 bg-[linear-gradient(135deg,rgba(255,250,240,0.98),rgba(246,227,195,0.94))] px-3 py-2 shadow-[0_10px_28px_rgba(120,70,24,0.14)]"
            >
              <img src="/pics/logo.png" alt="Kota Karigari" className="h-10 w-auto" />
            </Link>

            <button
              aria-label="Close menu"
              onClick={() => setMenuOpen(false)}
              className="rounded-full border border-[#b88952]/30 bg-white/50 p-2"
            >
              <X size={26} className="text-[#6f402c]" />
            </button>
          </div>

          <div className="relative z-[10000] mt-12 flex flex-col gap-8 px-6">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="font-serif text-4xl tracking-[0.08em] text-[#6f402c]"
              >
                {link.label}
              </Link>
            ))}

            <button
              onClick={() => {
                openCart();
                setMenuOpen(false);
              }}
              className="mt-4 flex items-center gap-3 text-lg text-[#6f402c]"
            >
              <ShoppingBag />
              Cart ({count})
            </button>

            <Link
              href={accountHref}
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 text-lg text-[#6f402c]"
            >
              <User />
              {user ? "My account" : "Log in"}
            </Link>
          </div>
        </div>
      )}
    </>
  );
}