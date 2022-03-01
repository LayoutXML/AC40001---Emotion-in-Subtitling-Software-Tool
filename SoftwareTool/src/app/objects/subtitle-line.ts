import {Sizes} from "./sizes";
import {Emphasis} from "./emphasis";
import {Animations} from "./animations";

export class SubtitleLine {
  text: string;
  color: string;
  size: Sizes;
  emphasis: Emphasis;
  animation: Animations;

  constructor(text: string, color?: string, size?: Sizes, emphasis?: Emphasis, animation?: Animations) {
    this.text = text;
    this.color = color;
    this.size = size;
    this.emphasis = emphasis;
    this.animation = animation;
  }
}
