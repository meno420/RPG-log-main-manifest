/**
 * App.jsx — Componente raíz de la aplicación
 * ─────────────────────────────────────────────────────
 * Controla el flujo principal de autenticación y guarda los datos
 * del usuario recién creado para pasarlos a HomeScreen.
 *
 * Estado:
 *   currentUser (object | null)
 *     null      → no autenticado, muestra AuthScreen
 *     { name, isNewAccount } → autenticado, muestra HomeScreen
 *
 * Callbacks:
 *   handleLogin(username, isNew)
 *     → recibe el nombre desde AuthScreen al autenticarse
 *     → isNew=true  si viene de registro (comienza nivel 1, stats en 1)
 *     → isNew=false si viene de login   (en el futuro cargará del backend)
 *
 *   handleLogout
 *     → limpia currentUser y vuelve a AuthScreen
 *
 * NOTA: Sin backend aún — los datos de progreso se almacenan en
 * el estado de HomeScreen mientras dure la sesión del navegador.
 */
import { useState } from "react";
import AuthScreen from "./screens/AuthScreen";
import HomeScreen from "./screens/HomeScreen";

export default function App() {
  // null = sin sesión | objeto = sesión activa
  const [currentUser, setCurrentUser] = useState(null);

  // Recibe nombre de usuario e indica si es cuenta nueva
  const handleLogin = (username, isNew = false) => {
    setCurrentUser({ name: username, isNewAccount: isNew });
  };

  const handleLogout = () => setCurrentUser(null);

  if (!currentUser) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  return (
    <HomeScreen
      initialName={currentUser.name}
      isNewAccount={currentUser.isNewAccount}
      onLogout={handleLogout}
    />
  );
}
