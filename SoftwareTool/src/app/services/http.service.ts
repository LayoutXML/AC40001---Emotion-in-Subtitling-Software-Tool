import {Injectable} from '@angular/core';
import {collection, collectionData, Firestore, query, where} from "@angular/fire/firestore";
import {from} from "rxjs";
import {getDownloadURL, ref, Storage} from "@angular/fire/storage";

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  constructor(private firestore: Firestore,
              private storage: Storage) {
  }

  fetchVideoMetadata(id: string) {
    return collectionData(query(collection(this.firestore, 'videos'), where('__name__', '==', id)));
  }

  fetchVideoSource(filename: string) {
    return from(getDownloadURL(ref(this.storage, filename)));
  }

  fetchAllVideosList() {
    return collectionData(query(collection(this.firestore, 'videos')));
  }
}
