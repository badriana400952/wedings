import React from "react";
import {
  Home,
  Heart,
  Calendar,
  MapPin,
  Image,
} from "lucide-react";

/**
 * Daftar menu
 */
const links = [
  {
    title: "Home",
    elementId: "hero",
    IconMenu: Home,
  },
  {
    title: "Mempelai",
    elementId: "mempelai",
    IconMenu: Heart,
  },
  {
    title: "Tanggal",
    elementId: "tanggal",
    IconMenu: Calendar,
  },
  {
    title: "Lokasi",
    elementId: "lokasi",
    IconMenu: MapPin,
  },
  {
    title: "Galeri",
    elementId: "galeri",
    IconMenu: Image,
  },
];

const Menu = () => {

  const scrollTo = (e: any, elementId: string) => {
    e.preventDefault();

    const element = document.getElementById(elementId);

    if (!element) return;

    const headerOffset = 0;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  };

  return (
    <div
      className="
      fixed
      bottom-4 md:bottom-5
      left-1/2
      -translate-x-1/2
      z-[1000]
      rounded-xl
      p-2
      shadow-xl
      bg-[rgba(213,206,163,0.7)]
      backdrop-blur
      "
    >
      <nav
        className="
        flex
        items-center
        justify-center
        gap-3
        bg-black
        rounded-xl
        px-4
        py-2
        "
      >
        {links.map(({ title, IconMenu, elementId }, key) => (
          <button
            key={key}
            onClick={(e) => scrollTo(e, elementId)}
            title={title}
            className="
            p-2
            rounded-lg
            transition
            hover:bg-white/10
            active:scale-95
            "
          >
            <IconMenu
              size={22}
              className="text-gray-300"
            />
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Menu;