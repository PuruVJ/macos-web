import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AppWindow } from '@/components/windows/AppWindow';
import { createInitialWindowsState, useWindowsStore } from '@/stores/windowsStore';

vi.mock('@/components/apps', () => ({
  AppSurface: () => <div>Test App Surface</div>,
}));

vi.mock('react-rnd', () => ({
  Rnd: ({ children, ...props }: any) => <div {...props}>{children}</div>,
}));

function openFinderWindow() {
  const windows = createInitialWindowsState();
  windows.finder = {
    open: true,
    zIndex: 4,
    fullscreen: false,
    isDragging: false,
    bounds: {
      x: 40,
      y: 60,
      width: 860,
      height: 580,
    },
    previousBounds: null,
  };

  useWindowsStore.setState({
    viewport: { width: 1440, height: 900 },
    activeAppId: 'calendar',
    activeZIndex: 4,
    windows,
  });
}

describe('AppWindow', () => {
  beforeEach(() => {
    openFinderWindow();
  });

  it('focuses the window on pointer down', () => {
    render(<AppWindow appId="finder" />);

    fireEvent.mouseDown(screen.getByTestId('window-finder'));

    expect(useWindowsStore.getState().activeAppId).toBe('finder');
  });

  it('maximizes and closes through the traffic light controls', () => {
    render(<AppWindow appId="finder" />);

    fireEvent.click(screen.getByRole('button', { name: 'Toggle fullscreen for Finder' }));
    expect(useWindowsStore.getState().windows.finder.fullscreen).toBe(true);

    fireEvent.click(screen.getByRole('button', { name: 'Close Finder' }));
    expect(useWindowsStore.getState().windows.finder.open).toBe(false);
  });
});
