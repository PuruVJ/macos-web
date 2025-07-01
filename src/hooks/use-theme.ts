import { useAtom } from 'jotai';
import { useEffect } from 'preact/hooks';
import { themeAtom } from '__/stores/theme.store';

/**
 * Sitewide theme
 */
export function useTheme() {
  const [theme, setTheme] = useAtom(themeAtom);

  useEffect(() => {
    document.body.classList.remove('light', 'dark');
    document.body.classList.add(theme);
  }, [theme]);

  return [theme, setTheme] as const;
}
