import {Injectable} from '@angular/core';
import {collection, collectionData, Firestore, query, where} from "@angular/fire/firestore";
import {from} from "rxjs";
import {getDownloadURL, ref, Storage} from "@angular/fire/storage";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  constructor(private firestore: Firestore,
              private storage: Storage,
              private httpClient: HttpClient) {
  }

  fetchVideoMetadata(id: string) {
    return collectionData(query(collection(this.firestore, 'videos'), where('__name__', '==', id)));
  }

  fetchFileURL(filename: string) {
    return from(getDownloadURL(ref(this.storage, filename)));
  }

  fetchRawTextFile(url: string) {
    return this.httpClient.get(url, {responseType: 'text'});
  }

  fetchAllVideosList() {
    return collectionData(query(collection(this.firestore, 'videos')), {idField: 'id'});
  }

  fetchCode(code: string) {
    return collectionData(query(collection(this.firestore, 'codes'), where('__name__', '==', code)));
  }
}
