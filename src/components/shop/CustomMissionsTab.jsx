/**
 * CustomMissionsTab.jsx — Tab de misiones personalizadas (Tienda)
 * ─────────────────────────────────────────────────────
 * Gestiona los 3 slots de misiones custom. NINGUNO viene desbloqueado
 * por defecto — el usuario debe comprar cada slot antes de poder usarlo.
 *
 * PRECIOS DE SLOTS (SLOT_PRICES de data/shop.js):
 *   Slot 1 → 150🪙   Slot 2 → 300🪙   Slot 3 → 500🪙
 *
 * FLUJO:
 *   1. Slot bloqueado → card con precio → botón DESBLOQUEAR
 *   2. Slot desbloqueado y vacío → botón CREAR MISIÓN CUSTOM
 *   3. Slot con misión activa → muestra timer + info + botón COMPLETAR al llegar a 0
 *
 * TIMER:
 *   Al crear una misión se guarda startedAt (timestamp ms) y durationMs.
 *   MissionTimer actualiza el tiempo restante cada segundo con setInterval.
 *   Cuando llega a 0 el botón COMPLETAR se activa.
 *
 * PERSISTENCIA:
 *   El estado de slots comprados (unlockedSlots: Set de índices) y las
 *   misiones activas (customMissions) se persisten en HomeScreen via props.
 *   HomeScreen los guarda en localStorage bajo clave por usuario.
 *
 * Props:
 *   coins / setCoins          — monedero del usuario
 *   customMissions            — array de misiones activas (desde HomeScreen)
 *   setCustomMissions         — actualiza el array en HomeScreen
 *   onMissionComplete(m)      — propaga XP+monedas completadas a HomeScreen
 *   unlockedSlots             — Set<number> de índices de slots comprados {0,1,2}
 *   setUnlockedSlots          — actualiza los slots desbloqueados
 */
import { useState, useEffect } from "react";
import { SHOP_STATS, SLOT_PRICES } from "../../data/shop";
import MissionBuilder from "./MissionBuilder";
import ConfirmModal   from "./ConfirmModal";

const TOTAL_SLOTS = 3; // número fijo de slots

// Formatea ms → "HH:MM:SS"
function fmtMs(ms) {
  if (ms <= 0) return "00:00:00";
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sc = s % 60;
  return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(sc).padStart(2,"0")}`;
}

// Subcomponente de timer individual por misión activa
function MissionTimer({ startedAt, durationMs }) {
  const [left, setLeft] = useState(() => Math.max(0, durationMs - (Date.now() - startedAt)));
  useEffect(() => {
    const id = setInterval(() => setLeft(Math.max(0, durationMs - (Date.now() - startedAt))), 1000);
    return () => clearInterval(id);
  }, [startedAt, durationMs]);
  const done = left === 0;
  return (
    <div className={`am-timer${done ? " am-timer-done" : ""}`}>
      {done ? "⏰ LISTO PARA COMPLETAR" : `⏱ ${fmtMs(left)}`}
    </div>
  );
}

export default function CustomMissionsTab({
  coins, setCoins,
  customMissions, setCustomMissions,
  onMissionComplete,
  unlockedSlots, setUnlockedSlots,
}) {
  const [showBuilder,  setShowBuilder]  = useState(false);
  const [targetSlot,   setTargetSlot]   = useState(null); // índice del slot donde crear
  const [confirmBuy,   setConfirmBuy]   = useState(null); // { slotIdx, price }
  const [confirmDone,  setConfirmDone]  = useState(null); // { mission, mIdx }

  // Comprar un slot → descontar monedas y añadir al set
  const handleBuySlot = () => {
    const { slotIdx, price } = confirmBuy;
    setCoins(p => p - price);
    setUnlockedSlots(prev => new Set([...prev, slotIdx]));
    setConfirmBuy(null);
  };

  // Crear misión en el slot seleccionado
  const handleCreate = (mission) => {
    setCoins(p => p - mission.cost);
    setCustomMissions(prev => [
      ...prev,
      { ...mission, slotIdx: targetSlot, startedAt: Date.now(), durationMs: mission.dur.hours * 3600 * 1000, done: false },
    ]);
    setShowBuilder(false);
    setTargetSlot(null);
  };

  // Completar misión → propaga recompensas
  const handleComplete = (mission, mIdx) => {
    setCustomMissions(prev => prev.map((m, i) => i === mIdx ? { ...m, done: true } : m));
    if (onMissionComplete) onMissionComplete(mission);
    setConfirmDone(null);
  };

  // Abandonar misión sin recompensas
  const handleAbandon = (mIdx) => setCustomMissions(prev => prev.filter((_, i) => i !== mIdx));

  // Misión activa para un slot dado (no completada)
  const missionForSlot = (slotIdx) => {
    const idx = customMissions.findIndex(m => m.slotIdx === slotIdx && !m.done);
    return idx >= 0 ? { mission: customMissions[idx], mIdx: idx } : null;
  };

  const isReady = (m) => (Date.now() - m.startedAt) >= m.durationMs;

  return (
    <>
      {/* ── Sección de slots ─────────────────────── */}
      <div className="shop-section">
        <div className="shop-sec-header">
          <span className="shop-sec-title">⚙️ ESPACIOS DE MISIÓN</span>
          <div className="shop-sec-line" />
          <span className="shop-sec-count">{unlockedSlots.size}/{TOTAL_SLOTS}</span>
        </div>

        {Array.from({ length: TOTAL_SLOTS }, (_, slotIdx) => {
          const price     = SLOT_PRICES[slotIdx];
          const unlocked  = unlockedSlots.has(slotIdx);
          const active    = missionForSlot(slotIdx);
          const canAfford = coins >= price;

          // ── SLOT BLOQUEADO ─────────────────────────
          if (!unlocked) {
            return (
              <div key={slotIdx} className="slot-card slot-locked-card">
                <div className="slot-header">
                  <div className="slot-title">ESPACIO {slotIdx + 1}</div>
                  <div className="slot-badge slot-badge-locked">🔒 BLOQUEADO</div>
                </div>
                <div className="slot-buy-row">
                  <div className="slot-buy-desc">
                    Desbloquea este espacio para crear una misión personalizada adicional.
                  </div>
                  <button
                    className="btn-buy"
                    disabled={!canAfford}
                    style={!canAfford ? { opacity: .5, cursor: "not-allowed" } : {}}
                    onClick={() => setConfirmBuy({ slotIdx, price })}
                  >
                    {canAfford ? `🪙 ${price}` : `Sin fondos (🪙${price})`}
                  </button>
                </div>
              </div>
            );
          }

          // ── SLOT DESBLOQUEADO CON MISIÓN ACTIVA ───
          if (active) {
            const { mission, mIdx } = active;
            const statObjs = SHOP_STATS.filter(s => mission.stats.includes(s.id));
            const ready    = isReady(mission);

            return (
              <div key={slotIdx} className="slot-card">
                <div className="slot-header">
                  <div className="slot-title">{mission.name}</div>
                  <div className="slot-badge">ACTIVA</div>
                </div>
                <div className="active-mission">
                  {mission.desc && <div className="am-desc">{mission.desc}</div>}
                  <div className="am-tags">
                    {statObjs.map(s => (
                      <div key={s.id} className="am-tag" style={{ "--tc": s.color }}>{s.icon} {s.name}</div>
                    ))}
                  </div>
                  <div className="am-meta">
                    <div className="am-meta-item">
                      <div className="am-meta-lbl">DURACIÓN</div>
                      <div className="am-meta-val">{mission.dur.label}</div>
                    </div>
                    <div className="am-meta-item">
                      <div className="am-meta-lbl">XP AL COMPLETAR</div>
                      <div className="am-meta-val" style={{ color:"var(--purple)" }}>+{mission.xp} XP</div>
                    </div>
                    <div className="am-meta-item">
                      <div className="am-meta-lbl">MONEDAS</div>
                      <div className="am-meta-val" style={{ color:"var(--gold)" }}>🪙 +{mission.cost}</div>
                    </div>
                  </div>

                  {/* Timer dinámico */}
                  <div className="am-timer-wrap">
                    <div className="am-meta-lbl">TIEMPO RESTANTE</div>
                    <MissionTimer startedAt={mission.startedAt} durationMs={mission.durationMs} />
                  </div>

                  {/* Botón COMPLETAR — visible solo cuando el timer llega a 0 */}
                  {ready && (
                    <button className="btn-complete-mission" onClick={() => setConfirmDone({ mission, mIdx })}>
                      ✅ COMPLETAR MISIÓN
                    </button>
                  )}

                  <button className="btn-outline-sm" style={{ alignSelf:"flex-start", marginTop:".3rem" }} onClick={() => handleAbandon(mIdx)}>
                    ABANDONAR
                  </button>
                </div>
              </div>
            );
          }

          // ── SLOT DESBLOQUEADO Y VACÍO ──────────────
          return (
            <div key={slotIdx}>
              <button className="empty-slot" onClick={() => { setTargetSlot(slotIdx); setShowBuilder(true); }}>
                <div className="empty-slot-icon">➕</div>
                <div className="empty-slot-text">CREAR MISIÓN — ESPACIO {slotIdx + 1}</div>
              </button>
            </div>
          );
        })}
      </div>

      {/* ── Reglas ───────────────────────────────── */}
      <div className="shop-section" style={{ paddingTop: 0 }}>
        <div className="rules-card">
          <div className="rules-title">▸ REGLAS DE MISIONES CUSTOM</div>
          {[
            "Máximo 4 estadísticas por misión",
            "+3 stats activa cooldown de 24h",
            `Precios de espacios: 🪙${SLOT_PRICES[0]} / 🪙${SLOT_PRICES[1]} / 🪙${SLOT_PRICES[2]}`,
            "Costo de creación: 1 stat=50🪙  2=120🪙  3=220🪙  4=350🪙",
            "XP = Base × stats × multiplicador de duración",
            "El botón COMPLETAR aparece cuando el tiempo llega a 0",
          ].map((r, i) => (
            <div key={i} className="rules-item"><span className="rules-arrow">▸</span> {r}</div>
          ))}
        </div>
      </div>

      {/* ── Modales ──────────────────────────────── */}
      {showBuilder && (
        <MissionBuilder coins={coins} onClose={() => { setShowBuilder(false); setTargetSlot(null); }} onCreate={handleCreate} />
      )}

      {confirmBuy && (
        <ConfirmModal
          icon="🔓"
          title={`DESBLOQUEAR ESPACIO ${confirmBuy.slotIdx + 1}`}
          desc={`¿Gastar 🪙${confirmBuy.price} para desbloquear este espacio de misión custom?\nSaldo actual: 🪙${coins}`}
          confirmLabel={`🪙 COMPRAR (${confirmBuy.price})`}
          onConfirm={handleBuySlot}
          onClose={() => setConfirmBuy(null)}
        />
      )}

      {confirmDone && (
        <ConfirmModal
          icon="✅"
          title="COMPLETAR MISIÓN"
          desc={`¿Reclamar las recompensas de "${confirmDone.mission.name}"?\n+${confirmDone.mission.xp} XP · 🪙${confirmDone.mission.cost}`}
          confirmLabel="✅ RECLAMAR"
          onConfirm={() => handleComplete(confirmDone.mission, confirmDone.mIdx)}
          onClose={() => setConfirmDone(null)}
        />
      )}
    </>
  );
}
