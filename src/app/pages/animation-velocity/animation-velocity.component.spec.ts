import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimationVelocityComponent } from './animation-velocity.component';

describe('AnimationVelocityComponent', () => {
  let component: AnimationVelocityComponent;
  let fixture: ComponentFixture<AnimationVelocityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnimationVelocityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnimationVelocityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
