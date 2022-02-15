import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {faPause, faPlay} from '@fortawesome/free-solid-svg-icons';
import {HttpService} from "../../services/http.service";

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.css']
})
export class VideoComponent implements OnInit {
  faPause = faPause;
  faPlay = faPlay;

  @Input()
  id: string;

  videoSource: string;
  title: string;
  playButtonVisible = true;
  playing = false;

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
      });
      this.videoPlayer.nativeElement.addEventListener('ended', e => {
        this.playButtonVisible = true;
        this.playing = false;
      });
    });
  }

  playPauseVideo() {
    this.playButtonVisible = true;
    if (this.videoPlayer.nativeElement.paused) {
      this.videoPlayer.nativeElement.play();
    } else {
      this.videoPlayer.nativeElement.pause();
    }
  }
}
