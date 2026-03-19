/**
 * MissionCard.jsx — Tarjeta individual de misión
 * ─────────────────────────────────────────────────────
 * Renderiza una misión con su información y controles.
 *
 * Comportamiento por tipo:
 *   type="daily"  — SIN barra de progreso. Solo botón COMPLETAR.
 *                   Las misiones diarias son binarias: hecho o no hecho.
 *   type="weekly" — CON barra de progreso. El progreso avanza
 *                   automáticamente al completar misiones diarias del
 *                   mismo stat. El botón aparece solo si progress >= total.
 *
 * Props:
 *   mission    — { id, name, desc, stat, icon, color, xp, coins,
 *                  progress, total, unit, done }
 *   type       — "daily" | "weekly"
 *   onComplete — callback(mission) al presionar COMPLETAR
 *
 * Estilos: MissionsScreen.css (.mission-card, .mission-top, etc.)
 */
export default function MissionCard({ mission, type = "daily", onComplete }) {
  const pct        = Math.min((mission.progress / mission.total) * 100, 100);
  const isWeekly   = type === "weekly";
  // Las semanales se pueden completar cuando el progreso llega al total
  const canComplete = isWeekly ? (mission.progress >= mission.total && !mission.done) : !mission.done;

  return (
    <div
      className={`mission-card${mission.done ? " done" : ""}`}
      style={{ "--stat-color": mission.color }}
    >
      {/* ── Fila superior: info + recompensas ── */}
      <div className="mission-top">
        <div className="mission-left">
          <div className="mission-stat-tag">
            {mission.icon} {mission.stat}
          </div>
          <div className="mission-name-text">{mission.name}</div>
          <div className="mission-desc">{mission.desc}</div>
        </div>
        <div className="mission-rewards">
          <div className="reward-xp">+{mission.xp} XP</div>
          <div className="reward-coins">🪙 {mission.coins}</div>
        </div>
      </div>

      {/* ── Parte inferior: barra (solo semanales) + botón ── */}
      {!mission.done && (
        <div className="mission-bottom">

          {/* Barra de progreso — SOLO en semanales */}
          {isWeekly && (
            <div className="mission-progress-wrap">
              <div className="mission-progress-label">
                {mission.progress}/{mission.total} {mission.unit}
              </div>
              <div className="mission-progress-track">
                <div className="mission-progress-fill" style={{ width: `${pct}%` }} />
              </div>
            </div>
          )}

          {/* Botón completar:
              · Diarias: siempre visible
              · Semanales: solo cuando el progreso llegó al total */}
          {canComplete && (
            <button className="mission-btn" onClick={() => onComplete(mission)}>
              ▶ COMPLETAR
            </button>
          )}

          {/* Semanales incompletas: muestra "en progreso" */}
          {isWeekly && !canComplete && (
            <div className="mission-in-progress">
              EN PROGRESO — {mission.total - mission.progress} {mission.unit} restantes
            </div>
          )}
        </div>
      )}
    </div>
  );
}
