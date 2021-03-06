import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent} from './app.component';
import {VideoComponent} from './components/video/video.component';
import {VideoPageComponent} from './pages/video-page/video-page.component';
import {AppRoutingModule} from "./app-routing-module";
import {initializeApp, provideFirebaseApp} from '@angular/fire/app';
import {getFirestore, provideFirestore} from '@angular/fire/firestore';
import {getStorage, provideStorage} from "@angular/fire/storage";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {FormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import { VideoListComponent } from './pages/video-list/video-list.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { CodeComponent } from './pages/code/code.component';
import { ThankYouComponent } from './pages/thank-you/thank-you.component';

@NgModule({
  declarations: [
    AppComponent,
    VideoComponent,
    VideoPageComponent,
    VideoListComponent,
    NavBarComponent,
    CodeComponent,
    ThankYouComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    provideFirebaseApp(() => initializeApp({
      apiKey: "AIzaSyDfP2n7qKyDa6DezpbrmbDWoIzaWcTdnkk",
      authDomain: "emotion-in-subtitling.firebaseapp.com",
      databaseURL: "https://emotion-in-subtitling-default-rtdb.europe-west1.firebasedatabase.app",
      projectId: "emotion-in-subtitling",
      storageBucket: "emotion-in-subtitling.appspot.com",
      messagingSenderId: "403249131028",
      appId: "1:403249131028:web:c15a6149273d122a350101"
    })),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    FontAwesomeModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
