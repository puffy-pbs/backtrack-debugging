import { TestBed } from '@angular/core/testing';

import { CustomSolutionService } from './custom-solution.service';

describe('CustomSolutionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CustomSolutionService = TestBed.get(CustomSolutionService);
    expect(service).toBeTruthy();
  });
});
