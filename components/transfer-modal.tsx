"use client"

// Importaciones de React e iconos
import { useState } from "react"
import { X, Loader2, ArrowRight, CheckCircle2 } from "lucide-react"

// Tipo que define los pasos de la transferencia
// "form" = formulario, "confirming" = procesando, "success" = exitoso
type TransferStep = "form" | "confirming" | "success"

/* ================================================================== */
/*  TransferModal: modal para realizar transferencias SPEI             */
/*  Se muestra sobre el dashboard como overlay con backdrop blur       */
/*  Flujo: formulario -> procesando (2s) -> comprobante de exito      */
/* ================================================================== */
export function TransferModal({ onClose }: { onClose: () => void }) {
  // Estado del paso actual de la transferencia
  const [step, setStep] = useState<TransferStep>("form")

  // Estados de los campos del formulario
  const [clabe, setClabe] = useState("")           // CLABE interbancaria del destinatario (18 digitos)
  const [amount, setAmount] = useState("")          // Monto a transferir
  const [concept, setConcept] = useState("")        // Concepto de la transferencia (opcional)
  const [beneficiary, setBeneficiary] = useState("") // Nombre del beneficiario
  const [folio, setFolio] = useState("")            // Folio generado al completar la transferencia

  /* ---------------------------------------------------------------- */
  /*  handleTransfer: procesa la transferencia simulada                 */
  /*  1. Cambia a estado "confirming" (muestra spinner)                */
  /*  2. Espera 2 segundos simulando conexion con el banco             */
  /*  3. Genera un folio unico y muestra el comprobante                */
  /* ---------------------------------------------------------------- */
  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault()
    setStep("confirming")

    // Simula un procesamiento de 2 segundos (como una peticion real al servidor SPEI)
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Genera un folio aleatorio con formato: SPEI-[timestamp]-[caracteres aleatorios]
    const randomFolio = `SPEI-${Date.now().toString().slice(-8)}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`
    setFolio(randomFolio)
    setStep("success")  // Muestra el comprobante
  }

  /* ================================================================ */
  /*  RENDER: overlay modal con las 3 vistas                           */
  /* ================================================================ */
  return (
    // Overlay de fondo oscuro con efecto blur
    <div className="fixed inset-0 bg-foreground/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center">
      {/* Contenedor del modal: aparece desde abajo en movil, centrado en desktop */}
      <div className="bg-card w-full max-w-md rounded-t-2xl sm:rounded-2xl max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-4 duration-300">

        {/* ---------- Header del modal con titulo y boton de cerrar ---------- */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="font-semibold text-card-foreground">Transferencia SPEI</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-secondary transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* ============ VISTA: Formulario de transferencia ============ */}
        {step === "form" && (
          <form onSubmit={handleTransfer} className="p-4 space-y-4">
            {/* Campo: nombre del beneficiario */}
            <div>
              <label htmlFor="beneficiary" className="block text-sm font-medium text-card-foreground mb-1.5">
                Beneficiario
              </label>
              <input
                id="beneficiary"
                type="text"
                value={beneficiary}
                onChange={(e) => setBeneficiary(e.target.value)}
                placeholder="Nombre del beneficiario"
                required
                className="w-full px-4 py-3 rounded-lg bg-secondary text-secondary-foreground placeholder:text-muted-foreground border border-border focus:outline-none focus:ring-2 focus:ring-ring text-sm"
              />
            </div>

            {/* Campo: CLABE interbancaria (18 digitos, fuente monoespaciada) */}
            <div>
              <label htmlFor="clabe" className="block text-sm font-medium text-card-foreground mb-1.5">
                CLABE Interbancaria
              </label>
              <input
                id="clabe"
                type="text"
                value={clabe}
                onChange={(e) => setClabe(e.target.value)}
                placeholder="18 digitos"
                maxLength={18}
                required
                className="w-full px-4 py-3 rounded-lg bg-secondary text-secondary-foreground placeholder:text-muted-foreground border border-border focus:outline-none focus:ring-2 focus:ring-ring text-sm font-mono"
              />
            </div>

            {/* Campo: monto con simbolo $ al inicio */}
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-card-foreground mb-1.5">
                Monto
              </label>
              <div className="relative">
                {/* Simbolo de pesos posicionado a la izquierda del input */}
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-mono">$</span>
                <input
                  id="amount"
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

            {/* Campo: concepto (opcional, no es requerido) */}
            <div>
              <label htmlFor="concept" className="block text-sm font-medium text-card-foreground mb-1.5">
                Concepto (opcional)
              </label>
              <input
                id="concept"
                type="text"
                value={concept}
                onChange={(e) => setConcept(e.target.value)}
                placeholder="Ej: Pago de renta"
                className="w-full px-4 py-3 rounded-lg bg-secondary text-secondary-foreground placeholder:text-muted-foreground border border-border focus:outline-none focus:ring-2 focus:ring-ring text-sm"
              />
            </div>

            {/* Boton de enviar */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
              >
                Enviar Transferencia
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* ============ VISTA: Procesando transferencia ============ */}
        {/* Muestra spinner con animacion de puntos rebotando */}
        {step === "confirming" && (
          <div className="p-8 flex flex-col items-center gap-4">
            {/* Spinner circular animado */}
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-card-foreground mb-1">Procesando transferencia...</p>
              <p className="text-sm text-muted-foreground">
                Verificando datos con el banco destino
              </p>
            </div>
            {/* Tres puntos con animacion de rebote escalonada */}
            <div className="flex gap-1 mt-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:0ms]" />
              <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:150ms]" />
              <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:300ms]" />
            </div>
          </div>
        )}

        {/* ============ VISTA: Transferencia exitosa (comprobante) ============ */}
        {step === "success" && (
          <div className="p-6 flex flex-col items-center gap-4">
            {/* Icono de exito */}
            <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-accent" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-card-foreground mb-2">Transferencia Exitosa</p>
              <p className="text-sm text-muted-foreground mb-4">
                Tu transferencia ha sido procesada correctamente.
              </p>
            </div>

            {/* Comprobante con los detalles de la transferencia */}
            <div className="w-full bg-secondary rounded-xl p-4 space-y-3">
              {/* Beneficiario */}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Beneficiario</span>
                <span className="font-medium text-card-foreground">{beneficiary}</span>
              </div>
              {/* CLABE parcialmente oculta por seguridad (solo ultimos 4 digitos) */}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">CLABE</span>
                <span className="font-mono text-card-foreground text-xs">
                  {"****" + clabe.slice(-4)}
                </span>
              </div>
              {/* Monto formateado en pesos mexicanos */}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Monto</span>
                <span className="font-semibold text-card-foreground font-mono">
                  ${Number(amount).toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                </span>
              </div>
              {/* Concepto: solo se muestra si se ingreso uno */}
              {concept && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Concepto</span>
                  <span className="text-card-foreground">{concept}</span>
                </div>
              )}
              {/* Linea separadora */}
              <hr className="border-border" />
              {/* Folio unico de la operacion */}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Folio</span>
                <span className="font-mono text-xs text-card-foreground">{folio}</span>
              </div>
              {/* Fecha y hora de la operacion */}
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
