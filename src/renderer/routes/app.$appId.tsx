import { createFileRoute } from '@tanstack/react-router';
import { useOpenAppFromRoute } from '@/hooks/useDesktopRouteSync';

function AppRouteComponent() {
  useOpenAppFromRoute();
  return null;
}

export const Route = createFileRoute('/app/$appId')({
  component: AppRouteComponent,
});
