import {Component, Input, OnInit} from '@angular/core';
import {HttpService} from "../../services/http.service";

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.css']
})
export class VideoComponent implements OnInit {

  @Input()
  id: number;

  constructor(private httpService: HttpService) {
  }

  ngOnInit(): void {
  }

  getVideoSource() {
    return this.httpService.fetchVideo(this.id);
  }

}
