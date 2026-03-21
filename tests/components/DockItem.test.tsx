import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DockItem } from '@/components/dock/DockItem';
import { createInitialWindowsState, useWindowsStore } from '@/stores/windowsStore';
import { openExternal } from '@/lib/utils/desktop';

vi.mock('@/lib/utils/desktop', () => ({
  openExternal: vi.fn(async () => undefined),
}));

function resetWindowsStore() {
  useWindowsStore.setState({
    viewport: { width: 1440, height: 900 },
    activeAppId: 'finder',
    activeZIndex: -2,
    windows: createInitialWindowsState(),
  });
}

describe('DockItem', () => {
  beforeEach(() => {
    resetWindowsStore();
    vi.mocked(openExternal).mockClear();
  });

  it('opens and focuses window apps from the dock', () => {
    render(<DockItem appId="calendar" mouseX={null} />);

    fireEvent.click(screen.getByRole('button', { name: 'Launch Calendar' }));

    const state = useWindowsStore.getState();
    expect(state.windows.calendar.open).toBe(true);
    expect(state.activeAppId).toBe('calendar');
  });

  it('uses the desktop bridge for external apps', async () => {
    render(<DockItem appId="vercel" mouseX={null} />);

    fireEvent.click(screen.getByRole('button', { name: 'Launch Powered by Vercel' }));

    expect(openExternal).toHaveBeenCalledWith(
      'https://vercel.com/?utm_source=purus-projects&utm_campaign=oss',
    );
  });
});
