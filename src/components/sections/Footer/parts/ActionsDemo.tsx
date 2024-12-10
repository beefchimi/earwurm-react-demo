import {type ReactNode} from 'react';

import {useTheme} from '@src/providers/ThemeProvider.tsx';
import {Button} from '@src/components/ui/Button/Button.tsx';
import styles from './ActionsDemo.module.css';

export interface ActionsDemoProps {
  children?: ReactNode;
}

export function ActionsDemo({children}: ActionsDemoProps) {
  const {toggleTheme} = useTheme();

  return (
    <div className={styles.ActionsDemo}>
      <div className={styles.Actions}>
        <Button
          label="Toggle Theme"
          ariaLabel="Switch between light / dark mode"
          size="small"
          variant="primary"
          outline
          onClick={toggleTheme}
        />

        <Button
          label="GitHub"
          ariaLabel="Open a YouTube overlay"
          size="small"
          variant="primary"
          outline
          external
          url="https://github.com/beefchimi/earwurm"
        />
      </div>

      {children}
    </div>
  );
}
