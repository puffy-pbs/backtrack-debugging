import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { from, of } from 'rxjs';
import { delay, concatMap, startWith, pairwise, switchMap } from 'rxjs/operators';
import { GameboardComponent } from '../../gameboard/gameboard.component';
import { DebuggerData } from '../../../@core/models/debugger-data';
import { AnimationVelocityComponent } from '../../animation-velocity/animation-velocity.component';
import { DebuggerComponent } from '../../debugger/debugger.component';

@Component({
  selector: 'bd-groupings',
  templateUrl: './groupings.component.html',
  styleUrls: ['./groupings.component.scss']
})
export class GroupingsComponent extends GameboardComponent implements OnInit, AfterViewInit {
  @ViewChild(DebuggerComponent) private dbcComponent: DebuggerComponent;
  @ViewChild(AnimationVelocityComponent) private avComponent: AnimationVelocityComponent;
  private n = 8;
  private half = this.n / 2;
  private k = this.half;
  private men: number[] = Array.from(Array(this.half), (val, index) => (index + 1));
  private women: number[] = Array.from(Array(this.half), (val, index) => (this.half + index + 1));
  private relations: Map<number, number>;
  private connectedCouples: { [type: string]: Set<number> };

  public ngOnInit(): void {
    const letters = [
      [...this.men],
      [...this.women],
    ];
    this.setLettersData(letters);
    this.setUsedArray();
    this.draw();

    this.connectedCouples = {};
    this.connectedCouples['men'] = new Set<number>();
    this.connectedCouples['women'] = new Set<number>();

    this.relations = new Map<number, number>();
    for (let i = 0; i < this.men.length; i++) {
      this.relations[this.men[i]] = this.women[i];
    }
  }

  public ngAfterViewInit(): void {
    this.groupCouples();
  }

  private groupCouples(): void {
    const generatorGroupsObservable = from(this.group(0, 0));

    generatorGroupsObservable
      .pipe(
        startWith([]),
        pairwise(),
        switchMap(([previous, curr]) => {
          const currPreviousDiff = this.arrayDiffService.arrayDifference(curr, previous);
          const currPreviousDiffSorted = this.sortService.arrayDifferenceStringValues(currPreviousDiff);
          const current = this.colour(currPreviousDiffSorted, 'lightskyblue');
          const previosCurrDiff = this.arrayDiffService.arrayDifference(previous, curr);
          const previosCurrDiffSorted = this.sortService.arrayDifferenceStringValues(previosCurrDiff, 'r');
          const prev = this.colour(previosCurrDiffSorted, 'black');
          const concat = prev.concat(current);
          return from(concat);
        }),
        concatMap((groupedCouples) => of(groupedCouples).pipe(delay(+this.avComponent.speed * 1000)))
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

  private *group(manIndex: number, womanIndex: number): IterableIterator<string[]> {
    const halfGroup = this.k / 2;
    let typeOfGroup;
    let position;
    let checkFunc;

    if (this.connectedCouples['men'].size < halfGroup) {
      typeOfGroup = 'men';
      position = manIndex;
      checkFunc = (index) => false;
    } else if (this.connectedCouples['women'].size < halfGroup) {
      typeOfGroup = 'women';
      position = womanIndex;
      checkFunc = (index) => Array.from(this.connectedCouples['men'])
        .some(man => this.relations[man] === this.women[index]);
    }

    if (this.connectedCouples[typeOfGroup]) {
      for (let i = position; i < this[typeOfGroup].length; i++) {
        const cellOccupied: boolean = checkFunc(i);
        if (!this.connectedCouples[typeOfGroup].has(this[typeOfGroup][i]) && !cellOccupied) {
          this.connectedCouples[typeOfGroup].add(this[typeOfGroup][i]);
          const callWith = (typeOfGroup === 'women') ? [manIndex, i + 1] : [i + 1, womanIndex];
          yield* this.group.apply(this, callWith);
          this.connectedCouples[typeOfGroup].delete(this[typeOfGroup][i]);
        }
      }
    } else {
      const grouped = new Array<string>();
      for (const key in this.connectedCouples) {
        for (const people of this.connectedCouples[key]) {
          const isWoman = people > this.half;
          const row = (isWoman) ? 1 : 0;
          const col = (isWoman) ? people - this.half : people;
          grouped.push([row, col - 1].join());
        }
      }

      yield grouped;
    }
  }

}
