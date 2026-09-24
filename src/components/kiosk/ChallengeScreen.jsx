import { useCallback, useEffect, useRef, useState } from "react";
import { CameraView } from "../CameraView";
import { ErrorBanner } from "../ErrorBanner";

const ERROR_STATUSES = new Set(["denied", "unavailable", "unsupported", "error"]);
const WRONG_GUESS_DURATION_MS = 1600;
const TICK_MS = 100;

export function ChallengeScreen({ animal, onFinish, onCancel }) {
  const [cameraStatus, setCameraStatus] = useState("idle");
  const [wrongGuess, setWrongGuess] = useState(null);
  const [elapsedMs, setElapsedMs] = useState(0);
  const wrongGuessTimerRef = useRef(null);
  const startedAtRef = useRef(null);
  const finishedRef = useRef(false);

  useEffect(() => {
    startedAtRef.current = performance.now();
    const id = setInterval(() => setElapsedMs(performance.now() - startedAtRef.current), TICK_MS);
    return () => clearInterval(id);
  }, []);

  useEffect(() => () => clearTimeout(wrongGuessTimerRef.current), []);

  const handleDiscover = useCallback(({ id, animal: found }) => {
    if (finishedRef.current) return;
    if (id === animal.id) {
      finishedRef.current = true;
      onFinish((performance.now() - startedAtRef.current) / 1000);
      return;
    }
    clearTimeout(wrongGuessTimerRef.current);
    setWrongGuess(found ? { emoji: found.emoji, name: found.name } : { emoji: "❓", name: "Unknown" });
    wrongGuessTimerRef.current = setTimeout(() => setWrongGuess(null), WRONG_GUESS_DURATION_MS);
  }, [animal.id, onFinish]);

  return (
    <div className="game-screen">
      <CameraView onDiscover={handleDiscover} onStatusChange={setCameraStatus} />

      <div className="hud-top">
        <span className="hud-title">Time Attack</span>
        <span className="hud-count">{(elapsedMs / 1000).toFixed(1)}s</span>
      </div>

      <div className="round-target-banner">
        FIND THE<br />
        <span className="round-target-emoji">{animal.emoji}</span> {animal.name.toUpperCase()}
      </div>

      {wrongGuess && (
        <div className="hud-toast hud-toast-unknown">
          <strong>{wrongGuess.emoji} {wrongGuess.name}</strong>
          <span>Not this one!</span>
        </div>
      )}

      {!ERROR_STATUSES.has(cameraStatus) && <div className="hud-bottom">Scan the {animal.name}'s QR code</div>}
      {ERROR_STATUSES.has(cameraStatus) && <ErrorBanner status={cameraStatus} />}

      <button type="button" className="exit-button" onClick={onCancel}>Exit</button>
    </div>
  );
}
