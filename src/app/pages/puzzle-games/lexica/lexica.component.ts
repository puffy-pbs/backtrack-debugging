import { GameboardComponent } from '../../gameboard/gameboard.component';
import { range, from, of } from 'rxjs';
import { map, switchMap, startWith, delay, concatMap, pairwise } from 'rxjs/operators';
import { Component, AfterViewInit, OnInit, ViewChild } from '@angular/core';
import { DebuggerData } from '../../../@core/models/debugger-data';
import { AnimationVelocityComponent } from '../../animation-velocity/animation-velocity.component';
import { DebuggerComponent } from '../../debugger/debugger.component';
import { LexicaService } from '../../../@core/mock/lexica.service';

@Component({
  selector: 'bd-lexica',
  templateUrl: './lexica.component.html',
  styleUrls: ['./lexica.component.scss']
})
export class LexicaComponent extends GameboardComponent implements OnInit, AfterViewInit {
  @ViewChild(DebuggerComponent) private dbcComponent: DebuggerComponent;
  @ViewChild(AnimationVelocityComponent) private avComponent: AnimationVelocityComponent;
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
    const generatorWordsObservable = range(0, this.rows);
    generatorWordsObservable.pipe(
      switchMap(i => range(-1, this.rows).pipe(map(j => [i, j]))),
      switchMap(pair => {
        const row = pair[0];
        const col = pair[1];
        const pos = [row, col + 1].join();
        return from(this.findNextWord(row, col, pos));
      }),
      startWith([]),
      pairwise(),
      switchMap(([previous, curr]) => {
        const currPreviousDiff = this.arrayDiffService.arrayDifference(curr, previous);
        const current = this.colour(currPreviousDiff, 'lightskyblue');
        const previosCurrDiff = this.arrayDiffService.arrayDifference(previous, curr).reverse();
        const prev = this.colour(previosCurrDiff, 'black');
        const concat = prev.concat(current);
        return from(concat);
      }),
      concatMap((positions) => of(positions).pipe(delay(+this.avComponent.speed * 1000)))
    ).subscribe(square => {
      let separatorPos = square.position.indexOf(',');
      const row = +square.position.substr(0, separatorPos);
      const col = +square.position.substr(++separatorPos);
      const color = (square.colour === 'lightskyblue') ? 'blue' : square.colour;
      const curr = new DebuggerData(row, col, color);
      this.dbcComponent.pushToDebugData(curr);
      this.drawServiceMediator.highlightWords(square.position, square.colour);
    });
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

    const validDirections = directions.filter(direction =>
      this.validateNextPosition(direction.row, direction.col) && !this.used[direction.row][direction.col]);
    return validDirections;
  }

  private validateNextPosition(row: number, col: number): boolean {
    const isPositionValid = (row >= 0 && col >= 0 && row < this.rows && col < this.cols);
    return isPositionValid;
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
