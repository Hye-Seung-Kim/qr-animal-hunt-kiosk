export function ResultScreen({ animal, name, timeSeconds, leaderboard, onTryAgain, onHome }) {
  const rank = leaderboard.findIndex((e) => e.name === name && e.timeSeconds === timeSeconds) + 1;
  const madeTop = rank > 0;

  return (
    <div className="start-screen">
      <span className="round-target-emoji">{animal.emoji}</span>
      <h1>{timeSeconds.toFixed(1)}s</h1>
      <p>
        {madeTop && rank === 1
          ? `${"\u{1F947}"} New best time for ${animal.name}!`
          : madeTop
            ? `Nice! #${rank} on the ${animal.name} board.`
            : `Found the ${animal.name}! Didn't crack the top ${leaderboard.length}.`}
      </p>

      <ul className="leaderboard-list">
        {leaderboard.map((entry, i) => (
          <li key={`${entry.name}-${entry.at}`} className={entry.name === name && entry.timeSeconds === timeSeconds ? "leaderboard-row-me" : ""}>
            <span className="leaderboard-rank">{i + 1}</span>
            <span className="leaderboard-name">{entry.name}</span>
            <span className="leaderboard-wins">{entry.timeSeconds.toFixed(1)}s</span>
          </li>
        ))}
      </ul>

      <div className="room-choice">
        <button type="button" className="primary-button" onClick={onTryAgain}>Try Again</button>
        <button type="button" className="secondary-button" onClick={onHome}>Choose Another Animal</button>
      </div>
    </div>
  );
}
