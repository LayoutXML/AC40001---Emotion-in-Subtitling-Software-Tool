import {SubtitleLine} from "./subtitle-line";

export class SubtitleBlock {
  id: number;
  text: SubtitleLine[];
  startTime: number;
  endTime: number;

  constructor(id: number, text: SubtitleLine[], startTime: number, endTime: number) {
    this.id = id;
    this.text = text;
    this.startTime = startTime;
    this.endTime = endTime;
  }
}
