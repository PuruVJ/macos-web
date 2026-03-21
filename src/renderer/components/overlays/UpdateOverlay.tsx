import { useSystemStore } from '@/stores/systemStore';

export function UpdateOverlay() {
  const needsUpdate = useSystemStore((state) => state.needsUpdate);
  const setNeedsUpdate = useSystemStore((state) => state.setNeedsUpdate);

  if (!needsUpdate) {
    return null;
  }

  return (
    <div className="desktop-overlay">
      <section className="modal-card">
        <img
          alt="System Preferences icon"
          className="update-icon"
          draggable="false"
          height={96}
          src="/app-icons/system-preferences/256.png"
          width={96}
        />
        <h2>Updates Available</h2>
        <p>Restart to install these updates now?</p>
        <div className="modal-actions">
          <button className="secondary-button" onClick={() => setNeedsUpdate(false)} type="button">
            Later
          </button>
          <button className="primary-button" onClick={() => setNeedsUpdate(false)} type="button">
            Update
          </button>
        </div>
      </section>
    </div>
  );
}
