import { useState } from 'react'
import { SidebarToggle } from '../components/Layout'
import { useFocus } from '../context/FocusContext'
import ActionModal from '../components/ActionModal'

const timelineSegments = [
  { label: 'YouTube Physics Lecture', start: '09:02', end: '09:26', duration: '24m', color: 'bg-[#3b82f6]', percent: 28, type: 'productive' },
  { label: "Google Search - Lenz's Law", start: '09:26', end: '09:34', duration: '8m', color: 'bg-[#3b82f6]', percent: 10, type: 'productive' },
  { label: 'Distraction - Gaming', start: '09:34', end: '09:41', duration: '7m', color: 'bg-[#f43f5e]', percent: 8, type: 'distraction' },
  { label: 'Obsidian - EMI Notes', start: '09:41', end: '09:59', duration: '18m', color: 'bg-[#38bdf8]', percent: 25, type: 'productive' },
  { label: 'Chrome & Notes - Switching', start: '09:59', end: '10:14', duration: '15m', color: 'bg-[#f59e0b]', percent: 14, type: 'stuck' },
  { label: 'Buffer', start: '10:14', end: '10:30', duration: '', color: 'bg-[#cbd5e1]', percent: 23, type: 'idle' },
]

const timelineActivities = [
  {
    id: 1,
    time: '09:02 AM',
    duration: '24 min',
    app: 'YouTube',
    appIcon: (
      <svg className="w-3.5 h-3.5 text-[#ef4444]" fill="currentColor" viewBox="0 0 24 24">
        <polygon points="5 3 19 12 5 21 5 3" />
      </svg>
    ),
    appSubtitle: 'YouTube via Arc Browser',
    title: 'Electromagnetic Induction — Physics Lecture',
    description: "Faraday's Law derivation, magnetic flux surfaces & induced electromotive force.",
    type: 'Productive',
    typeColor: 'bg-[#ecfdf5] text-[#059669]',
    borderColor: 'border-[#10b981]',
    goalAlignment: '94% match',
    goalPrompt: 'Study electromagnetic induction for my physics exam',
    contextReasoning: "Detected active derivation of Faraday's Law and magnetic flux equations matching syllabus topics. High keystroke correlation in Obsidian notes without distracting tab switching.",
  },
  {
    id: 2,
    time: '09:26 AM',
    duration: '8 min',
    app: 'Google Search',
    appIcon: (
      <svg className="w-3.5 h-3.5 text-[#3b82f6]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" x2="22" y1="12" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
    appSubtitle: 'Google Chrome',
    title: "Lenz's Law explanation & Right-Hand Rule",
    description: 'Deep query into directional opposition of induced current vectors.',
    type: 'Productive',
    typeColor: 'bg-[#ecfdf5] text-[#059669]',
    borderColor: 'border-[#10b981]',
  },
  {
    id: 3,
    time: '09:34 AM',
    duration: '7 min',
    app: 'YouTube',
    appIcon: (
      <svg className="w-3.5 h-3.5 text-[#ef4444]" fill="currentColor" viewBox="0 0 24 24">
        <polygon points="5 3 19 12 5 21 5 3" />
      </svg>
    ),
    appSubtitle: 'YouTube via Arc Browser',
    title: 'Best Gaming Moments & Highlights 2024',
    description: 'Video unrelated to physics domain; alert intervention triggered.',
    type: 'Distraction',
    typeColor: 'bg-[#fff1f2] text-[#e11d48]',
    borderColor: 'border-[#f43f5e]',
  },
  {
    id: 4,
    time: '09:41 AM',
    duration: '18 min',
    app: 'Obsidian',
    appIcon: (
      <svg className="w-3.5 h-3.5 text-[#7c3aed]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="m14 2-8 8 3 11 11-4 2-7z" />
        <path d="m5 10 9 9" />
      </svg>
    ),
    appSubtitle: 'Obsidian Desktop',
    title: 'Physics — EMI notes & Maxwell Eq. Synthesis',
    description: 'Structured markdown synthesis for Faraday integral equations and flux laws.',
    type: 'Productive',
    typeColor: 'bg-[#ecfdf5] text-[#059669]',
    borderColor: 'border-[#10b981]',
  },
  {
    id: 5,
    time: '09:59 AM',
    duration: '15 min',
    app: 'Chrome & Notes',
    appIcon: (
      <svg className="w-3.5 h-3.5 text-[#f59e0b]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="4" />
        <line x1="21.17" x2="12" y1="8" y2="8" />
        <line x1="3.95" x2="8.54" y1="6.06" y2="14" />
        <line x1="10.88" x2="15.46" y1="21.94" y2="14" />
      </svg>
    ),
    appSubtitle: 'Chrome & Apple Notes',
    title: 'Repeated research context switching',
    description: 'Rapid search loops across reference documentation without active note taking.',
    type: 'Potentially Stuck',
    typeColor: 'bg-[#fffbeb] text-[#d97706]',
    borderColor: 'border-[#f59e0b]',
  },
]

const detailMilestones = [
  { label: 'Maxwell Equations & Flux', status: 'completed' },
  { label: "Faraday's Law Conceptual Derivation", status: 'completed' },
  { label: 'Electromagnetic Induction Core Lecture', status: 'active' },
  { label: "Lenz's Law Problem Set", status: 'pending' },
  { label: 'Obsidian Synthesis & Equation Sheet', status: 'pending' },
]

function ActivityPage() {
  const { rightSidebarOpen } = useFocus()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('All')
  const [selectedId, setSelectedId] = useState(1)
  const [modal, setModal] = useState(null)
  const [notice, setNotice] = useState('')
  const filtered = timelineActivities.filter((activity) => (filter === 'All' || activity.type.toLowerCase().includes(filter.toLowerCase())) && `${activity.title} ${activity.description} ${activity.app}`.toLowerCase().includes(query.toLowerCase()))
  const selected = timelineActivities.find((activity) => activity.id === selectedId) || timelineActivities[0]
  const showNotice = (message) => { setNotice(message); window.setTimeout(() => setNotice(''), 2200) }
  return (
    <>
      <header className="h-14 border-b border-[#eaecf0] bg-white px-6 flex items-center justify-between sticky top-0 z-20">
        <h1 className="text-[15px] font-semibold text-[#0f172a]">Activity Stream</h1>
        <div className="flex items-center gap-3">
          <div className="relative flex items-center">
            <svg className="w-3.5 h-3.5 text-[#94a3b8] absolute left-3 pointer-events-none" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input value={query} onChange={(event) => setQuery(event.target.value)}
              className="bg-[#f8fafc] border border-[#e2e8f0] text-[12px] rounded-lg pl-8 pr-3 py-1.5 w-[250px] focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 placeholder:text-[#94a3b8] transition-all"
              placeholder="Search activities or topics..."
              type="text"
            />
          </div>
          <button onClick={() => showNotice('Date range picker is set to today.')} className="flex items-center gap-2 border border-[#e2e8f0] bg-white rounded-lg px-2.5 py-1.5 text-[12px] text-[#334155] hover:bg-[#f8fafc] transition-colors font-medium">
            <svg className="w-3.5 h-3.5 text-[#64748b]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
              <rect height="18" rx="2" ry="2" width="18" x="3" y="4" />
              <line x1="16" x2="16" y1="2" y2="6" />
              <line x1="8" x2="8" y1="2" y2="6" />
              <line x1="3" x2="21" y1="10" y2="10" />
            </svg>
            <span>Today, Oct 24</span>
            <svg className="w-3 h-3 text-[#94a3b8]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>
          <button onClick={() => setModal('objective')} className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm shadow-blue-500/20">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
              <path d="M12 5v14" />
            </svg>
            New Objective
          </button>
          <SidebarToggle />
        </div>
      </header>

      <div className="px-7 py-3 border-b border-[#eaecf0] bg-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono text-[#64748b]">09:00 AM</span>
          <div className="w-[150px] h-2 bg-[#f1f5f9] rounded-full flex overflow-hidden">
            {timelineSegments.map((seg, i) => (
              <div key={i} className={`${seg.color} h-full`} style={{ width: `${seg.percent}%` }} title={`${seg.start} - ${seg.end}: ${seg.label} (${seg.duration})`} />
            ))}
          </div>
          <span className="text-[11px] font-mono text-[#64748b]">10:30 AM</span>
        </div>
        <div className="flex items-center gap-1.5">
          {['All', 'Productive', 'Distraction', 'Stuck'].map((option) => <button key={option} onClick={() => setFilter(option)} className={`px-3 py-1 rounded-full text-[11.5px] font-medium ${filter === option ? 'bg-[#0f172a] text-white' : 'text-[#64748b] hover:bg-[#f1f5f9]'}`}>{option}</button>)}
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <section className="flex-1 px-8 py-5 overflow-y-auto border-r border-[#eaecf0]">
          <div className="flex items-center justify-between mb-5">
            <span className="text-[10px] font-bold tracking-wider text-[#94a3b8] uppercase">Session Timeline</span>
            <span className="text-[11px] font-mono text-[#94a3b8]">Chronological</span>
          </div>
          <div className="relative pl-6 space-y-4">
            <div className="absolute left-[7px] top-3 bottom-4 w-[1px] bg-[#e2e8f0]" />
            {filtered.map((a) => (
              <div key={a.id} className="relative">
                <div className="absolute -left-[27px] top-4 w-3.5 h-3.5 rounded-full bg-[#94a3b8] border-2 border-white" />
                <button type="button" onClick={() => setSelectedId(a.id)} className={`w-full text-left border-[1.5px] ${a.borderColor} rounded-xl bg-white p-4 shadow-sm hover:shadow transition-shadow ${selectedId === a.id ? 'ring-2 ring-blue-100' : ''}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-[11.5px] text-[#64748b]">
                      <span className="font-mono text-[#475569]">{a.time}</span>
                      <span className="text-[#cbd5e1]">•</span>
                      <span className="flex items-center gap-1 font-medium text-[#1e293b]">
                        {a.appIcon}
                        {a.app}
                      </span>
                      <span className="text-[#cbd5e1]">•</span>
                      <span className="text-[#64748b] font-mono">{a.duration}</span>
                    </div>
                    <span className={`${a.typeColor} text-[11px] font-medium px-2 py-0.5 rounded-md`}>{a.type}</span>
                  </div>
                  <h3 className="text-[14px] font-bold text-[#0f172a] mb-1">{a.title}</h3>
                  <p className="text-[12.5px] text-[#64748b] leading-relaxed">{a.description}</p>
                </button>
              </div>
            ))}
          </div>
        </section>

        {rightSidebarOpen && <aside className="w-[430px] flex-shrink-0 bg-white p-6 overflow-y-auto flex flex-col justify-between">
          <div className="space-y-5">
            <div className="flex items-center justify-between pb-1">
              <h2 className="text-[14px] font-bold text-[#0f172a]">Activity Details</h2>
              <span className={`${selected.typeColor} text-[11.5px] font-medium px-2.5 py-0.5 rounded-md`}>{selected.type}</span>
            </div>

            <div>
              <span className="text-[11.5px] font-mono text-[#94a3b8] block mb-1">{selected.time} · {selected.duration}</span>
              <h3 className="text-[16px] font-bold text-[#0f172a] leading-tight mb-2">{selected.title}</h3>
              <div className="flex items-center gap-1.5 text-[12px] text-[#64748b]">
                <svg className="w-4 h-4 text-[#ef4444]" fill="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" fill="#fee2e2" r="10" />
                  <polygon fill="#ef4444" points="10 8 16 12 10 16 10 8" />
                </svg>
                <span>{selected.appSubtitle || selected.app}</span>
              </div>
            </div>

            <div className="border border-[#e2e8f0] rounded-xl p-4 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[12px] font-medium text-[#475569]">Goal Alignment</span>
                <span className="text-[12px] font-semibold text-[#2563eb]">94% match</span>
              </div>
              <div className="w-full bg-[#eff6ff] h-1.5 rounded-full overflow-hidden mb-2.5">
                <div className="bg-[#3b82f6] h-full rounded-full" style={{ width: '94%' }} />
              </div>
              <p className="text-[11.5px] text-[#64748b] leading-normal">
                Aligned with <span className="text-[#1e293b] font-medium">"Study electromagnetic induction for my physics exam"</span>
              </p>
            </div>

            <div className="border border-[#e2e8f0] rounded-xl p-4 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
              <div className="flex items-center gap-1.5 mb-2">
                <svg className="w-3.5 h-3.5 text-[#3b82f6]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" viewBox="0 0 24 24">
                  <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                </svg>
                <h4 className="text-[12px] font-semibold text-[#1e293b]">Context & Reasoning</h4>
              </div>
              <p className="text-[12px] text-[#64748b] leading-relaxed">{selected.contextReasoning || selected.description}</p>
            </div>

            <div className="border border-[#e2e8f0] rounded-xl p-4 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-[12px] font-semibold text-[#1e293b]">Goal Milestones</h4>
                <span className="text-[11px] font-mono text-[#94a3b8]">3 of 5</span>
              </div>
              <div className="space-y-2.5 text-[12px]">
                {detailMilestones.map((m, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    {m.status === 'completed' ? (
                      <>
                        <svg className="w-4 h-4 text-[#10b981] flex-shrink-0" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" viewBox="0 0 24 24">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                          <polyline points="22 4 12 14.01 9 11.01" />
                        </svg>
                        <span className="text-[#94a3b8] line-through">{m.label}</span>
                      </>
                    ) : m.status === 'active' ? (
                      <>
                        <div className="w-4 h-4 rounded-full border-2 border-[#3b82f6] flex items-center justify-center flex-shrink-0">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#3b82f6]" />
                        </div>
                        <span className="text-[#0f172a] font-semibold">{m.label}</span>
                      </>
                    ) : (
                      <>
                        <div className="w-4 h-4 rounded-full border border-[#cbd5e1] flex-shrink-0" />
                        <span className="text-[#94a3b8]">{m.label}</span>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-5 space-y-2">
            <button onClick={() => showNotice('Takeaway copied to your notes workspace.')} className="w-full bg-[#3b82f6] hover:bg-[#2563eb] text-white py-2.5 px-4 rounded-xl text-[13px] font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-colors">
              <span>Summarize Takeaway to Notes</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </button>
            <button onClick={() => setModal('reclassify')} className="w-full bg-white hover:bg-[#f8fafc] text-[#334155] border border-[#e2e8f0] py-2.5 px-4 rounded-xl text-[13px] font-medium transition-colors">
              Reclassify Activity
            </button>
          </div>
        </aside>}
      </div>
      {notice && <div className="fixed bottom-5 right-5 z-40 rounded-xl bg-slate-900 px-4 py-3 text-xs font-medium text-white shadow-lg">{notice}</div>}
      {modal === 'objective' && <ActionModal title="Create objective" description="Add a clear target for the next focus session." onClose={() => setModal(null)}><form onSubmit={(event) => { event.preventDefault(); setModal(null); showNotice('Objective created.') }} className="space-y-3"><input required placeholder="Objective title" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" /><button className="w-full rounded-lg bg-blue-600 py-2 text-sm font-semibold text-white">Create objective</button></form></ActionModal>}
      {modal === 'reclassify' && <ActionModal title="Reclassify activity" description="Apply a new classification to the selected activity." onClose={() => setModal(null)}><div className="grid grid-cols-3 gap-2">{['Productive', 'Distraction', 'Stuck'].map((option) => <button key={option} onClick={() => { setModal(null); showNotice(`Marked ${option.toLowerCase()}.`) }} className="rounded-lg border border-slate-200 px-2 py-2 text-xs font-semibold hover:border-blue-400 hover:bg-blue-50">{option}</button>)}</div></ActionModal>}
    </>
  )
}

export default ActivityPage
