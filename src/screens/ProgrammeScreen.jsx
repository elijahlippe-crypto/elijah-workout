import { useState } from 'react'
import { SESSIONS, DELOAD_WEEKS, PERIODISATION_BLOCKS } from '../data/programme'

const WEEK_TOTALS = {
  Sun: { sets: 23 },
  Mon: { sets: 20 },
  Tue: { sets: 27 },
  Wed: { sets: 22 },
}

export default function ProgrammeScreen() {
  const [expandedDay, setExpandedDay] = useState(null)

  const totalSets = Object.values(SESSIONS).reduce((acc, s) => {
    return acc + s.exercises.reduce((a, e) => a + e.sets, 0)
  }, 0)

  return (
    <div className="min-h-screen bg-bg pb-24 px-4 pt-6">
      <h1 className="text-2xl font-extrabold text-text mb-1">Programme</h1>
      <p className="text-muted text-sm mb-5">24-Week Hypertrophy · 4-Day Split</p>

      {/* Periodisation blocks */}
      <div className="bg-surface border border-border rounded-2xl p-4 mb-4">
        <p className="text-muted text-xs uppercase tracking-widest font-medium mb-3">Periodisation</p>
        <div className="space-y-2">
          {PERIODISATION_BLOCKS.map(b => (
            <div key={b.weeks} className="flex items-center justify-between bg-card rounded-xl px-3 py-2.5">
              <span className="text-text text-sm font-semibold">{b.label}</span>
              <span className="text-accent text-xs font-bold bg-accent/10 px-2 py-1 rounded-lg">Wks {b.weeks}</span>
            </div>
          ))}
          {DELOAD_WEEKS.map(w => (
            <div key={w} className="flex items-center justify-between bg-orange/10 border border-orange/20 rounded-xl px-3 py-2.5">
              <span className="text-orange text-sm font-semibold">🔄 Deload</span>
              <span className="text-orange text-xs font-bold">Week {w}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly volume */}
      <div className="bg-surface border border-border rounded-2xl p-4 mb-4">
        <p className="text-muted text-xs uppercase tracking-widest font-medium mb-3">Weekly Volume</p>
        <div className="grid grid-cols-2 gap-2 mb-3">
          {Object.entries(SESSIONS).map(([day, session]) => (
            <div key={day} className="bg-card rounded-xl p-3">
              <p className="text-muted text-xs">{day}</p>
              <p className="text-text font-bold text-sm mt-0.5">{session.label}</p>
              <p className="text-accent text-xs mt-1">
                {session.exercises.reduce((a, e) => a + e.sets, 0)} sets · {session.exercises.length} ex
              </p>
            </div>
          ))}
        </div>
        <div className="bg-accent/10 border border-accent/20 rounded-xl px-3 py-2.5 flex justify-between items-center">
          <span className="text-accent text-sm font-semibold">Total weekly sets</span>
          <span className="text-accent font-bold">{totalSets}</span>
        </div>
      </div>

      {/* Sessions detail */}
      <div className="space-y-3">
        {Object.entries(SESSIONS).map(([dayKey, session]) => {
          const isOpen = expandedDay === dayKey
          const DAY_NAMES = { Sun: 'Sunday', Mon: 'Monday', Tue: 'Tuesday', Wed: 'Wednesday' }
          return (
            <div key={dayKey} className="bg-surface border border-border rounded-2xl overflow-hidden">
              <button
                onClick={() => setExpandedDay(isOpen ? null : dayKey)}
                className="w-full text-left p-4 flex items-center justify-between active:bg-card"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-text">{session.label}</p>
                  </div>
                  <p className="text-muted text-xs mt-0.5">{DAY_NAMES[dayKey]} · {session.focus}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted">
                    {session.exercises.reduce((a, e) => a + e.sets, 0)} sets
                  </span>
                  <span className="text-muted">{isOpen ? '▲' : '▼'}</span>
                </div>
              </button>

              {isOpen && (
                <div className="border-t border-border">
                  {session.exercises.map((ex, idx) => (
                    <div
                      key={ex.id}
                      className="px-4 py-3 border-b border-border/50 last:border-0 flex items-start gap-3"
                    >
                      <span className="text-muted text-xs font-bold w-5 mt-0.5 flex-shrink-0 text-right">{idx + 1}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <p className="text-text text-sm font-semibold leading-snug">{ex.name}</p>
                          {ex.key && <span className="text-orange text-xs">⚡</span>}
                        </div>
                        <p className="text-muted text-xs mt-0.5">
                          {ex.sets}×{ex.repRange} · {ex.rir}
                        </p>
                        {ex.notes && (
                          <p className="text-accent/70 text-xs mt-0.5 italic">{ex.notes}</p>
                        )}
                      </div>
                      <span className="text-xs text-muted flex-shrink-0 mt-0.5 bg-card border border-border rounded-lg px-2 py-0.5">
                        {ex.rest}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Progression notes */}
      <div className="bg-surface border border-border rounded-2xl p-4 mt-4">
        <p className="text-muted text-xs uppercase tracking-widest font-medium mb-3">Progression Rules</p>
        <div className="space-y-2 text-sm text-text">
          <p>📈 <strong>Double progression:</strong> hit top of rep range on all sets → add load next session</p>
          <p>😤 <strong>Target RIR 1–2</strong> for most sets; compounds at RIR 2</p>
          <p>⏱ <strong>Rest:</strong> 2–3 min compounds, 60–120s isolations</p>
          <p>⚡ <strong>Long-head triceps</strong> exercises — never skip these</p>
          <p>🔄 <strong>Deload wks 7, 14, 21:</strong> halve sets, RIR 3–4, drop intensifiers</p>
        </div>
      </div>
    </div>
  )
}
