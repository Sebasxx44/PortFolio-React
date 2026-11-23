// Seconds of visible playback mapped to positions in the continuous camera shot.
// A repeated position holds the finished composition inside its screen.
const shots = [
  [0, 0],
  [3.0, 0.105],
  [5.0, 0.14],
  [8.0, 0.18],
  [10.5, 0.209],
  [12.8, 0.238],
  [14.9, 0.238],
  [16.8, 0.281],
  [23.3, 0.344],
  [25.5, 0.396],
  [27.9, 0.43],
  [30.1, 0.459],
  [32.1, 0.49],
  [34.0, 0.51],
  [35.9, 0.532],
  [38.1, 0.532],
  [39.9, 0.568],
  [46.4, 0.628],
  [48.5, 0.677],
  [50.7, 0.71],
  [53.5, 0.744],
  [56.4, 0.778],
  [59.1, 0.812],
  [61.4, 0.812],
  [63.5, 0.85],
  [69.2, 0.902],
  [72.1, 0.947],
  [78.5, 1],
] as const;

export const duration = shots[shots.length - 1][0];

function speedAt(index: number) {
  const [seconds, position] = shots[index];
  const before = shots[index - 1],
    after = shots[index + 1];
  if (!before || !after) return 0;
  const incoming = (position - before[1]) / (seconds - before[0]);
  const outgoing = (after[1] - position) / (after[0] - seconds);
  if (!incoming || !outgoing) return 0;
  return (2 * incoming * outgoing) / (incoming + outgoing);
}
const speeds = shots.map((_, i) => speedAt(i));

// Monotone cubic interpolation keeps camera speed continuous through moving keys and at rests.
export function sceneAt(seconds: number) {
  if (seconds <= 0) return 0;
  if (seconds >= duration) return 1;
  const right = shots.findIndex(([time]) => time >= seconds);
  const [a, from] = shots[right - 1],
    [b, to] = shots[right];
  if (from === to) return from;
  const span = b - a,
    u = (seconds - a) / span,
    u2 = u * u,
    u3 = u2 * u;
  return (
    from +
    (to - from) * (3 * u2 - 2 * u3) +
    span * ((u3 - 2 * u2 + u) * speeds[right - 1] + (u3 - u2) * speeds[right])
  );
}
