import { SESSIONS, DELOAD_WEEKS, DAY_ABBREV_MAP } from '../data/programme'

const DAY_NAMES = { Sun: 'Sunday', Mon: 'Monday', Tue: 'Tuesday', Wed: 'Wednesday' }
const DAY_COLORS = { Sun: 'from-orange/20 to-transparent', Mon: 'from-accent/20 to-transparent', Tue: 'from-orange/20 to-transparent', Wed: 'from-accent/20 to-transparent' }

export default function HomeScreen({ startDate, setStartDate, currentWeek, todayKey, setScreen, setActiveSession }) {
  const todaySession = todayKey ? SESSIONS[todayKey] : null
  const isDeload = DELOAD_WEEKS.includes(currentWeek)

  const handleStart = () => {
    if (todaySession) {
      setActiveSession({ dayKey: todayKey, date: new Date().toISOString().split('T')[0] })
      setScreen('session')
    }
  }

  const handleDateChange = (e) => {
    setStartDate(e.target.value)
  }

  return (
    <div className="min-h-screen bg-bg pb-24 px-4 pt-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-text tracking-tight">Elijah's Training</h1>
        <p className="text-muted text-sm mt-0.5">24-Week Hypertrophy</p>
      </div>

      {/* Week card */}
      <div className="bg-surface border border-border rounded-2xl p-5 mb-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-muted text-xs uppercase tracking-widest font-medium">Current Week</p>
            <p className="text-5xl font-black text-text mt-1">
              {currentWeek > 24 ? '24+' : currentWeek < 1 ? '—' : currentWeek}
            </p>
            <p className="text-muted text-xs mt-1">of 24</p>
          </div>
          <div className="text-right">
            {isDeload && (
              <span className="inline-block bg-orange/20 text-orange text-xs font-bold px-3 py-1.5 rounded-full border border-orange/30">
                🔄 DELOAD
              </span>
            )}
            {currentWeek > 0 && currentWeek <= 24 && !isDeload && (
              <div className="bg-accent/10 border border-accent/20 rounded-xl px-3 py-2">
                <p className="text-accent text-xs font-bold">{Math.round((currentWeek/24)*100)}% done</p>
              </div>
            )}
          </div>
        </div>
        {/* Progress bar */}
        {currentWeek > 0 && (
          <div className="h-1.5 bg-border rounded-full overflow-hidden">
            <div
              className="h-full bg-accent rounded-full transition-all"
              style={{ width: `${Math.min(100, (currentWeek/24)*100)}%` }}
            />
          </div>
        )}
      </div>

      {/* Deload info */}
      {isDeload && (
        <div className="bg-orange/10 border border-orange/30 rounded-2xl p-4 mb-4">
          <p className="text-orange font-semibold text-sm">Deload Protocol</p>
          <p className="text-orange/80 text-xs mt-1">Halve all sets · RIR 3–4 · No intensifiers · Let it recover.</p>
        </div>
      )}

      {/* Today's session */}
      {todaySession ? (
        <div className={`bg-gradient-to-br ${DAY_COLORS[todayKey]} bg-surface border border-border rounded-2xl p-5 mb-4`}>
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-muted text-xs uppercase tracking-widest font-medium">Today — {DAY_NAMES[todayKey]}</p>
              <p className="text-xl font-extrabold text-text mt-1">{todaySession.label}</p>
              <p className="text-muted text-xs mt-1 leading-snug">{todaySession.focus}</p>
            </div>
            <span className="text-3xl mt-1">{todayKey === 'Sun' || todayKey === 'Tue' ? '💪' : '🔙'}</span>
          </div>
          <p className="text-muted text-xs mb-4">{todaySession.exercises.length} exercises</p>
          <button
            onClick={handleStart}
            className="w-full bg-accent text-white font-bold py-4 rounded-2xl text-base min-h-[52px] active:opacity-80"
          >
            Start Today's Session →
          </button>
        </div>
      ) : (
        <div className="bg-surface border border-border rounded-2xl p-5 mb-4 text-center">
          <p className="text-3xl mb-2">😴</p>
          <p className="text-text font-semibold">Rest Day</p>
          <p className="text-muted text-sm mt-1">No session scheduled today (Thu–Sat off).</p>
        </div>
      )}

      {/* This week's split overview */}
      <div className="bg-surface border border-border rounded-2xl p-4 mb-4">
        <p className="text-muted text-xs uppercase tracking-widest font-medium mb-3">This Week's Split</p>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(SESSIONS).map(([day, session]) => (
            <button
              key={day}
              onClick={() => {
                setActiveSession({ dayKey: day, date: new Date().toISOString().split('T')[0] })
                setScreen('session')
              }}
              className={`rounded-xl p-3 text-left border transition-all active:scale-95 ${
                day === todayKey
                  ? 'bg-accent/15 border-accent/40'
                  : 'bg-card border-border'
              }`}
            >
              <p className={`text-xs font-bold ${day === todayKey ? 'text-accent' : 'text-muted'}`}>{DAY_NAMES[day]}</p>
              <p className="text-text text-sm font-semibold mt-0.5">{session.label}</p>
              <p className="text-muted text-xs">{session.exercises.length} ex</p>
            </button>
          ))}
        </div>
      </div>

      {/* Start date setting */}
      <div className="bg-surface border border-border rounded-2xl p-4">
        <p className="text-muted text-xs uppercase tracking-widest font-medium mb-2">Programme Start Date</p>
        <input
          type="date"
          value={startDate}
          onChange={handleDateChange}
          className="w-full bg-card border border-border rounded-xl px-3 py-3 text-text text-sm focus:border-accent focus:outline-none"
        />
        <p className="text-muted text-xs mt-2">Change this to adjust your current week number.</p>
      </div>
    </div>
  )
}
