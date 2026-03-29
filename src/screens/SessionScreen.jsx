import { useState } from 'react'
import { SESSIONS, DELOAD_WEEKS } from '../data/programme'
import ExerciseCard from '../components/ExerciseCard'
import LogModal from '../components/LogModal'

export default function SessionScreen({ activeSession, logs, setLogs, unit, currentWeek, onBack }) {
  const [modalEx, setModalEx] = useState(null)

  if (!activeSession) return null
  const { dayKey, date } = activeSession
  const session = SESSIONS[dayKey]
  if (!session) return null

  const isDeload = DELOAD_WEEKS.includes(currentWeek)

  // Today's log key
  const todayKey = `${date}__${session.id}`
  const todayLog = logs[todayKey] || {}

  // Find the most recent previous log for this session
  const prevLogKey = Object.keys(logs)
    .filter(k => k.includes(`__${session.id}`) && k !== todayKey)
    .sort()
    .slice(-1)[0]
  const prevLog = prevLogKey ? logs[prevLogKey] : {}

  const doneCount = Object.keys(todayLog).length
  const totalCount = session.exercises.length

  const handleSave = (exId, data) => {
    setLogs(prev => ({
      ...prev,
      [todayKey]: {
        ...(prev[todayKey] || {}),
        [exId]: data,
      },
    }))
    setModalEx(null)
  }

  return (
    <div className="min-h-screen bg-bg pb-24">
      {/* Header */}
      <div className="bg-surface border-b border-border px-4 pt-6 pb-4 sticky top-0 z-30">
        <div className="flex items-center gap-3 mb-2">
          <button onClick={onBack} className="text-muted text-lg p-1 -ml-1 min-h-[44px] min-w-[44px] flex items-center justify-center">
            ‹
          </button>
          <div className="flex-1">
            <h2 className="font-extrabold text-xl text-text">{session.label}</h2>
            <p className="text-muted text-xs">{session.focus}</p>
          </div>
          <span className="text-muted text-xs bg-card border border-border px-2 py-1 rounded-lg">
            {doneCount}/{totalCount}
          </span>
        </div>
        {/* Progress */}
        <div className="h-1 bg-border rounded-full overflow-hidden">
          <div
            className="h-full bg-accent rounded-full transition-all"
            style={{ width: `${totalCount > 0 ? (doneCount/totalCount)*100 : 0}%` }}
          />
        </div>
        {isDeload && (
          <div className="mt-2 bg-orange/10 border border-orange/30 rounded-xl px-3 py-2">
            <p className="text-orange text-xs font-bold">🔄 DELOAD WEEK — Halve sets, RIR 3–4, no intensifiers</p>
          </div>
        )}
      </div>

      {/* Exercise list */}
      <div className="px-4 py-4 space-y-3">
        {session.exercises.map((ex, idx) => {
          const exLog = todayLog[ex.id]
          const prevExLog = prevLog[ex.id]
          return (
            <div key={ex.id}>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-muted text-xs font-bold w-5 text-right">{idx + 1}</span>
                <ExerciseCard
                  exercise={ex}
                  logged={exLog}
                  onTap={() => setModalEx({ ex, prevExLog })}
                />
              </div>
            </div>
          )
        })}
      </div>

      {doneCount === totalCount && totalCount > 0 && (
        <div className="mx-4 bg-accent/10 border border-accent/30 rounded-2xl p-5 text-center mb-4">
          <p className="text-3xl mb-2">🎉</p>
          <p className="text-accent font-bold text-lg">Session Complete!</p>
          <p className="text-muted text-sm mt-1">All {totalCount} exercises logged.</p>
        </div>
      )}

      {/* Modal */}
      {modalEx && (
        <LogModal
          exercise={modalEx.ex}
          prevLog={modalEx.prevExLog}
          unit={unit}
          onSave={(data) => handleSave(modalEx.ex.id, data)}
          onClose={() => setModalEx(null)}
        />
      )}
    </div>
  )
}
