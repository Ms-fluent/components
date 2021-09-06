import {
  MS_MOTION_SLIDE_LTR_IN,
  MS_MOTION_SLIDE_LTR_OUT,
  MS_MOTION_SLIDE_RTL_IN,
  MS_MOTION_SLIDE_RTL_OUT,
  MsMotionSlideOptions
} from './animations-keyframe';

export class MsMotionFunction {
  static slideOut(host: HTMLElement, options: MsMotionSlideOptions): Promise<void> {
    const keyframes = options.dir === 'ltr' ? MS_MOTION_SLIDE_LTR_OUT : MS_MOTION_SLIDE_RTL_OUT;

    return new Promise<void>(resolve => {
      host.animate(keyframes, {duration: options.duration, delay: options.delay, easing: options.easing})
        .onfinish = () => {
        host.classList.add('ms-hidden');
        resolve();
      }
    });
  }

  public static slideIn(host: HTMLElement, options: MsMotionSlideOptions) {
    const keyframes = options.dir === 'ltr' ? MS_MOTION_SLIDE_LTR_IN : MS_MOTION_SLIDE_RTL_IN;

    return new Promise<void>(resolve => {
      host.animate(keyframes, {duration: options.duration, delay: options.delay, easing: options.easing})
        .onfinish = () => {
        host.classList.remove('ms-hidden');
        resolve();
      };
    });
  }
}
