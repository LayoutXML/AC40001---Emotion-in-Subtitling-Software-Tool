import {Injectable} from '@angular/core';
import {Sizes} from "../objects/sizes";
import {Emphasis} from "../objects/emphasis";
import {Animations} from "../objects/animations";

class Pair {
  pleasantness: number;
  arousal: number;

  constructor(pleasantness: number, arousal: number) {
    this.pleasantness = pleasantness;
    this.arousal = arousal;
  }

  equals(pair: Pair) {
    return this.pleasantness === pair.pleasantness && this.arousal === pair.arousal;
  }
}

@Injectable({
  providedIn: 'root'
})
export class SubtitleEmotionUtilsService {
  colorMap = new Map<Pair, string>();
  sizeMap = new Map<Pair, Sizes>();
  emphasisMap = new Map<Pair, Emphasis>();
  animationsMap = new Map<Pair, Animations>();

  constructor() {
    this.colorMap.set(new Pair(1, 1), '#0000FF');
    this.colorMap.set(new Pair(1, 2), '#0000FF');
    this.colorMap.set(new Pair(1, 3), '#7F00FF');
    this.colorMap.set(new Pair(1, 4), '#FF7F00');
    this.colorMap.set(new Pair(1, 5), '#FF7F00');
    this.colorMap.set(new Pair(1, 6), '#FF0000');
    this.colorMap.set(new Pair(1, 7), '#FF0000');
    this.colorMap.set(new Pair(2, 1), '#0000FF');
    this.colorMap.set(new Pair(2, 2), '#0000FF');
    this.colorMap.set(new Pair(2, 3), '#7F00FF');
    this.colorMap.set(new Pair(2, 4), '#FF7F00');
    this.colorMap.set(new Pair(2, 5), '#FF7F00');
    this.colorMap.set(new Pair(2, 6), '#FF0000');
    this.colorMap.set(new Pair(2, 7), '#FF0000');
    this.colorMap.set(new Pair(3, 1), '#007FFF');
    this.colorMap.set(new Pair(3, 2), '#007FFF');
    this.colorMap.set(new Pair(3, 3), '#FFFFFF');
    this.colorMap.set(new Pair(3, 4), '#FFFFFF');
    this.colorMap.set(new Pair(3, 5), '#FFFFFF');
    this.colorMap.set(new Pair(3, 6), '#FF00FF');
    this.colorMap.set(new Pair(3, 7), '#FF00FF');
    this.colorMap.set(new Pair(4, 1), '#007FFF');
    this.colorMap.set(new Pair(4, 2), '#007FFF');
    this.colorMap.set(new Pair(4, 3), '#FFFFFF');
    this.colorMap.set(new Pair(4, 4), '#FFFFFF');
    this.colorMap.set(new Pair(4, 5), '#FFFFFF');
    this.colorMap.set(new Pair(4, 6), '#FF007F');
    this.colorMap.set(new Pair(4, 7), '#FF007F');
    this.colorMap.set(new Pair(5, 1), '#000000');
    this.colorMap.set(new Pair(5, 2), '#000000');
    this.colorMap.set(new Pair(5, 3), '#FFFFFF');
    this.colorMap.set(new Pair(5, 4), '#FFFFFF');
    this.colorMap.set(new Pair(5, 5), '#FFFFFF');
    this.colorMap.set(new Pair(5, 6), '#FF007F');
    this.colorMap.set(new Pair(5, 7), '#FF007F');
    this.colorMap.set(new Pair(6, 1), '#FFFFFF');
    this.colorMap.set(new Pair(6, 2), '#FFFFFF');
    this.colorMap.set(new Pair(6, 3), '#FFFF00');
    this.colorMap.set(new Pair(6, 4), '#FFFF00');
    this.colorMap.set(new Pair(6, 5), '#00FF7F');
    this.colorMap.set(new Pair(6, 6), '#00FFFF');
    this.colorMap.set(new Pair(6, 7), '#00FFFF');
    this.colorMap.set(new Pair(7, 1), '#FFFFFF');
    this.colorMap.set(new Pair(7, 2), '#FFFFFF');
    this.colorMap.set(new Pair(7, 3), '#FFFF00');
    this.colorMap.set(new Pair(7, 4), '#FFFF00');
    this.colorMap.set(new Pair(7, 5), '#00FF7F');
    this.colorMap.set(new Pair(7, 6), '#00FFFF');
    this.colorMap.set(new Pair(7, 7), '#00FFFF');

    this.sizeMap.set(new Pair(1, 1), Sizes.SMALL_LOWERCASE);
    this.sizeMap.set(new Pair(1, 2), Sizes.SMALL_LOWERCASE);
    this.sizeMap.set(new Pair(2, 1), Sizes.SMALL_LOWERCASE);
    this.sizeMap.set(new Pair(2, 2), Sizes.SMALL_LOWERCASE);
    this.sizeMap.set(new Pair(3, 1), Sizes.SMALL_LOWERCASE);
    this.sizeMap.set(new Pair(3, 2), Sizes.SMALL_LOWERCASE);
    this.sizeMap.set(new Pair(1, 3), Sizes.SMALL);
    this.sizeMap.set(new Pair(1, 4), Sizes.SMALL);
    this.sizeMap.set(new Pair(1, 5), Sizes.SMALL);
    this.sizeMap.set(new Pair(2, 3), Sizes.SMALL);
    this.sizeMap.set(new Pair(2, 4), Sizes.SMALL);
    this.sizeMap.set(new Pair(2, 5), Sizes.SMALL);
    this.sizeMap.set(new Pair(1, 6), Sizes.LARGE_UPPERCASE);
    this.sizeMap.set(new Pair(1, 7), Sizes.LARGE_UPPERCASE);
    this.sizeMap.set(new Pair(2, 6), Sizes.LARGE_UPPERCASE);
    this.sizeMap.set(new Pair(2, 7), Sizes.LARGE_UPPERCASE);
    this.sizeMap.set(new Pair(3, 6), Sizes.LARGE_UPPERCASE);
    this.sizeMap.set(new Pair(3, 7), Sizes.LARGE_UPPERCASE);

    this.emphasisMap.set(new Pair(1, 1), Emphasis.BLUR);
    this.emphasisMap.set(new Pair(1, 2), Emphasis.BLUR);
    this.emphasisMap.set(new Pair(1, 3), Emphasis.BLUR);
    this.emphasisMap.set(new Pair(1, 4), Emphasis.BLUR);
    this.emphasisMap.set(new Pair(2, 2), Emphasis.BLUR);
    this.emphasisMap.set(new Pair(2, 3), Emphasis.BLUR);
    this.emphasisMap.set(new Pair(2, 4), Emphasis.BLUR);
    this.emphasisMap.set(new Pair(2, 1), Emphasis.LIGHT);
    this.emphasisMap.set(new Pair(3, 1), Emphasis.LIGHT);
    this.emphasisMap.set(new Pair(3, 2), Emphasis.LIGHT);
    this.emphasisMap.set(new Pair(4, 1), Emphasis.LIGHT);
    this.emphasisMap.set(new Pair(4, 2), Emphasis.LIGHT);
    this.emphasisMap.set(new Pair(1, 5), Emphasis.UNDERLINE);
    this.emphasisMap.set(new Pair(1, 6), Emphasis.UNDERLINE);
    this.emphasisMap.set(new Pair(1, 7), Emphasis.UNDERLINE);
    this.emphasisMap.set(new Pair(2, 5), Emphasis.UNDERLINE);
    this.emphasisMap.set(new Pair(2, 6), Emphasis.UNDERLINE);
    this.emphasisMap.set(new Pair(2, 7), Emphasis.UNDERLINE);
    this.emphasisMap.set(new Pair(3, 6), Emphasis.ITALICS);
    this.emphasisMap.set(new Pair(4, 6), Emphasis.ITALICS);
    this.emphasisMap.set(new Pair(5, 6), Emphasis.ITALICS);
    this.emphasisMap.set(new Pair(6, 6), Emphasis.ITALICS);
    this.emphasisMap.set(new Pair(3, 7), Emphasis.BOLD);
    this.emphasisMap.set(new Pair(4, 7), Emphasis.BOLD);
    this.emphasisMap.set(new Pair(5, 7), Emphasis.BOLD);
    this.emphasisMap.set(new Pair(6, 7), Emphasis.BOLD);

    this.animationsMap.set(new Pair(1, 1), Animations.FLASHING);
    this.animationsMap.set(new Pair(1, 2), Animations.FLASHING);
    this.animationsMap.set(new Pair(1, 3), Animations.FLASHING);
    this.animationsMap.set(new Pair(1, 4), Animations.FLASHING);
    this.animationsMap.set(new Pair(2, 1), Animations.FLASHING);
    this.animationsMap.set(new Pair(2, 2), Animations.FLASHING);
    this.animationsMap.set(new Pair(2, 3), Animations.FLASHING);
    this.animationsMap.set(new Pair(2, 4), Animations.FLASHING);
    this.animationsMap.set(new Pair(3, 1), Animations.FLASHING);
    this.animationsMap.set(new Pair(3, 2), Animations.FLASHING);
    this.animationsMap.set(new Pair(1, 5), Animations.PULSING);
    this.animationsMap.set(new Pair(1, 6), Animations.PULSING);
    this.animationsMap.set(new Pair(1, 7), Animations.PULSING);
    this.animationsMap.set(new Pair(2, 5), Animations.PULSING);
    this.animationsMap.set(new Pair(2, 6), Animations.PULSING);
    this.animationsMap.set(new Pair(2, 7), Animations.PULSING);
  }

  getColorByValues(pleasantness: number, arousal: number): string {
    if (pleasantness < 1 || arousal < 1 || pleasantness > 7 || arousal > 7) {
      return '#ffffff';
    }

    const key = new Pair(Math.floor(pleasantness), Math.floor(arousal));

    for (const [mKey, mValue] of this.colorMap) {
      if (key.equals(mKey)) {
        return mValue;
      }
    }

    return '#ffffff';
  }

  getSizeByValues(pleasantness: number, arousal: number): Sizes {
    if (pleasantness < 1 || arousal < 1 || pleasantness > 7 || arousal > 7) {
      return Sizes.REGULAR;
    }

    const key = new Pair(Math.floor(pleasantness), Math.floor(arousal));

    for (const [mKey, mValue] of this.sizeMap) {
      if (key.equals(mKey)) {
        return mValue;
      }
    }

    return Sizes.REGULAR;
  }

  getEmphasisByValues(pleasantness: number, arousal: number): Emphasis {
    if (pleasantness < 1 || arousal < 1 || pleasantness > 7 || arousal > 7) {
      return Emphasis.NO_EMPHASIS;
    }

    const key = new Pair(Math.floor(pleasantness), Math.floor(arousal));

    for (const [mKey, mValue] of this.emphasisMap) {
      if (key.equals(mKey)) {
        return mValue;
      }
    }

    return Emphasis.NO_EMPHASIS;
  }

  getAnimationsByValues(pleasantness: number, arousal: number): Animations {
    if (pleasantness < 1 || arousal < 1 || pleasantness > 7 || arousal > 7) {
      return Animations.NO_ANIMATION;
    }

    const key = new Pair(Math.floor(pleasantness), Math.floor(arousal));

    for (const [mKey, mValue] of this.animationsMap) {
      if (key.equals(mKey)) {
        return mValue;
      }
    }

    return Animations.NO_ANIMATION;
  }


}
