import { NgModule } from '@angular/core';
import { ThemeModule } from '../../@theme/theme.module';
import { PuzzleGamesRoutingModule, ROUTED_COMPONENTS } from './puzzle-games-routing.module';

// components
import { LexicaComponent } from './lexica/lexica.component';
import { GameboardComponent } from '../gameboard/gameboard.component';
import { DebuggerComponent } from '../debugger/debugger.component';
import { NbListModule } from '@nebular/theme';
import { GroupingsComponent } from './groupings/groupings.component';
import { AnimationVelocityComponent } from '../animation-velocity/animation-velocity.component';

// services
// TO DO
const COMPONENTS = [
  LexicaComponent,
  GroupingsComponent,
  GameboardComponent,
  DebuggerComponent,
  AnimationVelocityComponent
];

const MODULES = [
  ThemeModule,
  NbListModule,
  PuzzleGamesRoutingModule
];

@NgModule({
  imports: [
    ...MODULES
  ],
  declarations: [
    ...COMPONENTS,
    ...ROUTED_COMPONENTS,
  ],
  exports: COMPONENTS
})
export class PuzzleGamesModule { }
