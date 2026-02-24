"use client";

import { useState, useMemo } from "react";
import {
  Calculator as CalcIcon,
  TrendingUp,
  Percent,
  DollarSign,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

const Calculator = () => {
  const [precioCompra, setPrecioCompra] = useState<string>("200000000");
  const [precioVenta, setPrecioVenta] = useState<string>("250000000");
  const [meses, setMeses] = useState<string>("12");

  const results = useMemo(() => {
    const compra = parseFloat(precioCompra) || 0;
    const venta = parseFloat(precioVenta) || 0;
    const mesesNum = parseFloat(meses) || 1;

    const ganancia = venta - compra;
    const roi = compra > 0 ? (ganancia / compra) * 100 : 0;
    const roiAnual = mesesNum > 0 ? (roi * 12) / mesesNum : 0;

    return {
      ganancia,
      roi,
      roiAnual,
      isPositive: ganancia >= 0,
    };
  }, [precioCompra, precioVenta, meses]);

  const barChartData = useMemo(() => {
    const compra = parseFloat(precioCompra) || 0;
    const venta = parseFloat(precioVenta) || 0;
    const ganancia = venta - compra;

    return [
      {
        name: "Inversión",
        valor: compra / 1000000,
        fill: "hsl(var(--muted-foreground))",
      },
      {
        name: "Ganancia",
        valor: Math.max(ganancia, 0) / 1000000,
        fill: "hsl(var(--primary))",
      },
      { name: "Total", valor: venta / 1000000, fill: "hsl(var(--chart-1))" },
    ];
  }, [precioCompra, precioVenta]);

  const projectionData = useMemo(() => {
    const compra = parseFloat(precioCompra) || 0;
    const venta = parseFloat(precioVenta) || 0;
    const mesesNum = parseFloat(meses) || 12;

    const tasaMensual = mesesNum > 0 ? (venta - compra) / mesesNum : 0;

    const data = [];
    for (
      let i = 0;
      i <= Math.min(mesesNum, 24);
      i += Math.max(1, Math.floor(mesesNum / 6))
    ) {
      data.push({
        mes: `Mes ${i}`,
        valor: (compra + tasaMensual * i) / 1000000,
      });
    }

    if (data[data.length - 1]?.mes !== `Mes ${mesesNum}`) {
      data.push({
        mes: `Mes ${mesesNum}`,
        valor: venta / 1000000,
      });
    }

    return data;
  }, [precioCompra, precioVenta, meses]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatMillions = (value: number) => `$${value.toFixed(0)}M`;

  const handleInputChange = (
    setter: React.Dispatch<React.SetStateAction<string>>,
    value: string,
  ) => {
    const numericValue = value.replace(/[^0-9]/g, "");
    setter(numericValue);
  };

  return (
    <section id="calculadora" className="section-padding bg-background">
      <div className="container-section">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <span className="inline-block text-sm font-semibold text-primary mb-3 tracking-wide uppercase">
            Herramienta Gratuita
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Calcula tu ganancia potencial
          </h2>
          <p className="text-lg text-muted-foreground">
            Descubre cuánto podrías ganar al ceder tu contrato de compraventa.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-6xl mx-auto"
        >
          <div className="bg-card rounded-3xl shadow-xl overflow-hidden border border-border/50">
            <div className="grid lg:grid-cols-2">
              {/* Input Section */}
              <div className="p-8 lg:p-10">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <CalcIcon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      Calculadora de Beneficios
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Ingresa los datos de tu propiedad
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="precioCompra"
                      className="text-sm font-medium text-foreground"
                    >
                      Precio de compra original (COP)
                    </Label>
                    <div className="relative">
                      <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="precioCompra"
                        type="text"
                        value={
                          precioCompra
                            ? Number(precioCompra).toLocaleString("es-CO")
                            : ""
                        }
                        onChange={(e) =>
                          handleInputChange(setPrecioCompra, e.target.value)
                        }
                        className="pl-12 h-14 text-lg bg-secondary border-border focus:border-primary"
                        placeholder="200,000,000"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="precioVenta"
                      className="text-sm font-medium text-foreground"
                    >
                      Precio de venta deseado (COP)
                    </Label>
                    <div className="relative">
                      <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="precioVenta"
                        type="text"
                        value={
                          precioVenta
                            ? Number(precioVenta).toLocaleString("es-CO")
                            : ""
                        }
                        onChange={(e) =>
                          handleInputChange(setPrecioVenta, e.target.value)
                        }
                        className="pl-12 h-14 text-lg bg-secondary border-border focus:border-primary"
                        placeholder="250,000,000"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="meses"
                      className="text-sm font-medium text-foreground"
                    >
                      Meses transcurridos desde la compra
                    </Label>
                    <Input
                      id="meses"
                      type="number"
                      value={meses}
                      onChange={(e) => setMeses(e.target.value)}
                      className="h-14 text-lg bg-secondary border-border focus:border-primary"
                      placeholder="12"
                      min="1"
                    />
                  </div>
                </div>

                {/* Results Cards */}
                <div className="mt-8 grid grid-cols-3 gap-3">
                  <div className="bg-secondary rounded-xl p-4 text-center">
                    <TrendingUp className="w-5 h-5 text-primary mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground mb-1">
                      Ganancia
                    </p>
                    <p
                      className={`text-sm font-bold ${results.isPositive ? "text-primary" : "text-destructive"}`}
                    >
                      {formatCurrency(results.ganancia)}
                    </p>
                  </div>
                  <div className="bg-secondary rounded-xl p-4 text-center">
                    <Percent className="w-5 h-5 text-primary mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground mb-1">
                      ROI Total
                    </p>
                    <p
                      className={`text-sm font-bold ${results.isPositive ? "text-primary" : "text-destructive"}`}
                    >
                      {results.roi.toFixed(1)}%
                    </p>
                  </div>
                  <div className="bg-secondary rounded-xl p-4 text-center">
                    <TrendingUp className="w-5 h-5 text-primary mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground mb-1">
                      ROI Anual
                    </p>
                    <p
                      className={`text-sm font-bold ${results.isPositive ? "text-primary" : "text-destructive"}`}
                    >
                      {results.roiAnual.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>

              {/* Charts Section */}
              <div className="gradient-hero p-8 lg:p-10">
                <h3 className="text-lg font-semibold text-primary-foreground/90 mb-6">
                  Visualización de tu inversión
                </h3>

                {/* Bar Chart */}
                <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-2xl p-4 mb-6">
                  <p className="text-sm text-primary-foreground/70 mb-4">
                    Comparación de valores (millones COP)
                  </p>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={barChartData}
                        margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="rgba(255,255,255,0.1)"
                        />
                        <XAxis
                          dataKey="name"
                          tick={{ fill: "rgba(255,255,255,0.7)", fontSize: 12 }}
                          axisLine={{ stroke: "rgba(255,255,255,0.2)" }}
                        />
                        <YAxis
                          tick={{ fill: "rgba(255,255,255,0.7)", fontSize: 12 }}
                          axisLine={{ stroke: "rgba(255,255,255,0.2)" }}
                          tickFormatter={formatMillions}
                        />
                        <Tooltip
                          formatter={(value: number | undefined) => [
                            `$${(value ?? 0).toFixed(0)}M`,
                            "Valor",
                          ]}
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                            color: "hsl(var(--foreground))",
                          }}
                        />
                        <Bar dataKey="valor" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Line Chart */}
                <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-2xl p-4">
                  <p className="text-sm text-primary-foreground/70 mb-4">
                    Proyección de valorización
                  </p>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={projectionData}
                        margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="rgba(255,255,255,0.1)"
                        />
                        <XAxis
                          dataKey="mes"
                          tick={{ fill: "rgba(255,255,255,0.7)", fontSize: 11 }}
                          axisLine={{ stroke: "rgba(255,255,255,0.2)" }}
                        />
                        <YAxis
                          tick={{ fill: "rgba(255,255,255,0.7)", fontSize: 12 }}
                          axisLine={{ stroke: "rgba(255,255,255,0.2)" }}
                          tickFormatter={formatMillions}
                        />
                        <Tooltip
                          formatter={(value: number | undefined) => [
                            `$${(value ?? 0).toFixed(0)}M`,
                            "Valor",
                          ]}
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                            color: "hsl(var(--foreground))",
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="valor"
                          stroke="hsl(var(--primary-foreground))"
                          strokeWidth={3}
                          dot={{
                            fill: "hsl(var(--primary-foreground))",
                            strokeWidth: 2,
                            r: 4,
                          }}
                          activeDot={{
                            r: 6,
                            fill: "hsl(var(--primary-foreground))",
                          }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6">
            * Los cálculos son estimados y no incluyen costos de transacción ni
            impuestos.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Calculator;
