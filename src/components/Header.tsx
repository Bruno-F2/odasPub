"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, ArrowUp } from "lucide-react";

export default function Header() {
  const navLinks = [
    { title: "Nosotros", href: "/nosotros" },
    { title: "Menú", href: "/menu" },
    { title: "Donde Estamos", href: "/ubicacion" },
  ];

  const [isOpen, setIsOpen] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setIsOpen(!isOpen);

  const scrollToSection = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -80;
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;

      window.scrollTo({ top: y, behavior: "smooth" });

      setIsOpen(false);
    }
  };

  // Evitar scroll al abrir el menú
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // Cierra el menú si se hace click afuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Efecto para el botón de scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <header className="flex justify-between items-center py-2 px-5 z-50 relative bg-background-primary">
        <div className="p-2 z-50">
          <a href="/">
            <motion.img src="/logo.png" alt="Logo" className="w-24 md:w-28" />
          </a>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center p-5 space-x-2">
          {navLinks.map((link) => (
            <motion.a
              key={link.href}
              href={link.href}
              className="font-primary font-bold text-lg text-white opacity-80 p-2 hover:opacity-100 transition-all duration-300 hover:cursor-pointer hover:underline hover:text-accent underline-offset-4"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="link-text"> {link.title}</span>
            </motion.a>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <motion.button
          className="md:hidden p-2 pr-1 self-center cursor-pointer z-50"
          onClick={toggleMenu}
          aria-label="Toggle Menu"
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.1 }}
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{ type: "spring" }}
        >
          {isOpen ? (
            <X className="text-accent" size={24} />
          ) : (
            <Menu className="text-accent" size={24} />
          )}
        </motion.button>
      </header>

      {/* Mobile Navigation Fullscreen*/}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={menuRef}
            className="md:hidden fixed inset-0 z-40 bg-primary flex flex-col items-center justify-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <nav className="flex flex-col space-y-6 items-center">
              {navLinks.map((link, index) => (
                <motion.a
                  key={link.href}
                  href={`#${link.href.substring(1)}`}
                  onClick={(e) => scrollToSection(e, link.href.substring(1))}
                  className="font-primary font-bold text-lg text-white opacity-80 p-2 hover:opacity-100 transition-all duration-300 hover:cursor-pointer hover:underline hover:text-accent underline-offset-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.2,
                    delay: 0.1 + index * 0.05,
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  {link.title}
                </motion.a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botón para ir arriba */}
      <AnimatePresence>
        {showScrollButton && (
          <motion.button
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-40 bg-accent text-white p-3 rounded-full shadow-lg hover:cursor-pointer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Ir arriba"
          >
            <ArrowUp size={24} />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
