import { Injectable, Renderer2, ElementRef } from '@angular/core';
import { Observable, range, from } from 'rxjs';
import { map, tap, mergeMap } from 'rxjs/operators';
import { DrawSquareService } from './draw-square.service';
import { GameboardConfig } from '../../@core/interfaces/gameboard-config';
import { Board } from '../../@core/models/board';

@Injectable({
  providedIn: 'root'
})
export class GameboardDrawService {
  private _gameboardConfig: GameboardConfig;
  private _drawsService: DrawSquareService;
  private rowsObservable: Observable<number>;
  private columnsObservable: Observable<number>;

  public constructor(
    private renderer2: Renderer2,
    private el: ElementRef
  ) { }

  public set drawsService(value) {
    const canvas = this.el.nativeElement.querySelector('#' + value);
    const ctx: CanvasRenderingContext2D = canvas.getContext('2d');
    this._drawsService = new DrawSquareService(ctx);
  }

  public set gameboardConfig(value) {
    this._gameboardConfig = value;
    this.init();
  }

  private init(): void {
    this.setRowsObservable();
    this.setColumnsObservable();
  }

  private setRowsObservable(): void {
    this.rowsObservable = range(0, this._gameboardConfig.rows);
  }

  private setColumnsObservable(): void {
    this.columnsObservable = range(0, this._gameboardConfig.cols);
  }

  public drawBoard(height: string = '500px', width: string = '500px'): void {
    const boards = [
      new Board('bgCanvas', '0px', '0px'),
      new Board('topCanvas', height, width)
    ];

    from(boards)
      .subscribe(board => {
        const parentDiv = this.el.nativeElement.querySelector('.game');
        const ctx = this.renderer2.createElement('canvas');
        this.renderer2.setAttribute(ctx, 'id', board.id);
        this.renderer2.setAttribute(ctx, 'height', board.height);
        this.renderer2.setAttribute(ctx, 'width', board.width);
        this.renderer2.appendChild(parentDiv, ctx);
      });
  }

  public setBoard(): void {
    this.setPlayField();
    this.drawLettersPlaceholder();
  }

  public highlightWords(position: string, fillStyle: string): void {
    const letter = this.translate([position]);
    const positions = this._gameboardConfig.lettersByPosition[position];
    const fontStyle = this._gameboardConfig.width / 3 + 'px Arial';
    this._drawsService.highlightSquare(fontStyle, fillStyle, letter, positions.x, positions.y);
  }

  private setPlayField(): void {
    const x = this._gameboardConfig.x;
    const y = this._gameboardConfig.y;
    const width = this._gameboardConfig.width * this._gameboardConfig.cols;
    const height = this._gameboardConfig.width * this._gameboardConfig.rows;
    this._drawsService.strokeRect(x, y, width, height);
  }

  private drawCols(): void {
    let x = this._gameboardConfig.x;
    const height = this._gameboardConfig.width * this._gameboardConfig.rows;
    this.columnsObservable.subscribe(() => {
      this._drawsService.strokeRect(
        x, 
        this._gameboardConfig.y, 
        this._gameboardConfig.width, 
        height);
      x += this._gameboardConfig.width;
    });
  }

  private drawRows(): void {
    const width = this._gameboardConfig.width * this._gameboardConfig.cols;
    let height = this._gameboardConfig.width;
    this.rowsObservable.subscribe(() => {
      this._drawsService.strokeRect(
        this._gameboardConfig.x, 
        this._gameboardConfig.y, 
        width, 
        height);
      height += this._gameboardConfig.width;
    });
  }

  private addLetterByPosition(index: string, column: number, row: number): void {
    this._gameboardConfig.lettersByPosition[index] = {
      x: column,
      y: row
    };
  }

  private drawLettersPlaceholder(): void {
    this.drawRows();
    this.drawCols();
    this.setLettersPlaceholder();
  }

  private setLettersPlaceholder(): void {
    this._drawsService.setFontStyle(this._gameboardConfig.width / 3 + 'px Arial');
    const startX = this._gameboardConfig.width / 2;
    const startY = this._gameboardConfig.y * 2 + this._gameboardConfig.width / 2;
    let x;
    let y;

    this.rowsObservable.pipe(
      mergeMap(i => this.columnsObservable.pipe(
        map(j => [i, j])
      )),
      tap(pair => {
        const row = pair[0];
        const col = pair[1];
        if (col === 0) {
          x = startX;
          y = (row === 0) ? startY : y + this._gameboardConfig.width;
        } else {
          x += this._gameboardConfig.width;
        }
      })
    ).
    subscribe(pair => {
      const row = pair[0];
      const col = pair[1];
      const letter = (this._gameboardConfig.letters[row][col] != null) ? this._gameboardConfig.letters[row][col] : '';
      this._drawsService.fillText(letter, x, y);
      const index = row + ',' + col;
      this.addLetterByPosition(index, x, y);
    });
  }

  public translate(nextWord: string[]): string {
    const word = nextWord.reduce((accumulator, currentValue) => {
      const separatorPos = currentValue.indexOf(',');
      if (separatorPos !== -1) {
        const row = +currentValue.substr(0, separatorPos);
        const col = +currentValue.substr(separatorPos + 1);
        accumulator += this._gameboardConfig.letters[row][col];
      }
      return accumulator;
    }, '');

    return word;
  }
}
