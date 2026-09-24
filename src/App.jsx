import { useState } from "react";
import { HomeScreen } from "./components/kiosk/HomeScreen";
import { NameEntryScreen } from "./components/kiosk/NameEntryScreen";
import { ChallengeScreen } from "./components/kiosk/ChallengeScreen";
import { ResultScreen } from "./components/kiosk/ResultScreen";
import { ANIMALS } from "./data/animals";
import { addResult } from "./lib/leaderboard";
import "./App.css";

// One physical device, shared by everyone in turn -- so this is a plain
// local state machine (HOME -> NAME -> CHALLENGE -> RESULT), no multiplayer
// sync needed. See src/lib/leaderboard.js for why the "backend" is just
// localStorage.
function App() {
  const [screen, setScreen] = useState("home");
  const [animalId, setAnimalId] = useState(null);
  const [name, setName] = useState("");
  const [result, setResult] = useState(null);

  const animal = animalId ? ANIMALS[animalId] : null;

  function handleSelectAnimal(id) {
    setAnimalId(id);
    setScreen("name");
  }

  function handleStartChallenge(enteredName) {
    setName(enteredName);
    setScreen("challenge");
  }

  function handleFinish(timeSeconds) {
    const leaderboard = addResult(animalId, { name, timeSeconds });
    setResult({ timeSeconds, leaderboard });
    setScreen("result");
  }

  if (screen === "home" || !animal) {
    return <HomeScreen onSelect={handleSelectAnimal} />;
  }

  if (screen === "name") {
    return <NameEntryScreen animal={animal} onStart={handleStartChallenge} onBack={() => setScreen("home")} />;
  }

  if (screen === "challenge") {
    return <ChallengeScreen animal={animal} onFinish={handleFinish} onCancel={() => setScreen("home")} />;
  }

  return (
    <ResultScreen
      animal={animal}
      name={name}
      timeSeconds={result.timeSeconds}
      leaderboard={result.leaderboard}
      onTryAgain={() => setScreen("name")}
      onHome={() => setScreen("home")}
    />
  );
}

export default App;
