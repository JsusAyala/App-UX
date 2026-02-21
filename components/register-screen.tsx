"use client"

// Importaciones de React e iconos necesarios
import { useState } from "react"
import {
  Shield,         // Icono de escudo (logo de la app)
  ArrowLeft,      // Flecha izquierda (volver atras)
  ArrowRight,     // Flecha derecha (avanzar)
  Eye,            // Icono de ojo abierto (mostrar contrasena)
  EyeOff,         // Icono de ojo cerrado (ocultar contrasena)
  Check,          // Icono de palomita (regla cumplida)
  X,              // Icono de X (regla no cumplida / error)
  Loader2,        // Icono de spinner (cargando)
  Mail,           // Icono de correo (verificacion email)
  CheckCircle2,   // Icono de circulo con palomita (exito)
} from "lucide-react"

/* ------------------------------------------------------------------ */
/*  Reglas de contrasena: cada regla tiene un id, texto descriptivo    */
/*  y una funcion test que evalua si la contrasena cumple la regla     */
/*  Estas son reglas razonables (minimo 8 caracteres)                  */
/* ------------------------------------------------------------------ */
const PASSWORD_RULES = [
  { id: "length", label: "Minimo 8 caracteres", test: (p: string) => p.length >= 8 },
  { id: "upper", label: "Al menos una letra mayuscula", test: (p: string) => /[A-Z]/.test(p) },
  { id: "lower", label: "Al menos una letra minuscula", test: (p: string) => /[a-z]/.test(p) },
  { id: "number", label: "Al menos un numero", test: (p: string) => /\d/.test(p) },
]

/* ------------------------------------------------------------------ */
/*  Interfaz y estado inicial del formulario de registro               */
/*  Solo se piden los campos esenciales: nombre, apellido, correo,     */
/*  telefono, contrasena y confirmacion de contrasena                  */
/* ------------------------------------------------------------------ */
interface FormData {
  nombre: string
  apellido: string
  correo: string
  telefono: string
  password: string
  confirmPassword: string
}

const INITIAL_FORM: FormData = {
  nombre: "",
  apellido: "",
  correo: "",
  telefono: "",
  password: "",
  confirmPassword: "",
}

/* ================================================================== */
/*  RegisterScreen: componente principal del flujo de registro         */
/*  Tiene 4 pasos:                                                     */
/*    0 = Datos personales (nombre, correo, telefono)                  */
/*    1 = Crear contrasena con validacion en tiempo real               */
/*    2 = Verificacion por email con codigo de 6 digitos               */
/*    3 = Pantalla de exito con boton para ir al login                 */
/* ================================================================== */
export function RegisterScreen({ onBack }: { onBack: () => void }) {
  // Estado del paso actual del formulario (0 a 3)
  const [step, setStep] = useState(0)
  // Estado de todos los campos del formulario
  const [form, setForm] = useState<FormData>(INITIAL_FORM)
  // Errores de validacion por campo
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})
  // Controla la visibilidad de la contrasena y su confirmacion
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  /* Estados para la verificacion por email */
  const [emailCode, setEmailCode] = useState("")           // Codigo ingresado por el usuario
  const [emailSent, setEmailSent] = useState(false)        // Indica si el codigo ya fue "enviado"
  const [verifying, setVerifying] = useState(false)        // Indica si se esta verificando el codigo
  const [verificationError, setVerificationError] = useState("")  // Error de verificacion

  /* ---------------------------------------------------------------- */
  /*  Funcion helper para actualizar un campo del formulario y         */
  /*  limpiar su error asociado al mismo tiempo                        */
  /* ---------------------------------------------------------------- */
  const set = (key: keyof FormData, val: string) => {
    setForm((p) => ({ ...p, [key]: val }))
    setErrors((p) => {
      const n = { ...p }
      delete n[key]  // Elimina el error del campo que se esta editando
      return n
    })
  }

  /* ---------------------------------------------------------------- */
  /*  Validacion por paso: revisa los campos del paso actual y         */
  /*  retorna true si todo es valido, false si hay errores             */
  /* ---------------------------------------------------------------- */
  const validateStep = (): boolean => {
    const e: Partial<Record<keyof FormData, string>> = {}

    // Validacion del paso 0: Datos personales
    if (step === 0) {
      if (!form.nombre.trim()) e.nombre = "Campo obligatorio"
      if (!form.apellido.trim()) e.apellido = "Campo obligatorio"
      if (!form.correo.trim()) e.correo = "Campo obligatorio"
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correo)) e.correo = "Correo invalido"  // Regex basica de email
      if (!form.telefono.trim()) e.telefono = "Campo obligatorio"
      else if (form.telefono.length !== 10) e.telefono = "Debe tener 10 digitos"  // Telefonos mexicanos = 10 digitos
    }

    // Validacion del paso 1: Contrasena
    if (step === 1) {
      const allPass = PASSWORD_RULES.every((r) => r.test(form.password))  // Verifica todas las reglas
      if (!form.password) e.password = "Campo obligatorio"
      else if (!allPass) e.password = "La contrasena no cumple todos los requisitos"
      if (!form.confirmPassword) e.confirmPassword = "Campo obligatorio"
      else if (form.confirmPassword !== form.password) e.confirmPassword = "Las contrasenas no coinciden"
    }

    setErrors(e)
    return Object.keys(e).length === 0  // true si no hay errores
  }

  /* ---------------------------------------------------------------- */
  /*  Navegacion entre pasos: avanzar y retroceder                     */
  /* ---------------------------------------------------------------- */
  const next = () => {
    if (validateStep()) setStep((s) => s + 1)  // Solo avanza si la validacion pasa
  }

  const prev = () => {
    if (step > 0 && step < 3) {      // No retrocede en el paso de exito
      setVerificationError("")        // Limpia errores de verificacion
      setStep((s) => s - 1)
    }
  }

  /* ---------------------------------------------------------------- */
  /*  Funciones de verificacion por email (simuladas)                  */
  /* ---------------------------------------------------------------- */

  // Simula el envio de un codigo al correo
  const sendEmailCode = async () => {
    setEmailSent(true)
  }

  // Verifica el codigo ingresado (cualquier codigo de 6 digitos funciona,
  // excepto "000000" que se usa para simular un error)
  const verifyEmail = async () => {
    setVerifying(true)
    setVerificationError("")
    await new Promise((r) => setTimeout(r, 1500))  // Simula delay de red

    // "000000" es el unico codigo que falla (para demostrar el manejo de errores)
    if (emailCode === "000000") {
      setVerificationError("Codigo incorrecto. Intenta de nuevo.")
      setVerifying(false)
      return
    }

    // Cualquier otro codigo de 6 digitos es aceptado
    setVerifying(false)
    setStep(3)  // Avanza a la pantalla de exito
  }

  /* ---------------------------------------------------------------- */
  /*  Componente Input reutilizable: genera un campo de texto con      */
  /*  label, placeholder, validacion visual y mensaje de error         */
  /* ---------------------------------------------------------------- */
  const Input = ({
    label,
    field,
    type = "text",
    placeholder = "",
    maxLength,
  }: {
    label: string
    field: keyof FormData
    type?: string
    placeholder?: string
    maxLength?: number
  }) => (
    <div>
      <label className="block text-sm font-medium text-card-foreground mb-1.5">
        {label}
      </label>
      <input
        type={type}
        value={form[field]}
        onChange={(e) => set(field, e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        className={`w-full px-4 py-3 rounded-lg bg-secondary text-secondary-foreground placeholder:text-muted-foreground border text-sm transition-all focus:outline-none focus:ring-2 ${
          errors[field]
            ? "border-destructive focus:ring-destructive/40"  // Borde rojo si hay error
            : "border-border focus:ring-ring"                 // Borde normal si no hay error
        }`}
      />
      {/* Mensaje de error debajo del campo */}
      {errors[field] && (
        <p className="text-destructive text-xs mt-1">{errors[field]}</p>
      )}
    </div>
  )

  /* ---------------------------------------------------------------- */
  /*  Etiquetas de los pasos y calculo del progreso                    */
  /* ---------------------------------------------------------------- */
  const STEP_LABELS = [
    "Datos Personales",
    "Contrasena",
    "Verificar Email",
    "Cuenta Creada",
  ]

  const totalSteps = STEP_LABELS.length
  // Porcentaje de progreso para la barra visual (ej: paso 1 de 4 = 25%)
  const progressPercent = ((step + 1) / totalSteps) * 100

  /* ================================================================ */
  /*  RENDER: estructura visual del flujo de registro                  */
  /* ================================================================ */
  return (
    <div className="min-h-screen bg-primary flex flex-col">

      {/* ============ HEADER: logo, titulo y barra de progreso ============ */}
      <div className="px-4 pt-6 pb-4">
        <div className="flex items-center gap-3 mb-4">
          {/* Boton de retroceso: en paso 0 vuelve al login, en otros pasos retrocede */}
          {step < 3 && (
            <button
              onClick={step === 0 ? onBack : prev}
              className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
              aria-label="Volver"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          {/* Logo de NovaPay */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
              <Shield className="w-5 h-5 text-accent-foreground" />
            </div>
            <span className="text-lg font-bold text-primary-foreground">
              NovaPay
            </span>
          </div>
        </div>

        {/* Titulo del paso actual e indicador de progreso (ej: "Paso 2 de 4") */}
        <h2 className="text-xl font-bold text-primary-foreground mb-1">
          {step < 3 ? "Crear Cuenta" : "Registro Exitoso"}
        </h2>
        <p className="text-primary-foreground/60 text-sm">
          Paso {Math.min(step + 1, totalSteps)} de {totalSteps}:{" "}
          {STEP_LABELS[step]}
        </p>

        {/* Barra de progreso visual que se llena segun el paso actual */}
        <div className="mt-3 h-1.5 bg-primary-foreground/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-accent rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* ============ AREA DEL FORMULARIO (tarjeta blanca) ============ */}
      <div className="flex-1 bg-card rounded-t-3xl p-5 overflow-y-auto">

        {/* ============ PASO 0: Datos Personales ============ */}
        {/* Campos: nombre, apellido, correo y telefono */}
        {step === 0 && (
          <div className="space-y-4">
            <Input
              label="Nombre(s)"
              field="nombre"
              placeholder="Ej: Juan Carlos"
            />
            <Input
              label="Apellido(s)"
              field="apellido"
              placeholder="Ej: Garcia Lopez"
            />
            <Input
              label="Correo Electronico"
              field="correo"
              type="email"
              placeholder="tu@correo.com"
            />
            <Input
              label="Telefono Celular (10 digitos)"
              field="telefono"
              type="tel"
              placeholder="5512345678"
              maxLength={10}
            />
          </div>
        )}

        {/* ============ PASO 1: Contrasena ============ */}
        {/* Campo de contrasena con validacion en tiempo real y confirmacion */}
        {step === 1 && (
          <div className="space-y-4">
            {/* Campo de contrasena con boton de mostrar/ocultar */}
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1.5">
                Contrasena
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => set("password", e.target.value)}
                  placeholder="Crea tu contrasena"
                  className={`w-full px-4 py-3 pr-10 rounded-lg bg-secondary text-secondary-foreground placeholder:text-muted-foreground border text-sm transition-all focus:outline-none focus:ring-2 ${
                    errors.password
                      ? "border-destructive focus:ring-destructive/40"
                      : "border-border focus:ring-ring"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-card-foreground"
                  aria-label="Toggle password"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-destructive text-xs mt-1">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Panel de reglas de contrasena en tiempo real:
                Cada regla muestra palomita verde si se cumple o X gris si no */}
            <div className="bg-secondary/60 rounded-xl p-4 space-y-2">
              <p className="text-xs font-semibold text-card-foreground mb-1">
                Requisitos de contrasena:
              </p>
              {PASSWORD_RULES.map((rule) => {
                const pass =
                  form.password.length > 0 && rule.test(form.password)  // Evalua la regla
                return (
                  <div key={rule.id} className="flex items-center gap-2">
                    {pass ? (
                      <Check className="w-3.5 h-3.5 text-accent flex-shrink-0" />   // Cumplida: verde
                    ) : (
                      <X className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" /> // No cumplida: gris
                    )}
                    <span
                      className={`text-xs ${
                        pass ? "text-accent" : "text-muted-foreground"
                      }`}
                    >
                      {rule.label}
                    </span>
                  </div>
                )
              })}
            </div>

            {/* Campo de confirmacion de contrasena */}
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1.5">
                Confirmar Contrasena
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={form.confirmPassword}
                  onChange={(e) => set("confirmPassword", e.target.value)}
                  placeholder="Repite tu contrasena"
                  className={`w-full px-4 py-3 pr-10 rounded-lg bg-secondary text-secondary-foreground placeholder:text-muted-foreground border text-sm transition-all focus:outline-none focus:ring-2 ${
                    errors.confirmPassword
                      ? "border-destructive focus:ring-destructive/40"
                      : "border-border focus:ring-ring"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-card-foreground"
                  aria-label="Toggle confirm"
                >
                  {showConfirm ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-destructive text-xs mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          </div>
        )}

        {/* ============ PASO 2: Verificacion por Email ============ */}
        {/* Envia un codigo simulado al correo y el usuario lo ingresa */}
        {step === 2 && (
          <div className="space-y-4">
            {/* Icono y texto explicativo */}
            <div className="flex flex-col items-center text-center mb-2">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <Mail className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-card-foreground">
                Verificacion por Email
              </h3>
              <p className="text-muted-foreground text-sm mt-1">
                Ingresa el codigo de 6 digitos enviado a{" "}
                <span className="font-medium text-card-foreground">
                  {form.correo}
                </span>
              </p>
            </div>

            {/* Si el codigo no ha sido enviado, muestra boton para enviarlo */}
            {!emailSent ? (
              <button
                onClick={sendEmailCode}
                className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-all"
              >
                Enviar Codigo
              </button>
            ) : (
              <>
                {/* Campo para ingresar el codigo de 6 digitos */}
                <input
                  type="text"
                  value={emailCode}
                  onChange={(e) => {
                    // Solo permite numeros y limita a 6 caracteres
                    setEmailCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                    setVerificationError("")
                  }}
                  placeholder="------"
                  maxLength={6}
                  className="w-full px-3 py-4 rounded-lg bg-secondary text-secondary-foreground border border-border text-center text-2xl font-mono tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-ring"
                />

                {/* Boton para verificar el codigo */}
                <button
                  onClick={verifyEmail}
                  disabled={emailCode.length !== 6 || verifying}  // Deshabilitado si no hay 6 digitos
                  className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  {verifying ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Verificando...
                    </>
                  ) : (
                    "Verificar Codigo"
                  )}
                </button>

                {/* Pista para el usuario */}
                <p className="text-xs text-center text-muted-foreground">
                  Ingresa cualquier codigo de 6 digitos para continuar
                </p>
              </>
            )}

            {/* Mensaje de error si la verificacion falla */}
            {verificationError && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg px-4 py-3 flex items-start gap-2">
                <X className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                <p className="text-destructive text-sm">{verificationError}</p>
              </div>
            )}
          </div>
        )}

        {/* ============ PASO 3: Pantalla de Exito ============ */}
        {/* Confirma que la cuenta fue creada y ofrece ir al login */}
        {step === 3 && (
          <div className="flex flex-col items-center justify-center text-center py-8">
            {/* Icono grande de exito */}
            <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mb-5">
              <CheckCircle2 className="w-10 h-10 text-accent" />
            </div>
            <h3 className="text-xl font-bold text-card-foreground mb-2">
              Cuenta Creada Exitosamente
            </h3>
            <p className="text-muted-foreground text-sm mb-6 leading-relaxed max-w-xs">
              Bienvenido a NovaPay, {form.nombre}. Tu cuenta ha sido creada
              correctamente. Ya puedes iniciar sesion con tu correo y contrasena.
            </p>
            {/* Boton para regresar a la pantalla de login */}
            <button
              onClick={onBack}
              className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
            >
              Ir al Inicio de Sesion
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ============ BOTONES DE NAVEGACION (pasos 0 y 1) ============ */}
        {/* Muestra "Anterior" y "Siguiente" para navegar entre pasos */}
        {step < 2 && (
          <div className="flex items-center gap-3 mt-6">
            {/* Boton "Anterior": solo visible desde el paso 1 en adelante */}
            {step > 0 && (
              <button
                onClick={prev}
                className="flex-1 py-3 rounded-lg border border-border text-card-foreground font-medium text-sm hover:bg-secondary transition-all flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Anterior
              </button>
            )}
            {/* Boton "Siguiente": valida el paso actual antes de avanzar */}
            <button
              onClick={next}
              className="flex-1 py-3 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
            >
              Siguiente
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
