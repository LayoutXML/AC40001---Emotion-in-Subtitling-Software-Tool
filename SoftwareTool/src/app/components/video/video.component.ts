import {Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild} from '@angular/core';
import {faCompress, faExpand, faPause, faPlay} from '@fortawesome/free-solid-svg-icons';
import {HttpService} from "../../services/http.service";
import {DisplayOption} from "../../objects/display-option";
import {SubtitleBlock} from "../../objects/subtitle-block";
import {SubtitleLine} from "../../objects/subtitle-line";
import {SubtitleEmotionUtilsService} from "../../services/subtitle-emotion-utils.service";
import {Sizes} from "../../objects/sizes";
import {Emphasis} from "../../objects/emphasis";

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.css']
})
export class VideoComponent implements OnInit {
  faPause = faPause;
  faPlay = faPlay;
  faExpand = faExpand;
  faCompress = faCompress;
  emotionUtil = new SubtitleEmotionUtilsService();

  @Input()
  id: string;

  @Input()
  set displayOption(displayOption: DisplayOption) {
    this._displayOption = displayOption;
    this.processDisplayOption();
  }

  @Output()
  enlargedChange = new EventEmitter<boolean>();

  videoSource: string;
  title: string;
  playButtonVisible = true;
  playing = false;
  enlarged = false;
  _displayOption: DisplayOption;
  element;
  document;
  ignoreFullscreenEvent = false;
  rawSubtitles: string;
  subtitlesLine = 0;
  previousSubtitlesLine = 0;
  currentSubtitles: SubtitleBlock[] = [];

  @ViewChild('video')
  videoPlayer: ElementRef;

  constructor(private httpService: HttpService) {
  }

  ngOnInit(): void {
    this.fetchMetadata();
    this.document = document;
    this.element = document.getElementById('container');
  }

  fetchMetadata() {
    this.httpService.fetchVideoMetadata(this.id).subscribe(metadata => {
      this.title = metadata[0].title;
      this.fetchVideo(metadata[0].filename);
      this.fetchSubtitles(metadata[0].subtitles);
    });
  }

  fetchVideo(filename) {
    this.httpService.fetchFileURL(filename).subscribe(videoSource => {
      this.videoSource = videoSource;
      this.initialiseButton();
    });
  }

  fetchSubtitles(filename) {
    this.httpService.fetchFileURL(filename).subscribe(subtitleSource => {
      this.httpService.fetchRawTextFile(subtitleSource).subscribe(subtitles => {
        this.rawSubtitles = subtitles;
      })
    })
  }

  initialiseButton() {
    setTimeout(() => {
      this.videoPlayer.nativeElement.addEventListener('play', e => {
        this.playing = true;
        this.showSubtitles();
        this.showAndRemoveButtonsWithDelay();
      });
      this.videoPlayer.nativeElement.addEventListener('pause', e => {
        this.playButtonVisible = true;
        this.playing = false;
      });
      this.videoPlayer.nativeElement.addEventListener('ended', e => {
        this.playButtonVisible = true;
        this.playing = false;
      });
    });
  }

  processDisplayOption() {
    if (!this.videoPlayer || !this.videoPlayer.nativeElement) {
      return;
    }
    this.videoPlayer.nativeElement.muted = DisplayOption.AUDIBLE !== this._displayOption;
    this.showSubtitles();
  }

  playPauseVideo() {
    this.playButtonVisible = true;
    if (this.videoPlayer.nativeElement.paused) {
      this.processDisplayOption();
      this.videoPlayer.nativeElement.play();
    } else {
      this.videoPlayer.nativeElement.pause();
    }
    this.currentSubtitles = [];
  }

  expandShrinkVideo() {
    if (this.enlarged) {
      this.shrinkVideo();
    } else {
      this.expandVideo();
    }
  }

  expandVideo() {
    if (this.enlarged) {
      return;
    }

    this.enlarged = true;
    this.enlargedChange.next(this.enlarged);
    this.ignoreFullscreenEvent = true;

    // https://stackoverflow.com/questions/51998594/how-to-make-google-chrome-go-full-screen-in-angular-4-application
    if (this.element.requestFullscreen) {
      this.element.requestFullscreen();
    } else if (this.element.mozRequestFullScreen) {
      this.element.mozRequestFullScreen();
    } else if (this.element.webkitRequestFullscreen) {
      this.element.webkitRequestFullscreen();
    } else if (this.element.msRequestFullscreen) {
      this.element.msRequestFullscreen();
    }
  }

  shrinkVideo() {
    if (!this.enlarged) {
      return;
    }

    this.enlarged = false;
    this.enlargedChange.next(this.enlarged);
    this.ignoreFullscreenEvent = true;

    // https://stackoverflow.com/questions/51998594/how-to-make-google-chrome-go-full-screen-in-angular-4-application
    if (this.document.exitFullscreen) {
      this.document.exitFullscreen();
    } else if (this.document.mozCancelFullScreen) {
      this.document.mozCancelFullScreen();
    } else if (this.document.webkitExitFullscreen) {
      this.document.webkitExitFullscreen();
    } else if (this.document.msExitFullscreen) {
      this.document.msExitFullscreen();
    }
  }

  @HostListener('document:keydown.f', ['$event'])
  fHandler(event) {
    this.expandShrinkVideo();
  }

  @HostListener('document:keydown.escape', ['$event'])
  escHandler(event) {
    this.shrinkVideo();
  }

  @HostListener('document:keydown.space', ['$event'])
  spaceHandler(event) {
    this.playPauseVideo();
  }

  @HostListener('document:fullscreenchange', [])
  @HostListener('document:webkitfullscreenchange', [])
  @HostListener('document:mozfullscreenchange', [])
  @HostListener('document:MSFullscreenChange', [])
  fullScreen() {
    if (this.ignoreFullscreenEvent) {
      this.ignoreFullscreenEvent = false;
    } else {
      this.expandShrinkVideo();
    }
  }

  async showSubtitles() {
    if ((DisplayOption.AUDIBLE as DisplayOption) === this._displayOption) {
      this.currentSubtitles = [];
      return;
    }

    const startTime = new Date().getTime() - this.videoPlayer.nativeElement.currentTime * 1000;
    const subtitleLines = this.rawSubtitles.split('\r\n');

    if (this.subtitlesLine < 0) {
      this.subtitlesLine = 0; // Weird javascript bug
      this.previousSubtitlesLine = 0;
    }
    let repeatedOnceBefore = false;

    let seq = +subtitleLines[this.subtitlesLine];
    let lineType = 0; // 0 - sequence number, 1 - timestamp, 2 - subtitle line, 3 - empty line separator
    let leftTimestamp;
    let rightTimestamp;
    let currentLines = [];
    for (let i = this.subtitlesLine; i < subtitleLines.length; i++) {
      const subtitleLine = subtitleLines[i];

      if (!this.playing || (DisplayOption.AUDIBLE as DisplayOption) === this._displayOption) {
        this.subtitlesLine = this.previousSubtitlesLine;
        return;
      }

      if (lineType === 0) {
        if (subtitleLine === seq + '') {
          if (i != 0 && this.subtitlesLine === i) {
            // Multiple concurrent functions are displaying the same lines
            // Allowing one repeat after pause
            if (repeatedOnceBefore) {
              return;
            }
            repeatedOnceBefore = true;
          }

          this.previousSubtitlesLine = this.subtitlesLine;
          this.subtitlesLine = i;
        } else {
          continue;
        }
      }

      if (lineType === 1) {
        const timestamps = subtitleLine.split(' --> ');
        leftTimestamp = timestamps[0];
        rightTimestamp = timestamps[1];
      }

      if (lineType === 2) {
        if (subtitleLine.length !== 0) {
          currentLines.push(subtitleLine);
          continue;
        } else {
          lineType++;
        }
      }

      if (lineType === 3) {
        const currentStartTime = leftTimestamp.substring(0, 2) * 1000 * 60 * 60 + leftTimestamp.substring(3, 5) * 1000 * 60 + leftTimestamp.substring(6, 8) * 1000 + +leftTimestamp.substring(9);
        const currentEndTime = rightTimestamp.substring(0, 2) * 1000 * 60 * 60 + rightTimestamp.substring(3, 5) * 1000 * 60 + rightTimestamp.substring(6, 8) * 1000 + +rightTimestamp.substring(9);
        const currentTime = new Date().getTime();
        const waitTime = currentStartTime - (currentTime - startTime);
        const duration = currentEndTime - currentStartTime;

        if (duration > 0) {
          if (waitTime > 0) {
            await this.delay(waitTime);
          }
          if (!this.playing || (DisplayOption.AUDIBLE as DisplayOption) === this._displayOption) {
            this.subtitlesLine = this.previousSubtitlesLine;
            return;
          }
          this.showAndDestroyConcurrently(currentLines, duration);
        }

        seq++;
        lineType = -1;
        currentLines = [];
      }

      lineType++;
    }
  }

  async showAndDestroyConcurrently(currentLines: string[], duration: number) {
    // Necessary for time overlapping subtitle texts
    const id = new Date().getTime();
    const subtitles = new SubtitleBlock(id, this.parseSubtitleLines(currentLines));
    this.currentSubtitles.push(subtitles);
    await this.delay(duration - 100); // Javascript bug, async functions are not perfect to each ms
    this.currentSubtitles = this.currentSubtitles.filter(subtitle => id != subtitle.id);
  }

  parseSubtitleLines(subtitleLines: string[]): SubtitleLine[] {
    const result = [];

    subtitleLines.forEach(line => {
      if (!line.startsWith("<e")) {
        result.push(new SubtitleLine(line));
        return;
      }

      const text = line.substring(7);
      const pleasantness = +line.charAt(3);
      const arousal = +line.charAt(5);
      if ((DisplayOption.TRADITIONAL as DisplayOption) === this._displayOption) {
        result.push(new SubtitleLine(text));
      } else if ((DisplayOption.EMOTIONAL as DisplayOption) === this._displayOption) {
        result.push(new SubtitleLine(text,
          this.emotionUtil.getColorByValues(pleasantness, arousal),
          this.emotionUtil.getSizeByValues(pleasantness, arousal),
          this.emotionUtil.getEmphasisByValues(pleasantness, arousal),
          this.emotionUtil.getAnimationsByValues(pleasantness, arousal)))
      }
    });

    return result;
  }

  showAndRemoveButtonsWithDelay() {
    this.playButtonVisible = true;
    setTimeout(() => {
      if (this.playing) {
        this.playButtonVisible = false;
      }
    }, 1000);
  }

  delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
  }

  getColor(line: SubtitleLine) {
    if ((Emphasis.BLUR as Emphasis) === line.emphasis) {
      return 'transparent';
    }
    if (line.color) {
      return line.color;
    }
    return '#ffffff';
  }

  getBackgroundColor(line: SubtitleLine) {
    if (line.color === '#000000') {
      return 'rgba(255, 255, 255, 0.75)';
    }
    return 'rgba(0, 0, 0, 0.75)';
  }

  getFontSize(line: SubtitleLine) {
    let size = 18;

    if (line.size && (Sizes.REGULAR as Sizes) !== line.size) {
      if ((Sizes.LARGE_UPPERCASE as Sizes) === line.size) {
        size = 24;
        line.text = line.text.toUpperCase();
      } else if ((Sizes.SMALL as Sizes) === line.size) {
        size = 12;
      } else if ((Sizes.SMALL_LOWERCASE as Sizes) === line.size) {
        size = 12;
        line.text = line.text.toLowerCase();
      }
    }

    if (this.enlarged) {
      size *= 2;
    }

    return size + 'pt';
  }

  getFontWeight(line: SubtitleLine) {
    if (line.emphasis) {
      if ((Emphasis.LIGHT as Emphasis) === line.emphasis) {
        return '300';
      }
      if ((Emphasis.BOLD as Emphasis) === line.emphasis) {
        return '700';
      }
    }
    return '400';
  }

  getFontStyle(line: SubtitleLine) {
    if (line.emphasis) {
      if ((Emphasis.ITALICS as Emphasis) === line.emphasis) {
        return 'italic';
      }
    }
    return 'normal';
  }

  getTextDecoration(line: SubtitleLine) {
    if (line.emphasis) {
      if ((Emphasis.UNDERLINE as Emphasis) === line.emphasis) {
        return 'underline';
      }
    }
    return 'none';
  }

  getTextShadow(line: SubtitleLine) {
    if (line.emphasis) {
      if ((Emphasis.BLUR as Emphasis) === line.emphasis) {
        const color = line.color ? line.color : '#ffffff';
        return '0 0 5px ' + color;
      }
    }
    return 'none';
  }
}
