export class MsMotionKeyFrames {
  static fadeIn: Keyframe[] = [
    {opacity: 0},
    {opacity: 1}
  ];

  static fadeOut: Keyframe[] = [
    {opacity: 1},
    {opacity: 0}
  ];

  static scaleDownIn: Keyframe[] = [
    {transform: 'scale3d(1.15, 1.15, 1)'},
    {transform: 'scale3d(1, 1, 1)'}
  ];

  static scaleDownOut: Keyframe[] = [
    {transform: 'scale3d(1, 1, 1)'},
    {transform: 'scale3d(0.9, 0.9, 1)'}
  ];

  static slideLeftOut: Keyframe[] = [
    {transform: 'translate3d(0, 0, 0)'},
    {transform: 'translate3d(-48px, 0, 0)'}
  ];

  static slideLeftIn: Keyframe[] = [
    {transform: 'translate3d(0, 0, 0)'},
    {transform: 'translate3d(48px, 0, 0)'}
  ];

  static slideRightIn: Keyframe[] = [
    {transform: 'translate3d(-48px, 0, 0)'},
    {transform: 'translate3d(0px, 0, 0)'}
  ];

  static slideUpOut: Keyframe[] = [
    {transform: 'translate3d(0, 0, 0)'},
    {transform: 'translate3d(0, -48px, 0)'}
  ];

  static slideDownOut: Keyframe[] = [
    {transform: 'translate3d(0, 0, 0)'},
    {transform: 'translate3d(0, 48px, 0)'}
  ];

  static slideUpIn: Keyframe[] = [
    {transform: 'translate3d(0, 48px, 0)'},
    {transform: 'translate3d(0, 0, 0)'}
  ];

  static slideDownIn: Keyframe[] = [
    {transform: 'translate3d(0, -48px, 0)'},
    {transform: 'translate3d(0px, 0, 0)'}
  ];

  static getSlideInFromDir(dir: 'top' | 'left' | 'bottom' | 'right') {
    if (dir === 'left') {
      return MsMotionKeyFrames.slideLeftIn;
    }
    if (dir === 'right') {
      return MsMotionKeyFrames.slideRightIn;
    }
    if (dir === 'top') {
      return MsMotionKeyFrames.slideUpIn;
    }
    if (dir === 'bottom') {
      return MsMotionKeyFrames.slideDownOut;
    }
  }
}
