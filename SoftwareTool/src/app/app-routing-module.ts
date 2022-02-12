import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AppComponent} from "./app.component";
import {VideoPageComponent} from "./pages/video-page/video-page.component";

const routes: Routes = [
  {path: '', runGuardsAndResolvers: 'always', component: AppComponent},
  {path: 'video/:id', runGuardsAndResolvers: 'always', component: VideoPageComponent},
  {path: '**', component: AppComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
