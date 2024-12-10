import {useStore} from '@tanstack/react-store';
import {Store} from '@tanstack/store';
import {Earwurm} from 'earwurm';

const earwurmManager = new Earwurm({transitions: true});
// earwurmManager.add(...AUDIO_LIB);

export const earwurmStore = new Store({
  // Not exposing the `manager`, as we want interaction
  // with its API to be done through the `useEarwurm` hook.
  // manager: earwurmManager,

  volume: earwurmManager.volume,
  mute: earwurmManager.mute,
  // unlocked: earwurmManager.unlocked,
});

export function useEarwurm(selector: 'volume' | 'mute') {
  return useStore(earwurmStore, (state) => state[selector]);
}

export function setVolume(level: number) {
  earwurmManager.volume = level;

  earwurmStore.setState((state) => {
    return {
      ...state,
      volume: earwurmManager.volume,
    };
  });
}

export function toggleMute() {
  earwurmManager.mute = !earwurmManager.mute;

  earwurmStore.setState((state) => {
    return {
      ...state,
      mute: earwurmManager.mute,
    };
  });
}

///
/// Earwurm events

/*
earwurmManager.on('library', (newKeys) => {
  activeStacksRef.current = filterSynthValues(newKeys);
});
*/
