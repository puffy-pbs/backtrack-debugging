import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'bd-animation-velocity',
  templateUrl: './animation-velocity.component.html',
  styleUrls: ['./animation-velocity.component.scss'],
})
export class AnimationVelocityComponent implements OnInit {
 @Input() public speed: string;

 ngOnInit() {
   this.speed = '1';
 }

}
