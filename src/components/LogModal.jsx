import { useState } from 'react'

function parseRepRange(str) {
  const match = str.match(/(\d+)[–-](\d+)/)
  if (match) return { lo: parseInt(match[1]), hi: parseInt(match[2]) }
  const single = str.match(/(\d+)/)
  if (single) return { lo: parseInt(single[1]), hi: parseInt(single[1]) }
  return { lo: 8, hi: 12 }
}

export default function LogModal({ exercise, prevLog, unit, onSave, onClose }) {
  const numSets = exercise.sets
  const repRange = parseRepRange(exercise.repRange.split('/')[0])

  const [sets, setSets] = useState(() =>
    Array.from({ length: numSets }, (_, i) => ({
      weight: prevLog?.sets?.[i]?.weight ?? '',
      reps: prevLog?.sets?.[i]?.reps ?? '',
    }))
  )

  const updateSet = (i, field, val) => {
    setSets(prev => {
      const next = [...prev]
      next[i] = { ...next[i], [field]: val }
      return next
    })
  }

  const allAtTop = sets.every(s => {
    const r = parseInt(s.reps)
    return !isNaN(r) && r >= repRange.hi
  })

  const handleSave = () => {
    const filtered = sets.filter(s => s.weight !== '' || s.reps !== '')
    onSave({ sets: filtered })
  }

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-end justify-center" onClick={onClose}>
      <div
        className="bg-surface w-full max-w-lg rounded-t-2xl p-5 pb-8 max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 pr-4">
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-lg text-text leading-tight">{exercise.name}</h2>
              {exercise.key && <span className="text-orange text-sm">⚡</span>}
            </div>
            <p className="text-muted text-sm mt-1">
              {exercise.sets}×{exercise.repRange} @ {exercise.rir}
            </p>
            {exercise.notes && (
              <p className="text-accent text-xs mt-1">{exercise.notes}</p>
            )}
          </div>
          <button onClick={onClose} className="text-muted text-2xl leading-none p-1">×</button>
        </div>

        {/* Previous */}
        {prevLog?.sets?.length > 0 && (
          <div className="bg-card rounded-xl p-3 mb-4">
            <p className="text-xs text-muted mb-2 font-medium uppercase tracking-wide">Last session</p>
            <div className="flex flex-wrap gap-2">
              {prevLog.sets.map((s, i) => (
                <span key={i} className="text-xs bg-border rounded-lg px-2 py-1 text-text">
                  Set {i+1}: {s.weight}{unit} × {s.reps}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Set inputs */}
        <div className="space-y-3 mb-5">
          <div className="grid grid-cols-3 gap-2 text-xs text-muted font-medium uppercase tracking-wide px-1">
            <span>Set</span>
            <span>Weight ({unit})</span>
            <span>Reps</span>
          </div>
          {sets.map((s, i) => (
            <div key={i} className="grid grid-cols-3 gap-2 items-center">
              <span className="text-sm text-muted font-medium pl-1">{i + 1}</span>
              <input
                type="number"
                inputMode="decimal"
                placeholder="—"
                value={s.weight}
                onChange={e => updateSet(i, 'weight', e.target.value)}
                className="bg-card border border-border rounded-xl px-3 py-3 text-text text-center text-base focus:border-accent focus:outline-none min-h-[44px]"
              />
              <input
                type="number"
                inputMode="numeric"
                placeholder="—"
                value={s.reps}
                onChange={e => updateSet(i, 'reps', e.target.value)}
                className="bg-card border border-border rounded-xl px-3 py-3 text-text text-center text-base focus:border-accent focus:outline-none min-h-[44px]"
              />
            </div>
          ))}
        </div>

        {/* Progression hint */}
        {allAtTop && (
          <div className="bg-orange/10 border border-orange/30 rounded-xl p-3 mb-4 flex items-start gap-2">
            <span className="text-orange text-lg">🔼</span>
            <p className="text-orange text-sm leading-snug">
              <strong>All sets hit top of range.</strong> Increase weight next session.
            </p>
          </div>
        )}

        {/* Rest time */}
        <div className="flex items-center gap-2 mb-5 text-muted text-sm">
          <span>⏱</span>
          <span>Rest: {exercise.rest}</span>
        </div>

        {/* Save */}
        <button
          onClick={handleSave}
          className="w-full bg-accent text-white font-bold py-4 rounded-2xl text-base min-h-[52px] active:opacity-80"
        >
          Save Sets
        </button>
      </div>
    </div>
  )
}
