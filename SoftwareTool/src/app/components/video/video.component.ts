import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
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

  videoSource: string;
  title: string;
  playButtonVisible = true;
  playing = false;
  enlarged = false;
  _displayOption: DisplayOption;

  @ViewChild('video')
  videoPlayer: ElementRef;

  constructor(private httpService: HttpService) {
  }

  ngOnInit(): void {
    this.fetchMetadata();
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
        setTimeout(() => {
          if (this.playing) {
            this.playButtonVisible = false;
          }
        }, 1000);
      });
      this.videoPlayer.nativeElement.addEventListener('pause', e => {
        this.playButtonVisible = true;
        this.playing = false;
        this.enlarged = false;
      });
      this.videoPlayer.nativeElement.addEventListener('ended', e => {
        this.playButtonVisible = true;
        this.playing = false;
        this.enlarged = false;
      });
    });
  }

  processDisplayOption() {
    if (!this.videoPlayer || !this.videoPlayer.nativeElement) {
      return;
    }
    this.videoPlayer.nativeElement.muted = DisplayOption.AUDIBLE !== this.displayOption;
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
    this.enlarged = !this.enlarged;
  }
}
