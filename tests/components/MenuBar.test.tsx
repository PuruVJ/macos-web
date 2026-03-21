import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { MenuBar } from '@/components/topbar/MenuBar';
import { useMenuBarStore } from '@/stores/menuBarStore';
import { createInitialWindowsState, useWindowsStore } from '@/stores/windowsStore';

function resetStores() {
  useMenuBarStore.setState({
    activeMenu: '',
    menus: useMenuBarStore.getState().menus,
  });
  useWindowsStore.setState({
    viewport: { width: 1440, height: 900 },
    activeAppId: 'finder',
    activeZIndex: -2,
    windows: createInitialWindowsState(),
  });
}

describe('MenuBar', () => {
  beforeEach(() => {
    resetStores();
  });

  it('opens menus and routes preference actions into the desktop state', () => {
    render(<MenuBar />);

    fireEvent.click(screen.getByRole('button', { name: 'OS' }));
    fireEvent.click(screen.getByRole('button', { name: 'System Preferences...' }));

    const windows = useWindowsStore.getState().windows;
    expect(windows.wallpapers.open).toBe(true);
    expect(useMenuBarStore.getState().activeMenu).toBe('');
  });
});
