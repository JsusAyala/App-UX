"use client"

// Importaciones de React, contexto de autenticacion e iconos
import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { 
  CreditCard,        // Icono de tarjeta (para movimientos de debito)
  Send,              // Icono de enviar (para transferencias)
  FileText,          // Icono de documento (para estado de cuenta)
  LogOut,            // Icono de cerrar sesion
  ArrowUpRight,      // Flecha hacia arriba-derecha (enlace externo)
  ArrowDownLeft,     // Flecha hacia abajo-izquierda (dinero recibido)
  Smartphone,        // Icono de celular (para recargas)
  Zap,               // Icono de rayo (para pagos)
  MoreHorizontal,    // Icono de tres puntos (mas opciones)
  Bell               // Icono de campana (notificaciones)
} from "lucide-react"

// Importacion de los componentes modales y la vista de estado de cuenta
import { TransferModal } from "./transfer-modal"
import { PaymentModal } from "./payment-modal"
import { StatementView } from "./statement-view"

// Tipo que define las vistas posibles dentro del dashboard
type View = "home" | "statement"

/* ================================================================== */
/*  Dashboard: pantalla principal despues de iniciar sesion             */
/*  Muestra saldo, acciones rapidas y movimientos recientes            */
/* ================================================================== */
export function Dashboard() {
  const { user, logout } = useAuth()  // Datos del usuario y funcion de logout

  // Estados para controlar la navegacion y modales
  const [view, setView] = useState<View>("home")            // Vista actual: inicio o estado de cuenta
  const [showTransfer, setShowTransfer] = useState(false)    // Controla si se muestra el modal de transferencia
  const [showPayment, setShowPayment] = useState(false)      // Controla si se muestra el modal de pago
  const [showBalance, setShowBalance] = useState(true)       // Controla si el saldo es visible u oculto
  const [hasNotification] = useState(true)                   // Indica si hay notificaciones pendientes

  // Si no hay usuario, no se renderiza nada (proteccion)
  if (!user) return null

  // Si la vista es "statement", se muestra el componente de estado de cuenta
  if (view === "statement") {
    return <StatementView onBack={() => setView("home")} />
  }

  /* ---------------------------------------------------------------- */
  /*  Datos simulados de movimientos recientes                         */
  /*  Cada transaccion tiene: id, nombre, monto, fecha, tipo e icono  */
  /* ---------------------------------------------------------------- */
  const recentTransactions = [
    { id: 1, name: "Amazon MX", amount: -1249.99, date: "Hoy, 14:32", type: "debit" as const, icon: "cart" },
    { id: 2, name: "Transferencia recibida", amount: 5000.00, date: "Hoy, 09:15", type: "credit" as const, icon: "transfer" },
    { id: 3, name: "Netflix", amount: -219.00, date: "Ayer, 00:01", type: "debit" as const, icon: "entertainment" },
    { id: 4, name: "Uber Eats", amount: -387.50, date: "12 Feb, 21:45", type: "debit" as const, icon: "food" },
    { id: 5, name: "Nomina", amount: 28500.00, date: "10 Feb, 06:00", type: "credit" as const, icon: "salary" },
  ]

  /* ================================================================ */
  /*  RENDER: estructura visual del dashboard                          */
  /* ================================================================ */
  return (
    <div className="min-h-screen bg-background">

      {/* ============ HEADER: saludo, notificaciones y logout ============ */}
      <div className="bg-primary px-4 pt-6 pb-8">
        <div className="flex items-center justify-between mb-6">
          {/* Saludo con el nombre del usuario */}
          <div>
            <p className="text-primary-foreground/60 text-sm">Hola,</p>
            <h1 className="text-primary-foreground font-semibold text-lg">{user.name}</h1>
          </div>
          <div className="flex items-center gap-3">
            {/* Boton de notificaciones con indicador rojo si hay pendientes */}
            <button className="relative" aria-label="Notificaciones">
              <Bell className="w-5 h-5 text-primary-foreground/80" />
              {hasNotification && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-destructive rounded-full" />
              )}
            </button>
            {/* Boton para cerrar sesion */}
            <button
              onClick={logout}
              className="p-2 rounded-lg bg-primary-foreground/10 text-primary-foreground/80 hover:bg-primary-foreground/20 transition-colors"
              aria-label="Cerrar sesion"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ============ TARJETA DE SALDO ============ */}
        {/* Muestra el saldo disponible con opcion de ocultar */}
        <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-2xl p-5 border border-primary-foreground/10">
          <div className="flex items-center justify-between mb-1">
            <p className="text-primary-foreground/60 text-sm">Saldo disponible</p>
            {/* Boton para alternar la visibilidad del saldo */}
            <button
              onClick={() => setShowBalance(!showBalance)}
              className="text-xs text-primary-foreground/50 hover:text-primary-foreground/80 transition-colors"
            >
              {showBalance ? "Ocultar" : "Mostrar"}
            </button>
          </div>
          {/* Monto del saldo: se muestra formateado o con asteriscos si esta oculto */}
          <p className="text-3xl font-bold text-primary-foreground font-mono tracking-tight mb-3">
            {showBalance ? `$${user.balance.toLocaleString("es-MX", { minimumFractionDigits: 2 })}` : "$** *** **"}
          </p>
          {/* Numero de cuenta parcialmente oculto */}
          <p className="text-primary-foreground/40 text-xs">{user.accountNumber}</p>
        </div>
      </div>

      {/* ============ ACCIONES RAPIDAS ============ */}
      {/* Grid de 4 botones circulares: Transferir, Recargar, Pagar, Mas */}
      <div className="px-4 -mt-4">
        <div className="bg-card rounded-2xl p-4 shadow-lg shadow-foreground/5">
          <div className="grid grid-cols-4 gap-2">
            <QuickAction
              icon={<Send className="w-5 h-5" />}
              label="Transferir"
              onClick={() => setShowTransfer(true)}  // Abre modal de transferencia
            />
            <QuickAction
              icon={<Smartphone className="w-5 h-5" />}
              label="Recargar"
              onClick={() => setShowPayment(true)}   // Abre modal de pago (reutilizado para recargas)
            />
            <QuickAction
              icon={<Zap className="w-5 h-5" />}
              label="Pagar"
              onClick={() => setShowPayment(true)}   // Abre modal de pago de servicios
            />
            <QuickAction
              icon={<MoreHorizontal className="w-5 h-5" />}
              label="Mas"
              onClick={() => {}}                     // Sin funcionalidad aun
            />
          </div>
        </div>
      </div>

      {/* ============ BOTON DE ESTADO DE CUENTA ============ */}
      {/* Al hacer clic cambia la vista a "statement" */}
      <div className="px-4 mt-4">
        <button
          onClick={() => setView("statement")}
          className="w-full flex items-center justify-between bg-card rounded-xl p-4 shadow-sm border border-border hover:bg-secondary/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-card-foreground">Estado de Cuenta</p>
              <p className="text-xs text-muted-foreground">Febrero 2026</p>
            </div>
          </div>
          <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* ============ MOVIMIENTOS RECIENTES ============ */}
      {/* Lista de las ultimas transacciones del usuario */}
      <div className="px-4 mt-6 pb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-foreground">Movimientos Recientes</h2>
          <button className="text-xs text-primary font-medium">Ver todos</button>
        </div>

        <div className="space-y-3">
          {recentTransactions.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center justify-between bg-card rounded-xl p-3.5 border border-border"
            >
              <div className="flex items-center gap-3">
                {/* Icono del movimiento: verde para ingresos, gris para egresos */}
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  tx.type === "credit" 
                    ? "bg-accent/10"     // Fondo verde claro para ingresos
                    : "bg-secondary"     // Fondo gris para egresos
                }`}>
                  {tx.type === "credit" ? (
                    <ArrowDownLeft className="w-5 h-5 text-accent" />       // Flecha de ingreso
                  ) : (
                    <CreditCard className="w-5 h-5 text-muted-foreground" /> // Icono de tarjeta para egreso
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-card-foreground">{tx.name}</p>
                  <p className="text-xs text-muted-foreground">{tx.date}</p>
                </div>
              </div>
              {/* Monto: verde con + para ingresos, normal con - para egresos */}
              <p className={`text-sm font-semibold font-mono ${
                tx.type === "credit" ? "text-accent" : "text-card-foreground"
              }`}>
                {tx.type === "credit" ? "+" : "-"}${Math.abs(tx.amount).toLocaleString("es-MX", { minimumFractionDigits: 2 })}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ============ MODALES ============ */}
      {/* Se renderizan condicionalmente cuando su estado es true */}
      {showTransfer && <TransferModal onClose={() => setShowTransfer(false)} />}
      {showPayment && <PaymentModal onClose={() => setShowPayment(false)} />}
    </div>
  )
}

/* ================================================================== */
/*  QuickAction: componente reutilizable para los botones de acceso    */
/*  rapido (Transferir, Recargar, Pagar, Mas)                         */
/*  Recibe un icono, una etiqueta de texto y una funcion onClick       */
/* ================================================================== */
function QuickAction({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-1.5 py-2 rounded-xl hover:bg-secondary/50 transition-colors"
    >
      {/* Circulo con el icono */}
      <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center text-primary">
        {icon}
      </div>
      {/* Etiqueta debajo del icono */}
      <span className="text-xs text-card-foreground font-medium">{label}</span>
    </button>
  )
}
