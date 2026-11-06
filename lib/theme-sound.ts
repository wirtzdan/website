// Light-switch click for the theme toggle, played through Web Audio.
//
// Browsers only let an AudioContext start (or resume) during a user gesture, so
// `primeThemeSound` and `playThemeSound` must be called synchronously from the
// pointer/click handler. The buffer may still be decoding on the very first
// click; the source is started as soon as it is ready, which is allowed because
// the context was already unlocked inside the gesture.

const SOUND_URL = "/lightswitch.mp3";
const VOLUME = 0.05;

// [offset, duration] in seconds within lightswitch.mp3.
const SPRITES = {
  on: [0, 0.3],
  off: [0.5, 0.3],
} as const;

export type ThemeSound = keyof typeof SPRITES;

type AudioContextConstructor = typeof AudioContext;

let context: AudioContext | null = null;
let buffer: Promise<AudioBuffer | null> | null = null;

const getContext = () => {
  if (context) return context;
  if (typeof window === "undefined") return null;
  const Ctor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: AudioContextConstructor }).webkitAudioContext;
  if (!Ctor) return null;
  context = new Ctor();
  return context;
};

const loadBuffer = (ctx: AudioContext) => {
  buffer ??= fetch(SOUND_URL)
    .then((response) => {
      if (!response.ok) throw new Error(`${SOUND_URL} responded ${response.status}`);
      return response.arrayBuffer();
    })
    .then((data) => ctx.decodeAudioData(data))
    .catch((error: unknown) => {
      // Allow a later click to retry, e.g. after a flaky connection.
      buffer = null;
      console.warn("Theme toggle sound failed to load", error);
      return null;
    });
  return buffer;
};

/** Unlock the audio context and start loading the sound. Call from a user gesture. */
export const primeThemeSound = () => {
  const ctx = getContext();
  if (!ctx) return null;
  // Safari reports "interrupted" after a call or when the tab was backgrounded.
  if (ctx.state !== "running") void ctx.resume().catch(() => {});
  return loadBuffer(ctx);
};

/** Play one half of the light-switch sound. Call from a user gesture. */
export const playThemeSound = (sound: ThemeSound) => {
  const pending = primeThemeSound();
  const ctx = context;
  if (!pending || !ctx) return;
  void pending.then((decoded) => {
    if (!decoded) return;
    const source = ctx.createBufferSource();
    const gain = ctx.createGain();
    gain.gain.value = VOLUME;
    source.buffer = decoded;
    source.connect(gain).connect(ctx.destination);
    const [offset, duration] = SPRITES[sound];
    source.start(0, offset, duration);
  });
};
