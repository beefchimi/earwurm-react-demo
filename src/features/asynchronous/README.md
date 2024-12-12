# Async

```tsx
function Component() {
  const [queueRequested, setQueueRequested] = useState<string[]>();
  const [maxReached, setMaxReached] = useState(false);

  async function handlePreload() {
    if (!stack) return;

    const loaded = loadedStacks.includes(stackId);

    if (!loaded) {
      setLoadingState('pending');
      await sleep(1000);
    }

    const sound = await stack.prepare();
    sound.stop();

    setLoadingState('ready');
  }

  function handleQueueSound() {
    if (!stack || maxReached) return;

    if (loadingState === 'pending' && stack.keys.length === 0)
      stack
        .prepare()
        .then((sound) => console.log('Sound added to queue', sound.id))
        .catch(console.error);
  }

  const handlePlaySound = useCallback(
    (stackKeys) => {
      for (const key of stackKeys) {
        const queuedSound = stack.get(stackKeys);
        if (queuedSound.state !== playing) queuedSound.play();
      }
    },
    [stack],
  );

  useEffect(() => {
    stack?.on('queue', handlePlaySound);
    return () => stack?.off('queue', handlePlaySound);
  }, [handlePlaySound]);

  return (
    <section className={clx('main-section', styles.Asynchronous)}>
      <Text>
        Since fetching and decoding audio can take time, you may want to preload
        some of your sound effects in order to mitigate UI delays.
      </Text>

      <button
        onClick={handleQueueSound}
        onFocus={}
        onPointerEnter={
          loadingState === 'unavailable' ? handlePreload : undefined
        }
      >
        Play
      </button>
    </section>
  );
}
```
