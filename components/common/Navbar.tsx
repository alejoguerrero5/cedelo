"use client";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const pathname = usePathname();
  console.log("pathname", pathname);

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const hideForMVP = true;
  const shouldHideMenu = pathname === "/landing";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/70 backdrop-blur-md shadow-navbar"
          : "bg-primary-light"
      }`}
    >
      <div className="container-section">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div
              className={`text-2xl md:text-3xl font-bold tracking-tight transition-colors cursor-pointer ${
                isScrolled ? "text-primary" : "text-primary-foreground"
              }`}
            >
              CEDELO
            </div>
          </Link>

          {/* Desktop Navigation */}
          {!shouldHideMenu && !hideForMVP && (
            <div className="hidden md:flex items-center gap-6">
              <button
                onClick={() => scrollToSection("como-funciona")}
                className={`text-sm font-medium transition-colors hover:text-primary cursor-pointer ${
                  isScrolled
                    ? "text-foreground"
                    : "text-primary-foreground/90 hover:text-primary-foreground"
                }`}
              >
                Cómo Funciona
              </button>
              <button
                onClick={() => scrollToSection("beneficios")}
                className={`text-sm font-medium transition-colors hover:text-primary cursor-pointer ${
                  isScrolled
                    ? "text-foreground"
                    : "text-primary-foreground/90 hover:text-primary-foreground"
                }`}
              >
                Beneficios
              </button>
              <button
                onClick={() => scrollToSection("calculadora")}
                className={`text-sm font-medium transition-colors hover:text-primary cursor-pointer ${
                  isScrolled
                    ? "text-foreground"
                    : "text-primary-foreground/90 hover:text-primary-foreground"
                }`}
              >
                Calculadora
              </button>
              <Link
                href="/propiedades"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isScrolled
                    ? "text-foreground"
                    : "text-primary-foreground/90 hover:text-primary-foreground"
                }`}
              >
                Para Inversionistas
              </Link>
            </div>
          )}

          {/* Desktop Auth Buttons */}

          <div className="hidden md:flex items-center gap-3">
            {!shouldHideMenu && !hideForMVP && (
              <Button
                variant="ghost"
                className={`transition-colors ${
                  isScrolled
                    ? "text-foreground hover:bg-muted"
                    : "text-primary-foreground border-primary-foreground/30 hover:bg-primary-foreground/10"
                }`}
              >
                Iniciar sesión
              </Button>
            )}
            <Button
              className={`transition-all ${
                isScrolled
                  ? " text-primary-foreground shadow-blue"
                  : "bg-primary-foreground text-primary hover:bg-primary-foreground/90"
              }`}
              onClick={() => scrollToSection("registro")}
            >
              Registrarse
            </Button>
          </div>

          {/* Mobile Menu Button */}
          {!shouldHideMenu && (
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`md:hidden p-2 rounded-lg transition-colors ${
                isScrolled ? "text-foreground" : "text-primary-foreground"
              }`}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-card border-t border-border"
          >
            <div className="container-section py-4 flex flex-col gap-3">
              <button
                onClick={() => scrollToSection("como-funciona")}
                className="text-left py-2 text-foreground font-medium hover:text-primary transition-colors"
              >
                Cómo Funciona
              </button>
              <button
                onClick={() => scrollToSection("beneficios")}
                className="text-left py-2 text-foreground font-medium hover:text-primary transition-colors"
              >
                Beneficios
              </button>
              <button
                onClick={() => scrollToSection("calculadora")}
                className="text-left py-2 text-foreground font-medium hover:text-primary transition-colors"
              >
                Calculadora
              </button>
              <Link
                href="/propiedades"
                className="py-2 text-foreground font-medium hover:text-primary transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Para Inversionistas
              </Link>
              <div className="flex flex-col gap-2 pt-3 border-t border-border">
                <Button variant="outline" className="w-full">
                  Iniciar sesión
                </Button>
                <Button
                  className="w-full"
                  onClick={() => scrollToSection("registro")}
                >
                  Registrarse
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
