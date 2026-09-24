import { ANIMALS, ANIMAL_ORDER } from "../../data/animals";
import { getBestTime } from "../../lib/leaderboard";

export function HomeScreen({ onSelect }) {
  return (
    <div className="start-screen">
      <h1>Animal Hunt</h1>
      <p>Time Attack -- pick an animal and race the clock to find its QR code.</p>

      <div className="animal-picker">
        {ANIMAL_ORDER.map((id) => {
          const animal = ANIMALS[id];
          const best = getBestTime(id);
          return (
            <button key={id} type="button" className="animal-picker-card" onClick={() => onSelect(id)}>
              <span className="animal-picker-emoji">{animal.emoji}</span>
              <span className="animal-picker-name">{animal.name}</span>
              <span className="animal-picker-best">{best !== null ? `${best.toFixed(1)}s best` : "No record yet"}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
