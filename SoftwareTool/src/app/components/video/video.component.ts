import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {faPause, faPlay} from '@fortawesome/free-solid-svg-icons';
import {HttpService} from "../../services/http.service";

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.css']
})
export class VideoComponent implements OnInit {

  @Input()
  id: string;

  videoSource: string;
  title: string;
  playButtonVisible = true;

  @ViewChild('video')
  videoPlayer: ElementRef;

  constructor(private httpService: HttpService) {
  }

  ngOnInit(): void {
    this.httpService.fetchVideoMetadata(this.id).subscribe(metadata => {
      this.title = metadata[0].title;
      this.httpService.fetchVideoSource(metadata[0].filename).subscribe(source => this.videoSource = source);
    });
  }

  playPauseVideo() {
    this.playButtonVisible = true;
    if (this.videoPlayer.nativeElement.paused) {
      this.videoPlayer.nativeElement.play();
      setTimeout(() => this.playButtonVisible = false, 1000);
    } else {
      this.videoPlayer.nativeElement.pause();
    }
  }

  getPlayPauseButtonIcon() {
    if (this.videoPlayer && this.videoPlayer.nativeElement) {
      if (this.videoPlayer.nativeElement.paused) {
        this.playButtonVisible = true;
        return faPlay;
      }
      return faPause;
    }
    return faPlay;
  }
}
