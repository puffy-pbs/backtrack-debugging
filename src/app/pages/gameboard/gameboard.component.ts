import {Component, Renderer2, ElementRef} from '@angular/core';
import {GameboardDrawService} from '../services/gameboard-draw.service';
import {GameboardConfig} from '../../@core/interfaces/gameboard-config';
import {Square} from '../../@core/models/square';
import {SortService} from "../services/sort.service";
import { ArrayDiffService } from '../services/array-diff.service';

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
    protected arrayDiffService: ArrayDiffService,
    protected sortService: SortService
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
    const gameboardConfig: GameboardConfig = {
      letters: this.letters,
      lettersByPosition: this.lettersByPosition,
      rows: this.rows,
      cols: this.cols,
      width: this.width,
      x: this.x,
      y: this.y
    };

    this.drawServiceMediator.gameboardConfig = gameboardConfig;
    this.drawServiceMediator.drawBoard(height, width);
    this.drawServiceMediator.drawsService = 'topCanvas';
    this.drawServiceMediator.setBoard();
  }

  protected colour(positions: any[], colour: string): Square[] {
    return positions.map(position => new Square(position, colour));
  }
}

