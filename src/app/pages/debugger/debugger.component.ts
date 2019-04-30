import { Component, Input, ElementRef } from '@angular/core';
import { DebuggerData } from '../../@core/models/debugger-data';

@Component({
  selector: 'bd-debugger',
  templateUrl: './debugger.component.html',
  styleUrls: ['./debugger.component.scss']
})
export class DebuggerComponent {
  @Input() public debugData: DebuggerData[] = [];
  public currentValue: DebuggerData = null;

  public constructor(private el: ElementRef) { }

  public pushToDebugData(value: DebuggerData): void {
    this.debugData.push(value);
    this.currentValue = value;
  }

  public downScrollControl(): void {
    const list = this.el.nativeElement.querySelector('nb-card-body');
    list.scrollTop = list.scrollHeight;
  }
}
