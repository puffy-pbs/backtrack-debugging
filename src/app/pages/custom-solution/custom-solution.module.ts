import { NgModule } from '@angular/core';
import { ThemeModule } from '../../@theme/theme.module';
import { NbListModule, NbDialogModule } from '@nebular/theme';
import { PuzzleGamesModule } from '../puzzle-games/puzzle-games.module';
import { CustomSolutionService } from '../services/custom-solution.service';
import { CustomSolutionComponent } from './custom-solution.component';

// components
const COMPONENTS = [
  CustomSolutionComponent,
];

// services
const SERVICES = [
  CustomSolutionService
];

// modules
const MODULES = [
  ThemeModule,
  NbListModule,
  PuzzleGamesModule,
  NbDialogModule.forChild()
];

@NgModule({
  imports: MODULES,
  declarations: COMPONENTS,
  providers: SERVICES,
})
export class CustomSolutionModule { }
