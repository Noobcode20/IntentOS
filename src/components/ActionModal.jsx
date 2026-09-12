import { useEffect, useState } from 'react'

export default function ActionModal({ title, description, children, onClose }) {
  useEffect(() => {
    const onKeyDown = (event) => event.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 p-4" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div><h2 className="text-base font-bold text-slate-900">{title}</h2><p className="mt-1 text-xs leading-relaxed text-slate-500">{description}</p></div>
          <button type="button" onClick={onClose} aria-label="Close dialog" className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700">×</button>
        </div>
        <div className="mt-5">{children}</div>
      </div>
    </div>
  )
}
