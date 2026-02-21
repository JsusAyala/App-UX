"use client"

import { useState, useEffect } from "react"
import {
  ArrowLeft,
  Loader2,
  ArrowDownLeft,
  ArrowUpRight,
  CreditCard,
  Download,
} from "lucide-react"

interface Transaction {
  id: number
  name: string
  amount: number
  date: string
  type: "credit" | "debit"
  category: string
}

const STATEMENT_DATA: Transaction[] = [
  { id: 1, name: "Nomina - Empresa ABC", amount: 28500.0, date: "10 Feb 2026", type: "credit", category: "Ingreso" },
  { id: 2, name: "Amazon MX", amount: -1249.99, date: "10 Feb 2026", type: "debit", category: "Compras" },
  { id: 3, name: "Transferencia - Maria Lopez", amount: 5000.0, date: "09 Feb 2026", type: "credit", category: "Transferencia" },
  { id: 4, name: "CFE - Luz", amount: -842.0, date: "08 Feb 2026", type: "debit", category: "Servicios" },
  { id: 5, name: "Spotify", amount: -115.0, date: "07 Feb 2026", type: "debit", category: "Suscripcion" },
  { id: 6, name: "Netflix", amount: -219.0, date: "07 Feb 2026", type: "debit", category: "Suscripcion" },
  { id: 7, name: "OXXO - Deposito", amount: 3000.0, date: "06 Feb 2026", type: "credit", category: "Deposito" },
  { id: 8, name: "Uber Eats", amount: -387.5, date: "05 Feb 2026", type: "debit", category: "Comida" },
  { id: 9, name: "Telmex", amount: -599.0, date: "04 Feb 2026", type: "debit", category: "Servicios" },
  { id: 10, name: "Transferencia - Carlos R.", amount: -2500.0, date: "03 Feb 2026", type: "debit", category: "Transferencia" },
  { id: 11, name: "Rappi", amount: -256.0, date: "02 Feb 2026", type: "debit", category: "Comida" },
  { id: 12, name: "Nomina - Empresa ABC", amount: 28500.0, date: "01 Feb 2026", type: "credit", category: "Ingreso" },
]

export function StatementView({ onBack }: { onBack: () => void }) {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simula carga de 1.5 segundos
    const timer = setTimeout(() => setLoading(false), 1500)
    return () => clearTimeout(timer)
  }, [])

  const totalIncome = STATEMENT_DATA.filter((t) => t.type === "credit").reduce((s, t) => s + t.amount, 0)
  const totalExpenses = STATEMENT_DATA.filter((t) => t.type === "debit").reduce((s, t) => s + Math.abs(t.amount), 0)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary px-4 pt-6 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 rounded-lg bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20 transition-colors"
              aria-label="Regresar"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h1 className="text-primary-foreground font-semibold">Estado de Cuenta</h1>
              <p className="text-primary-foreground/50 text-xs">Febrero 2026</p>
            </div>
          </div>
          {!loading && (
            <button
              className="p-2 rounded-lg bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20 transition-colors"
              aria-label="Descargar"
            >
              <Download className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center px-4 py-20 gap-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
          <p className="text-sm text-muted-foreground">Cargando estado de cuenta...</p>
        </div>
      ) : (
        <div className="px-4 py-5 pb-10">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-card rounded-xl p-4 border border-border">
              <p className="text-xs text-muted-foreground mb-1">Ingresos</p>
              <p className="text-lg font-bold text-accent font-mono">
                +${totalIncome.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="bg-card rounded-xl p-4 border border-border">
              <p className="text-xs text-muted-foreground mb-1">Egresos</p>
              <p className="text-lg font-bold text-destructive font-mono">
                -${totalExpenses.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          {/* Transaction List */}
          <h2 className="font-semibold text-foreground mb-3">
            Movimientos ({STATEMENT_DATA.length})
          </h2>

          <div className="space-y-2.5">
            {STATEMENT_DATA.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between bg-card rounded-xl p-3.5 border border-border"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      tx.type === "credit" ? "bg-accent/10" : "bg-secondary"
                    }`}
                  >
                    {tx.type === "credit" ? (
                      <ArrowDownLeft className="w-5 h-5 text-accent" />
                    ) : (
                      <CreditCard className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-card-foreground">{tx.name}</p>
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-muted-foreground">{tx.date}</p>
                      <span className="text-xs text-muted-foreground/50">|</span>
                      <p className="text-xs text-muted-foreground">{tx.category}</p>
                    </div>
                  </div>
                </div>
                <p
                  className={`text-sm font-semibold font-mono ${
                    tx.type === "credit" ? "text-accent" : "text-card-foreground"
                  }`}
                >
                  {tx.type === "credit" ? "+" : "-"}$
                  {Math.abs(tx.amount).toLocaleString("es-MX", {
                    minimumFractionDigits: 2,
                  })}
                </p>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-6 bg-card rounded-xl p-4 border border-border">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Balance del periodo</span>
              <span
                className={`text-lg font-bold font-mono ${
                  totalIncome - totalExpenses >= 0 ? "text-accent" : "text-destructive"
                }`}
              >
                {totalIncome - totalExpenses >= 0 ? "+" : "-"}$
                {Math.abs(totalIncome - totalExpenses).toLocaleString("es-MX", {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>

          {/* Disclaimer */}
          <p className="text-xs text-muted-foreground text-center mt-4 leading-relaxed">
            Estado de cuenta generado el {new Date().toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" })}.
            Para aclaraciones llama al 800-NOVA-PAY.
          </p>
        </div>
      )}
    </div>
  )
}
