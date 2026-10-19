import { useEffect, useMemo, useState } from 'react';

type AppId = 'notes' | 'calculator' | 'clock' | 'music' | 'gallery' | 'system';
type ThemeName = 'midnight' | 'aurora' | 'violet' | 'silver';

type NotificationItem = {
  id: number;
  title: string;
  detail: string;
  time: string;
};

const appCatalog = [
  { id: 'notes', label: 'Notes', icon: '✎', accent: '#c4b5fd' },
  { id: 'calculator', label: 'Calculator', icon: '∑', accent: '#7dd3fc' },
  { id: 'clock', label: 'Clock', icon: '◔', accent: '#bfdbfe' },
  { id: 'music', label: 'Music', icon: '♫', accent: '#a7f3d0' },
  { id: 'gallery', label: 'Gallery', icon: '▣', accent: '#f9a8d4' },
  { id: 'system', label: 'System', icon: '◎', accent: '#fde68a' },
] as const;

const galleryItems = [
  { id: 1, title: 'Violet Drift', gradient: 'linear-gradient(135deg, #1d4ed8 0%, #8b5cf6 40%, #f0abfc 100%)' },
  { id: 2, title: 'Ice Bloom', gradient: 'linear-gradient(135deg, #0f172a 0%, #2563eb 35%, #a5f3fc 100%)' },
  { id: 3, title: 'Chrome Haze', gradient: 'linear-gradient(135deg, #111827 0%, #64748b 30%, #e2e8f0 100%)' },
  { id: 4, title: 'Lumen Echo', gradient: 'linear-gradient(135deg, #3b0764 0%, #7c3aed 35%, #f0abfc 100%)' },
  { id: 5, title: 'Prism Field', gradient: 'linear-gradient(135deg, #082f49 0%, #0ea5e9 30%, #e0f2fe 100%)' },
  { id: 6, title: 'Glass Wake', gradient: 'linear-gradient(135deg, #111827 0%, #334155 35%, #cbd5e1 100%)' },
] as const;

const demoTracks = [
  { title: 'Glass Current', artist: 'Lumen' },
  { title: 'Polar Drift', artist: 'North Arc' },
  { title: 'Soft Signal', artist: 'Midnight Echo' },
] as const;

const initialNotifications: NotificationItem[] = [
  { id: 1, title: 'System check', detail: 'Transmission stabilised at 96%.', time: 'just now' },
  { id: 2, title: 'Cloud sync', detail: 'Notes and preferences stored locally.', time: '4m ago' },
  { id: 3, title: 'Battery', detail: 'Power reserve at 86%.', time: '11m ago' },
];

const themeMap: Record<ThemeName, string> = {
  midnight: 'radial-gradient(circle at top, rgba(59,130,246,0.18), rgba(2,6,23,1) 68%)',
  aurora: 'radial-gradient(circle at top left, rgba(45,212,191,0.32), rgba(15,23,42,1) 55%)',
  silver: 'radial-gradient(circle at top, rgba(148,163,184,0.24), rgba(17,24,39,1) 62%)',
  violet: 'radial-gradient(circle at top, rgba(168,85,247,0.28), rgba(15,23,42,1) 62%)',
};

function formatTime(date: Date) {
  return new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' }).format(date);
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).format(date);
}

function AppLauncher({
  open,
  onClose,
  onLaunch,
}: {
  open: boolean;
  onClose: () => void;
  onLaunch: (id: AppId) => void;
}) {
  if (!open) return null;

  return (
    <div className="overlay" onClick={onClose}>
      <div className="overlay-panel panel-lg" onClick={(event) => event.stopPropagation()}>
        <div className="panel-header">
          <span className="eyebrow">App launcher</span>
          <button className="ghost-button" onClick={onClose}>Close</button>
        </div>
        <div className="launcher-search">
          <span>⌕</span>
          <input aria-label="Search apps" type="text" placeholder="Search apps" />
        </div>
        <div className="app-grid">
          {appCatalog.map((app) => (
            <button
              key={app.id}
              className="app-tile"
              style={{ ['--app-accent' as string]: app.accent }}
              onClick={() => {
                onLaunch(app.id);
                onClose();
              }}
            >
              <span className="app-icon">{app.icon}</span>
              <span>{app.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ControlCenter({
  open,
  onClose,
  brightness,
  setBrightness,
  theme,
  setTheme,
}: {
  open: boolean;
  onClose: () => void;
  brightness: number;
  setBrightness: (value: number) => void;
  theme: ThemeName;
  setTheme: (value: ThemeName) => void;
}) {
  if (!open) return null;

  return (
    <div className="overlay" onClick={onClose}>
      <div className="overlay-panel panel-md" onClick={(event) => event.stopPropagation()}>
        <div className="panel-header">
          <span className="eyebrow">Control center</span>
          <button className="ghost-button" onClick={onClose}>Done</button>
        </div>
        <div className="control-stack">
          <div className="control-block">
            <label>Brightness</label>
            <input
              type="range"
              min={40}
              max={100}
              value={brightness}
              onChange={(event) => setBrightness(Number(event.target.value))}
            />
          </div>
          <div className="theme-grid">
            {(['midnight', 'aurora', 'silver', 'violet'] as ThemeName[]).map((option) => (
              <button
                key={option}
                type="button"
                className={`theme-swatch ${theme === option ? 'selected' : ''}`}
                style={{ background: themeMap[option] }}
                onClick={() => setTheme(option)}
                aria-label={option}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function NotesApp({ text, setText }: { text: string; setText: (value: string) => void }) {
  return (
    <div className="app-window-content">
      <div className="app-header-row">
        <div>Notes</div>
        <span className="badge">Local</span>
      </div>
      <textarea value={text} onChange={(event) => setText(event.target.value)} className="notes-textarea" />
    </div>
  );
}

function CalculatorApp({ value, setValue }: { value: string; setValue: (next: string) => void }) {
  const handleButton = (token: string) => {
    if (token === 'C') {
      setValue('');
      return;
    }
    if (token === '⌫') {
      setValue(value.slice(0, -1));
      return;
    }
    if (token === '=') {
      try {
        const safe = value.replace(/×/g, '*').replace(/÷/g, '/');
        const result = Function(`"use strict"; return (${safe})`)();
        setValue(String(result));
      } catch {
        setValue('Error');
      }
      return;
    }
    setValue(value + token);
  };

  return (
    <div className="app-window-content">
      <div className="calc-screen">{value || '0'}</div>
      <div className="calc-grid">
        {['C', '⌫', '÷', '×', '7', '8', '9', '-', '4', '5', '6', '+', '1', '2', '3', '=', '0', '.'].map((button) => (
          <button key={button} type="button" className="calc-key" onClick={() => handleButton(button)}>
            {button}
          </button>
        ))}
      </div>
    </div>
  );
}

function ClockApp() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="app-window-content centered-stack">
      <div className="time-large">{formatTime(now)}</div>
      <div className="date-line">{formatDate(now)}</div>
      <div className="analog-wrap">
        <div className="analog-clock">
          <span className="hand hour" style={{ transform: `translate(-50%, -100%) rotate(${(now.getHours() % 12) * 30 + now.getMinutes() / 2}deg)` }} />
          <span className="hand minute" style={{ transform: `translate(-50%, -100%) rotate(${now.getMinutes() * 6 + now.getSeconds() / 10}deg)` }} />
          <span className="hand second" style={{ transform: `translate(-50%, -100%) rotate(${now.getSeconds() * 6}deg)` }} />
        </div>
      </div>
    </div>
  );
}

function MusicApp({
  currentTrack,
  setCurrentTrack,
  isPlaying,
  setIsPlaying,
  progress,
  setProgress,
}: {
  currentTrack: number;
  setCurrentTrack: (index: number) => void;
  isPlaying: boolean;
  setIsPlaying: (value: boolean) => void;
  progress: number;
  setProgress: (value: number) => void;
}) {
  useEffect(() => {
    if (!isPlaying) return;
    const interval = window.setInterval(() => setProgress((prev) => (prev >= 100 ? 0 : prev + 1)), 900);
    return () => window.clearInterval(interval);
  }, [isPlaying, setProgress]);

  return (
    <div className="app-window-content">
      <div className="music-card">
        <div className="album-art" />
        <div>
          <strong>{demoTracks[currentTrack].title}</strong>
          <small>{demoTracks[currentTrack].artist}</small>
        </div>
      </div>
      <div className="progress-bar">
        <span style={{ width: `${progress}%` }} />
      </div>
      <div className="music-controls">
        <button type="button" onClick={() => setCurrentTrack((currentTrack - 1 + demoTracks.length) % demoTracks.length)}>Prev</button>
        <button type="button" className="primary" onClick={() => setIsPlaying(!isPlaying)}>{isPlaying ? 'Pause' : 'Play'}</button>
        <button type="button" onClick={() => setCurrentTrack((currentTrack + 1) % demoTracks.length)}>Next</button>
      </div>
    </div>
  );
}

function GalleryApp({ selected, setSelected }: { selected: number; setSelected: (id: number) => void }) {
  return (
    <div className="app-window-content gallery-grid">
      {galleryItems.map((item) => (
        <button
          key={item.id}
          type="button"
          className={`gallery-tile ${selected === item.id ? 'active' : ''}`}
          style={{ background: item.gradient }}
          onClick={() => setSelected(item.id)}
        >
          <span>{item.title}</span>
        </button>
      ))}
    </div>
  );
}

function SystemInfoApp() {
  const stats = {
    os: 'Wonder OS',
    build: 'Lumen 1.0',
    gpu: 'WebGL Renderer',
    memory: '8.2 GB',
    stability: '96%',
  };

  return (
    <div className="app-window-content">
      <div className="system-info-grid">
        <div><label>OS</label><strong>{stats.os}</strong></div>
        <div><label>Build</label><strong>{stats.build}</strong></div>
        <div><label>GPU</label><strong>{stats.gpu}</strong></div>
        <div><label>Memory</label><strong>{stats.memory}</strong></div>
        <div><label>Stability</label><strong>{stats.stability}</strong></div>
      </div>
    </div>
  );
}

export default function App() {
  const [theme, setTheme] = useState<ThemeName>('midnight');
  const [brightness, setBrightness] = useState(84);
  const [notes, setNotes] = useState('');
  const [notificationItems, setNotificationItems] = useState<NotificationItem[]>(initialNotifications);
  const [sourceOpen, setSourceOpen] = useState(false);
  const [controlOpen, setControlOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [openApps, setOpenApps] = useState<AppId[]>(['notes', 'clock']);
  const [activeApp, setActiveApp] = useState<AppId | null>('notes');
  const [calculatorValue, setCalculatorValue] = useState('');
  const [musicIndex, setMusicIndex] = useState(0);
  const [musicProgress, setMusicProgress] = useState(42);
  const [isPlaying, setIsPlaying] = useState(true);
  const [gallerySelected, setGallerySelected] = useState(1);

  useEffect(() => {
    const savedNotes = window.localStorage.getItem('wonder-os-notes');
    if (savedNotes) setNotes(savedNotes);

    const savedTheme = window.localStorage.getItem('wonder-os-theme');
    if (savedTheme && ['midnight', 'aurora', 'violet', 'silver'].includes(savedTheme)) {
      setTheme(savedTheme as ThemeName);
    }

    const savedBrightness = window.localStorage.getItem('wonder-os-brightness');
    if (savedBrightness) setBrightness(Number(savedBrightness));
  }, []);

  useEffect(() => {
    window.localStorage.setItem('wonder-os-notes', notes);
  }, [notes]);

  useEffect(() => {
    window.localStorage.setItem('wonder-os-theme', theme);
  }, [theme]);

  useEffect(() => {
    window.localStorage.setItem('wonder-os-brightness', String(brightness));
  }, [brightness]);

  const cssVars = useMemo(
    () => ({
      ['--os-theme' as string]: themeMap[theme],
      ['--brightness' as string]: String(brightness / 100),
    }),
    [brightness, theme],
  );

  const openApp = (id: AppId) => {
    setOpenApps((current) => (current.includes(id) ? current : [...current, id]));
    setActiveApp(id);
  };

  const closeApp = (id: AppId) => {
    const next = openApps.filter((app) => app !== id);
    setOpenApps(next);
    if (activeApp === id) setActiveApp(next[0] ?? null);
  };

  const dismissNotification = (id: number) => {
    setNotificationItems((current) => current.filter((item) => item.id !== id));
  };

  const clearNotifications = () => setNotificationItems([]);

  const renderApp = () => {
    switch (activeApp) {
      case 'notes':
        return <NotesApp text={notes} setText={setNotes} />;
      case 'calculator':
        return <CalculatorApp value={calculatorValue} setValue={setCalculatorValue} />;
      case 'clock':
        return <ClockApp />;
      case 'music':
        return (
          <MusicApp
            currentTrack={musicIndex}
            setCurrentTrack={setMusicIndex}
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
            progress={musicProgress}
            setProgress={setMusicProgress}
          />
        );
      case 'gallery':
        return <GalleryApp selected={gallerySelected} setSelected={setGallerySelected} />;
      case 'system':
        return <SystemInfoApp />;
      default:
        return null;
    }
  };

  const now = new Date();

  return (
    <div className="os-shell" style={cssVars}>
      <div className="ambient-backdrop" />

      <header className="topbar glass-panel">
        <div className="status-left">
          <span className="brand">WONDER OS</span>
          <span className="edition">Lumen 1.0</span>
        </div>
        <div className="status-right">
          <span>{formatTime(now)}</span>
          <span className="status-pill">Signal 5G</span>
          <span className="status-pill">Synced</span>
        </div>
      </header>

      <main className="home-layout">
        <section className="hero-panel glass-panel">
          <div className="hero-scene">
            <div className="scene-meta">
              <span className="eyebrow">Home</span>
              <h1>Lumen Core</h1>
              <p>Immersive glass operating system</p>
            </div>
            <div className="scene-visual">
              <div className="orb" />
            </div>
          </div>
          <div className="hero-stats">
            <div className="stat-box">
              <span>Time</span>
              <strong>{formatTime(now)}</strong>
            </div>
            <div className="stat-box">
              <span>Date</span>
              <strong>{formatDate(now)}</strong>
            </div>
            <div className="stat-box">
              <span>Brightness</span>
              <strong>{brightness}%</strong>
            </div>
          </div>
        </section>

        <aside className="side-stack">
          <div className="glass-panel widget">
            <div className="mini-header">
              <span>System status</span>
              <span className="badge alive">Live</span>
            </div>
            <ul className="status-list">
              <li><span>Theme</span><strong>{theme}</strong></li>
              <li><span>Signal</span><strong>5G</strong></li>
              <li><span>Battery</span><strong>86%</strong></li>
            </ul>
          </div>

          <div className="glass-panel widget">
            <div className="mini-header">
              <span>Quick actions</span>
            </div>
            <div className="quick-actions">
              <button type="button" onClick={() => openApp('notes')}>Notes</button>
              <button type="button" onClick={() => openApp('calculator')}>Calc</button>
              <button type="button" onClick={() => setControlOpen(true)}>System</button>
            </div>
          </div>
        </aside>
      </main>

      <nav className="dock glass-panel">
        <button type="button" className="dock-button" onClick={() => setSourceOpen(true)}>⌘</button>
        {appCatalog.map((app) => (
          <button
            key={app.id}
            type="button"
            className={`dock-button ${activeApp === app.id ? 'active' : ''}`}
            style={{ ['--dock-accent' as string]: app.accent }}
            onClick={() => openApp(app.id)}
          >
            {app.icon}
          </button>
        ))}
        <button type="button" className="dock-button" onClick={() => setNotificationsOpen(true)}>
          {notificationItems.length > 0 ? <span className="notification-indicator">{notificationItems.length}</span> : null}
          🔔
a        </button>
      </nav>

      {activeApp ? (
        <div className="app-window glass-panel">
          <div className="panel-header window-header">
            <span className="eyebrow">{appCatalog.find((app) => app.id === activeApp)?.label ?? activeApp}</span>
            <div className="window-actions">
              <button type="button" className="ghost-button" onClick={() => setOpenApps([...openApps])}>Stack</button>
              <button type="button" className="ghost-button" onClick={() => closeApp(activeApp)}>Close</button>
            </div>
          </div>
          {renderApp()}
        </div>
      ) : null}

      <AppLauncher open={sourceOpen} onClose={() => setSourceOpen(false)} onLaunch={openApp} />
      <ControlCenter
        open={controlOpen}
        onClose={() => setControlOpen(false)}
        brightness={brightness}
        setBrightness={setBrightness}
        theme={theme}
        setTheme={setTheme}
      />

      <div className={`overlay ${notificationsOpen ? 'visible' : ''}`} onClick={() => setNotificationsOpen(false)}>
        <div className="overlay-panel panel-md" onClick={(event) => event.stopPropagation()}>
          <div className="panel-header">
            <span className="eyebrow">Notifications ({notificationItems.length})</span>
            <button type="button" className="ghost-button" onClick={clearNotifications}>Clear all</button>
          </div>
          <div className="notification-list">
            {notificationItems.length === 0 ? (
              <div className="empty-state">All clear.</div>
            ) : (
              notificationItems.map((item) => (
                <div key={item.id} className="notification-item">
                  <div className="dot" />
                  <div className="notification-body">
                    <strong>{item.title}</strong>
                    <span>{item.detail}</span>
                  </div>
                  <div className="notification-meta">
                    <small>{item.time}</small>
                    <button type="button" onClick={() => dismissNotification(item.id)}>Dismiss</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <button type="button" className="floating-settings" onClick={() => setControlOpen(true)}>Settings</button>
    </div>
  );
}
