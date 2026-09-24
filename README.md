# Animal Hunt: Time Attack

A single-device, single-camera "kiosk" mode of [Animal Hunt](https://github.com/Hye-Seung-Kim/qr-animal-hunt) —
built for a fixed/mounted phone that a group of people share and take turns
on, rather than each player using their own device.

## Live demo

https://qr-animal-hunt-kiosk.netlify.app

Mount the phone (stand/tripod so the camera doesn't shake), open the link,
and let people take turns. Print QR codes from
https://qr-animal-hunt-kiosk.netlify.app/test-qr-codes.html and spread them
around the play area — **print multiple copies of each animal's QR code** if
more than one person might be searching for the same target at once, since
only one physical card exists per copy.

## How it works

Pick an animal → enter your name → the clock starts and the camera opens →
find and scan that animal's QR code → your time is saved to a **local
leaderboard for that specific animal** (times across different animals
aren't really comparable, since each QR is placed somewhere different).

This is a genuinely simpler app than the multiplayer version it's forked
from: one device is the whole game, so there's no real-time sync, no rooms,
no Supabase — `src/lib/leaderboard.js` just reads/writes `localStorage`.
Everything else (camera access, QR detection, the 3D animal models, sound
effects) is the same code, copied from the multiplayer project.

- `src/App.jsx` — the state machine: `home -> name -> challenge -> result`.
- `src/components/kiosk/` — the four screens above.
- `src/lib/leaderboard.js` — per-animal top-10 times in `localStorage`.
- `src/hooks/useCamera.js`, `src/hooks/useQRScanner.js`,
  `src/lib/overlayRenderer.js`, `src/three/` — unchanged from the
  multiplayer project (camera access, QR detection/tracking, the QR
  bounding-box + caption overlay, and the six glb-based 3D animal models).
- `src/data/animals.js` — same 6 QR payloads mapped to the same 6 animals.

## Add a new animal

Same as the multiplayer project: add an entry to `ANIMALS` and its id to
`ANIMAL_ORDER` in `src/data/animals.js`, a sound recipe in
`src/lib/sounds.js`, and (if using a real model instead of emoji-only) a glb
under `public/assets/models/` wired up in `src/three/AnimalModels.jsx`.

## Generate test QR codes

```bash
npm run generate-qr
```

Regenerates `public/qr-codes/*.svg` and `public/test-qr-codes.html` from
`src/data/animals.js`.

## Run locally

```bash
npm install
npm run dev
```

Camera access requires HTTPS in production, but `localhost` is exempt.

## Deploy to Netlify

`netlify.toml` is already configured (`npm run build`, publishes `dist/`).
No environment variables needed — there's no backend.

```bash
netlify deploy --prod --build
```

## Testing checklist

- [ ] Picking an animal shows its current best time (or "No record yet")
- [ ] Camera permission is requested only after entering a name and tapping
      Start Challenge
- [ ] Scanning the wrong QR shows "Not this one!" and the timer keeps running
- [ ] Scanning the correct QR stops the timer and shows the result + updated
      leaderboard for that animal
- [ ] "Try Again" restarts a challenge for the same animal; "Choose Another
      Animal" goes back to the picker
- [ ] The Exit button (bottom-left, during the challenge) bails out without
      recording a time
- [ ] Reloading the page keeps the leaderboard (same device, same browser)
- [ ] Mounting the phone on a stand and having several people take turns
      works — hold each attempt to a single "current challenger" name
