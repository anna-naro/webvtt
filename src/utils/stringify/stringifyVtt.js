import { WebVTTSerializer } from "webvtt-parser";
import { convertCueList } from "./convertCueList";

const vttSerializer = new WebVTTSerializer();

export const stringifyVtt = (cues) =>
  vttSerializer.serialize(convertCueList(cues));
