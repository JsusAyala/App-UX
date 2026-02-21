"use client"

// Importaciones de React necesarias para el contexto de autenticacion
import { createContext, useContext, useState, type ReactNode } from "react"

/* ------------------------------------------------------------------ */
/*  Interfaz del usuario: define la estructura de datos del usuario    */
/*  que se almacena al iniciar sesion                                  */
/* ------------------------------------------------------------------ */
interface User {
  name: string            // Nombre completo del usuario
  email: string           // Correo electronico
  accountNumber: string   // Numero de cuenta bancaria (parcialmente oculto)
  balance: number         // Saldo disponible en la cuenta
}

/* ------------------------------------------------------------------ */
/*  Interfaz del contexto de autenticacion: define las funciones y     */
/*  datos que estaran disponibles en toda la app                       */
/* ------------------------------------------------------------------ */
interface AuthContextType {
  user: User | null                                       // Usuario actual (null si no ha iniciado sesion)
  login: (email: string, password: string) => Promise<boolean>  // Funcion para iniciar sesion
  logout: () => void                                      // Funcion para cerrar sesion
  isLoading: boolean                                      // Indica si se esta procesando el login
}

// Se crea el contexto de React con valor inicial null
const AuthContext = createContext<AuthContextType | null>(null)

/* ================================================================== */
/*  AuthProvider: componente que envuelve la app y provee el estado    */
/*  de autenticacion a todos los componentes hijos                     */
/* ================================================================== */
export function AuthProvider({ children }: { children: ReactNode }) {
  // Estado del usuario autenticado (null = no autenticado)
  const [user, setUser] = useState<User | null>(null)
  // Estado de carga durante el proceso de login
  const [isLoading, setIsLoading] = useState(false)

  /* ---------------------------------------------------------------- */
  /*  Funcion login: simula la autenticacion con un delay de red       */
  /*  Acepta cualquier correo/contrasena y crea un usuario simulado    */
  /* ---------------------------------------------------------------- */
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    // Simula el retraso de red (1.8 segundos) como si fuera una peticion real al servidor
    await new Promise((resolve) => setTimeout(resolve, 1800))
    
    // Si se proporcionaron ambos campos, se crea el usuario simulado
    if (email && password) {
      setUser({
        name: "Jesús Ayala",                    // Nombre fijo del usuario simulado
        email: email,                            // Se usa el correo ingresado
        accountNumber: "****-****-****-4892",    // Numero de cuenta parcialmente oculto por seguridad
        balance: 47_832.50,                      // Saldo inicial simulado de $47,832.50 MXN
      })
      setIsLoading(false)
      return true  // Login exitoso
    }
    setIsLoading(false)
    return false  // Login fallido (campos vacios)
  }

  /* ---------------------------------------------------------------- */
  /*  Funcion logout: limpia el estado del usuario para cerrar sesion  */
  /* ---------------------------------------------------------------- */
  const logout = () => {
    setUser(null)
  }

  // Se renderiza el Provider que comparte el estado con toda la app
  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

/* ================================================================== */
/*  Hook personalizado useAuth: permite a cualquier componente         */
/*  acceder al contexto de autenticacion de forma sencilla             */
/*  Lanza error si se usa fuera del AuthProvider                       */
/* ================================================================== */
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
