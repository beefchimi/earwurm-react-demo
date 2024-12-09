import {assertNumber, supportDom} from 'beeftools';

import type {
  ScrollbarWidth,
  ScrollbarWidthDualAxis,
  DefaultScrollLockOptions,
  ScrollLockCapturedProperties,
  OptionalScrollTarget,
  RequiredScrollTarget,
} from './types.ts';

type TargetPadding = 'padding-right' | 'padding-bottom';

interface CapturedPropertiesCriteria {
  target: RequiredScrollTarget;
  scrollAxis: DefaultScrollLockOptions['scrollAxis'];
  scrollbarWidth: ScrollbarWidth;
}

function getTargetPadding(
  target: RequiredScrollTarget,
  padding: TargetPadding,
) {
  return supportDom()
    ? parseInt(window.getComputedStyle(target).getPropertyValue(padding), 10)
    : 0;
}

function getCapturedProperties({
  target,
  scrollAxis,
  scrollbarWidth,
}: CapturedPropertiesCriteria) {
  const verticalWidth = assertNumber(scrollbarWidth)
    ? scrollbarWidth
    : scrollbarWidth.vertical;

  const horizontalWidth = assertNumber(scrollbarWidth)
    ? scrollbarWidth
    : scrollbarWidth.horizontal;

  const captured: ScrollLockCapturedProperties = {
    scrollbarWidth: {
      vertical: verticalWidth,
      horizontal: horizontalWidth,
    },
  };

  // If there is no vertical or horizontal scrollbar,
  // we don't need to bother detecting and applying `padding`.

  if (verticalWidth === 0 && horizontalWidth === 0) {
    return captured;
  }

  if (scrollAxis === 'vertical' || scrollAxis === 'both') {
    captured.paddingRight = getTargetPadding(target, 'padding-right');
    captured.appliedPaddingRight = captured.paddingRight + verticalWidth;
  }

  if (scrollAxis === 'horizontal' || scrollAxis === 'both') {
    captured.paddingBottom = getTargetPadding(target, 'padding-bottom');
    captured.appliedPaddingBottom = captured.paddingBottom + horizontalWidth;
  }

  return captured;
}

export function assertScrollbarWidthDualAxis(
  value: ScrollbarWidth,
): value is ScrollbarWidthDualAxis {
  return (
    Object.prototype.hasOwnProperty.call(value, 'vertical') &&
    Object.prototype.hasOwnProperty.call(value, 'horizontal')
  );
}

///
/// Scrollbar measurements

export function guessScrollbarWidthVertical(target?: OptionalScrollTarget) {
  if (!supportDom()) return 0;

  // `target` measurements do not account for `border` styles.
  return target
    ? target.offsetWidth - target.clientWidth
    : window.innerWidth - document.documentElement.clientWidth;
}

export function guessScrollbarWidthHorizontal(target?: OptionalScrollTarget) {
  if (!supportDom()) return 0;

  // `target` measurements do not account for `border` styles.
  return target
    ? target.offsetHeight - target.clientHeight
    : window.innerHeight - document.documentElement.clientHeight;
}

///
/// DOM mutation (side-effects)

interface ResetScrollStylesCriteria {
  target: RequiredScrollTarget;
  overflow: string;
  paddingRight: string;
  paddingBottom: string;
}

export function applyScrollStyles({
  target,
  scrollAxis,
  scrollbarWidth,
}: CapturedPropertiesCriteria) {
  const captured = getCapturedProperties({target, scrollAxis, scrollbarWidth});
  const {appliedPaddingRight, appliedPaddingBottom} = captured;

  if (appliedPaddingRight) {
    target.style.paddingRight = `${appliedPaddingRight}px`;
  }

  if (appliedPaddingBottom) {
    target.style.paddingBottom = `${appliedPaddingBottom}px`;
  }

  target.style.overflow = 'hidden';

  return captured;
}

export function resetScrollStyles({
  target,
  overflow,
  paddingRight,
  paddingBottom,
}: ResetScrollStylesCriteria) {
  target.style.overflow = overflow;
  target.style.paddingRight = paddingRight;
  target.style.paddingBottom = paddingBottom;
}
