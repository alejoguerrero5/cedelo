"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";

export function LayoutChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

const hideNavbar = pathname.includes("/admin") || pathname.includes("/login");
const hideFooter = pathname.includes("/admin") || pathname.includes("/login");
  return (
    <>
      {!hideNavbar && <Navbar />}
      {children}
      {!hideFooter && <Footer />}
    </>
  );
}

