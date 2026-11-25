// Seconds of visible playback mapped to positions in the continuous camera shot.
// A repeated position holds the finished composition inside its screen.
const shots = [
  [0, 0],
  [1.55, 0.105],
  [2.45, 0.14],
  [3.95, 0.18],
  [5.15, 0.209],
  [6.35, 0.238],
  [7.25, 0.238],
  [8.15, 0.281],
  [10.35, 0.344],
  [11.4, 0.396],
  [12.75, 0.43],
  [13.95, 0.459],
  [15.05, 0.49],
  [16.1, 0.51],
  [17.15, 0.532],
  [18.1, 0.532],
  [19, 0.568],
  [21.2, 0.628],
  [22.2, 0.677],
  [23.45, 0.71],
  [24.9, 0.744],
  [26.4, 0.778],
  [27.95, 0.812],
  [29, 0.812],
  [30.05, 0.85],
  [32.15, 0.902],
  [33.65, 0.947],
  [38, 1],
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
