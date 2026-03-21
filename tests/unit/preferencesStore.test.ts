import { beforeEach, describe, expect, it } from 'vitest';
import {
  createDefaultPreferencesState,
  usePreferencesStore,
} from '@/stores/preferencesStore';

function resetPreferencesStore() {
  localStorage.clear();
  usePreferencesStore.setState(createDefaultPreferencesState());
}

describe('preferencesStore', () => {
  beforeEach(() => {
    resetPreferencesStore();
  });

  it('persists preference changes to localStorage', () => {
    usePreferencesStore.getState().setThemeScheme('dark');
    usePreferencesStore.getState().setShouldShowNotch(true);

    const persisted = JSON.parse(localStorage.getItem('macos:preferences') ?? '{}');

    expect(persisted.state.theme.scheme).toBe('dark');
    expect(persisted.state.shouldShowNotch).toBe(true);
  });

  it('syncs wallpaper-controlled theme updates from the schedule', () => {
    usePreferencesStore.getState().selectWallpaper('ventura');
    usePreferencesStore.getState().setWallpaperThemeControl(true);
    usePreferencesStore.getState().syncWallpaperSchedule(new Date('2026-03-21T19:00:00'));

    const state = usePreferencesStore.getState();

    expect(state.wallpaper.image).toBeTruthy();
    expect(state.theme.scheme).toBe('dark');
  });
});
