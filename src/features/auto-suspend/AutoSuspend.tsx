import styles from './AutoSuspend.module.css';

/*
const suspendAfterMs = 30000;
let suspendId = 0;

function autoSuspend() {
  manager.suspend();
  suspendId = 0;
}

manager.on('play', (active) => {
  clearTimeout(suspendId);
  suspendId = 0;

  if (active) return;

  suspendId = setTimeout(autoSuspend, suspendAfterMs);
});
*/

export function AutoSuspend() {
  return (
    <div className={styles.AutoSuspend}>
      <p>AutoSuspend</p>
    </div>
  );
}
