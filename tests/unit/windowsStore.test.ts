import { beforeEach, describe, expect, it } from 'vitest';
import {
  createInitialWindowsState,
  getDefaultWindowBounds,
  useWindowsStore,
} from '@/stores/windowsStore';

function resetWindowsStore() {
  useWindowsStore.setState({
    viewport: { width: 1440, height: 900 },
    activeAppId: 'finder',
    activeZIndex: -2,
    windows: createInitialWindowsState(),
  });
}

describe('windowsStore', () => {
  beforeEach(() => {
    resetWindowsStore();
  });

  it('opens an app with centered default bounds and focuses it', () => {
    useWindowsStore.getState().openApp('calendar');

    const state = useWindowsStore.getState();

    expect(state.activeAppId).toBe('calendar');
    expect(state.windows.calendar.open).toBe(true);
    expect(state.windows.calendar.bounds).toEqual(
      getDefaultWindowBounds('calendar', state.viewport),
    );
  });

  it('raises z-index when focusing an already-open app', () => {
    useWindowsStore.getState().openApp('calendar');
    const firstZIndex = useWindowsStore.getState().windows.calendar.zIndex;

    useWindowsStore.getState().openApp('wallpapers');
    useWindowsStore.getState().focusApp('calendar');

    const state = useWindowsStore.getState();

    expect(state.activeAppId).toBe('calendar');
    expect(state.windows.calendar.zIndex).toBeGreaterThan(firstZIndex);
    expect(state.windows.calendar.zIndex).toBeGreaterThan(state.windows.wallpapers.zIndex);
  });

  it('toggles fullscreen and restores the previous bounds', () => {
    useWindowsStore.getState().openApp('finder');
    const originalBounds = useWindowsStore.getState().windows.finder.bounds;

    useWindowsStore.getState().toggleFullscreen('finder');

    let state = useWindowsStore.getState();
    expect(state.windows.finder.fullscreen).toBe(true);
    expect(state.windows.finder.previousBounds).toEqual(originalBounds);
    expect(state.windows.finder.bounds).toEqual({
      x: 0,
      y: 30,
      width: 1440,
      height: 870,
    });

    useWindowsStore.getState().toggleFullscreen('finder');
    state = useWindowsStore.getState();

    expect(state.windows.finder.fullscreen).toBe(false);
    expect(state.windows.finder.bounds).toEqual(originalBounds);
  });
});
