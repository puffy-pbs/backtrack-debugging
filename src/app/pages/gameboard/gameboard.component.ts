import {Component, ElementRef, Renderer2} from '@angular/core';
import {GameboardDrawService} from '../services/gameboard-draw.service';
import {GameboardConfig} from '../../@core/interfaces/gameboard-config';
import {Square} from '../../@core/models/square';
import {SortService} from "../services/sort.service";
import {ArrayDiffService} from '../services/array-diff.service';
import {from, Observable, of} from "rxjs";
import {delay} from "rxjs/operators";
import {DebuggerData} from "../../@core/models/debugger-data";
import {DebuggerComponent} from "../debugger/debugger.component";
import {NbDialogService} from "@nebular/theme";

@Component({
  selector: 'bd-gameboard',
  templateUrl: './gameboard.component.html'
})
export class GameboardComponent {
  protected drawServiceMediator: GameboardDrawService;
  protected letters: any;
  protected rows: number;
  protected cols: number;
  protected lettersByPosition: string[];
  protected width: number = 80;
  protected x: number = 10;
  protected y: number = 10;
  protected used: boolean[];

  public constructor(
    protected renderer2: Renderer2,
    protected el: ElementRef,
    protected dialogService: NbDialogService,
    protected arrayDiffService: ArrayDiffService,
    protected sortService: SortService,
  ) {
    this.drawServiceMediator = new GameboardDrawService(this.renderer2, this.el);
    this.lettersByPosition = [];
  }

  protected setLettersData(letters: any): void {
    this.letters = letters;
    this.rows = letters.length;
    this.cols = letters[0].length;
  }

  protected setUsedArray(): void {
    this.used = Array.from(Array(this.rows)).reduce(accumulator => {
      accumulator.push(Array(this.cols));
      return accumulator;
    }, []);
  }

  protected draw(): void {
    const width = this.width * this.cols + this.y + 1 + 'px';
    const height = this.width * this.rows + this.x + + 1 + 'px';
    this.drawServiceMediator.gameboardConfig = {
      letters: this.letters,
      lettersByPosition: this.lettersByPosition,
      rows: this.rows,
      cols: this.cols,
      width: this.width,
      x: this.x,
      y: this.y,
    };
    this.drawServiceMediator.drawBoard(height, width);
    this.drawServiceMediator.drawsService = 'topCanvas';
    this.drawServiceMediator.setBoard();
  }

  protected colour(positions: any[], colour: string): Square[] {
    return positions.map(position => new Square(position, colour));
  }

  protected findDiffBetweenTwoPairsOfData(previous, curr): Observable<Square> {
    const currPreviousDiff = this.arrayDiffService.arrayDifference(curr, previous);
    const current = this.colour(currPreviousDiff, 'lightskyblue');
    const previousCurrDiff = this.arrayDiffService.arrayDifference(previous, curr).reverse();
    const prev = this.colour(previousCurrDiff, 'black');
    const concat = prev.concat(current);
    return from(concat);
  }

  protected setDefaultDelay(positions: Square, speed: number): Observable<Square> {
    return of(positions).pipe(delay(speed * 1000));
  }

  protected highlightCurrentData(square: Square, debuggerComponent: DebuggerComponent) {
    let separatorPos = square.position.indexOf(',');
    const row = +square.position.substr(0, separatorPos);
    const col = +square.position.substr(++separatorPos);
    const color = (square.colour === 'lightskyblue') ? 'blue' : square.colour;
    debuggerComponent.pushToDebugData(new DebuggerData(row, col, color));
    this.drawServiceMediator.highlightWords(square.position, square.colour);
  }
}

