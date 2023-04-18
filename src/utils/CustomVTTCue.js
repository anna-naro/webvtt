export class CustomVTTCue {
  constructor({ id, text, startTime, endTime }) {
    this.alignment = "center";
    this.direction = "horizontal";
    this.endTime = endTime;
    this.id = id;
    this.lineAlign = "start";
    this.linePosition = "auto";
    this.pauseOnExit = false;
    this.positionAlign = "auto";
    this.size = 100;
    this.snapToLines = true;
    this.startTime = startTime;
    this.text = text;
    this.textPosition = "auto";
    this.tree = {
      children: [{ type: "text", value: text }],
    };
  }
}
