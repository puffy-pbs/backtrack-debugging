import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomSolutionComponent } from './custom-solution.component';

describe('CustomSolutionComponent', () => {
  let component: CustomSolutionComponent;
  let fixture: ComponentFixture<CustomSolutionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomSolutionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomSolutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
