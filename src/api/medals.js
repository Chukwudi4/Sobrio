/**
 * accepts an array {start, end, medal},
 *
 * methods: isInRange: accepts a value and searches for it and returns an object
 */

const starter = 0;
const ambitious = 30;
const pro = 90;
const free = 120;

const medalObject = {
  starter: {
    title: 'Starter',
    color: 'red',
  },
  ambitious: {
    title: 'Ambitious',
    color: 'pink',
  },
  pro: {
    title: 'Pro',
    color: 'lemon',
  },
  free: {
    title: 'Free',
    color: 'green',
  },
};

export function getMedal(days) {
  // const days = parseInt(milliseconds / (60 * 60 * 24 * 1000), 10);

  let medal =
    days < ambitious
      ? medalObject['starter']
      : days < pro
      ? medalObject['ambitious']
      : days < free
      ? medalObject['pro']
      : medalObject['free'];

  return medal;
}
