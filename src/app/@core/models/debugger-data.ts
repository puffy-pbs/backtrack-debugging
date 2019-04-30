export class DebuggerData {
  public row: number;
  public col: number;
  public value: any;

  public constructor(row: number, col: number, value: any) {
    this.row = row;
    this.col = col;
    this.value = value;
  }
}
