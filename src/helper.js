export const QUEUE_MESSAGES = [];

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

export const wait = (ms) => new Promise((r) => setTimeout(r, ms));

export const retryOperation = (operation, delay, retries) =>
  new Promise((resolve, reject) => {
    return operation()
      .then(resolve)
      .catch((reason) => {
        console.log("Operation trying again");
        if (retries > 0) {
          return wait(delay)
            .then(retryOperation.bind(null, operation, delay, retries - 1))
            .then(resolve)
            .catch(reject);
        }
        return reject(reason);
      });
  });
