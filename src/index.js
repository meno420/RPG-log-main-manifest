/**
 * index.js — Punto de entrada de la aplicación React
 * ─────────────────────────────────────────────────────
 * Monta el componente raíz <App /> en el elemento #root del HTML.
 * Este archivo no debe modificarse salvo que se cambie la configuración
 * de React (ej: StrictMode, Suspense global, proveedores de contexto).
 */
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";

serviceWorkerRegistration.register();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);

