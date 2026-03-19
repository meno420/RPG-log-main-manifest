/**
 * ProfileSection.jsx — Sección de perfil en ajustes
 * ─────────────────────────────────────────────────────
 * Permite al usuario personalizar su identidad en la app:
 *
 *   • Selector de avatar (grid de 12 emojis)
 *   • Campo de nombre de usuario (máx. 20 caracteres)
 *   • Botón GUARDAR con feedback de éxito temporal
 *
 * El avatar y nombre cambian de inmediato en el estado local.
 * Al integrar backend, el botón GUARDAR debería hacer PATCH /users/:id/profile.
 *
 * Props:
 *   user    — objeto actual { name, avatar, title, level }
 *   setUser — actualiza el usuario en HomeScreen (estado compartido)
 *
 * Datos: AVATARS (array de emojis) desde data/settings.js
 * Estilos: SettingsScreen.css (.avatar-grid, .avatar-opt, .field-wrap)
 */
import { useState } from "react";
import { AVATARS } from "../../data/settings";

export default function ProfileSection({ user, setUser }) {
  const [name, setName]     = useState(user.name);
  const [avatar, setAvatar] = useState(user.avatar);
  const [saved, setSaved]   = useState(false);

  const dirty = name !== user.name || avatar !== user.avatar;

  const save = () => {
    setUser(p => ({ ...p, name: name.trim() || p.name, avatar }));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="settings-block">
      <div className="settings-block-header">
        <span className="settings-block-icon">🧙</span>
        <span className="settings-block-title">PERFIL Y AVATAR</span>
      </div>
      <div className="settings-block-body">

        {/* Current preview */}
        <div className="avatar-row">
          <div className="avatar-big">
            {avatar}
            <div className="avatar-big-edit">✏️</div>
          </div>
          <div>
            <div className="avatar-info-username">{name || user.name}</div>
            <div className="avatar-info-title">{user.title}</div>
            <div className="avatar-info-level">NIVEL {user.level}</div>
          </div>
        </div>

        {/* Avatar picker */}
        <div>
          <div className="avatar-picker-label">▸ ELIGE TU AVATAR</div>
          <div className="avatar-grid">
            {AVATARS.map(a => (
              <button
                key={a}
                className={`avatar-opt${avatar === a ? " selected" : ""}`}
                onClick={() => setAvatar(a)}
              >
                {a}
              </button>
            ))}
          </div>
        </div>

        {/* Name input */}
        <div className="field-row">
          <label className="field-label-settings">▸ NOMBRE DE HÉROE</label>
          <div className="field-wrap">
            <input
              className="field-input-settings"
              value={name}
              onChange={e => setName(e.target.value)}
              maxLength={20}
              placeholder={user.name}
            />
          </div>
          <div className="field-char-limit">{name.length}/20</div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: ".8rem" }}>
          <button className="save-btn" disabled={!dirty} onClick={save}>
            💾 GUARDAR CAMBIOS
          </button>
          {saved && <span className="save-success">✓ GUARDADO</span>}
        </div>
      </div>
    </div>
  );
}
