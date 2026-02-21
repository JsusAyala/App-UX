"use client"

// Importaciones de React e iconos
import { useState } from "react"
import { X, Loader2, Zap, CheckCircle2 } from "lucide-react"

// Tipo que define los pasos del pago: formulario, procesando o exitoso
type PaymentStep = "form" | "processing" | "success"

/* ------------------------------------------------------------------ */
/*  Lista de servicios disponibles para pago                           */
/*  Cada servicio tiene un id unico y un nombre descriptivo            */
/* ------------------------------------------------------------------ */
const SERVICES = [
  { id: "cfe", name: "CFE - Luz" },
  { id: "telmex", name: "Telmex" },
  { id: "agua", name: "Agua Potable" },
  { id: "gas", name: "Gas Natural" },
  { id: "internet", name: "Totalplay" },
  { id: "celular", name: "Telcel Recarga" },
]

/* ================================================================== */
/*  PaymentModal: modal para pagar servicios                           */
/*  Se muestra como overlay sobre el dashboard                         */
/*  Flujo: seleccionar servicio -> llenar datos -> procesar -> recibo  */
/* ================================================================== */
export function PaymentModal({ onClose }: { onClose: () => void }) {
  // Estado del paso actual
  const [step, setStep] = useState<PaymentStep>("form")

  // Estados del formulario
  const [service, setService] = useState("")       // ID del servicio seleccionado
  const [reference, setReference] = useState("")   // Numero de referencia del recibo
  const [amount, setAmount] = useState("")         // Monto a pagar
  const [folio, setFolio] = useState("")           // Folio generado al completar el pago

  // Busca el nombre completo del servicio seleccionado para mostrarlo en el recibo
  const serviceName = SERVICES.find((s) => s.id === service)?.name ?? ""

  /* ---------------------------------------------------------------- */
  /*  handlePayment: procesa el pago simulado                          */
  /*  1. Cambia a estado "processing" (muestra animacion de carga)     */
  /*  2. Espera 2 segundos simulando conexion con el proveedor         */
  /*  3. Genera folio unico y muestra el recibo de exito               */
  /* ---------------------------------------------------------------- */
  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    setStep("processing")

    // Simula 2 segundos de procesamiento (conexion con el proveedor del servicio)
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Genera un folio aleatorio con formato: PAY-[timestamp]-[caracteres]
    const randomFolio = `PAY-${Date.now().toString().slice(-8)}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`
    setFolio(randomFolio)
    setStep("success")  // Muestra el recibo
  }

  /* ================================================================ */
  /*  RENDER: overlay modal con las 3 vistas                           */
  /* ================================================================ */
  return (
    // Overlay de fondo oscuro con blur
    <div className="fixed inset-0 bg-foreground/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center">
      {/* Contenedor del modal con animacion de entrada desde abajo */}
      <div className="bg-card w-full max-w-md rounded-t-2xl sm:rounded-2xl max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-4 duration-300">

        {/* ---------- Header del modal ---------- */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="font-semibold text-card-foreground">Pago de Servicios</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-secondary transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* ============ VISTA: Formulario de pago ============ */}
        {step === "form" && (
          <form onSubmit={handlePayment} className="p-4 space-y-4">
            {/* Selector de servicio (dropdown) */}
            <div>
              <label htmlFor="service" className="block text-sm font-medium text-card-foreground mb-1.5">
                Servicio
              </label>
              <select
                id="service"
                value={service}
                onChange={(e) => setService(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg bg-secondary text-secondary-foreground border border-border focus:outline-none focus:ring-2 focus:ring-ring text-sm appearance-none"
              >
                <option value="">Selecciona un servicio</option>
                {/* Se genera una opcion por cada servicio de la lista */}
                {SERVICES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Campo: numero de referencia del recibo (fuente monoespaciada) */}
            <div>
              <label htmlFor="reference" className="block text-sm font-medium text-card-foreground mb-1.5">
                Numero de referencia
              </label>
              <input
                id="reference"
                type="text"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="Ej: 1234567890"
                required
                className="w-full px-4 py-3 rounded-lg bg-secondary text-secondary-foreground placeholder:text-muted-foreground border border-border focus:outline-none focus:ring-2 focus:ring-ring text-sm font-mono"
              />
            </div>

            {/* Campo: monto a pagar con simbolo $ */}
            <div>
              <label htmlFor="pay-amount" className="block text-sm font-medium text-card-foreground mb-1.5">
                Monto a pagar
              </label>
              <div className="relative">
                {/* Simbolo de pesos posicionado a la izquierda */}
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-mono">
                  $
                </span>
                <input
                  id="pay-amount"
                  type="number"
                  step="0.01"
                  min="1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  required
                  className="w-full pl-8 pr-4 py-3 rounded-lg bg-secondary text-secondary-foreground placeholder:text-muted-foreground border border-border focus:outline-none focus:ring-2 focus:ring-ring text-sm font-mono"
                />
              </div>
            </div>

            {/* Boton para realizar el pago */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4" />
                Realizar Pago
              </button>
            </div>
          </form>
        )}

        {/* ============ VISTA: Procesando pago ============ */}
        {/* Muestra spinner y barra de progreso animada */}
        {step === "processing" && (
          <div className="p-8 flex flex-col items-center gap-4">
            {/* Spinner circular */}
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-card-foreground mb-1">Procesando pago...</p>
              <p className="text-sm text-muted-foreground">
                Conectando con el proveedor del servicio
              </p>
            </div>
            {/* Barra de progreso con animacion de pulso */}
            <div className="w-full bg-secondary rounded-full h-1.5 overflow-hidden mt-2">
              <div className="h-full bg-primary rounded-full animate-pulse" style={{ width: "70%" }} />
            </div>
          </div>
        )}

        {/* ============ VISTA: Pago exitoso (recibo) ============ */}
        {step === "success" && (
          <div className="p-6 flex flex-col items-center gap-4">
            {/* Icono de exito */}
            <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-accent" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-card-foreground mb-2">Pago Exitoso</p>
              <p className="text-sm text-muted-foreground">
                Tu pago ha sido procesado correctamente.
              </p>
            </div>

            {/* Recibo con los detalles del pago */}
            <div className="w-full bg-secondary rounded-xl p-4 space-y-3">
              {/* Nombre del servicio pagado */}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Servicio</span>
                <span className="font-medium text-card-foreground">{serviceName}</span>
              </div>
              {/* Numero de referencia */}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Referencia</span>
                <span className="font-mono text-card-foreground text-xs">{reference}</span>
              </div>
              {/* Monto pagado formateado */}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Monto</span>
                <span className="font-semibold text-card-foreground font-mono">
                  ${Number(amount).toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                </span>
              </div>
              {/* Separador */}
              <hr className="border-border" />
              {/* Folio unico de la operacion */}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Folio</span>
                <span className="font-mono text-xs text-card-foreground">{folio}</span>
              </div>
              {/* Fecha y hora del pago */}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Fecha</span>
                <span className="text-card-foreground text-xs">
                  {new Date().toLocaleString("es-MX", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>

            {/* Boton para cerrar el modal */}
            <button
              onClick={onClose}
              className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-all mt-2"
            >
              Listo
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
