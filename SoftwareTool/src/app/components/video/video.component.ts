import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
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
    if (this.videoPlayer.nativeElement.paused) {
      this.videoPlayer.nativeElement.play();
    } else {
      this.videoPlayer.nativeElement.pause();
    }
  }
}
