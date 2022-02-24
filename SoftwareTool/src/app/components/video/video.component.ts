import {Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild} from '@angular/core';
import {faCompress, faExpand, faPause, faPlay} from '@fortawesome/free-solid-svg-icons';
import {HttpService} from "../../services/http.service";
import {DisplayOption} from "../../objects/display-option";

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
  subtitles: string;
  subtitlesLine = 0;
  previousSubtitlesLine = 0;

  @ViewChild('video')
  videoPlayer: ElementRef;

  constructor(private httpService: HttpService) {
  }

  ngOnInit(): void {
    this.fetchMetadata();
    this.document = document;
    this.element = document.documentElement;
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
        this.subtitles = subtitles;
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
  }

  playPauseVideo() {
    this.playButtonVisible = true;
    if (this.videoPlayer.nativeElement.paused) {
      this.processDisplayOption();
      this.videoPlayer.nativeElement.play();
    } else {
      this.videoPlayer.nativeElement.pause();
    }
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

  @HostListener('document:keydown.escape', ['$event'])
  escHandler(event) {
    this.shrinkVideo();
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
    if (DisplayOption.AUDIBLE === this._displayOption) {
      return;
    }

    const startTime = new Date().getTime() - this.videoPlayer.nativeElement.currentTime * 1000;
    const subtitleLines = this.subtitles.split('\r\n');

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

      if (!this.playing) {
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
          if (!this.playing) {
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
    console.log(currentLines); // TODO: show current subtitles
    await this.delay(duration);
    // TODO: destroy current subtitles
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
}
