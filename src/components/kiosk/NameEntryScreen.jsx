import { useState } from "react";
import { unlockAudio } from "../../lib/sounds";

export function NameEntryScreen({ animal, onStart, onBack }) {
  const [name, setName] = useState("");

  function handleStart() {
    if (!name.trim()) return;
    // Must run inside this tap handler for mobile Safari's autoplay policy --
    // whoever is stepping up to the kiosk right now is the first gesture in
    // this attempt.
    unlockAudio();
    onStart(name.trim());
  }

  return (
    <div className="start-screen">
      <span className="round-target-emoji">{animal.emoji}</span>
      <h1>{animal.name}</h1>
      <p>Enter your name to start the clock.</p>
      <input
        className="text-input"
        placeholder="Your name"
        value={name}
        maxLength={20}
        autoFocus
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleStart()}
      />
      <button type="button" className="primary-button" disabled={!name.trim()} onClick={handleStart}>
        Start Challenge
      </button>
      <button type="button" className="secondary-button" onClick={onBack}>
        Back
      </button>
    </div>
  );
}
