import { createRootRoute } from '@tanstack/react-router';
import { DesktopRoot } from '@/components/desktop/DesktopRoot';

export const Route = createRootRoute({
  component: DesktopRoot,
});
