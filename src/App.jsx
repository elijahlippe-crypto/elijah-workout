import { useState, useMemo } from 'react'
import { useStorage } from './hooks/useStorage'
import { INITIAL_MEASUREMENTS, DAY_ABBREV_MAP } from './data/programme'
import BottomNav from './components/BottomNav'
import HomeScreen from './screens/HomeScreen'
import SessionScreen from './screens/SessionScreen'
import HistoryScreen from './screens/HistoryScreen'
import MeasurementsScreen from './screens/MeasurementsScreen'
import ProgrammeScreen from './screens/ProgrammeScreen'

function getDefaultStartDate() {
  // Default to a Monday roughly where week 1 would make sense
  return new Date().toISOString().split('T')[0]
}

export default function App() {
  const [screen, setScreen] = useState('home')
  const [activeSession, setActiveSession] = useState(null)
  const [unit, setUnit] = useStorage('unit', 'kg')
  const [logs, setLogs] = useStorage('workout_logs', {})
  const [measurements, setMeasurements] = useStorage('measurements', INITIAL_MEASUREMENTS)
  const [startDate, setStartDate] = useStorage('programme_start_date', getDefaultStartDate())

  // Current week number
  const currentWeek = useMemo(() => {
    if (!startDate) return 1
    const start = new Date(startDate + 'T00:00:00')
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const diffDays = Math.floor((today - start) / (1000 * 60 * 60 * 24))
    if (diffDays < 0) return 1
    return Math.min(24, Math.ceil((diffDays + 1) / 7))
  }, [startDate])

  // Today's session key (Sun=0,Mon=1,Tue=2,Wed=3,Thu=4...)
  const todayKey = useMemo(() => {
    const day = new Date().getDay() // 0=Sun,1=Mon,...
    return DAY_ABBREV_MAP[day] || null
  }, [])

  const handleSetScreen = (s) => {
    if (s !== 'session') setActiveSession(null)
    setScreen(s)
  }

  return (
    <div className="min-h-screen bg-bg">
      {/* Unit toggle — floating top right */}
      {screen !== 'session' && (
        <div className="fixed top-4 right-4 z-50">
          <button
            onClick={() => setUnit(u => u === 'kg' ? 'lbs' : 'kg')}
            className="bg-card border border-border text-muted text-xs font-bold px-3 py-2 rounded-xl active:opacity-70 min-h-[36px]"
          >
            {unit}
          </button>
        </div>
      )}

      {/* Screens */}
      {screen === 'home' && (
        <HomeScreen
          startDate={startDate}
          setStartDate={setStartDate}
          currentWeek={currentWeek}
          todayKey={todayKey}
          setScreen={handleSetScreen}
          setActiveSession={setActiveSession}
        />
      )}
      {screen === 'session' && (
        <SessionScreen
          activeSession={activeSession}
          logs={logs}
          setLogs={setLogs}
          unit={unit}
          currentWeek={currentWeek}
          onBack={() => handleSetScreen('home')}
        />
      )}
      {screen === 'history' && (
        <HistoryScreen logs={logs} unit={unit} />
      )}
      {screen === 'measurements' && (
        <MeasurementsScreen measurements={measurements} setMeasurements={setMeasurements} />
      )}
      {screen === 'programme' && (
        <ProgrammeScreen />
      )}

      {/* Bottom nav — hidden during session */}
      {screen !== 'session' && (
        <BottomNav screen={screen} setScreen={handleSetScreen} />
      )}
    </div>
  )
}
