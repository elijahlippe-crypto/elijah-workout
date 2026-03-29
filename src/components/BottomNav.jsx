export default function BottomNav({ screen, setScreen }) {
  const tabs = [
    { id: 'home', icon: '🏠', label: 'Home' },
    { id: 'history', icon: '📋', label: 'History' },
    { id: 'measurements', icon: '📏', label: 'Measure' },
    { id: 'programme', icon: '📅', label: 'Plan' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border safe-bottom z-40">
      <div className="flex items-stretch">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setScreen(tab.id)}
            className={`flex-1 flex flex-col items-center justify-center py-3 gap-1 text-xs font-medium transition-colors min-h-[56px] ${
              screen === tab.id
                ? 'text-accent'
                : 'text-muted'
            }`}
          >
            <span className="text-lg leading-none">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  )
}
