/**
 * AvatarDropdown.jsx — Menú desplegable del avatar
 * ─────────────────────────────────────────────────────
 * Panel que aparece al hacer clic en el avatar del Navbar.
 * Reemplaza el ítem CONFIG en la barra de navegación.
 *
 * Contiene:
 *   Header   — avatar, nombre, título y nivel + monedas del usuario
 *   👤 PERFIL Y AVATAR  → navega a "settings-profile"
 *   🪙 MONEDERO         → navega a "settings-wallet"
 *   🔔 NOTIFICACIONES   → navega a "settings-notifs"
 *              (muestra un punto rojo pulsante si hay no leídas)
 *   🚪 CERRAR SESIÓN    → navega a "settings-logout" (estilo peligro rojo)
 *
 * Se cierra automáticamente al seleccionar cualquier opción
 * y también al hacer clic fuera (manejado en HomeScreen.handleAppClick).
 *
 * Props:
 *   setActivePage   — cambia la página en HomeScreen
 *   setShowDropdown — cierra el dropdown
 *   unreadCount     — número de notificaciones sin leer
 *   user            — objeto { name, title, avatar, level, coins }
 *
 * Estilos: SettingsScreen.css (.dropdown-panel, .dp-item, .dp-header)
 */
export default function AvatarDropdown({ setActivePage, setShowDropdown, unreadCount, user }) {
  const go = (page) => { setActivePage(page); setShowDropdown(false); };

  return (
    <div className="dropdown-panel">
      <div className="dp-corner-bl" />
      <div className="dp-corner-br" />

      {/* User header */}
      <div className="dp-header">
        <div className="dp-header-top">
          <span className="dp-avatar-lg">{user.avatar}</span>
          <div>
            <div className="dp-username">{user.name}</div>
            <div className="dp-title-tag">{user.title}</div>
          </div>
        </div>
        <div className="dp-level">NIVEL {user.level} · 🪙 {user.coins.toLocaleString()}</div>
      </div>

      {/* Menu items */}
      <button className="dp-item" onClick={() => go("settings-profile")}>
        <span className="dp-item-icon">🧙</span>
        <span className="dp-item-label">PERFIL Y AVATAR</span>
        <span className="dp-item-arrow">›</span>
      </button>

      <button className="dp-item" onClick={() => go("settings-wallet")}>
        <span className="dp-item-icon">🪙</span>
        <span className="dp-item-label">MONEDERO</span>
        <span className="dp-item-arrow">›</span>
      </button>

      <button className="dp-item" onClick={() => go("settings-notifs")}>
        <span className="dp-item-icon">🔔</span>
        <span className="dp-item-label">NOTIFICACIONES</span>
        {unreadCount > 0
          ? <div className="dp-notif-dot" />
          : <span className="dp-item-arrow">›</span>
        }
      </button>

      <button className="dp-item danger" onClick={() => go("settings-logout")}>
        <span className="dp-item-icon">🚪</span>
        <span className="dp-item-label">CERRAR SESIÓN</span>
      </button>
    </div>
  );
}
