export function calculatePoints(started, ended = Date.now(), multiplier = 1) {
  const seconds = Math.abs(ended - started) / 1000;
  const minutes = Math.ceil(seconds / 60);
  const points = minutes * multiplier;

  return [points, minutes];
}
