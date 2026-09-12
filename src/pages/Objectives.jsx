import { Link } from 'react-router-dom'
import { TopBar, SearchInput, DateSelector } from '../components/Layout'

const objectivesData = [
  {
    id: 1,
    title: 'Physics 301 Final: Electromagnetic Fields',
    description: "Study electromagnetic induction, Faraday's Law derivation, Maxwell synthesis and problem sets.",
    priority: 'Current Focus',
    alignment: '94% Aligned',
    due: 'Due in 4 days',
    progress: 60,
    completed: 3,
    total: 5,
    sessionContext: 'Obsidian & YouTube Lecture',
    focusedTime: '1h 42m focused today',
    color: 'blue',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
        <path d="M6 6h10" />
        <path d="M6 10h10" />
      </svg>
    ),
    milestones: [
      { label: "Maxwell Equations & Magnetic Flux Surfaces", status: 'completed', time: 'Completed • 09:18 AM' },
      { label: "Faraday's Law Conceptual Derivation", status: 'completed', time: 'Completed • 09:38 AM' },
      { label: 'Electromagnetic Induction Core Lecture & Vector Proof', status: 'active', time: 'Current Step • 24m' },
      { label: "Lenz's Law Problem Set (Problems 14-26)", status: 'pending', time: 'Next up (~35m)' },
      { label: 'Obsidian Synthesis & Final Equation Cheat Sheet', status: 'pending', time: 'Pending (~20m)' },
    ],
  },
  {
    id: 2,
    title: 'CS 240: Distributed Consensus Implementation',
    description: 'Build Raft leader election algorithm in Go with fault tolerance unit tests.',
    priority: 'Medium Priority',
    due: 'Due Friday',
    progress: 50,
    completed: 2,
    total: 4,
    color: 'purple',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
  {
    id: 3,
    title: 'Research Grant Proposal: Neural Interfaces',
    description: 'Draft 5-page literature review and preliminary budget for undergraduate seed fund.',
    priority: 'Low Priority',
    due: 'Due Nov 2',
    progress: 25,
    completed: 1,
    total: 4,
    color: 'amber',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v20" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
]

function ObjectiveCard({ obj }) {
  return (
    <div className={`bg-white rounded-2xl border p-5 shadow-sm hover:shadow-md transition-all flex flex-col gap-4 ${obj.id === 1 ? 'border-2 border-blue-500/40' : 'border border-slate-200/90'}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl bg-${obj.color}-50 border border-${obj.color}-100 flex items-center justify-center text-${obj.color}-600 font-bold text-sm`}>
            {obj.icon}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-bold text-base text-slate-900">{obj.title}</h2>
              {obj.priority && (
                <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide rounded-md ${
                  obj.id === 1 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
                }`}>
                  {obj.priority}
                </span>
              )}
              {obj.alignment && (
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide bg-emerald-100 text-emerald-800 rounded-md">
                  {obj.alignment}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{obj.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-mono font-medium text-slate-500">{obj.due}</span>
          <button className="text-slate-400 hover:text-slate-600 p-1">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="1" />
              <circle cx="19" cy="12" r="1" />
              <circle cx="5" cy="12" r="1" />
            </svg>
          </button>
        </div>
      </div>

      <div className="bg-slate-50/80 rounded-xl p-3.5 border border-slate-100 flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-700">Milestone Progress: <span className="text-blue-600 font-bold">{obj.completed} of {obj.total} Completed</span></span>
          <span className="font-mono text-slate-500 font-semibold">{obj.progress}% Complete</span>
        </div>
        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
          <div className={`bg-${obj.color}-600 h-full rounded-full transition-all`} style={{ width: `${obj.progress}%` }} />
        </div>
        {obj.id === 1 && (
          <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Active session context: <strong className="text-slate-700 font-medium">{obj.sessionContext}</strong>
            </span>
            <span className="font-mono text-slate-500">{obj.focusedTime}</span>
          </div>
        )}
      </div>

      {obj.milestones && (
        <div className="flex flex-col gap-2 pt-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Milestones Breakdown</div>
          <div className="grid grid-cols-1 gap-2">
            {obj.milestones.map((m, i) => (
              <div
                key={i}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs ${
                  m.status === 'completed'
                    ? 'bg-emerald-50/50 border border-emerald-200/60'
                    : m.status === 'active'
                    ? 'bg-blue-50/60 border border-blue-300 shadow-xs'
                    : 'bg-white border border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  {m.status === 'completed' ? (
                    <div className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                      <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                  ) : m.status === 'active' ? (
                    <div className="w-4 h-4 rounded-full border-2 border-blue-600 flex items-center justify-center bg-white">
                      <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                    </div>
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-300" />
                  )}
                  <span className={`${m.status === 'completed' ? 'text-slate-500 line-through font-medium' : m.status === 'active' ? 'text-blue-900 font-semibold' : 'text-slate-700 font-medium'}`}>
                    {m.label}
                  </span>
                </div>
                <span className={`text-[11px] font-medium px-2 py-0.5 rounded ${
                  m.status === 'completed' ? 'text-emerald-700 bg-emerald-100/70' :
                  m.status === 'active' ? 'text-blue-700 bg-blue-100 font-bold' :
                  'text-slate-400 font-mono'
                }`}>
                  {m.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function ObjectivesPage() {
  return (
    <>
      <TopBar title="Objectives">
        <SearchInput />
        <DateSelector />
        <button className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm shadow-blue-500/20">
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14" />
            <path d="M12 5v14" />
          </svg>
          New Objective
        </button>
        <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200/60 ml-1">
          <button className="p-1 rounded-md bg-white shadow-sm text-slate-700">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <path d="M9 3v18" />
            </svg>
          </button>
        </div>
      </TopBar>

      <div className="flex-1 flex min-h-0 overflow-hidden">
        <div className="flex-1 overflow-y-auto px-8 py-6 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button className="px-3.5 py-1.5 text-xs font-medium text-slate-600 bg-white hover:bg-slate-50 border border-slate-200/80 rounded-xl transition-colors">
                High Priority (1)
              </button>
              <button className="px-3.5 py-1.5 text-xs font-medium text-slate-600 bg-white hover:bg-slate-50 border border-slate-200/80 rounded-xl transition-colors">
                Academic (2)
              </button>
              <button className="px-3.5 py-1.5 text-xs font-medium text-slate-600 bg-white hover:bg-slate-50 border border-slate-200/80 rounded-xl transition-colors">
                Archived (5)
              </button>
            </div>
            <span className="text-xs font-medium text-slate-400">Sorting by: <strong className="text-slate-700 font-semibold">Priority & Live Activity</strong></span>
          </div>

          {objectivesData.map((obj) => (
            <ObjectiveCard key={obj.id} obj={obj} />
          ))}
        </div>

        <aside className="w-96 bg-white border-l border-slate-100 p-6 flex flex-col gap-5 overflow-y-auto shrink-0">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Objective Insights</span>
            <span className="text-xs font-semibold px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200/60 rounded-full">In Focus</span>
          </div>

          <div className="flex flex-col gap-1 pb-1">
            <span className="text-[11px] font-mono text-slate-400 uppercase">Selected Scope</span>
            <h3 className="text-base font-bold text-slate-900 leading-snug">Physics 301 Final Exam</h3>
            <p className="text-xs text-slate-500">Goal prompt: "Study electromagnetic induction for my physics exam without distraction"</p>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50/40 border border-blue-100 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-800">Live Intent Alignment</span>
              <span className="text-sm font-bold text-blue-600 font-mono">94%</span>
            </div>
            <div className="w-full bg-blue-100/70 h-2 rounded-full overflow-hidden">
              <div className="bg-blue-600 h-full rounded-full" style={{ width: '94%' }} />
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Telemetry indicates strong semantic adherence across browser research and note-taking windows.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50/90 border border-slate-100 flex flex-col gap-2.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-900">
              <svg className="w-4 h-4 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
              </svg>
              Intent Detection & Milestones
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              IntentOS automatically classified <strong>Faraday's Law Derivation</strong> as completed after 18m of dense mathematical synthesis in Obsidian matching syllabus items.
            </p>
            <div className="text-[11px] text-slate-400 font-mono pt-1">Last evaluated: 2 minutes ago</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50/90 border border-slate-100 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-900">
                <svg className="w-4 h-4 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                </svg>
                Domain Shielding Rules
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/70 px-1.5 py-0.5 rounded">Active</span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-700">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Allowed: YouTube (Physics & STEM)
                </span>
                <span className="text-[11px] text-slate-400 font-mono">Whitelisted</span>
              </div>
              <div className="flex items-center justify-between text-slate-700">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                  Blocked: Algorithmic Feeds & Gaming
                </span>
                <span className="text-[11px] text-rose-500 font-mono">Hard Nudge</span>
              </div>
              <div className="flex items-center justify-between text-slate-700">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  Stuck loop assistance: &gt;12m idle
                </span>
                <span className="text-[11px] text-amber-600 font-mono">Auto-Prompt</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2.5 mt-auto pt-4">
            <Link to="/objectives" className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl transition-colors shadow-sm shadow-blue-500/20 flex items-center justify-center gap-2">
              <span>Add Milestone to Objective</span>
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
            </Link>
            <button className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors">
              Configure Intent Guardrails
            </button>
          </div>
        </aside>
      </div>
    </>
  )
}

export default ObjectivesPage