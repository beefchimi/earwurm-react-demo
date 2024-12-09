import {afterEach, beforeEach} from 'vitest';
import {cleanup} from '@testing-library/react';

import '@testing-library/jest-dom/vitest';

beforeEach(() => {
  // vi.useFakeTimers();
});

afterEach(() => {
  // vi.clearAllTimers();
  // vi.useRealTimers();
  cleanup();
});
