/**
 * data/constants.js — Constantes globales de la aplicación
 * ─────────────────────────────────────────────────────
 * Centraliza todos los datos estáticos de demo para el dashboard.
 * Al integrar el backend, estos valores vendrán de la API.
 *
 * Exportaciones:
 *
 *   STATS           — Las 6 estadísticas del personaje:
 *                     { id, name, icon, color, lv, xp, max }
 *                     id: "str" | "res" | "agi" | "int" | "cre" | "com"
 *
 *   DAILY_MISSIONS  — Misiones diarias con progreso
 *   WEEKLY_MISSIONS — Misiones semanales de mayor duración
 *   SPECIAL_MISSION — Misión especial del día (XP ×2)
 *
 *   MISSIONS_TODAY  — Subset de misiones para el widget del dashboard
 *   ACHIEVEMENTS    — Últimos logros del usuario (para ProgressSection)
 *   XP_HISTORY      — XP ganada por día en la semana (para gráfica de barras)
 *
 *   STAT_GROUPS     — Agrupa las stats para MissionsScreen con icono y color
 *   PARTICLES       — Emojis decorativos para la SpecialMission
 *
 *   NAV_ITEMS       — Ítems de la barra de navegación
 *                     { id, label, icon }
 *                     NOTA: el ítem "settings" se filtra en Navbar.jsx
 *                     porque sus opciones viven en el dropdown del avatar
 */
// Stats de demo (cuenta con progreso para visualizar la UI)
export const STATS = [
  { id: "str", name: "FUERZA",       icon: "🟥", color: "#e05252", lv: 7,  xp: 340, max: 500 },
  { id: "res", name: "RESISTENCIA",  icon: "🟦", color: "#5b8dd9", lv: 5,  xp: 210, max: 400 },
  { id: "agi", name: "AGILIDAD",     icon: "🟩", color: "#52c97a", lv: 6,  xp: 280, max: 450 },
  { id: "int", name: "INTELIGENCIA", icon: "🟪", color: "#a855f7", lv: 9,  xp: 480, max: 600 },
  { id: "cre", name: "CREATIVIDAD",  icon: "🟨", color: "#f5c842", lv: 4,  xp: 150, max: 350 },
  { id: "com", name: "COMUNICACIÓN", icon: "🟧", color: "#f5853a", lv: 6,  xp: 260, max: 450 },
];

// Stats iniciales para una cuenta nueva — todas en nivel 1, XP en 0
// Fórmula XP máxima por nivel: 200 × lv × (1 + 0.1 × (lv - 1))  → lv 1 = 200 XP
export const INITIAL_STATS = [
  { id: "str", name: "FUERZA",       icon: "🟥", color: "#e05252", lv: 1, xp: 0, max: 200 },
  { id: "res", name: "RESISTENCIA",  icon: "🟦", color: "#5b8dd9", lv: 1, xp: 0, max: 200 },
  { id: "agi", name: "AGILIDAD",     icon: "🟩", color: "#52c97a", lv: 1, xp: 0, max: 200 },
  { id: "int", name: "INTELIGENCIA", icon: "🟪", color: "#a855f7", lv: 1, xp: 0, max: 200 },
  { id: "cre", name: "CREATIVIDAD",  icon: "🟨", color: "#f5c842", lv: 1, xp: 0, max: 200 },
  { id: "com", name: "COMUNICACIÓN", icon: "🟧", color: "#f5853a", lv: 1, xp: 0, max: 200 },
];

// Widget del dashboard — refleja misiones del día sin marcar nada por defecto
export const MISSIONS_TODAY = [
  { name: "20 Sentadillas",       stat: "FUERZA",       xp: "+50 XP", done: false },
  { name: "Leer 10 páginas",      stat: "INTELIGENCIA", xp: "+40 XP", done: false },
  { name: "Iniciar conversación", stat: "COMUNICACIÓN", xp: "+35 XP", done: false },
  { name: "Dibujar algo libre",   stat: "CREATIVIDAD",  xp: "+45 XP", done: false },
  { name: "30 min cardio",        stat: "RESISTENCIA",  xp: "+55 XP", done: false },
];

export const ACHIEVEMENTS = [
  { icon: "🏆", name: "RACHA DE 7 DÍAS", desc: "Misión completada 7 días seguidos",  color: "#f5c842", isNew: true  },
  { icon: "📚", name: "LECTOR VORAZ",    desc: "Leíste 50 páginas esta semana",       color: "#a855f7", isNew: true  },
  { icon: "💪", name: "GUERRERO FÍSICO", desc: "100 sentadillas en total",            color: "#e05252", isNew: false },
];

export const XP_HISTORY = [
  { day: "LUN", xp: 120, pct: 60  },
  { day: "MAR", xp: 200, pct: 100 },
  { day: "MIÉ", xp: 85,  pct: 42  },
  { day: "JUE", xp: 160, pct: 80  },
  { day: "VIE", xp: 95,  pct: 47  },
  { day: "SÁB", xp: 175, pct: 87  },
  { day: "HOY", xp: 90,  pct: 45  },
];

export const NAV_ITEMS = [
  { id: "home",      label: "INICIO",      icon: "🏠" },
  { id: "missions",  label: "MISIONES",    icon: "⚔️" },
  { id: "minigames", label: "MINI JUEGOS", icon: "🎮" },
  { id: "shop",      label: "TIENDA",      icon: "🏪" },
  { id: "settings",  label: "CONFIG",      icon: "⚙️" },
];

// ─── MISSIONS DATA ───────────────────────────────────────────────
// Todas las misiones comienzan sin completar y sin progreso previo.
// done:false y progress:0 en todas — el estado real se persiste
// por usuario en localStorage via MissionsScreen.
export const DAILY_MISSIONS = [
  { id: 1, name: "20 Sentadillas",       desc: "Haz 20 sentadillas seguidas sin parar.",       stat: "FUERZA",       icon: "🟥", color: "#e05252", xp: 50, coins: 30, progress: 0, total: 20, unit: "reps",  done: false },
  { id: 2, name: "Leer 10 páginas",      desc: "Lee al menos 10 páginas de cualquier libro.",  stat: "INTELIGENCIA", icon: "🟪", color: "#a855f7", xp: 40, coins: 25, progress: 0, total: 10, unit: "págs",  done: false },
  { id: 3, name: "Iniciar conversación", desc: "Habla con alguien que no conoces bien.",       stat: "COMUNICACIÓN", icon: "🟧", color: "#f5853a", xp: 35, coins: 20, progress: 0, total: 1,  unit: "vez",   done: false },
  { id: 4, name: "Dibujar algo libre",   desc: "Dibuja lo que quieras, sin reglas.",           stat: "CREATIVIDAD",  icon: "🟨", color: "#f5c842", xp: 45, coins: 28, progress: 0, total: 1,  unit: "vez",   done: false },
  { id: 5, name: "30 min cardio",        desc: "Trota, salta o baila durante 30 minutos.",     stat: "RESISTENCIA",  icon: "🟦", color: "#5b8dd9", xp: 55, coins: 35, progress: 0, total: 30, unit: "min",   done: false },
  { id: 6, name: "Sprint de 100m",       desc: "Corre a máxima velocidad 100 metros.",         stat: "AGILIDAD",     icon: "🟩", color: "#52c97a", xp: 45, coins: 28, progress: 0, total: 3,  unit: "veces", done: false },
];

export const WEEKLY_MISSIONS = [
  { id: 7, name: "Leer 50 páginas",         desc: "Completa 50 páginas de lectura esta semana.",                           stat: "INTELIGENCIA", icon: "🟪", color: "#a855f7", xp: 200, coins: 120, progress: 0, total: 50, unit: "págs",  done: false },
  { id: 8, name: "Entrenar 4 días",         desc: "Haz al menos 1 misión de Fuerza o Resistencia 4 días distintos.",       stat: "FUERZA",       icon: "🟥", color: "#e05252", xp: 250, coins: 150, progress: 0, total: 4,  unit: "días",  done: false },
  { id: 9, name: "5 conversaciones nuevas", desc: "Inicia 5 conversaciones con personas distintas esta semana.",           stat: "COMUNICACIÓN", icon: "🟧", color: "#f5853a", xp: 180, coins: 110, progress: 0, total: 5,  unit: "convs", done: false },
];

export const SPECIAL_MISSION = {
  id: 99,
  name: "MENTE Y MÚSCULO",
  desc: "Lee 5 páginas Y haz 15 sentadillas en el mismo día. El cuerpo y la mente crecen juntos.",
  stats: [
    { label: "INTELIGENCIA", color: "#a855f7", icon: "🟪" },
    { label: "FUERZA",       color: "#e05252", icon: "🟥" },
  ],
  icon: "⚡",
  xp: 160,
  coins: 100,
  locked: false,
};

export const PARTICLES = ["✨","⭐","💫","✦","★"].map((icon, i) => ({
  id: i, icon,
  x: 8 + i * 18,
  ps: `${0.55 + (i * 0.13)}rem`,
  pd: `${2 + (i * 0.4)}s`,
  pdelay: `${(i * 0.4)}s`,
}));

export const STAT_GROUPS = [
  { key: "FUERZA",       icon: "🟥", color: "#e05252" },
  { key: "RESISTENCIA",  icon: "🟦", color: "#5b8dd9" },
  { key: "AGILIDAD",     icon: "🟩", color: "#52c97a" },
  { key: "INTELIGENCIA", icon: "🟪", color: "#a855f7" },
  { key: "CREATIVIDAD",  icon: "🟨", color: "#f5c842" },
  { key: "COMUNICACIÓN", icon: "🟧", color: "#f5853a" },
];
