import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PuzzleGamesComponent } from './puzzle-games.component';
import { LexicaComponent } from './lexica/lexica.component';
import { GroupingsComponent } from './groupings/groupings.component';

const routes: Routes = [{
  path: '',
  component: PuzzleGamesComponent,
  children: [
    {
      path: 'lexica',
      component: LexicaComponent,
    },
    {
      path: 'groupings',
      component: GroupingsComponent
    }
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PuzzleGamesRoutingModule {
}

export const ROUTED_COMPONENTS = [
  PuzzleGamesComponent,
  LexicaComponent,
  GroupingsComponent
];
