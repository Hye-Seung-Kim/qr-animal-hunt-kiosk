// This is a single fixed-camera kiosk shared by everyone in turn, not a
// per-player device, so there's no multiplayer sync to do -- localStorage on
// this one device is the whole leaderboard. Kept separate per animal id
// since different physical QR placements aren't equally hard to reach, so
// times across animals aren't really comparable.
const STORAGE_KEY = "animal-hunt-kiosk:leaderboard";
const MAX_ENTRIES_PER_ANIMAL = 10;

function readAll() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeAll(data) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Ignore write failures (private browsing, quota, etc.) -- the
    // leaderboard just won't persist across reloads.
  }
}

export function getLeaderboard(animalId) {
  return readAll()[animalId] || [];
}

export function getBestTime(animalId) {
  const list = getLeaderboard(animalId);
  return list.length > 0 ? list[0].timeSeconds : null;
}

export function addResult(animalId, { name, timeSeconds }) {
  const all = readAll();
  const list = all[animalId] || [];
  list.push({ name, timeSeconds, at: Date.now() });
  list.sort((a, b) => a.timeSeconds - b.timeSeconds);
  all[animalId] = list.slice(0, MAX_ENTRIES_PER_ANIMAL);
  writeAll(all);
  return all[animalId];
}
