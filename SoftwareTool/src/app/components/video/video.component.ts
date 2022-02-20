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
    });
  }

  fetchVideo(filename) {
    this.httpService.fetchVideoSource(filename).subscribe(source => {
      this.videoSource = source;
      this.initialiseButton();
    });
  }

  initialiseButton() {
    setTimeout(() => {
      this.videoPlayer.nativeElement.addEventListener('play', e => {
        this.playing = true;
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

  showAndRemoveButtonsWithDelay() {
    this.playButtonVisible = true;
    setTimeout(() => {
      if (this.playing) {
        this.playButtonVisible = false;
      }
    }, 1000);
  }
}
