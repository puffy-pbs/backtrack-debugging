import { TestBed } from '@angular/core/testing';

import { GameboardDrawService } from './gameboard-draw.service';

describe('GameboardDrawService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GameboardDrawService = TestBed.get(GameboardDrawService);
    expect(service).toBeTruthy();
  });
});
