/**
 * MiniGamesScreen.jsx — Pantalla de minijuegos
 * ─────────────────────────────────────────────────────
 * Lobby de juegos y lanzador. Actúa como puente entre
 * HomeScreen (que tiene el estado global) y GameWrapper.
 *
 * Flujo de recompensas:
 *   HomeScreen pasa onGameDone → MiniGamesScreen lo recibe →
 *   lo pasa a GameWrapper → llega a ResultScreen que lo llama
 *   al terminar la partida con (xp, coins, stat).
 *
 * Props:
 *   onGameDone(xp, coins, stat) — viene de HomeScreen, actualiza
 *     user.xp, la stat correspondiente y el monedero.
 *
 * Estilos: MiniGamesScreen.css
 */
import { useState } from "react";
import "../styles/MiniGamesScreen.css";
import { GAMES } from "../data/games";
import GameWrapper from "../components/GameWrapper";

// ── Lobby: grid de juegos disponibles ────────────────────────────
const GamesLobby = ({ onSelect }) => (
  <div className="minigames-page">
    <div>
      <div className="mg-header">
        <span className="mg-title">🎮 MINI JUEGOS</span>
        <div className="mg-line" />
      </div>
      <div className="mg-subtitle">
        Juega para ganar XP y monedas extra. Cada juego entrena un atributo distinto.
      </div>
      <div className="games-grid">
        {GAMES.map(g => {
          // Gradiente para juegos de dos stats (color + color2)
          const hasGrad  = !!g.color2;
          const cardStyle = hasGrad
            ? { "--gc": g.color, "--gc2": g.color2, background: `linear-gradient(135deg, color-mix(in srgb, ${g.color} 10%, transparent), color-mix(in srgb, ${g.color2} 10%, transparent))` }
            : { "--gc": g.color };

          return (
            <div
              key={g.id}
              className={`game-card${hasGrad ? " game-card-multi" : ""}`}
              style={cardStyle}
              onClick={() => onSelect(g)}
            >
              <div className="game-card-top">
                <span className="game-icon">{g.icon}</span>
                <span className="game-diff">{g.diff}</span>
              </div>
              <div className="game-name">{g.name}</div>
              <div className="game-desc">{g.desc}</div>
              <div className="game-footer">
                {/* Stats: una sola o múltiples con su color respectivo */}
                <div className="game-stat-tags">
                  {(g.stats || [g.stat]).map((s, i) => {
                    const c = i === 0 ? g.color : (g.color2 || g.color);
                    return (
                      <span key={s} className="game-stat-tag" style={{ "--gc": c }}>{s}</span>
                    );
                  })}
                </div>
                <span className="game-rewards">+{g.xp} XP 🪙 {g.coins}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </div>
);

// ── Main ─────────────────────────────────────────────────────────
export default function MiniGamesScreen({ onGameDone }) {
  const [activeGame, setActiveGame] = useState(null);

  if (activeGame) {
    return (
      <GameWrapper
        game={activeGame}
        onBack={() => setActiveGame(null)}
        onGameDone={(xp, coins, stat, gameId, score) => onGameDone && onGameDone(xp, coins, stat, gameId, score)}
      />
    );
  }

  return <GamesLobby onSelect={setActiveGame} />;
}
