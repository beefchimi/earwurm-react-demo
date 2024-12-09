import {Suspense} from 'react';
import {Outlet, createRootRoute} from '@tanstack/react-router';

import {RouterDevTools} from '@src/RouterDevTools.tsx';
import {BreakpointProvider} from '@src/providers/BreakpointProvider.tsx';
import {ThemeProvider} from '@src/providers/ThemeProvider.tsx';

import {Footer} from '@src/components/sections/Footer/Footer.tsx';
import {Header} from '@src/components/sections/Header/Header.tsx';
import {Main} from '@src/components/sections/Main/Main.tsx';

export const Route = createRootRoute({
  component: RootComponent,
});

function App() {
  return (
    <div className="GlobalApp">
      <Header />

      <Main>
        <Outlet />
      </Main>

      <Footer />

      <Suspense>
        <RouterDevTools position="bottom-right" />
      </Suspense>
    </div>
  );
}

function RootComponent() {
  return (
    <ThemeProvider>
      <BreakpointProvider>
        <App />
      </BreakpointProvider>
    </ThemeProvider>
  );
}
