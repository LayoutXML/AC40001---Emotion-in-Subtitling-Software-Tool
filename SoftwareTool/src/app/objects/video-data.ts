import {DocumentData} from 'firebase/firestore';

export class VideoData implements DocumentData {
  id: string;
  title: string;
  thumbnailFilename: string;
  thumbnailUrl: string;
}
