/**
 * SimonGame.jsx — Minijuego: SIMON GLITCH (memorizar secuencia)
 * ─────────────────────────────────────────────────────
 * Juego de memoria: se muestra una secuencia de colores que
 * el jugador debe repetir en el mismo orden.
 *
 * Mecánica:
 *   • Cada ronda agrega un color más a la secuencia
 *   • La velocidad del flash aumenta a partir de la ronda 5
 *   • Un error termina la partida
 *   • Score = longitud de la secuencia completada
 *
 * Fases internas:
 *   "idle"     — pantalla de inicio
 *   "showing"  — el juego muestra la secuencia (no se puede interactuar)
 *   "input"    — el jugador repite la secuencia
 *   "correct"  — feedback breve de acierto
 *   "fail"     — termina la partida
 *
 * Colores: 4 botones (rojo, azul, verde, naranja) con sonido visual (flash)
 *
 * Estilos: MiniGamesScreen.css (.simon-grid, .simon-btn, .simon-status)
 */
import { useState, useCallback } from "react";

const SIMON_COLORS = [
  { id: 0, color: "#e05252", label: "🟥" },
  { id: 1, color: "#5b8dd9", label: "🟦" },
  { id: 2, color: "#52c97a", label: "🟩" },
  { id: 3, color: "#f5c842", label: "🟨" },
];

export default function SimonGame({ onEnd }) {
  const [seq, setSeq]             = useState([]);
  const [playerSeq, setPlayerSeq] = useState([]);
  const [phase, setPhase]         = useState("idle"); // idle | showing | input | wrong
  const [lit, setLit]             = useState(null);
  const [score, setScore]         = useState(0);
  const [started, setStarted]     = useState(false);

  const showSeq = useCallback((sequence) => {
    setPhase("showing");
    let i = 0;
    const show = () => {
      if (i >= sequence.length) { setPhase("input"); return; }
      setLit(sequence[i]);
      setTimeout(() => { setLit(null); i++; setTimeout(show, 300); }, 500);
    };
    setTimeout(show, 400);
  }, []);

  const nextRound = useCallback((current) => {
    const next = [...current, Math.floor(Math.random() * 4)];
    setSeq(next); setPlayerSeq([]); showSeq(next);
  }, [showSeq]);

  const start = () => { setStarted(true); setScore(0); setSeq([]); nextRound([]); };

  const press = (id) => {
    if (phase !== "input") return;
    const newP = [...playerSeq, id];
    setPlayerSeq(newP);
    if (newP[newP.length - 1] !== seq[newP.length - 1]) {
      setPhase("wrong");
      setTimeout(() => onEnd(score), 1200);
      return;
    }
    if (newP.length === seq.length) {
      const pts = seq.length * 50;
      setScore(p => p + pts);
      setTimeout(() => nextRound(seq), 500);
    }
  };

  if (!started) {
    return (
      <div className="game-start-screen">
        <div className="game-start-hint">
          Observa el patrón y repítelo.<br />
          Un error termina el juego.
        </div>
        <button className="btn-gold" onClick={start}>▶ INICIAR</button>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
      <div className="simon-status">
        {phase === "showing" ? "OBSERVA EL PATRÓN..."
          : phase === "input" ? `TU TURNO — ${seq.length - playerSeq.length} restantes`
          : phase === "wrong" ? "❌ ¡FALLASTE!"
          : ""}
      </div>

      <div className="simon-grid">
        {SIMON_COLORS.map(c => (
          <button
            key={c.id}
            className={`simon-btn${lit === c.id ? " lit" : ""}${phase === "wrong" ? " wrong-flash" : ""}`}
            style={{
              background: phase === "wrong"
                ? "#1a0a0a"
                : `color-mix(in srgb, ${c.color} ${lit === c.id ? 90 : 25}%, #0a0a0f)`,
              border: `2px solid ${lit === c.id ? c.color : "#2a2a3d"}`,
            }}
            onClick={() => press(c.id)}
          >
            <span style={{ fontSize: "1.6rem" }}>{c.label}</span>
          </button>
        ))}
      </div>

      <div className="simon-pattern-display">
        Ronda: {seq.length} | Progreso: {playerSeq.length}/{seq.length}
      </div>
    </div>
  );
}
