import styles from './Asynchronous.module.css';

type SoundLoadedState = 'unavailable' | 'pending' | 'ready';

function getLoadedLabel(status?: SoundLoadedState) {
  switch (status) {
    case 'unavailable':
      return 'This Sound has not yet been loaded.';
    case 'pending':
      return 'Sound loading…';
    case 'ready':
      return 'Sound is ready to play!';
    default:
      return 'No Sound has been selected.';
  }
}

export function Asynchronous() {
  return (
    <div className={styles.Asynchronous}>
      <p>Asynchronous</p>
      <p>{getLoadedLabel()}</p>
    </div>
  );
}
