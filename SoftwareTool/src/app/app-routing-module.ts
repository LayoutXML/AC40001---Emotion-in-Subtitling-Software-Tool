import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {VideoPageComponent} from "./pages/video-page/video-page.component";
import {VideoListComponent} from "./pages/video-list/video-list.component";
import {CodeComponent} from "./pages/code/code.component";
import {ThankYouComponent} from "./pages/thank-you/thank-you.component";

const routes: Routes = [
  {path: '', runGuardsAndResolvers: 'always', component: CodeComponent},
  {path: 'thankyou', runGuardsAndResolvers: 'always', component: ThankYouComponent},
  {path: 'videos', runGuardsAndResolvers: 'always', component: VideoListComponent},
  {path: 'video/:id', runGuardsAndResolvers: 'always', component: VideoPageComponent},
  {path: '**', component: CodeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
