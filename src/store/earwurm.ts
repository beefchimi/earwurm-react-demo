import {Earwurm, type LibraryEntry} from 'earwurm';

export type AudioLibKey = (typeof AUDIO_LIB_KEYS)[number];

// Public files cannot be glob imported.
// const audioFiles = import.meta.glob('/assets/audio/*.webm?import');
export const AUDIO_LIB_KEYS = [
  'click',
  'coin',
  'confirm',
  'death',
  'droid',
  'droplet',
  'gong',
  'pop',
  'rip',
  'slap',
  'twist',
  'uncork',
  'water',
] as const;

const AUDIO_LIB: LibraryEntry[] = AUDIO_LIB_KEYS.map((id) => ({
  id,
  path: `/assets/audio/${id}.webm`,
}));

export const earwurmManager = new Earwurm({transitions: true});

// Adding everything here, but we could do this incrementally
// whenever a Sound is requested for the first time.
earwurmManager.add(...AUDIO_LIB);

export function assertSoundId(value = ''): value is AudioLibKey {
  return AUDIO_LIB_KEYS.includes(value as AudioLibKey);
}
