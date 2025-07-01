import { useState } from 'preact/hooks';

interface LockScreenProps {
  onUnlock: () => void;
}

export const LockScreen = ({ onUnlock }: LockScreenProps) => {
  const [password, setPassword] = useState('');
  const [isUnlocking, setIsUnlocking] = useState(false);

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    setIsUnlocking(true);
    setTimeout(() => {
      onUnlock();
    }, 800); // Match transition duration
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 9999,
        backgroundImage: `url('/assets/wallpapers/37-1.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: isUnlocking ? 'none' : 'auto',
        transition: 'transform 0.8s cubic-bezier(.4,1.6,.2,1), opacity 0.8s cubic-bezier(.4,1.6,.2,1)',
        transform: isUnlocking ? 'translateY(-100vh)' : 'translateY(0)',
        opacity: isUnlocking ? 0 : 1,
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.55)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          zIndex: 1,
        }}
      />
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 32,
          borderRadius: 16,
        }}
      >
        <img
          src="/assets/app-icons/contacts/256.png"
          alt="User"
          style={{
            width: 96,
            height: 96,
            borderRadius: '50%',
            border: '3px solid #fff',
            marginBottom: 24,
            boxShadow: '0 2px 12px rgba(0,0,0,0.3)'
          }}
        />
        <div style={{ color: '#fff', fontSize: 22, fontWeight: 500, marginBottom: 24, textShadow: '0 2px 8px #000' }}>
          Administrator
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 240 }}>
          <input
            type="password"
            value={password}
            onInput={e => setPassword((e.target as HTMLInputElement).value)}
            placeholder="Enter password"
            style={{
              padding: 12,
              fontSize: 18,
              borderRadius: 8,
              border: 'none',
              outline: 'none',
              marginBottom: 12,
              width: '100%',
              background: 'rgba(255,255,255,0.85)',
              boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
            }}
            disabled={isUnlocking}
          />
          <button type="submit" style={{
            padding: '10px 0',
            fontSize: 16,
            borderRadius: 8,
            cursor: isUnlocking ? 'not-allowed' : 'pointer',
            width: '100%',
            background: '#007aff',
            color: '#fff',
            border: 'none',
            fontWeight: 600,
            boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
          }} disabled={isUnlocking}>
            Unlock
          </button>
        </form>
      </div>
    </div>
  );
};
