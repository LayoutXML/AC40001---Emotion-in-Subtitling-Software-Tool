import { Component, OnInit } from '@angular/core';
import {HttpService} from "../../services/http.service";
import {VideoData} from "../../objects/video-data";

@Component({
  selector: 'app-video-list',
  templateUrl: './video-list.component.html',
  styleUrls: ['./video-list.component.css']
})
export class VideoListComponent implements OnInit {
  videos: VideoData[];

  constructor(private httpService: HttpService) { }

  ngOnInit(): void {
    this.httpService.fetchAllVideosList().subscribe(data => {
      this.videos = data.map(document => {
        const video = new VideoData();
        video.id = document.id;
        video.title = document.title;
        video.thumbnailFilename = document.thumbnail;
        return video;
      });
      this.videos.forEach(video => {
        this.httpService.fetchFileURL(video.thumbnailFilename).subscribe(thumbnail => {
          video.thumbnailUrl = thumbnail;
        });
      })
    })
  }

}
