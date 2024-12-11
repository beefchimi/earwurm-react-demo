import {useCallback, useEffect, useState} from 'react';
import {type ManagerEventMap, type Sound} from 'earwurm';

import {earwurmManager, type AudioLibKey} from '@src/store/earwurm.ts';

export function useSequence() {
  const [queue, setQueue] = useState<Sound[]>([]);

  // `playing` represents the state of the Earwurm instance, which
  // will toggle back-and-forth as sounds are sequenced.
  // `sequencing` represents the "sequence of sounds" that are
  // queued to be played. We move between sounds by reacting to
  // the `playing` state as it changes.
  const [playing, setPlaying] = useState(earwurmManager.playing);
  const [sequencing, setSequencing] = useState(false);

  const soundInSequence = useCallback(
    (id: AudioLibKey) => queue.some((sound) => sound.id.startsWith(id)),
    [queue],
  );

  const addToSequence = useCallback((id: AudioLibKey) => {
    const stack = earwurmManager.get(id);

    stack
      ?.prepare()
      .then((sound) => setQueue((prev) => [...prev, sound]))
      .catch(console.error);
  }, []);

  const playSequence = useCallback(() => setSequencing(true), []);

  const handlePlayChange: ManagerEventMap['play'] = useCallback((active) => {
    setPlaying(active);
  }, []);

  useEffect(() => {
    if (!playing) {
      setQueue((current) => current.slice(1));
    }
  }, [playing]);

  useEffect(() => {
    if (sequencing && queue.length) {
      queue[0].play();
    }

    if (sequencing && !queue.length) {
      setSequencing(false);
    }
  }, [sequencing, queue]);

  useEffect(() => {
    // NOTE: This technique of listening to the `play` event works
    // because we are only using Earwurm to play the sounds from this page.
    // If that were not the case (Earwurm could be actively playing audio from
    // an unreleated UI), then we would probably hook in to either the Stack
    // or Sound `state` events.
    earwurmManager.on('play', handlePlayChange);
    return () => earwurmManager.off('play', handlePlayChange);
  }, [handlePlayChange]);

  /*
  Alternative to the above useEffect:

  const handleTrackEnded: SoundEndedEvent = (id) => {
    setEndedTracker((current) => current.filter((item) => item !== id));
  };

  useEffect(() => {
    for (const sound of queue) {
      if (endedTracker.includes(sound.id)) return;

      sound.on('ended', handleTrackEnded);
      setEndedTracker((current) => arrayDedupe(current, [sound.id]));
    }

    return () => {
      for (const sound of queue) {
        sound.off('ended', handleTrackEnded);
      }
    };
  }, [queue]);
  */

  return {
    // State values
    playing,
    sequencing,
    queue,
    // Handlers
    soundInSequence,
    addToSequence,
    playSequence,
  };
}
