import { Injectable } from '@angular/core';
import { DrawService } from './draw.service';

@Injectable({
  providedIn: 'root'
})
export class DrawSquareService extends DrawService {
  public constructor(context) {
    super(context);
  }

  public highlightSquare(font: string, style: string, text: string, x: number, y: number): void {
    this.setFontStyle(font);
    this.setFillStyle(style);
    this.fillText(text, x, y);
  }
}
