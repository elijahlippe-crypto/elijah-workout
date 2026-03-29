export default function ExerciseCard({ exercise, logged, onTap }) {
  return (
    <button
      onClick={onTap}
      className={`w-full text-left rounded-2xl p-4 border transition-all active:scale-[0.98] ${
        logged
          ? 'bg-accent/10 border-accent/30'
          : 'bg-card border-border'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`font-semibold text-sm leading-snug ${logged ? 'text-accent' : 'text-text'}`}>
              {exercise.name}
            </span>
            {exercise.key && (
              <span className="text-orange text-xs font-bold">⚡</span>
            )}
          </div>
          <p className="text-muted text-xs mt-1">
            {exercise.sets}×{exercise.repRange} · {exercise.rir} · {exercise.rest}
          </p>
          {exercise.notes && (
            <p className="text-accent/70 text-xs mt-1 italic">{exercise.notes}</p>
          )}
        </div>
        <div className="flex-shrink-0 mt-0.5">
          {logged ? (
            <span className="text-accent text-xl">✓</span>
          ) : (
            <span className="text-muted text-xl">›</span>
          )}
        </div>
      </div>
      {logged?.sets?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2 pt-2 border-t border-accent/20">
          {logged.sets.map((s, i) => (
            <span key={i} className="text-xs text-accent/80 bg-accent/10 rounded-lg px-2 py-0.5">
              {s.weight}×{s.reps}
            </span>
          ))}
        </div>
      )}
    </button>
  )
}
