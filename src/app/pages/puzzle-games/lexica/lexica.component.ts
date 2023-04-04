import {GameboardComponent} from '../../gameboard/gameboard.component';
import {from, range} from 'rxjs';
import {concatMap, map, pairwise, startWith, switchMap} from 'rxjs/operators';
import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {AnimationVelocityComponent} from '../../animation-velocity/animation-velocity.component';
import {DebuggerComponent} from '../../debugger/debugger.component';
import {LexicaService} from '../../../@core/mock/lexica.service';

@Component({
  selector: 'bd-lexica',
  templateUrl: './lexica.component.html',
  styleUrls: ['./lexica.component.scss'],
})
export class LexicaComponent extends GameboardComponent implements OnInit, AfterViewInit {
  @ViewChild(DebuggerComponent) private debuggerComponent: DebuggerComponent;
  @ViewChild(AnimationVelocityComponent) private animationVelocityComponent: AnimationVelocityComponent;
  private classification: number = 6;
  private currentWord: string[] = [];

  public ngOnInit() {
    const letters = new LexicaService().getData();
    this.setLettersData(letters);
    this.setUsedArray();
    this.draw();
  }

  public ngAfterViewInit() {
    this.findWords();
  }

  private findWords() {
    range(0, this.rows).pipe(
      switchMap(i => range(-1, this.rows).pipe(map(j => [i, j]))),
      switchMap(pair => {
        const row = pair[0];
        const col = pair[1];
        const pos = [row, col + 1].join();
        return from(this.findNextWord(row, col, pos));
      }),
      startWith([]),
      pairwise(),
      switchMap(([previous, curr]) => this.findDiffBetweenTwoPairsOfData(previous, curr)),
      concatMap(positions => this.setDefaultDelay(positions, +this.animationVelocityComponent.speed)),
    ).subscribe(square => this.highlightCurrentData(square, this.debuggerComponent));
  }

  private getAvailableDirections(row: number, col: number) {
    const directions = [
      { // Left
        row: row,
        col: col - 1
      },
      { // Right
        row: row,
        col: col + 1
      },
      { // Up
        row: row - 1,
        col: col
      },
      { // Bottom
        row: row + 1,
        col: col
      },
      { // Up Left
        row: row - 1,
        col: col - 1
      },
      { // Up Right
        row: row - 1,
        col: col + 1
      },
      { // Bottom Left
        row: row + 1,
        col: col - 1
      },
      { // Bottom Right
        row: row + 1,
        col: col + 1
      }
    ];

    return directions.filter(direction =>
      this.validateNextPosition(direction.row, direction.col)
      && !this.used[direction.row][direction.col]
    );
  }

  private validateNextPosition(row: number, col: number): boolean {
    return (row >= 0 && col >= 0 && row < this.rows && col < this.cols);
  }

  private *findNextWord(row: number, col: number, pos: string): IterableIterator<string[]> {
    if (this.currentWord.length === this.classification) {
      yield this.currentWord.slice();
      return;
    }

    const directions = this.getAvailableDirections(row, col);
    for (const direction of directions) {
      this.used[direction.row][direction.col] = true;
      this.currentWord.push([direction.row, direction.col].join());
      if (this.currentWord[0] === pos) {
        yield* this.findNextWord(direction.row, direction.col, pos);
      }
      this.used[direction.row][direction.col] = false;
      this.currentWord.pop();
    }
  }
}
