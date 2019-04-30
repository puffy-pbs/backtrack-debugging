import { TestBed } from '@angular/core/testing';

import { ArrayDiffService } from './array-diff.service';

describe('ArrayDiffService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ArrayDiffService = TestBed.get(ArrayDiffService);
    expect(service).toBeTruthy();
  });
});
