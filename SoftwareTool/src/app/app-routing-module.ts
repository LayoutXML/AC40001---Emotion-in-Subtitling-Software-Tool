import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {VideoPageComponent} from "./pages/video-page/video-page.component";
import {VideoListComponent} from "./pages/video-list/video-list.component";

const routes: Routes = [
  {path: '', runGuardsAndResolvers: 'always', component: VideoListComponent},
  {path: 'video/:id', runGuardsAndResolvers: 'always', component: VideoPageComponent},
  {path: '**', component: VideoListComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
