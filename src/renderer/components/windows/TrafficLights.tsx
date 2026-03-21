import { appRegistry } from '@/config/apps';
import type { AppId } from '@/lib/apps';

type TrafficLightsProps = {
  appId: AppId;
  onClose: () => void;
  onMinimize: () => void;
  onToggleFullscreen: () => void;
};

export function TrafficLights({
  appId,
  onClose,
  onMinimize,
  onToggleFullscreen,
}: TrafficLightsProps) {
  const definition = appRegistry[appId];

  return (
    <div className="traffic-lights no-drag">
      <button
        aria-label={`Close ${definition.title}`}
        className="traffic-button close"
        onClick={onClose}
        type="button"
      />
      <button
        aria-label={`Minimize ${definition.title}`}
        className="traffic-button minimize"
        onClick={onMinimize}
        type="button"
      />
      <button
        aria-label={`Toggle fullscreen for ${definition.title}`}
        className="traffic-button maximize"
        disabled={!definition.expandable}
        onClick={onToggleFullscreen}
        type="button"
      />
    </div>
  );
}
