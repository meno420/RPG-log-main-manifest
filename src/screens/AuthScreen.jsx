/**
 * AuthScreen.jsx — Pantalla de autenticación
 * ─────────────────────────────────────────────────────
 * Muestra la interfaz de login y registro. Al autenticarse
 * pasa el nombre del usuario hacia App.jsx via onLogin().
 *
 * Props:
 *   onLogin(username, isNew) — callback hacia App.jsx
 *     username — nombre del héroe (de signup) o email-prefix (de login)
 *     isNew    — true si es registro nuevo (comienza nivel 1)
 *
 * Estado:
 *   tab     — tab activa: "login" | "signup"
 *   success — { mode, name } al autenticarse (activa overlay de éxito)
 *
 * El overlay de éxito muestra el nombre del usuario y una barra de
 * carga de 1.8s antes de redirigir al dashboard.
 */
import { useState, useEffect } from "react";
import "../styles/globals.css";
import "../styles/AuthScreen.css";

import Stars      from "../components/Stars";
import LoginForm  from "../components/LoginForm";
import SignupForm from "../components/SignupForm";

// Overlay que aparece brevemente al autenticarse
const SuccessOverlay = ({ mode, name }) => (
  <div className="success-overlay">
    <div className="success-icon">{mode === "login" ? "⚔️" : "🏆"}</div>
    <div className="success-text">
      {mode === "login"
        ? `¡BIENVENIDO DE VUELTA,\n${name.toUpperCase()}!`
        : `¡HÉROE CREADO!\n${name.toUpperCase()}`}
    </div>
    <div className="success-bar-wrap">
      <div className="success-bar" />
    </div>
  </div>
);

export default function AuthScreen({ onLogin }) {
  const [tab, setTab]         = useState("login");
  const [success, setSuccess] = useState(null); // { mode, name } | null

  // Recibe (mode, username) desde LoginForm o SignupForm
  const handleSuccess = (mode, username) => {
    setSuccess({ mode, name: username });
    // Espera que termine la animación del overlay (1.8s barra + 0.3s margen)
    setTimeout(() => {
      onLogin(username, mode === "signup");
    }, 2100);
  };

  // Limpia el overlay si el componente se desmonta antes de que termine
  useEffect(() => {
    if (!success) return;
    const t = setTimeout(() => setSuccess(null), 2100);
    return () => clearTimeout(t);
  }, [success]);

  return (
    <div className="auth-root">
      <Stars />
      <div className="scanlines" />

      <div className="card">
        {success && <SuccessOverlay mode={success.mode} name={success.name} />}
        <div className="card-corner-bl" />
        <div className="card-corner-br" />

        {/* Header con logo */}
        <div className="card-header">
          <div className="logo-row">
            <span className="logo-icon">🗡️</span>
            <span className="logo-title">RPG LOG</span>
            <span className="logo-icon">🛡️</span>
          </div>
          <div className="logo-sub">PERSONAL RPG SYSTEM</div>
          <div className="xp-bar-wrap">
            <div className="xp-bar-fill" style={{ "--xp-w": "72%" }} />
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs">
          <button
            className={`tab-btn${tab === "login" ? " active" : ""}`}
            onClick={() => { setTab("login"); setSuccess(null); }}
          >
            ▸ INICIAR SESIÓN
          </button>
          <button
            className={`tab-btn${tab === "signup" ? " active" : ""}`}
            onClick={() => { setTab("signup"); setSuccess(null); }}
          >
            ▸ REGISTRARSE
          </button>
        </div>

        {/* Formulario activo */}
        {tab === "login"
          ? <LoginForm  key="login"  onSuccess={handleSuccess} />
          : <SignupForm key="signup" onSuccess={handleSuccess} />}

        {/* Footer: links legales + restablecer contraseña (solo en login) */}
        <div className="card-footer">
          <button className="footer-link" onClick={() => alert("Términos y condiciones — próximamente.")}>
            TÉRMINOS Y CONDICIONES
          </button>
          {tab === "login" && (
            <button className="footer-link" onClick={() => alert("Restablecimiento de contraseña — próximamente.")}>
              RESTABLECER CONTRASEÑA
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
