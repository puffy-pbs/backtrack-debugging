import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { CustomSolutionComponent } from './custom-solution/custom-solution.component';

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
    {
      path: 'custom-solution',
      component: CustomSolutionComponent
    },
    {
      path: 'puzzle-games',
      loadChildren: './puzzle-games/puzzle-games.module#PuzzleGamesModule'
    },
    {
      path: '',
      redirectTo: 'puzzle-games',
      pathMatch: 'full',
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
