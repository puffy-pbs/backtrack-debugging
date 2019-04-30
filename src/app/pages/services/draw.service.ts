import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DrawService {

  public constructor(
    protected context: CanvasRenderingContext2D) {
  }

  public setFontStyle(fontStyle: string): void {
    this.context.font = fontStyle;
  }

  public setFillStyle(fillStyle: string): void {
    this.context.fillStyle = fillStyle;
  }

  public fillText(text: string, x: number, y: number): void {
    this.context.fillText(text, x, y);
  }

  public strokeRect(x: number, y: number, width: number, height: number): void {
    this.context.strokeRect(x, y, width, height);
  }
}
