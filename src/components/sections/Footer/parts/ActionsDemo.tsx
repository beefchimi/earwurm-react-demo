import {useState, type ReactNode} from 'react';

import {Portal} from '@src/components/primitives/Portal.tsx';
import {Overlay} from '@src/components/primitives/Overlay/Overlay.tsx';
import {YouTubeEmbed} from '@src/components/primitives/YouTubeEmbed/YouTubeEmbed.tsx';
import {useTheme} from '@src/providers/ThemeProvider.tsx';

import {Button} from '@src/components/ui/Button/Button.tsx';

import styles from './ActionsDemo.module.css';

export interface ActionsDemoProps {
  children?: ReactNode;
}

export function ActionsDemo({children}: ActionsDemoProps) {
  const {toggleTheme} = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.ActionsDemo}>
      <div className={styles.Actions}>
        <Button
          label="Toggle Theme"
          ariaLabel="Switch between light / dark mode"
          size="small"
          variant="tertiary"
          outline
          onClick={toggleTheme}
        />

        <Button
          label="Watch YouTube"
          ariaLabel="Open a YouTube overlay"
          size="small"
          variant="tertiary"
          outline
          onClick={() => setOpen(true)}
        />
      </div>

      <Portal>
        <Overlay open={open} onClose={() => setOpen(false)}>
          <YouTubeEmbed videoId="430mSjFYHI0" autoPlay allowFullscreen />
        </Overlay>
      </Portal>

      {children}
    </div>
  );
}
