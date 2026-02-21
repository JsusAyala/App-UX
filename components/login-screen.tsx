"use client"

// Importaciones de React y dependencias
import { useState } from "react"
import { useAuth } from "@/lib/auth-context"     // Hook de autenticacion personalizado
import { Eye, EyeOff, Shield, Loader2 } from "lucide-react"  // Iconos de la libreria Lucide

/* ================================================================== */
/*  LoginScreen: pantalla principal de inicio de sesion                */
/*  Recibe onRegister como prop para navegar a la pantalla de registro */
/* ================================================================== */
export function LoginScreen({ onRegister }: { onRegister?: () => void }) {
  // Se extraen las funciones y estado del contexto de autenticacion
  const { login, isLoading } = useAuth()

  // Estados locales del formulario
  const [email, setEmail] = useState("")            // Valor del campo de correo
  const [password, setPassword] = useState("")      // Valor del campo de contrasena
  const [showPassword, setShowPassword] = useState(false)  // Controla si la contrasena es visible o no
  const [error, setError] = useState("")            // Mensaje de error de validacion

  /* ---------------------------------------------------------------- */
  /*  handleSubmit: se ejecuta al enviar el formulario                 */
  /*  Valida los campos y llama a la funcion login del contexto        */
  /* ---------------------------------------------------------------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()  // Evita que el formulario recargue la pagina
    setError("")        // Limpia errores anteriores
    
    // Validacion: ambos campos son obligatorios
    if (!email || !password) {
      setError("Por favor ingresa tu correo y contrasena")
      return
    }

    // Intenta iniciar sesion; si falla, muestra error
    const success = await login(email, password)
    if (!success) {
      setError("Credenciales incorrectas")
    }
  }

  /* ================================================================ */
  /*  RENDER: estructura visual de la pantalla de login                */
  /* ================================================================ */
  return (
    <div className="min-h-screen bg-primary flex flex-col items-center justify-center p-4">

      {/* ---------- Logo y nombre de la app ---------- */}
      <div className="mb-10 text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          {/* Icono del escudo que representa seguridad */}
          <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
            <Shield className="w-7 h-7 text-accent-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-primary-foreground tracking-tight">NovaPay</h1>
        </div>
        <p className="text-primary-foreground/60 text-sm">Banca Digital Segura</p>
      </div>

      {/* ---------- Tarjeta del formulario de login ---------- */}
      <div className="w-full max-w-sm">
        <div className="bg-card rounded-2xl p-6 shadow-2xl shadow-primary/30">
          {/* Titulo de bienvenida */}
          <h2 className="text-xl font-semibold text-card-foreground mb-1">Bienvenido</h2>
          <p className="text-muted-foreground text-sm mb-6">Inicia sesion en tu cuenta</p>

          {/* ---------- Formulario ---------- */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Campo de correo electronico */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-card-foreground mb-1.5">
                Correo electronico
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@correo.com"
                className="w-full px-4 py-3 rounded-lg bg-secondary text-secondary-foreground placeholder:text-muted-foreground border border-border focus:outline-none focus:ring-2 focus:ring-ring text-sm transition-all"
                disabled={isLoading}  // Se deshabilita mientras se procesa el login
              />
            </div>

            {/* Campo de contrasena con boton para mostrar/ocultar */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-card-foreground mb-1.5">
                Contrasena
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}  // Alterna entre texto plano y oculto
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingresa tu contrasena"
                  className="w-full px-4 py-3 rounded-lg bg-secondary text-secondary-foreground placeholder:text-muted-foreground border border-border focus:outline-none focus:ring-2 focus:ring-ring text-sm pr-12 transition-all"
                  disabled={isLoading}
                />
                {/* Boton de ojo para mostrar/ocultar contrasena */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-card-foreground transition-colors"
                  aria-label={showPassword ? "Ocultar contrasena" : "Mostrar contrasena"}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Mensaje de error: se muestra solo si hay un error */}
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg px-4 py-2.5">
                <p className="text-destructive text-sm">{error}</p>
              </div>
            )}

            {/* Boton de submit: cambia su estado visual cuando esta cargando */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 disabled:opacity-70 transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  {/* Icono de spinner animado mientras carga */}
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Verificando...
                </>
              ) : (
                "Iniciar Sesion"
              )}
            </button>
          </form>

          {/* ---------- Enlaces adicionales ---------- */}
          <div className="mt-5 text-center space-y-2">
            {/* Enlace para recuperar contrasena */}
            <button className="text-sm text-primary hover:underline block mx-auto">
              Olvidaste tu contrasena?
            </button>
            {/* Enlace para ir a la pantalla de registro (solo si onRegister fue proporcionado) */}
            {onRegister && (
              <button onClick={onRegister} className="text-sm text-card-foreground hover:text-primary transition-colors block mx-auto">
                No tienes cuenta? <span className="font-semibold text-primary underline">Registrate aqui</span>
              </button>
            )}
          </div>
        </div>

        {/* Nota de seguridad al pie */}
        <p className="text-center text-primary-foreground/40 text-xs mt-6">
          Protegido con encriptacion de 256-bit
        </p>
      </div>
    </div>
  )
}
