import { useState } from 'react'

const FIELDS = [
  { id: 'shoulders', label: 'Shoulders', emoji: '🤷' },
  { id: 'bust', label: 'Chest/Bust', emoji: '🫀' },
  { id: 'waist', label: 'Waist', emoji: '⬛' },
  { id: 'armL', label: 'Arm Left', emoji: '💪' },
  { id: 'armR', label: 'Arm Right', emoji: '💪' },
  { id: 'legL', label: 'Leg Left', emoji: '🦵' },
  { id: 'legR', label: 'Leg Right', emoji: '🦵' },
]

function formatDate(d) {
  return new Date(d + 'T00:00:00').toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

function getTrend(entries, field) {
  const valid = entries.filter(e => e[field] != null && e[field] !== '')
  if (valid.length < 2) return null
  const sorted = [...valid].sort((a, b) => a.date.localeCompare(b.date))
  const diff = parseFloat(sorted[sorted.length - 1][field]) - parseFloat(sorted[0][field])
  return diff
}

export default function MeasurementsScreen({ measurements, setMeasurements }) {
  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    shoulders: '', bust: '', waist: '', armL: '', armR: '', legL: '', legR: '',
    notes: '',
  })
  const [showForm, setShowForm] = useState(false)

  const handleSave = () => {
    const entry = { ...form }
    // Clean up empty strings to null
    for (const f of FIELDS) {
      if (entry[f.id] === '') entry[f.id] = null
    }
    setMeasurements(prev => {
      const filtered = prev.filter(e => e.date !== entry.date)
      return [...filtered, entry].sort((a, b) => a.date.localeCompare(b.date))
    })
    setShowForm(false)
    setForm({
      date: new Date().toISOString().split('T')[0],
      shoulders: '', bust: '', waist: '', armL: '', armR: '', legL: '', legR: '', notes: '',
    })
  }

  const latest = [...measurements].sort((a, b) => b.date.localeCompare(a.date))[0]

  return (
    <div className="min-h-screen bg-bg pb-24 px-4 pt-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-text">Measurements</h1>
          <p className="text-muted text-sm mt-0.5">{measurements.length} entries</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-accent text-white font-bold px-4 py-2.5 rounded-xl text-sm min-h-[44px] active:opacity-80"
        >
          + Add
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="bg-surface border border-border rounded-2xl p-4 mb-5">
          <h3 className="font-bold text-text mb-3">New Entry</h3>
          <div className="space-y-3">
            <div>
              <label className="text-muted text-xs mb-1 block">Date</label>
              <input
                type="date"
                value={form.date}
                onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                className="w-full bg-card border border-border rounded-xl px-3 py-3 text-text text-sm focus:border-accent focus:outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              {FIELDS.map(f => (
                <div key={f.id}>
                  <label className="text-muted text-xs mb-1 block">{f.emoji} {f.label} (in)</label>
                  <input
                    type="number"
                    inputMode="decimal"
                    step="0.25"
                    placeholder="—"
                    value={form[f.id]}
                    onChange={e => setForm(prev => ({ ...prev, [f.id]: e.target.value }))}
                    className="w-full bg-card border border-border rounded-xl px-3 py-3 text-text text-sm text-center focus:border-accent focus:outline-none min-h-[44px]"
                  />
                </div>
              ))}
            </div>
            <div>
              <label className="text-muted text-xs mb-1 block">Notes</label>
              <input
                type="text"
                placeholder="optional"
                value={form.notes}
                onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                className="w-full bg-card border border-border rounded-xl px-3 py-3 text-text text-sm focus:border-accent focus:outline-none"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="flex-1 bg-accent text-white font-bold py-3 rounded-xl text-sm min-h-[44px] active:opacity-80"
              >
                Save Entry
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 bg-card border border-border text-muted font-bold py-3 rounded-xl text-sm min-h-[44px] active:opacity-80"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Latest snapshot */}
      {latest && (
        <div className="bg-surface border border-border rounded-2xl p-4 mb-5">
          <p className="text-muted text-xs uppercase tracking-widest font-medium mb-3">Latest — {formatDate(latest.date)}</p>
          <div className="grid grid-cols-2 gap-2">
            {FIELDS.map(f => {
              const val = latest[f.id]
              if (val == null) return null
              const trend = getTrend(measurements, f.id)
              return (
                <div key={f.id} className="bg-card rounded-xl p-3">
                  <p className="text-muted text-xs">{f.emoji} {f.label}</p>
                  <div className="flex items-end gap-2 mt-1">
                    <p className="text-text font-bold text-lg">{val}"</p>
                    {trend !== null && (
                      <p className={`text-xs font-medium mb-0.5 ${trend > 0 ? 'text-orange' : trend < 0 ? 'text-red-400' : 'text-muted'}`}>
                        {trend > 0 ? `+${trend.toFixed(1)}` : trend.toFixed(1)}"
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* History list */}
      <div className="space-y-3">
        {[...measurements].sort((a, b) => b.date.localeCompare(a.date)).map((entry, i) => (
          <div key={entry.date + i} className="bg-surface border border-border rounded-2xl p-4">
            <p className="font-semibold text-text mb-2">{formatDate(entry.date)}</p>
            <div className="flex flex-wrap gap-2">
              {FIELDS.map(f => {
                if (entry[f.id] == null) return null
                return (
                  <span key={f.id} className="text-xs bg-card border border-border rounded-lg px-2 py-1 text-text">
                    {f.label}: {entry[f.id]}"
                  </span>
                )
              })}
            </div>
            {entry.notes && <p className="text-muted text-xs mt-2 italic">{entry.notes}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}
