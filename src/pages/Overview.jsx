import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { TopBar, SearchInput, DateSelector, SidebarToggle } from '../components/Layout'
import { useFocus } from '../context/FocusContext'
import ActionModal from '../components/ActionModal'

const activities = [
  {
    id: 1,
    time: '09:02 AM',
    duration: '24 min',
    app: 'YouTube',
    appIcon: (
      <svg className="w-3.5 h-3.5 text-rose-500 fill-current" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
    title: 'Electromagnetic Induction — Physics Lecture',
    description: "Faraday's Law derivation, magnetic flux surfaces & induced electromotive force. High correlation with course syllabus.",
    status: 'Productive',
    borderColor: 'border-emerald-500/60',
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-700',
    badgeBorder: 'border-emerald-200',
  },
  {
    id: 2,
    time: '09:41 AM',
    duration: '18 min',
    app: 'Obsidian',
    appIcon: (
      <svg className="w-3.5 h-3.5 text-purple-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <polygon points="12 2 2 8.5 4 19 12 22 20 19 22 8.5 12 2" />
      </svg>
    ),
    title: 'Physics — EMI notes & Maxwell Eq. Synthesis',
    description: 'Structured markdown synthesis for Faraday integral equations and flux laws. Deep keystroke frequency with zero tab jumping.',
    status: 'Productive',
    borderColor: 'border-emerald-500/60',
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-700',
    badgeBorder: 'border-emerald-200',
  },
  {
    id: 3,
    time: '09:59 AM',
    duration: '15 min',
    app: 'Chrome & Notes',
    appIcon: (
      <svg className="w-3.5 h-3.5 text-amber-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="4" />
        <line x1="21.17" x2="12" y1="8" y2="8" />
        <line x1="3.95" x2="8.54" y1="6.06" y2="14" />
        <line x1="10.88" x2="15.46" y1="21.94" y2="14" />
      </svg>
    ),
    title: 'Repeated research context switching',
    description: 'Rapid search loops across reference documentation without active note taking. IntentOS recommends formulating a single question.',
    status: 'Potentially Stuck',
    borderColor: 'border-amber-400/80',
    badgeBg: 'bg-amber-50',
    badgeText: 'text-amber-800',
    badgeBorder: 'border-amber-200',
  },
]

const milestones = [
  { label: 'Maxwell Equations & Flux', status: 'completed' },
  { label: "Faraday's Law Conceptual Derivation", status: 'completed' },
  { label: 'Electromagnetic Induction Core Lecture', status: 'active' },
  { label: "Lenz's Law Problem Set", status: 'pending' },
  { label: 'Obsidian Synthesis & Equation Sheet', status: 'pending' },
]

const SETTINGS_KEY = 'focus-companion.settings'

function ConnectionSettings() {
  const { connected, sendSettings, toggleMonitoring } = useFocus()
  const [apiUrl, setApiUrl] = useState('')
  const [captureInterval, setCaptureInterval] = useState(15)
  const [monitoring, setMonitoring] = useState(true)
  const [message, setMessage] = useState('Demo mode — add your analyzer endpoint to begin live monitoring.')

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}')
      const savedUrl = typeof saved.apiUrl === 'string' ? saved.apiUrl : ''
      const savedInterval = Number.isFinite(saved.captureInterval) ? saved.captureInterval : 15
      const savedMonitoring = typeof saved.monitoring === 'boolean' ? saved.monitoring : true
      setApiUrl(savedUrl)
      setCaptureInterval(savedInterval)
      setMonitoring(savedMonitoring)
      sendSettings({ apiUrl: savedUrl, captureInterval: savedInterval })
      toggleMonitoring(savedMonitoring)
    } catch {
      // A malformed local value should not prevent the dashboard from loading.
    }
  }, [])

  function saveSettings(event) {
    event.preventDefault()
    const normalizedUrl = apiUrl.trim().replace(/\/$/, '')

    if (normalizedUrl) {
      try {
        const url = new URL(normalizedUrl)
        if (!['http:', 'https:'].includes(url.protocol)) throw new Error('unsupported protocol')
      } catch {
        setMessage('Use a complete http:// or https:// analyzer URL.')
        return
      }
    }

    const nextSettings = { apiUrl: normalizedUrl, captureInterval: Math.max(5, Number(captureInterval) || 15) }
    localStorage.setItem(SETTINGS_KEY, JSON.stringify({ ...nextSettings, monitoring }))
    sendSettings(nextSettings)
    toggleMonitoring(monitoring)
    setMessage(normalizedUrl ? 'Settings saved. The next capture will check the analyzer.' : 'Saved in demo mode.')
  }

  function setMonitoringState(enabled) {
    setMonitoring(enabled)
    toggleMonitoring(enabled)
    try {
      const saved = JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}')
      localStorage.setItem(SETTINGS_KEY, JSON.stringify({ ...saved, monitoring: enabled }))
    } catch {
      // Saving the preference is non-essential; the main process still gets it.
    }
  }

  return (
    <form onSubmit={saveSettings} className="bg-white rounded-xl border border-slate-200 p-5 space-y-3.5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900">Live monitoring</h3>
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${connected ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
          {connected ? 'Connected' : 'Demo mode'}
        </span>
      </div>
      <label className="block space-y-1.5">
        <span className="text-[11px] font-medium text-slate-600">Analyzer URL</span>
        <input
          value={apiUrl}
          onChange={(event) => setApiUrl(event.target.value)}
          type="url"
          placeholder="https://your-server.example"
          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        />
      </label>
      <div className="flex items-end gap-2">
        <label className="flex-1 space-y-1.5">
          <span className="text-[11px] font-medium text-slate-600">Capture interval</span>
          <div className="relative">
            <input
              value={captureInterval}
              onChange={(event) => setCaptureInterval(event.target.value)}
              type="number"
              min="5"
              step="1"
              className="w-full px-3 py-2 pr-12 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
            <span className="absolute right-3 inset-y-0 flex items-center text-[10px] text-slate-400">sec</span>
          </div>
        </label>
        <button type="submit" className="px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">Save</button>
      </div>
      <div className="pt-0.5 flex items-center justify-between gap-3 text-[11px]">
        <span className="text-slate-500 leading-relaxed">{message}</span>
        <button
          type="button"
          onClick={() => setMonitoringState(!monitoring)}
          className={`shrink-0 px-2.5 py-1 rounded-md border font-medium transition-colors ${monitoring ? 'text-emerald-700 bg-emerald-50 border-emerald-200 hover:bg-emerald-100' : 'text-slate-600 bg-slate-50 border-slate-200 hover:bg-slate-100'}`}
        >
          {monitoring ? 'Pause' : 'Resume'}
        </button>
      </div>
    </form>
  )
}

function OverviewPage() {
  const { mood, connected, rightSidebarOpen } = useFocus()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('All')
  const [modal, setModal] = useState(null)
  const [notice, setNotice] = useState('')
  const visibleActivities = activities.filter((activity) => (filter === 'All' || activity.status.toLowerCase().includes(filter.toLowerCase())) && `${activity.title} ${activity.description} ${activity.app}`.toLowerCase().includes(query.toLowerCase()))
  function showNotice(message) { setNotice(message); window.setTimeout(() => setNotice(''), 2500) }
  return (
    <>
      <header className="h-16 px-8 bg-white border-b border-slate-100 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold text-slate-900 tracking-tight">Overview</h1>
          <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${connected ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
            Mood: {Math.round(mood)}% {connected ? '• Live' : '• Demo'}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-72">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" x2="16.65" y1="21" y2="16.65" />
              </svg>
            </span>
            <input
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50/80 border border-slate-200 text-xs rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Search activities, metrics, or objectives..."
              type="text" value={query} onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 text-xs font-medium text-slate-700 rounded-lg hover:bg-slate-50 transition">
            <svg className="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
              <rect height="18" rx="2" ry="2" width="18" x="3" y="4" />
              <line x1="16" x2="16" y1="2" y2="6" />
              <line x1="8" x2="8" y1="2" y2="6" />
              <line x1="3" x2="21" y1="10" y2="10" />
            </svg>
            <span>Today, Oct 24</span>
            <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
              <polyline points="6 9 12 15 18 9" />
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

      <main className="flex-1 overflow-y-auto p-8 space-y-6">
        <section className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-900 uppercase tracking-wide">Session Distribution</span>
              <span className="text-xs text-slate-400 font-normal">09:00 AM — 10:30 AM</span>
            </div>
            <div className="flex items-center gap-1.5">
              {['All', 'Productive', 'Distraction', 'Stuck'].map((option) => <button key={option} onClick={() => setFilter(option)} className={`px-2.5 py-0.5 rounded-md text-[11px] font-medium ${filter === option ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>{option}{option === 'Productive' ? ' (89m)' : option === 'Distraction' ? ' (7m)' : option === 'Stuck' ? ' (15m)' : ''}</button>)}
            </div>
          </div>
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden flex gap-0.5 p-0.5">
            <div className="bg-blue-500 h-full rounded-sm" style={{ width: '28%' }} title="09:02 AM - 09:26 AM: YouTube Physics Lecture (24m)" />
            <div className="bg-blue-400 h-full rounded-sm" style={{ width: '10%' }} title="09:26 AM - 09:34 AM: Google Search - Lenz's Law (8m)" />
            <div className="bg-rose-500 h-full rounded-sm" style={{ width: '8%' }} title="09:34 AM - 09:41 AM: Distraction - Best Gaming Moments (7m)" />
            <div className="bg-blue-600 h-full rounded-sm" style={{ width: '22%' }} title="09:41 AM - 09:59 AM: Obsidian - EMI Notes (18m)" />
            <div className="bg-amber-400 h-full rounded-sm" style={{ width: '18%' }} title="09:59 AM - 10:14 AM: Chrome & Notes - Repeated Context Switching (15m)" />
            <div className="bg-slate-200 h-full rounded-sm flex-1" title="Buffer" />
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1.5 px-0.5">
            <span>09:00 AM</span>
            <span>09:30 AM</span>
            <span>10:00 AM</span>
            <span>10:30 AM</span>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">Top Contexts & Sessions Today</h2>
                <Link to="/activity" className="text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline">View in Chronological Stream →</Link>
              </div>

              {visibleActivities.map((a) => (
                <div key={a.id} className={`bg-white rounded-xl border-2 ${a.borderColor} p-4 transition hover:shadow-sm`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="font-mono text-slate-400">{a.time}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-medium text-slate-700">
                        {a.appIcon}
                        {a.app}
                      </span>
                      <span>•</span>
                      <span className="text-slate-500 font-mono">{a.duration}</span>
                    </div>
                    <span className={`text-[11px] font-medium ${a.badgeText} ${a.badgeBg} px-2 py-0.5 rounded border ${a.badgeBorder}`}>
                      {a.status}
                    </span>
                  </div>
                  <h3 className="mt-2 text-sm font-semibold text-slate-900 tracking-tight">{a.title}</h3>
                  <p className="mt-1 text-xs text-slate-500 leading-relaxed">{a.description}</p>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wide">Goal Milestones</h3>
                  <p className="text-xs text-slate-500">Physics 301 Final • 3 of 5 completed</p>
                </div>
                <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">60% Completed</span>
              </div>
              <div className="space-y-2.5 pt-1">
                {milestones.map((m, i) => (
                  <div key={i} className="flex items-center gap-3 text-xs">
                    {m.status === 'completed' ? (
                      <>
                        <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" viewBox="0 0 24 24">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span className="text-slate-400 line-through">{m.label}</span>
                      </>
                    ) : m.status === 'active' ? (
                      <>
                        <div className="w-4 h-4 rounded-full border-2 border-blue-600 flex items-center justify-center shrink-0">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                        </div>
                        <span className="text-slate-900 font-medium">{m.label}</span>
                        <span className="text-[10px] uppercase font-bold text-blue-600 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">Active</span>
                      </>
                    ) : (
                      <>
                        <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
                        <span className="text-slate-500">{m.label}</span>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {rightSidebarOpen && <ConnectionSettings />}
            {rightSidebarOpen && <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-900">AI Session Synthesis</span>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Optimal</span>
              </div>
              <div className="p-3.5 bg-slate-50/70 border border-slate-200/90 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                  <svg className="w-3.5 h-3.5 text-blue-500" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                  <span>Context & Reasoning</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Detected active derivation of Faraday's Law and magnetic flux equations matching syllabus topics. High keystroke correlation in Obsidian notes without distracting tab switching.
                </p>
              </div>
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500 font-medium">Session Goal Alignment</span>
                  <span className="text-blue-600 font-semibold">94% match</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-full" style={{ width: '94%' }} />
                </div>
                <p className="text-[11px] text-slate-400 italic pt-1">Aligned with "Study electromagnetic induction for my physics exam"</p>
              </div>
            </div>}

            {rightSidebarOpen && <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3.5 shadow-sm">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900">Intent Defense & Interventions</h3>
              <div className="p-3 rounded-lg bg-rose-50/50 border border-rose-100 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-rose-900">1 Distraction Intercepted</span>
                  <span className="text-[10px] font-mono text-rose-600">09:34 AM</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  <strong>YouTube:</strong> "Best Gaming Moments & Highlights 2024" was flagged as unrelated to the physics domain. Focus recovered after 7m.
                </p>
              </div>
              <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100">
                <span>Automatic Nudges Enabled</span>
                <span className="font-medium text-emerald-600 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Active
                </span>
              </div>
            </div>}

            {rightSidebarOpen && <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-2.5 shadow-sm">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900 mb-3">Quick Actions</h3>
              <button onClick={() => showNotice('Takeaways copied to your notes workspace.')} className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-medium rounded-lg flex items-center justify-center gap-2 shadow-sm shadow-blue-500/10 transition">
                <span>Summarize Takeaways to Notes</span>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                  <line x1="5" x2="19" y1="12" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
              <button onClick={() => setModal('reclassify')} className="w-full py-2 px-4 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-medium rounded-lg transition">Reclassify Activities</button>
              <button onClick={() => setModal('scope')} className="w-full py-2 px-4 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-medium rounded-lg transition">Adjust Focus Scope</button>
            </div>}
          </div>
        </div>
      </main>
      {notice && <div className="fixed bottom-5 right-5 z-40 rounded-xl bg-slate-900 px-4 py-3 text-xs font-medium text-white shadow-lg">{notice}</div>}
      {modal === 'objective' && <ActionModal title="Create objective" description="Give your next focus session a clear target." onClose={() => setModal(null)}><form onSubmit={(event) => { event.preventDefault(); localStorage.setItem('focus-companion.newObjective', event.currentTarget.title.value); setModal(null); showNotice('Objective created.') }} className="space-y-3"><input name="title" required placeholder="Objective title" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" /><textarea name="description" placeholder="What does success look like?" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" /><button className="w-full rounded-lg bg-blue-600 py-2 text-sm font-semibold text-white">Create objective</button></form></ActionModal>}
      {modal === 'reclassify' && <ActionModal title="Reclassify activities" description="Choose how IntentOS should treat the selected session." onClose={() => setModal(null)}><div className="grid grid-cols-3 gap-2">{['Productive', 'Distraction', 'Stuck'].map((option) => <button key={option} onClick={() => { setModal(null); showNotice(`Activities marked ${option.toLowerCase()}.`) }} className="rounded-lg border border-slate-200 px-2 py-2 text-xs font-semibold hover:border-blue-400 hover:bg-blue-50">{option}</button>)}</div></ActionModal>}
      {modal === 'scope' && <ActionModal title="Adjust focus scope" description="Update the session guardrail used by the analyzer." onClose={() => setModal(null)}><form onSubmit={(event) => { event.preventDefault(); setModal(null); showNotice('Focus scope updated.') }} className="space-y-3"><input defaultValue="Physics 301 Final" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" /><button className="w-full rounded-lg bg-blue-600 py-2 text-sm font-semibold text-white">Save scope</button></form></ActionModal>}
    </>
  )
}

export default OverviewPage
