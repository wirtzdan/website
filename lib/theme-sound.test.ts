import { afterEach, beforeEach, expect, test, vi } from "vite-plus/test";

class FakeAudioContext {
  static instances: FakeAudioContext[] = [];
  state: AudioContextState | "interrupted" = "suspended";
  destination = {};
  resume = vi.fn(async () => {
    this.state = "running";
  });
  decodeAudioData = vi.fn(async () => ({ duration: 1.056 }));
  sources: { start: ReturnType<typeof vi.fn> }[] = [];
  gains: { gain: { value: number } }[] = [];

  constructor() {
    FakeAudioContext.instances.push(this);
  }

  createGain() {
    const node = { gain: { value: 1 }, connect: (next: unknown) => next };
    this.gains.push(node);
    return node;
  }

  createBufferSource() {
    const node = { buffer: null, start: vi.fn(), connect: (next: unknown) => next };
    this.sources.push(node);
    return node;
  }
}

const fetchMock = vi.fn();

const load = async () => {
  vi.resetModules();
  return import("./theme-sound");
};

const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

beforeEach(() => {
  FakeAudioContext.instances = [];
  fetchMock.mockReset();
  fetchMock.mockResolvedValue({ ok: true, arrayBuffer: async () => new ArrayBuffer(8) });
  vi.stubGlobal("window", { AudioContext: FakeAudioContext });
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

test("resumes the context synchronously and plays the requested sprite", async () => {
  const { playThemeSound } = await load();

  playThemeSound("off");
  const [ctx] = FakeAudioContext.instances;
  // resume() has to be called within the click, before any await.
  expect(ctx.resume).toHaveBeenCalledTimes(1);
  expect(fetchMock).toHaveBeenCalledWith("/lightswitch.mp3");

  await flush();
  expect(ctx.sources).toHaveLength(1);
  expect(ctx.sources[0].start).toHaveBeenCalledWith(0, 0.5, 0.3);
  expect(ctx.gains[0].gain.value).toBe(0.05);
});

test("reuses one context and one decoded buffer across clicks", async () => {
  const { playThemeSound, primeThemeSound } = await load();

  primeThemeSound();
  playThemeSound("on");
  playThemeSound("off");
  await flush();

  expect(FakeAudioContext.instances).toHaveLength(1);
  expect(fetchMock).toHaveBeenCalledTimes(1);
  const [ctx] = FakeAudioContext.instances;
  expect(ctx.decodeAudioData).toHaveBeenCalledTimes(1);
  expect(ctx.sources.map((source) => source.start.mock.calls[0])).toEqual([
    [0, 0, 0.3],
    [0, 0.5, 0.3],
  ]);
});

test("resumes a context Safari marked as interrupted", async () => {
  const { playThemeSound } = await load();
  playThemeSound("on");
  await flush();
  const [ctx] = FakeAudioContext.instances;
  ctx.state = "interrupted";

  playThemeSound("off");
  expect(ctx.resume).toHaveBeenCalledTimes(2);
});

test("a failed load stays silent and retries on the next click", async () => {
  const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
  fetchMock.mockResolvedValueOnce({ ok: false, status: 404 });
  const { playThemeSound } = await load();

  playThemeSound("on");
  await flush();
  const [ctx] = FakeAudioContext.instances;
  expect(ctx.sources).toHaveLength(0);
  expect(warn).toHaveBeenCalled();

  playThemeSound("on");
  await flush();
  expect(fetchMock).toHaveBeenCalledTimes(2);
  expect(ctx.sources).toHaveLength(1);
  warn.mockRestore();
});

test("does nothing when Web Audio is unavailable", async () => {
  vi.stubGlobal("window", {});
  const { playThemeSound } = await load();
  expect(() => playThemeSound("on")).not.toThrow();
  expect(fetchMock).not.toHaveBeenCalled();
});
