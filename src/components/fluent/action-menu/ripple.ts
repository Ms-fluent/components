export class MsRipple {
  constructor(private event: MouseEvent) {
  }

  get element(): HTMLElement {
    return this.event.currentTarget as HTMLElement;
  }

  async attach() {
    const circle = document.createElement('span');
    const diameter = Math.max(this.element.clientWidth, this.element.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${this.event.clientX - (this.element.offsetLeft + radius)}px`;
    circle.style.top = `${this.event.clientY - (this.element.offsetTop + radius)}px`;
    circle.classList.add('ms-ripple');
    this.element.appendChild(circle);

    await this._animate(circle);
    circle.remove();
  }

  private _animate(ripple: HTMLSpanElement): Promise<void> {
    return new Promise<void>(resolve => {
      ripple.animate([
        {'transform': 'scale(0)', 'opacity': '1'},
        {'transform': 'scale(4)', 'opacity': '0'},
      ], {fill: 'both', duration: 600}).onfinish = () => resolve();

    });
  }

}
