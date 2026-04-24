"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";
import { useState } from "react";

type LoginFormValues = {
  password: string;
};

export default function AdminLoginPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<LoginFormValues>({
    defaultValues: { password: "" },
  });

  const onSubmit = async ({ password }: LoginFormValues) => {
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        toast.error(data?.message ?? "Error al iniciar sesión");
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      toast.error("Error de red, intenta de nuevo");
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-8 bg-secondary">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <div className="rounded-2xl border border-border/50 bg-card shadow-card hover:shadow-card-hover transition-all duration-300 p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="mx-auto w-14 h-14 rounded-xl gradient-cta flex items-center justify-center shadow-blue">
              <ShieldCheck className="w-6 h-6 text-primary" />
            </div>

            <div>
              <span className="text-xs font-semibold text-primary tracking-wide uppercase">
                Acceso privado
              </span>

              <h1 className="text-2xl font-bold text-foreground mt-1">
                Panel de administración
              </h1>

              <p className="text-sm text-muted-foreground mt-1">
                Ingresa tu contraseña para continuar
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>

              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  className="h-11 pr-10"
                  {...register("password", {
                    required: "La contraseña es obligatoria",
                    minLength: {
                      value: 4,
                      message: "Mínimo 4 caracteres",
                    },
                  })}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {errors.password && (
              <p className="text-sm font-medium text-destructive">
                {errors.password.message}
              </p>
            )}

            <Button
              type="submit"
              className="w-full h-11 shadow-blue"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
