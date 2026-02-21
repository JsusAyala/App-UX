"use client"

// Importaciones de React y componentes de la app
import { useState } from "react"
import { AuthProvider, useAuth } from "@/lib/auth-context"   // Proveedor y hook de autenticacion
import { LoginScreen } from "@/components/login-screen"       // Pantalla de inicio de sesion
import { RegisterScreen } from "@/components/register-screen" // Pantalla de registro de usuario
import { Dashboard } from "@/components/dashboard"            // Panel principal del usuario

/* ================================================================== */
/*  AppContent: controla que pantalla se muestra segun el estado       */
/*  - Si el usuario esta autenticado -> muestra el Dashboard           */
/*  - Si esta en vista "register" -> muestra el formulario de registro */
/*  - Por defecto -> muestra el Login                                  */
/* ================================================================== */
function AppContent() {
  const { user } = useAuth()  // Obtiene el usuario actual del contexto

  // Estado que controla la vista actual: "login" o "register"
  const [view, setView] = useState<"login" | "register">("login")

  // Si hay usuario autenticado, se muestra directamente el Dashboard
  if (user) return <Dashboard />

  // Si la vista actual es "register", se muestra la pantalla de registro
  // con un callback onBack para volver al login
  if (view === "register") {
    return <RegisterScreen onBack={() => setView("login")} />
  }

  // Vista por defecto: pantalla de login con un callback para ir al registro
  return <LoginScreen onRegister={() => setView("register")} />
}

/* ================================================================== */
/*  Home: componente raiz de la pagina                                 */
/*  - Envuelve todo en AuthProvider para compartir el estado de auth   */
/*  - Usa max-w-md para simular una app movil centrada en pantalla     */
/*  - min-h-screen asegura que ocupe toda la altura de la ventana      */
/* ================================================================== */
export default function Home() {
  return (
    <AuthProvider>
      {/* Contenedor principal que simula una app movil */}
      <main className="max-w-md mx-auto min-h-screen bg-background shadow-2xl shadow-foreground/10 relative">
        <AppContent />
      </main>
    </AuthProvider>
  )
}
