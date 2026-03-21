import { useEffect } from 'react';
import { colors } from '@/config/colors';
import { usePreferencesStore } from '@/stores/preferencesStore';

export function usePreferenceEffects() {
  const reducedMotion = usePreferencesStore((state) => state.reducedMotion);
  const theme = usePreferencesStore((state) => state.theme);

  useEffect(() => {
    const { classList, style } = document.body;
    const color = colors[theme.primaryColor][theme.scheme];

    classList.remove('light', 'dark');
    classList.add(theme.scheme);
    document.body.dataset.theme = theme.scheme;
    document.body.dataset.motion = reducedMotion ? 'reduced' : 'full';

    style.setProperty('--system-color-primary', `hsl(${color.hsl})`);
    style.setProperty('--system-color-primary-hsl', color.hsl);
    style.setProperty('--system-color-primary-contrast', `hsl(${color.contrastHsl})`);
    style.setProperty('--system-color-primary-contrast-hsl', color.contrastHsl);
  }, [reducedMotion, theme]);
}
