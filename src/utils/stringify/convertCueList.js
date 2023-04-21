import { convertCue } from "./convertCue";

export const convertCueList = (cues) => {
  const result = [];

  for (let i = 0; i < cues.length; i++) {
    result.push(convertCue(i + 1, cues[i]));
  }

  return result;
};
