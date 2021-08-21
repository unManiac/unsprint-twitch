export function calculatePoints(started, ended = Date.now(), multiplier = 1) {
  const seconds = Math.abs(ended - started) / 1000;
  const minutes = Math.ceil(seconds / 60);
  const points = minutes * multiplier;

  return [points, minutes];
}

export function findBestMultiplier(sprint, sub, vip) {
  const { multiplier, multiplierSub = 0, multiplierVip = 0 } = sprint;

  let multiplierSelected = multiplier;

  if (sub && multiplierSub) {
    multiplierSelected = Math.max(multiplierSelected, multiplierSub);
  }

  if (vip && multiplierVip) {
    multiplierSelected = Math.max(multiplierSelected, multiplierVip);
  }

  return multiplierSelected;
}
