import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ArrayDiffService {
  private getDiff(arr1: any[], arr2: any[]): any[] {
    if (!arr2.length) {
      return arr1;
    }

    let arr = [];
    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) {
        arr = arr1.slice(i);
        break;
      }
    }

    return arr;
  }

  public arrayDifference(arr1: any[], arr2: any[]): any[] {
    const diff = this.getDiff(arr1, arr2);
    return diff;
  }

  public chunk(arr: number[], size: number): any[] {
    if (!arr.length || Array.isArray(arr[0])) {
      return arr;
    }

    let pos = 0;
    let resultArr = Array(Math.floor(arr.length / size));
    resultArr[pos] = [];
    for (let i = 0; i < arr.length; i++) {
      if (i > 0 && i % size === 0) {
        pos++;
        resultArr[pos] = [];
      }
      resultArr[pos].push(arr[i]);
    }

    return resultArr;
  }
  
}
