export function calculatePoints(started, ended = Date.now(), multiplier = 1) {
  const seconds = Math.abs(ended - started) / 1000;
  const minutes = Math.ceil(seconds / 60);
  const points = Math.ceil(minutes * multiplier);

  return [points, minutes];
}

export function findBestMultiplier(username, sprint, sub, vip, special) {
  const { multiplier, multiplierSub = 0, multiplierVip = 0 } = sprint;
  let multiplierSelected = multiplier;

  if (special?.list?.includes(username)) {
    multiplierSelected = special.multiplier;
  }

  if (sub && multiplierSub) {
    multiplierSelected = Math.max(multiplierSelected, multiplierSub);
  }

  if (vip && multiplierVip) {
    multiplierSelected = Math.max(multiplierSelected, multiplierVip);
  }

  return multiplierSelected;
}

export function getLastMonday() {
  let prevMonday = new Date();
  prevMonday = prevMonday.setDate(
    prevMonday.getDate() - ((prevMonday.getDay() + 6) % 7)
  );
  return new Date(prevMonday).setHours(5, 0, 0, 0);
}

export function getNextMonday() {
  let nextMonday = new Date(getLastMonday());
  nextMonday = nextMonday.setDate(nextMonday.getDate() + 7);
  return new Date(nextMonday).setHours(5, 0, 0, 0);
}

// for testing
export function getTwoWeeksMonday() {
  let nextMonday = new Date(getLastMonday());
  nextMonday = nextMonday.setDate(nextMonday.getDate() - 7);
  return new Date(nextMonday).setHours(5, 0, 0, 0);
}

export function sortRanking(list) {
  // order by biggest minutes and oldest update date
  return list.sort(
    (a, b) => b.minutes - a.minutes || a.updatedAt - b.updatedAt
  );
}

export function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}
