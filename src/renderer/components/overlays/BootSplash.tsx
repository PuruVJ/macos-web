import { useSystemStore } from '@/stores/systemStore';

export function BootSplash() {
  const bootVisible = useSystemStore((state) => state.bootVisible);

  if (!bootVisible) {
    return null;
  }

  return (
    <div className="boot-splash">
      <div className="boot-brand">macOS</div>
      <div aria-label="Boot progress" className="boot-progress" role="progressbar">
        <div className="boot-progress-indicator" />
      </div>
    </div>
  );
}
