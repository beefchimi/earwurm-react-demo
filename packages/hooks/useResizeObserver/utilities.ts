import type {ResizeCamelBox, ResizeKebabBox} from './types.ts';

export function convertKebabToCamel(size?: ResizeKebabBox): ResizeCamelBox {
  switch (size) {
    case 'border-box':
      return 'borderBoxSize';
    case 'device-pixel-content-box':
      return 'devicePixelContentBoxSize';
    default:
      return 'contentBoxSize';
  }
}

export function extractSize(
  entry?: ResizeObserverEntry,
  box: ResizeCamelBox = 'borderBoxSize',
  sizeType: keyof ResizeObserverSize = 'inlineSize',
) {
  let size = 0;

  if (!entry || (!entry[box] && box !== 'contentBoxSize')) return size;

  if (box === 'contentBoxSize') {
    size = entry.contentRect[sizeType === 'inlineSize' ? 'width' : 'height'];
  }

  /* eslint-disable */
  if (Array.isArray(entry[box])) {
    const firstValue = entry[box][0];
    size = firstValue ? firstValue[sizeType] : 0;
  } else {
    // @ts-expect-error Support Firefox's non-standard behavior.
    const nonStandardValue = entry[box][sizeType] as number;
    size = nonStandardValue ?? 0;
  }
  /* eslint-enable */

  return Math.round(size);
}
