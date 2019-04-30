import { TestBed } from '@angular/core/testing';

import { DrawSquareService } from './draw-square.service';

describe('DrawSquareService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DrawSquareService = TestBed.get(DrawSquareService);
    expect(service).toBeTruthy();
  });
});
