# Earwurm React Demo

This repo serves as a collection of examples for using [`Earwurm`](https://github.com/beefchimi/earwurm) in a React application.

## Common Web Audio usage

Without `Earwurm`, you would likely use the `Web Audio API` like so:

```ts
const SOUND_ASSET =
  'https://beefchimi.github.io/earwurm/assets/track-6-C4QVW55v.webm';

// Re-usable async function for fetching + decoding audio.
async function fetchAudioBuffer(context: AudioContext, path = '') {
  const audioRequest = new Request(path);

  return fetch(audioRequest)
    .then(async (response) => response.arrayBuffer())
    .then(async (arrayBuffer) => context.decodeAudioData(arrayBuffer));
}

// Re-usable play function
async function playSound(context: AudioContext, gainNode: GainNode, path = '') {
  // Create the single-use buffer source.
  const source = context.createBufferSource();

  // Connect the source to the gain node, which should already
  // be connected to the context output device.
  source.connect(gainNode);

  // Fetch the audio we want to use.
  // If we are not worried about performance, we could
  // cache this buffer and avoid repeat fetch/decode operations.
  const fetchedBuffer = await fetchAudioBuffer(context, path);

  // Assign the audio to the source buffer.
  source.buffer = fetchedBuffer;

  // Play this single-use sound.
  return source.start();
}

// Create the re-usable context and gain node.
const context = new AudioContext();
const gainNode = context.createGain();

// Connect the gain node to the output device.
gainNode.connect(context.destination);

// Optionally reduce volume just to err on the side of caution.
gainNode.gain.setValueAtTime(0.5, context.currentTime);

// This can only be invokved via a user interaction,
// but can be called repeatedly to create and play new sounds.
playSound(context, gainNode, SOUND_ASSET);
```

## Web Audio oscillator

Perhaps you want to use the `Web Audio API` to create your own sounds! If so, you will need to use the `Web Audio API` directly, as `Earwurm` does not currently support oscillators.

```ts
// Create the re-usable context and gain node.
const context = new AudioContext();
const gainNode = context.createGain();

// Create the single-use oscillator
const oscillator = context.createOscillator();
const minHertz = 440;
const maxHertz = 666;

// Timing values
const stepSec = 1;
const durationSec = stepSec * 4;
const startTime = context.currentTime;
const midTime = context.currentTime + stepSec;
const endTime = midTime + stepSec;

// Configure the oscillator
oscillator.type = 'square';
oscillator.frequency.setValueAtTime(minHertz, startTime);

// Connect the oscillator and begin playing
oscillator.connect(gainNode).connect(context.destination);
oscillator.start();

// Bend the note up
oscillator.frequency.exponentialRampToValueAtTime(maxHertz, midTime);

// Bend the note down
setTimeout(() => {
  oscillator.frequency
    .cancelScheduledValues(midTime)
    .setValueAtTime(maxHertz, midTime)
    .exponentialRampToValueAtTime(minHertz, endTime);
}, stepSec * 1000);

// Fade out the volume
gainNode.gain
  .setValueAtTime(1, midTime)
  .exponentialRampToValueAtTime(0.01, startTime + durationSec);

setTimeout(() => {
  oscillator.stop();
}, durationSec * 1000);
```
