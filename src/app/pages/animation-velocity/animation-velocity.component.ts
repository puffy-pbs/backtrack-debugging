import { Component, Input } from '@angular/core';

@Component({
  selector: 'bd-animation-velocity',
  templateUrl: './animation-velocity.component.html',
  styleUrls: ['./animation-velocity.component.scss'],
})
export class AnimationVelocityComponent {
 @Input() public speed: string = '1';
}
