import { Link, useLocation, Outlet } from 'react-router-dom'
import { FocusProvider } from '../context/FocusContext'

const logoIcon = (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
  </svg>
)

const overviewIcon = (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="7" height="7" x="3" y="3" rx="1.5" />
    <rect width="7" height="7" x="14" y="3" rx="1.5" />
    <rect width="7" height="7" x="14" y="14" rx="1.5" />
    <rect width="7" height="7" x="3" y="14" rx="1.5" />
  </svg>
)

const activityIcon = (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
)

const objectivesIcon = (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
)

const searchIcon = (
  <svg className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
)

const calendarIcon = (
  <svg className="w-3.5 h-3.5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
    <line x1="16" x2="16" y1="2" y2="6" />
    <line x1="8" x2="8" y1="2" y2="6" />
    <line x1="3" x2="21" y1="10" y2="10" />
  </svg>
)

const chevronDownIcon = (
  <svg className="w-3 h-3 text-slate-400 ml-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m6 9 6 6 6-6" />
  </svg>
)

function Sidebar({ activePage }) {
  const navItems = [
    { path: '/', label: 'Overview', icon: overviewIcon },
    { path: '/activity', label: 'Activity', icon: activityIcon },
    { path: '/objectives', label: 'Objectives', icon: objectivesIcon, badge: '3 Active' },
  ]

  return (
    <aside className="w-64 bg-white border-r border-slate-100 flex flex-col justify-between shrink-0 z-20 h-full">
      <div className="p-5 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/30">
              {logoIcon}
            </div>
            <span className="font-bold text-[17px] tracking-tight text-slate-900">IntentOS</span>
          </div>
          <div className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-3 mb-1">Workspace</div>
          {navItems.map((item) => {
            const isActive = activePage === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-between px-3 py-2 rounded-xl transition-colors font-medium text-[13.5px] ${
                  isActive
                    ? 'bg-blue-50/70 text-blue-600 font-semibold shadow-sm shadow-blue-500/5'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? 'text-blue-600' : 'text-slate-400'}>{item.icon}</span>
                  {item.label}
                </div>
                {item.badge && (
                  <span className="px-1.5 py-0.5 text-[10px] font-bold bg-blue-100 text-blue-700 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </div>
      </div>

      <div className="p-4 flex flex-col gap-4">
        <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Session Scope</span>
            <span className="text-[9px] font-bold uppercase tracking-wide bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-md">Priority</span>
          </div>
          <div className="font-semibold text-[13px] text-slate-900 mb-2">Physics 301 Final</div>
          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mb-2">
            <div className="bg-blue-600 h-full rounded-full" style={{ width: '68%' }} />
          </div>
          <div className="text-[11px] text-slate-500 font-mono flex items-center justify-between">
            <span>1h 42m elapsed</span>
            <span className="text-slate-400">2h 30m</span>
          </div>
        </div>

        <div className="flex items-center justify-between px-2 py-1 cursor-pointer hover:bg-slate-50 rounded-xl transition-colors">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs border border-white shadow-sm">
              AR
            </div>
            <div className="flex flex-col">
              <span className="text-[13px] font-semibold text-slate-900 leading-tight">Alex Rivera</span>
              <span className="text-[11px] text-slate-400 leading-tight">Pro Plan</span>
            </div>
          </div>
          <svg className="w-3.5 h-3.5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m7 15 5 5 5-5" />
            <path d="m7 9 5-5 5 5" />
          </svg>
        </div>
      </div>
    </aside>
  )
}

function TopBar({ title, children }) {
  return (
    <header className="h-16 px-8 bg-white border-b border-slate-100 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">{title}</h1>
      </div>
      <div className="flex items-center gap-3">
        {children}
      </div>
    </header>
  )
}

function SearchInput() {
  return (
    <div className="relative w-80">
      {searchIcon}
      <input
        type="text"
        placeholder="Search objectives, milestones, or topics..."
        className="w-full pl-9 pr-3.5 py-1.5 text-xs bg-slate-50 border border-slate-200/80 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white text-slate-700 placeholder-slate-400 transition-all"
      />
    </div>
  )
}

function DateSelector() {
  return (
    <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200/80 rounded-xl hover:bg-slate-50 transition-colors shadow-sm">
      {calendarIcon}
      <span>Today, Oct 24</span>
      {chevronDownIcon}
    </button>
  )
}

export default function Layout({ children }) {
  const location = useLocation()

  return (
    <FocusProvider>
      <div className="flex h-screen w-screen overflow-hidden bg-[#fcfdff]">
        <Sidebar activePage={location.pathname} />
        <main className="flex-1 flex flex-col h-full min-w-0 overflow-hidden bg-[#fafbfc]">
          <Outlet />
        </main>
      </div>
    </FocusProvider>
  )
}

export { TopBar, SearchInput, DateSelector, logoIcon, calendarIcon, chevronDownIcon, searchIcon }