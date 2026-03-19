/**
 * MissionsScreen.jsx — Pantalla de misiones
 * ─────────────────────────────────────────────────────
 * Gestiona misiones diarias, semanales y especiales con:
 *
 * PERSISTENCIA (localStorage):
 *   Clave "rpglog_missions" guarda:
 *     { dailyMissions, weeklyMissions, specialDone,
 *       dailyResetAt (timestamp ms), weeklyResetAt (timestamp ms) }
 *
 *   Al montar el componente:
 *     • Lee el estado guardado
 *     • Si han pasado ≥24h desde dailyResetAt → reinicia misiones diarias
 *     • Si han pasado ≥7d  desde weeklyResetAt → reinicia misiones semanales
 *
 * TIMERS REALES:
 *   Un setInterval de 1s actualiza los contadores de reinicio mostrando
 *   el tiempo real restante calculado desde los timestamps guardados.
 *
 * ENLACE DIARIA → SEMANAL:
 *   Completar una misión diaria incrementa el progreso de las semanales
 *   del mismo stat en mission.total unidades.
 *
 * Props:
 *   onMissionDone(mission, finalXp) — notifica a HomeScreen para actualizar
 *                                     user.xp, stats y coins.
 *   userLevel (number) — nivel del usuario. La misión especial se bloquea
 *                        si userLevel < 5. Al llegar a nivel 5 se desbloquea
 *                        automáticamente (el componente re-renderiza).
 */
import { useState, useEffect, useCallback } from "react";
import "../styles/MissionsScreen.css";

import {
  DAILY_MISSIONS,
  WEEKLY_MISSIONS,
  SPECIAL_MISSION,
  STAT_GROUPS,
} from "../data/constants";

import MissionCard    from "../components/MissionCard";
import SpecialMission from "../components/SpecialMission";
import CompleteModal  from "../components/CompleteModal";

// ── Constantes de tiempo ─────────────────────────────────────────
const MS_DAY  = 24 * 60 * 60 * 1000;   // 24 horas en ms
const MS_WEEK =  7 * MS_DAY;            // 7 días en ms
// La clave se construye con userId para aislar el estado por cuenta
const lsKey = (userId) => `rpglog_missions_${userId || "default"}`;

// ── Helpers de tiempo ────────────────────────────────────────────

// Formatea ms restantes → "HH:MM:SS" o "Xd HH:MM:SS"
function formatTimeLeft(ms) {
  if (ms <= 0) return "00:00:00";
  const totalSec = Math.floor(ms / 1000);
  const days     = Math.floor(totalSec / 86400);
  const hrs      = Math.floor((totalSec % 86400) / 3600);
  const mins     = Math.floor((totalSec % 3600) / 60);
  const secs     = totalSec % 60;
  const hms      = `${String(hrs).padStart(2,"0")}:${String(mins).padStart(2,"0")}:${String(secs).padStart(2,"0")}`;
  return days > 0 ? `${days}d ${hms}` : hms;
}

// ── Estado inicial desde localStorage o datos por defecto ────────
function loadInitialState(userId) {
  const now = Date.now();
  try {
    const saved = JSON.parse(localStorage.getItem(lsKey(userId)) || "null");
    if (saved) {
      let { dailyMissions, weeklyMissions, specialDone, dailyResetAt, weeklyResetAt } = saved;

      // ¿Han pasado ≥24h? → reiniciar misiones diarias
      if (now - dailyResetAt >= MS_DAY) {
        dailyMissions = DAILY_MISSIONS.map(m => ({ ...m }));
        specialDone   = false;
        dailyResetAt  = now;
      }

      // ¿Han pasado ≥7 días? → reiniciar misiones semanales
      if (now - weeklyResetAt >= MS_WEEK) {
        weeklyMissions = WEEKLY_MISSIONS.map(m => ({ ...m }));
        weeklyResetAt  = now;
      }

      return { dailyMissions, weeklyMissions, specialDone, dailyResetAt, weeklyResetAt };
    }
  } catch (_) { /* localStorage no disponible */ }

  // Primera vez: crear estado fresco con timestamps actuales
  return {
    dailyMissions:  DAILY_MISSIONS.map(m => ({ ...m })),
    weeklyMissions: WEEKLY_MISSIONS.map(m => ({ ...m })),
    specialDone:    false,
    dailyResetAt:   now,
    weeklyResetAt:  now,
  };
}

// ── Barra de filtros ─────────────────────────────────────────────
const FILTER_ALL = "TODAS";

const FilterBar = ({ active, onChange }) => (
  <div className="filter-bar">
    <span className="filter-label">▸ FILTRAR:</span>
    <button
      className={`filter-btn${active === FILTER_ALL ? " active" : ""}`}
      style={{ "--filter-color": "var(--gold)" }}
      onClick={() => onChange(FILTER_ALL)}
    >
      ⚔️ TODAS
    </button>
    {STAT_GROUPS.map((g) => (
      <button
        key={g.key}
        className={`filter-btn${active === g.key ? " active" : ""}`}
        style={{ "--filter-color": g.color }}
        onClick={() => onChange(g.key)}
      >
        {g.icon} {g.key}
      </button>
    ))}
  </div>
);

// ── Grupo de misiones por stat ───────────────────────────────────
const GroupedMissions = ({ missions, filter, onComplete, type }) => {
  const visible = filter === FILTER_ALL
    ? missions
    : missions.filter((m) => m.stat === filter);

  if (visible.length === 0) {
    return (
      <div style={{
        fontFamily: "var(--pixel)", fontSize: "0.4rem",
        color: "var(--text-dim)", padding: "1rem", textAlign: "center"
      }}>
        SIN MISIONES PARA ESTA ESTADÍSTICA
      </div>
    );
  }

  if (filter !== FILTER_ALL) {
    return visible.map((m) => (
      <MissionCard key={m.id} mission={m} type={type} onComplete={onComplete} />
    ));
  }

  return STAT_GROUPS.map((group) => {
    const groupMissions = missions.filter((m) => m.stat === group.key);
    if (groupMissions.length === 0) return null;
    const doneCnt = groupMissions.filter((m) => m.done).length;

    return (
      <div key={group.key} className="stat-group" style={{ "--group-color": group.color }}>
        <div className="stat-group-header">
          <span className="stat-group-icon">{group.icon}</span>
          <span className="stat-group-name">{group.key}</span>
          <span className="stat-group-count">{doneCnt}/{groupMissions.length}</span>
        </div>
        {groupMissions.map((m) => (
          <MissionCard key={m.id} mission={m} type={type} onComplete={onComplete} />
        ))}
      </div>
    );
  });
};

// ── Componente principal ─────────────────────────────────────────
export default function MissionsScreen({ onMissionDone, userLevel = 1, userId = "default" }) {
  // Carga el estado inicial desde localStorage aislado por userId
  const [state, setState] = useState(() => loadInitialState(userId));
  const { dailyMissions, weeklyMissions, specialDone, dailyResetAt, weeklyResetAt } = state;

  const [modal,  setModal]  = useState(null);
  const [filter, setFilter] = useState(FILTER_ALL);

  // Timers visuales: se recalculan cada segundo
  const [dailyLeft,  setDailyLeft]  = useState(() => Math.max(0, MS_DAY  - (Date.now() - dailyResetAt)));
  const [weeklyLeft, setWeeklyLeft] = useState(() => Math.max(0, MS_WEEK - (Date.now() - weeklyResetAt)));

  // ── Persiste en localStorage cada vez que el estado cambia ───
  useEffect(() => {
    try {
      localStorage.setItem(lsKey(userId), JSON.stringify(state));
    } catch (_) {}
  }, [state, userId]);

  // ── Timer: actualiza cada segundo ────────────────────────────
  useEffect(() => {
    const tick = () => {
      const now = Date.now();
      const dl  = Math.max(0, MS_DAY  - (now - state.dailyResetAt));
      const wl  = Math.max(0, MS_WEEK - (now - state.weeklyResetAt));
      setDailyLeft(dl);
      setWeeklyLeft(wl);

      // Auto-reset si el tiempo llegó a 0 mientras la pantalla está abierta
      if (dl === 0) {
        setState(prev => ({
          ...prev,
          dailyMissions: DAILY_MISSIONS.map(m => ({ ...m })),
          specialDone:   false,
          dailyResetAt:  now,
        }));
      }
      if (wl === 0) {
        setState(prev => ({
          ...prev,
          weeklyMissions: WEEKLY_MISSIONS.map(m => ({ ...m })),
          weeklyResetAt:  now,
        }));
      }
    };

    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [state.dailyResetAt, state.weeklyResetAt]);

  // ── Abrir modal al pulsar COMPLETAR ─────────────────────────
  const openModal = useCallback((mission) => setModal(mission), []);

  // ── Confirmar recompensas en el modal ───────────────────────
  const handleConfirm = (finalXp) => {
    const mission = modal;
    setModal(null);
    if (!mission) return;

    const isSpecial = !!mission.stats;
    const isDaily   = dailyMissions.some((d) => d.id === mission.id);
    const isWeekly  = weeklyMissions.some((w) => w.id === mission.id);

    setState(prev => {
      let { dailyMissions: dm, weeklyMissions: wm, specialDone: sd } = prev;

      if (isSpecial) {
        // Marcar misión especial como completada
        sd = true;

      } else if (isDaily) {
        // Marcar diaria como hecha
        dm = dm.map(m => m.id === mission.id
          ? { ...m, done: true, progress: m.total }
          : m
        );
        // Avanzar semanales del mismo stat
        wm = wm.map(w => {
          if (w.stat !== mission.stat || w.done) return w;
          const newProgress = Math.min(w.progress + mission.total, w.total);
          return { ...w, progress: newProgress };
        });

      } else if (isWeekly) {
        wm = wm.map(m => m.id === mission.id ? { ...m, done: true } : m);
      }

      return { ...prev, dailyMissions: dm, weeklyMissions: wm, specialDone: sd };
    });

    // Notificar a HomeScreen → actualiza XP, stat y monedas
    if (onMissionDone) onMissionDone(mission, finalXp);
  };

  const doneCount  = dailyMissions.filter(m => m.done).length;
  const wDoneCount = weeklyMissions.filter(m => m.done).length;

  return (
    <div className="missions-page">

      {/* ── Misión especial ────────────────────────────────── */}
      <div>
        <div className="section-header">
          <span className="section-title">⚡ MISIÓN ESPECIAL</span>
          <div className="section-line" />
        </div>
        <SpecialMission
          mission={{
            ...SPECIAL_MISSION,
            locked: specialDone || userLevel < 5,
            lockedReason: specialDone ? "done" : "level",
          }}
          onComplete={openModal}
        />
      </div>

      {/* ── Misiones diarias ──────────────────────────────── */}
      <div>
        <div className="section-header">
          <span className="section-title">▸ MISIONES DIARIAS</span>
          <div className="section-line" />
          <span className="section-count">{doneCount}/{dailyMissions.length}</span>
        </div>

        <FilterBar active={filter} onChange={setFilter} />

        <div className="refresh-bar">
          <div className="refresh-left">
            <div className="refresh-dot" />
            <span className="refresh-text">SE RENUEVAN EN</span>
          </div>
          <span className="refresh-timer">{formatTimeLeft(dailyLeft)}</span>
        </div>

        <GroupedMissions
          missions={dailyMissions}
          filter={filter}
          onComplete={openModal}
          type="daily"
        />
      </div>

      {/* ── Misiones semanales ────────────────────────────── */}
      <div>
        <div className="section-header">
          <span className="section-title">▸ MISIONES SEMANALES</span>
          <div className="section-line" />
          <span className="section-count">{wDoneCount}/{weeklyMissions.length}</span>
        </div>

        <div className="refresh-bar">
          <div className="refresh-left">
            <div className="refresh-dot" />
            <span className="refresh-text">SE RENUEVAN EN</span>
          </div>
          <span className="refresh-timer">{formatTimeLeft(weeklyLeft)}</span>
        </div>

        <GroupedMissions
          missions={weeklyMissions}
          filter={filter}
          onComplete={openModal}
          type="weekly"
        />
      </div>

      {/* ── Modal de recompensas ──────────────────────────── */}
      {modal && (
        <CompleteModal
          mission={modal}
          onClose={() => setModal(null)}
          onDone={handleConfirm}
        />
      )}
    </div>
  );
}
