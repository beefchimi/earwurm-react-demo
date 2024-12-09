export type ScrollAxis = 'vertical' | 'horizontal' | 'both';

export interface ScrollbarWidthDualAxis {
  vertical: number;
  horizontal: number;
}

export type ScrollbarWidth = ScrollbarWidthDualAxis | number;

export interface ScrollLockCapturedProperties {
  scrollbarWidth: ScrollbarWidthDualAxis;
  paddingRight?: number;
  appliedPaddingRight?: number;
  paddingBottom?: number;
  appliedPaddingBottom?: number;
}

export interface ScrollLockOptions {
  target?: HTMLElement | null;
  scrollAxis?: ScrollAxis;
  scrollbarOffset?: ScrollbarWidth;
  onLock?: (captured: ScrollLockCapturedProperties) => void;
  onUnlock?: () => void;
}

export interface DefaultScrollLockOptions extends ScrollLockOptions {
  scrollAxis: NonNullable<ScrollLockOptions['scrollAxis']>;
}

export type OptionalScrollTarget = ScrollLockOptions['target'];
export type RequiredScrollTarget = NonNullable<OptionalScrollTarget>;
