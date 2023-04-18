import { formatVttTime } from "./formatVttTime";

export const serializeVtt = (cues) => {
  const newLine = "\n";
  let vttString = "WEBVTT";

  cues.forEach(({ id, startTime, endTime, text }) => {
    vttString += newLine + newLine;

    vttString += id + newLine;

    vttString += `${formatVttTime(startTime)} --> ${formatVttTime(
      endTime
    )}${newLine}`;

    vttString += text;
  });

  return vttString;
};
