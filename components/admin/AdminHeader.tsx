"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function AdminHeader() {
  const router = useRouter();

  const logout = async () => {
    try {
      const res = await fetch("/api/admin/logout", { method: "POST" });
      if (!res.ok) throw new Error("logout failed");
      toast.success("Sesión cerrada");
      router.push("/login");
      router.refresh();
    } catch {
      toast.error("No se pudo cerrar sesión");
    }
  };

  return (
    <motion.div
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="sticky top-0 z-40 backdrop-blur-md bg-white/70 border-b border-border/50 mb-5"
    >
      <div className="container-section">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Left */}
          <div className="flex flex-col">
            <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-foreground">
              Panel de administración
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground">
              Gestiona tus proyectos publicados
            </p>
          </div>

          {/* Right */}
          <Button
            variant="ghost"
            onClick={logout}
            className="gap-2 text-foreground hover:bg-muted"
          >
            <LogOut className="h-4 w-4" />
            Cerrar sesión
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
