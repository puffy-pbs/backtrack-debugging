import { Component, ViewChild, Input } from '@angular/core';
import { from, of } from 'rxjs';
import { startWith, pairwise, switchMap, concatMap, delay } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

import { CustomSolutionService } from '../services/custom-solution.service';
import { GameboardComponent } from '../gameboard/gameboard.component';
import { DebuggerData } from '../../@core/models/debugger-data';
import { AnimationVelocityComponent } from '../animation-velocity/animation-velocity.component';
import { DebuggerComponent } from '../debugger/debugger.component';

@Component({
  selector: 'bd-custom-solution',
  templateUrl: './custom-solution.component.html',
  styleUrls: ['./custom-solution.component.scss']
})
export class CustomSolutionComponent extends GameboardComponent {
  @ViewChild(DebuggerComponent) private dbcComponent: DebuggerComponent;
  @ViewChild(AnimationVelocityComponent) private avComponent: AnimationVelocityComponent;
  @Input() functionString: string;
  @Input() isSuccesful: boolean = true;
  private variables: any[] = [];
  private customSolutionService: CustomSolutionService = new CustomSolutionService();

  public setFunctionInit(): void {
    try {
      const generatorAndVariables = this.customSolutionService.getFunctionInitAndGenerator(this.functionString);
      const variables = this.customSolutionService.getVariables(generatorAndVariables.functionInit);
      this.setVariables(variables);
      let letters = Array.from(Array(this.variables['n']), (val, index) => index + 1);
      letters = this.arrayDiffService.chunk(letters, environment.chunkSize);
      this.setLettersData([
        ...letters,
      ]);
      const generatorAndValues = this.customSolutionService.getFunction(generatorAndVariables.generator);
      eval('this.act = function* ' + generatorAndValues.params + ' { ' + generatorAndValues.generator);
      this.draw();
      this.runGenerator();
    } catch (err) {
      this.functionString = err;
      this.isSuccesful = false;
    }
  }

  private setVariables(variables: string[][]): void {
    for (const [key, value] of variables) {
      this.variables[key] = value;
    }
  }

  private *act() {

  }

  private runGenerator(): void {
    const generatorCustomObservable = from(this.act());

    generatorCustomObservable
      .pipe(
        startWith([]),
        pairwise(),
        switchMap(([previous, curr]) => {
          const currPreviousDiff = this.arrayDiffService.arrayDifference(curr, previous);
          const currPreviousDiffSorted = this.sortService.arrayDifferenceNumberValues(currPreviousDiff);
          const current = this.colour(currPreviousDiffSorted, 'lightskyblue');
          const previosCurrDiff = this.arrayDiffService.arrayDifference(previous, curr);
          const previosCurrDiffSorted = this.sortService.arrayDifferenceNumberValues(previosCurrDiff, 'r');
          const prev = this.colour(previosCurrDiffSorted, 'black');
          const concat = prev.concat(current);
          return from(concat);
        }),
        concatMap((groupedCouples) => of(groupedCouples).pipe(delay(+this.avComponent.speed * 1000)))
      ).subscribe((square) => {
        let col = +square.position;
        const row = (col >= 1) ? Math.floor(col / environment.chunkSize) : 0;
        col %= environment.chunkSize;
        const color = (square.colour === 'lightskyblue') ? 'blue' : square.colour;
        const curr = new DebuggerData(row, col, color);
        this.dbcComponent.pushToDebugData(curr);
        this.drawServiceMediator.highlightWords(row + ',' + col, square.colour);
      });
  }

}
