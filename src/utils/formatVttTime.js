export const formatVttTime = (seconds) =>
  new Date(seconds * 1000).toISOString().slice(11, 23);
