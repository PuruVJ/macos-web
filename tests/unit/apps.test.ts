import { describe, expect, it } from 'vitest';
import { appDefinitions, appRegistry } from '@/config/apps';
import { normalizeAppDefinitions } from '@/lib/apps';

describe('app registry', () => {
  it('normalizes app definitions into a keyed registry', () => {
    const registry = normalizeAppDefinitions(appDefinitions);

    expect(Object.keys(registry)).toHaveLength(appDefinitions.length);
    expect(registry.finder.title).toBe('Finder');
    expect(registry.vercel.launchKind).toBe('external');
    expect(registry.vercel.href).toContain('vercel.com');
  });

  it('exposes serializable launch metadata for desktop apps', () => {
    expect(appRegistry.wallpapers.routePath).toBe('/app/wallpapers');
    expect(appRegistry.calendar.defaultBounds.width).toBeGreaterThan(800);
    expect(appRegistry['view-source'].href).toBe('https://github.com/puruvj/macos-web');
  });
});
