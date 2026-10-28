const blinkPulse = (time: number, center: number, duration: number) => {
  const distance = Math.abs(time - center) / duration;
  return distance < 1 ? Math.pow(Math.cos((distance * Math.PI) / 2), 2) : 0;
};

export const avatarBlink = (time: number) => {
  const phase = ((time % 7.2) + 7.2) % 7.2;
  return (
    1 -
    0.97 *
      Math.max(
        blinkPulse(phase, 2.5, 0.13),
        blinkPulse(phase, 6, 0.12),
        blinkPulse(phase, 6.25, 0.1),
      )
  );
};
