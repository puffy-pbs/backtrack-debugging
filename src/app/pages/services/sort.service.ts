import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SortService {
  private getParams(a: string, b: string) {
    const first = a.split(',');
    const aRow = +first[0];
    const aCol = +first[1];
    const second = b.split(',');
    const bRow = +second[0];
    const bCol = +second[1];

    return {
      a: {
        row: aRow,
        col: aCol
      },
      b: {
        row: bRow,
        col: bCol
      }
    };
  }

  public arrayDifferenceNumberValues(diff: number[], dir: string = 'asc'): number[] {
    const sortingFunction = (dir === 'asc') ? (a, b) => a - b : (a, b) => b - a;
    return diff.sort(sortingFunction);
  }

  public arrayDifferenceStringValues(diff: string[], dir = 'asc'): string[] {
    const sortingFunction = (dir === 'asc') ? (a: string, b: string) => {
      const params = this.getParams(a, b);
      if (params.a.row === params.b.row) {
        return (params.a.col === params.b.col) ? 0 : (params.a.col > params.b.col ? 1 : -1);
      } else if (params.a.row > params.b.row) {
        return 1;
      } else if (params.a.row < params.b.row) {
        return -1;
      }
      return 0;
    } : (a: string, b: string) => {
      const params = this.getParams(a, b);
      if (params.a.row === params.b.row) {
        return (params.a.col === params.b.col) ? 0 : (params.b.col > params.a.col ? 1 : -1);
      } else if (params.b.row > params.a.row) {
        return 1;
      } else if (params.b.row < params.a.row) {
        return -1;
      }
      return 0;
    };
    return diff.sort(sortingFunction);
  }

}
