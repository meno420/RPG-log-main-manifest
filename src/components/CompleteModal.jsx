/**
 * CompleteModal.jsx — Modal de completar misión
 * ─────────────────────────────────────────────────────
 * Se muestra al confirmar una misión. Presenta las recompensas y
 * permite tomar una foto para doblar el XP ganado.
 *
 * Al presionar "CONTINUAR AVENTURA" llama onDone(finalXp) con el XP
 * real (normal o ×2 si se tomó foto). Esto dispara la actualización
 * de stats, XP del personaje y monedas en HomeScreen.
 *
 * Props:
 *   mission — objeto de la misión completada
 *   onClose — cierra el modal SIN aplicar recompensas (tap en overlay)
 *   onDone(finalXp) — confirma y aplica las recompensas
 *
 * Estilos: MissionsScreen.css (.modal-overlay, .modal, .modal-photo-section)
 */
import { useState, useRef } from "react";

export default function CompleteModal({ mission, onClose, onDone }) {
  const [photoTaken,    setPhotoTaken]    = useState(false);
  const [photoPreview,  setPhotoPreview]  = useState(null);
  const fileInputRef = useRef(null);

  if (!mission) return null;

  const isSpecial = !!mission.stats;
  const baseXp    = mission.xp;
  const finalXp   = photoTaken ? baseXp * 2 : baseXp;

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPhotoPreview(url);
    setPhotoTaken(true);
  };

  // Confirmar misión: propaga el XP final hacia MissionsScreen → HomeScreen
  const handleConfirm = () => {
    if (onDone) onDone(finalXp);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-corner-bl" />
        <div className="modal-corner-br" />

        <div className="modal-icon">{isSpecial ? "⚡" : "🏆"}</div>
        <div className="modal-title">
          {isSpecial ? "¡MISIÓN ESPECIAL!" : "¡MISIÓN COMPLETADA!"}
        </div>
        <div className="modal-mission">{mission.name}</div>

        {/* Recompensas */}
        <div className="modal-rewards">
          <div className="modal-reward">
            <div className={`modal-reward-val${photoTaken ? " x2" : ""}`}>
              +{finalXp} XP {photoTaken && "✕2"}
            </div>
            <div className="modal-reward-label">EXPERIENCIA</div>
          </div>
          <div className="modal-reward">
            <div className="modal-reward-val coins">+{mission.coins} 🪙</div>
            <div className="modal-reward-label">MONEDAS</div>
          </div>
        </div>

        {/* Sección de foto de evidencia para bonus ×2 */}
        {!photoTaken ? (
          <div className="modal-photo-section">
            <div className="modal-photo-title">📸 BONUS × 2 XP</div>
            <div className="modal-photo-desc">
              Toma una foto como evidencia y duplica tu experiencia ganada
            </div>
            <button className="modal-photo-btn" onClick={() => fileInputRef.current?.click()}>
              📷 TOMAR FOTO
            </button>
            {/* capture=environment abre la cámara trasera en móvil */}
            <input
              ref={fileInputRef}
              className="photo-input"
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handlePhotoChange}
            />
          </div>
        ) : (
          <div className="modal-photo-section">
            {photoPreview && (
              <img className="modal-photo-preview" src={photoPreview} alt="Evidencia" />
            )}
            <div className="modal-photo-taken">
              <span>✅</span>
              <span className="modal-photo-taken-text">¡FOTO TOMADA! XP DUPLICADO</span>
            </div>
          </div>
        )}

        <div className="modal-xp-track">
          <div className="modal-xp-fill" />
        </div>

        {/* Confirmar → propaga onDone con el XP final */}
        <button className="modal-btn" onClick={handleConfirm}>
          ▶ CONTINUAR AVENTURA
        </button>
      </div>
    </div>
  );
}
