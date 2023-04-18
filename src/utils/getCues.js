export const getCues = (url) => {
  const videoEl = document.createElement("video");
  const trackEl = document.createElement("track");

  trackEl.mode = "hidden";
  trackEl.default = true;

  trackEl.src = url;
  videoEl.append(trackEl);

  return new Promise((res, rej) => {
    trackEl.onload = () => res([...trackEl.track.cues]);
    trackEl.onerror = () => rej("invalid url");
  });
};
