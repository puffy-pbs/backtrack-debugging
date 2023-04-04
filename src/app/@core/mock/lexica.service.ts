import { Injectable } from '@angular/core';
import { LexicaData } from '../data/lexica';

@Injectable()
export class LexicaService extends LexicaData {
  getData() {
    return [
      ['N', 'F', 'T', 'P'],
      ['S', 'E', 'G', 'M'],
      ['O', 'Y', 'U', 'D'],
      ['T', 'I', 'I', 'H'],
    ];
  }
}
