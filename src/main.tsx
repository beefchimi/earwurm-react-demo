import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {RouterProvider, createRouter} from '@tanstack/react-router';

// Internal styles
import './styles/reset.css';
import './styles/fonts.css';
import './styles/media-queries.css';
import './styles/design-system.css';
import './styles/keyframes.css';
import './styles/global.css';
import './styles/utility.css';

import {routeTree} from './routeTree.gen';

const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
});

// TODO: Can this be in a dedicated `*.d.ts` file?
// I think it is required to be declared AFTER `createRouter`.
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

createRoot(document.getElementById('ReactRoot')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
