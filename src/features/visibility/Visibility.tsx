import styles from './Visibility.module.css';

/*
document.addEventListener('visibilitychange', () => {
  // Pause all playing sounds when the device is interrupted.
  if (document.hidden && manager.state === 'interrupted') {
    activeStacksRef.value.forEach((stackId) => manager.get(stackId)?.pause());
  }
});
*/

export function Visibility() {
  return (
    <div className={styles.Visibility}>
      <p>Visibility</p>
    </div>
  );
}
