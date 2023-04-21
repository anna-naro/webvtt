import { WebVTTCueTextParser } from "webvtt-parser";

const defaultEntities = {
  "&amp": "&",
  "&lt": "<",
  "&gt": ">",
  "&lrm": "\u200e",
  "&rlm": "\u200f",
  "&nbsp": "\u00A0",
};

export const convertCue = (
  id,
  {
    startTime,
    endTime,
    text,
    align: alignment,
    line: linePosition,
    lineAlign,
    position: textPosition,
    positionAlign,
    vertical: direction,
    pauseOnExit,
    size,
    snapToLines,
  }
) => {
  function handleError(message, col) {
    console.log(`Error at col: ${col} : ${message}`);
  }

  const cueTextParser = new WebVTTCueTextParser(
    text,
    handleError,
    "metadata",
    defaultEntities
  );

  const tree = cueTextParser.parse(startTime, endTime);

  direction = direction === "" ? "horizontal" : direction;
  lineAlign = lineAlign === undefined ? "start" : lineAlign;
  positionAlign = positionAlign === undefined ? "auto" : positionAlign;

  return {
    id,
    startTime,
    endTime,
    text,
    alignment,
    linePosition,
    lineAlign,
    textPosition,
    positionAlign,
    pauseOnExit,
    size,
    direction,
    snapToLines,
    tree,
  };
};
