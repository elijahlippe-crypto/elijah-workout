import { useState } from 'react'
import { SESSIONS } from '../data/programme'

function getSessionInfo(key) {
  const [date, sessionId] = key.split('__')
  const dayEntry = Object.entries(SESSIONS).find(([, s]) => s.id === sessionId)
  return { date, session: dayEntry ? dayEntry[1] : null, dayKey: dayEntry ? dayEntry[0] : null }
}

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
}

function findPRs(logs, sessionId, exId) {
  let best = null
  for (const [key, sessionLog] of Object.entries(logs)) {
    if (!key.includes(`__${sessionId}`)) continue
    const exLog = sessionLog[exId]
    if (!exLog?.sets) continue
    for (const s of exLog.sets) {
      const score = parseFloat(s.weight) * parseInt(s.reps)
      if (!isNaN(score) && (best === null || score > best.score)) {
        best = { weight: s.weight, reps: s.reps, score }
      }
    }
  }
  return best
}

export default function HistoryScreen({ logs, unit }) {
  const [expanded, setExpanded] = useState(null)

  const sessionKeys = Object.keys(logs)
    .filter(k => k.includes('__'))
    .sort()
    .reverse()

  if (sessionKeys.length === 0) {
    return (
      <div className="min-h-screen bg-bg pb-24 px-4 pt-6 flex flex-col items-center justify-center">
        <p className="text-5xl mb-4">📋</p>
        <p className="text-text font-semibold text-lg">No sessions yet</p>
        <p className="text-muted text-sm mt-2 text-center">Start your first session from the Home tab.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg pb-24 px-4 pt-6">
      <h1 className="text-2xl font-extrabold text-text mb-1">History</h1>
      <p className="text-muted text-sm mb-5">{sessionKeys.length} sessions logged</p>

      <div className="space-y-3">
        {sessionKeys.map(key => {
          const { date, session } = getSessionInfo(key)
          if (!session) return null
          const sessionLog = logs[key]
          const exDone = Object.keys(sessionLog).length
          const isOpen = expanded === key

          return (
            <div key={key} className="bg-surface border border-border rounded-2xl overflow-hidden">
              <button
                onClick={() => setExpanded(isOpen ? null : key)}
                className="w-full text-left p-4 flex items-center justify-between active:bg-card"
              >
                <div>
                  <p className="font-bold text-text">{session.label}</p>
                  <p className="text-muted text-xs mt-0.5">{formatDate(date)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted bg-card border border-border px-2 py-1 rounded-lg">
                    {exDone}/{session.exercises.length}
                  </span>
                  <span className="text-muted">{isOpen ? '▲' : '▼'}</span>
                </div>
              </button>

              {isOpen && (
                <div className="border-t border-border px-4 py-3 space-y-3">
                  {session.exercises.map(ex => {
                    const exLog = sessionLog[ex.id]
                    if (!exLog?.sets?.length) return null
                    const pr = findPRs(logs, session.id, ex.id)
                    return (
                      <div key={ex.id} className="bg-card rounded-xl p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <p className="text-sm font-semibold text-text flex-1">{ex.name}</p>
                          {ex.key && <span className="text-orange text-xs">⚡</span>}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {exLog.sets.map((s, i) => {
                            const isPR = pr && parseFloat(s.weight) * parseInt(s.reps) >= pr.score &&
                              parseFloat(s.weight) * parseInt(s.reps) > 0
                            return (
                              <span
                                key={i}
                                className={`text-xs rounded-lg px-2 py-1 font-medium ${
                                  isPR
                                    ? 'bg-orange/20 text-orange border border-orange/30'
                                    : 'bg-border text-text'
                                }`}
                              >
                                {s.weight}{unit}×{s.reps}{isPR ? ' 🏆' : ''}
                              </span>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
