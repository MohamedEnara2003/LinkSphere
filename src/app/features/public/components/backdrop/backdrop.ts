import { Component, ChangeDetectionStrategy, output } from '@angular/core';


@Component({
selector: 'app-backdrop',
template: `
    <div 
    (click)="onClick()"
    aria-label="backdrop" 
    role="presentation"
    class="size-full bg-dark/50 fixed inset-0 z-40">
    </div>
`,
})
export class Backdrop{ 
    close = output<void>()
    public onClick() {
    this.close.emit();
    }

}