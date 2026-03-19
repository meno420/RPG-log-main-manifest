/**
 * Navbar.jsx — Barra de navegación superior
 * ─────────────────────────────────────────────────────
 * Añade un ícono de campana 🔔 entre las monedas y el avatar.
 * Al pulsarla abre NotificationPanel (dropdown inline) con la
 * lista de notificaciones y acciones rápidas (marcar leídas, limpiar).
 *
 * Props:
 *   active / setActive     — página activa
 *   coins                  — monedas del usuario
 *   showDropdown / setShowDropdown — estado del AvatarDropdown
 *   showNotifPanel / setShowNotifPanel — estado del NotificationPanel
 *   unreadCount            — badge rojo en campana y avatar
 *   notifs / setNotifs     — array de notificaciones (para el panel)
 *   user                   — objeto { name, title, avatar, level }
 */
import { NAV_ITEMS } from "../data/constants";
import AvatarDropdown    from "./settings/AvatarDropdown";
import NotificationPanel from "./NotificationPanel";

const NAV_LINKS = NAV_ITEMS.filter(n => n.id !== "settings");

export default function Navbar({
  active, setActive,
  coins = 0,
  showDropdown, setShowDropdown,
  showNotifPanel, setShowNotifPanel,
  unreadCount = 0,
  notifs = [], setNotifs,
  user,
}) {
  const handleNavClick = (id) => {
    setActive(id);
    if (setShowDropdown)   setShowDropdown(false);
    if (setShowNotifPanel) setShowNotifPanel(false);
  };

  const toggleNotifPanel = (e) => {
    e.stopPropagation();
    if (setShowDropdown) setShowDropdown(false);
    setShowNotifPanel(p => !p);
  };

  const toggleAvatarDrop = (e) => {
    e.stopPropagation();
    if (setShowNotifPanel) setShowNotifPanel(false);
    setShowDropdown(p => !p);
  };

  const displayUser = user || { avatar: "🧙", name: "Héroe", title: "", level: 1, coins };

  return (
    <nav className="navbar">
      <div className="nav-logo">
        <span className="nav-logo-icon">🗡️</span>
        RPG LOG
      </div>

      <div className="nav-links">
        {NAV_LINKS.map(n => (
          <button
            key={n.id}
            className={`nav-link${active === n.id ? " active" : ""}`}
            onClick={() => handleNavClick(n.id)}
          >
            {n.label}
          </button>
        ))}
      </div>

      <div className="nav-right">
        <div className="nav-coins">🪙 {coins.toLocaleString()}</div>

        {/* ── Campana de notificaciones ─────────────────── */}
        <div style={{ position: "relative" }}>
          <button
            className={`nav-bell${showNotifPanel ? " active" : ""}`}
            onClick={toggleNotifPanel}
            aria-label="Notificaciones"
          >
            🔔
            {unreadCount > 0 && (
              <span className="nav-bell-badge">{unreadCount > 9 ? "9+" : unreadCount}</span>
            )}
          </button>

          {showNotifPanel && (
            <NotificationPanel
              notifs={notifs}
              setNotifs={setNotifs}
              onClose={() => setShowNotifPanel(false)}
            />
          )}
        </div>

        {/* ── Avatar + dropdown ─────────────────────────── */}
        <div style={{ position: "relative" }}>
          <div
            className={`nav-avatar${showDropdown ? " active" : ""}`}
            onClick={toggleAvatarDrop}
          >
            {displayUser.avatar}
            {unreadCount > 0 && <div className="nav-avatar-unread" />}
          </div>

          {showDropdown && (
            <AvatarDropdown
              setActivePage={setActive}
              setShowDropdown={setShowDropdown}
              unreadCount={unreadCount}
              user={{ ...displayUser, coins }}
            />
          )}
        </div>
      </div>
    </nav>
  );
}
