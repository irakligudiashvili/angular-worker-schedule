import { Directive, ElementRef, Renderer2 } from '@angular/core';
import { elementAt } from 'rxjs';

@Directive({
  standalone: false,
  selector: '[appSetBackground]'
})
export class SetBackgroundDirective {

  constructor(private element: ElementRef, private renderer: Renderer2) { 
    element.nativeElement.style.backgroundColor = 'yellow';
    element.nativeElement.style.color = 'black';
    // this.renderer.setStyle(this.element.nativeElement,'backgroundColor', 'yellow');
    // this.renderer.setStyle(this.element.nativeElement,'color','black');
    // this.renderer.setAttribute(this.element.nativeElement, 'title', 'example title');
  }

}
