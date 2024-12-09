import {lazy} from 'react';

// Avoid rendering in `production`, and lazy load in `development`.
export const RouterDevTools =
  process.env.NODE_ENV === 'production'
    ? () => null
    : lazy(() =>
        import('@tanstack/router-devtools').then((res) => ({
          default: res.TanStackRouterDevtools,

          // For Embedded Mode
          // default: res.TanStackRouterDevtoolsPanel
        })),
      );
