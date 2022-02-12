import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor() {
  }

  fetchVideo(id: number) {
    return 'https://video.rokas.dev/Videos/Sample%20video.mp4';
  }
}
