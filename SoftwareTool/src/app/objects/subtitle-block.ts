import {SubtitleLine} from "./subtitle-line";

export class SubtitleBlock {
  id: number;
  text: SubtitleLine[];

  constructor(id: number, text: SubtitleLine[]) {
    this.id = id;
    this.text = text;
  }
}
