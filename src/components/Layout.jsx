import { useState } from 'react'
import { Link, useLocation, Outlet } from 'react-router-dom'
import { FocusProvider, useFocus } from '../context/FocusContext'

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

function Sidebar({ activePage, collapsed, onToggle }) {
  const navItems = [
    { path: '/', label: 'Overview', icon: overviewIcon },
    { path: '/activity', label: 'Activity', icon: activityIcon },
    { path: '/objectives', label: 'Objectives', icon: objectivesIcon, badge: '3 Active' },
  ]

  const collapseIcon = (
    <svg className="w-3.5 h-3.5 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m15 18-6-6 6-6" />
    </svg>
  )

  const expandIcon = (
    <svg className="w-3.5 h-3.5 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 18 6-6-6-6" />
    </svg>
  )

  return (
    <aside
      className={`bg-white border-r border-slate-100 flex flex-col justify-between shrink-0 z-20 h-full transition-all duration-200 ${
        collapsed ? 'w-[72px]' : 'w-64'
      }`}
    >
      <div className={`p-5 flex flex-col gap-6 ${collapsed ? 'items-center' : ''}`}>
        <div className={`flex items-center justify-between ${collapsed ? 'flex-col gap-3' : ''}`}>
          <div className={`flex items-center gap-2.5 ${collapsed ? '' : ''}`}>
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/30 shrink-0">
              {logoIcon}
            </div>
            {!collapsed && <span className="font-bold text-[17px] tracking-tight text-slate-900">IntentOS</span>}
          </div>
          {!collapsed && (
            <div className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </div>
          )}
          {collapsed && (
            <div className="flex flex-col items-center gap-3 mt-1">
              <div className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </div>
              <button
                onClick={onToggle}
                className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                title="Expand"
              >
                {expandIcon}
              </button>
            </div>
          )}
          {!collapsed && (
            <button
              onClick={onToggle}
              className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              title="Collapse"
            >
              {collapseIcon}
            </button>
          )}
        </div>

        <div className={`flex flex-col gap-1.5 ${collapsed ? 'items-center w-full' : ''}`}>
                 {!collapsed && <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-3 mb-1">Workspace</div>}
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
                  } ${collapsed ? 'justify-center px-2' : ''}`}
                 >
                <div className={`flex items-center gap-3 ${collapsed ? '' : ''}`}>
                  <span className={isActive ? 'text-blue-600' : 'text-slate-400'}>{item.icon}</span>
                  {!collapsed && item.label}
                </div>
                {!collapsed && item.badge && (
                  <span className="px-1.5 py-0.5 text-[10px] font-bold bg-blue-100 text-blue-700 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </div>
      </div>

      {collapsed && (
        <div className="p-3 flex flex-col items-center gap-3">
          {/* Collapsed state uses the vertical progress bar. */}
          <div className="relative w-1.5 h-16 bg-slate-200 rounded-full overflow-hidden">
            <div className="absolute bottom-0 left-0 w-full bg-blue-600 rounded-full" style={{ height: '68%' }} />
          </div>
          <div className="relative flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-slate-700 text-white flex items-center justify-center font-bold text-[10px] border border-white/20 shadow-md">
              AR
            </div>
          </div>
        </div>
      )}

      {!collapsed && (
        <div className="p-4 flex flex-col gap-4">
          <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Session Scope</span>
              <span className="text-[9px] font-bold uppercase tracking-wide bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-md">Priority</span>
            </div>
            <div className="font-semibold text-[13px] text-slate-900 mb-2">Physics 301 Final</div>
            {/* Expanded state uses the horizontal progress bar. */}
            <div className="relative w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mb-2">
              <div className="absolute inset-y-0 left-0 bg-blue-600 rounded-full" style={{ width: '68%' }} />
            </div>
            <div className="text-[11px] text-slate-500 font-mono flex items-center justify-between">
              <span>1h 42m elapsed</span>
              <span className="text-slate-400">2h 30m</span>
            </div>
          </div>

          <button type="button" onClick={() => window.dispatchEvent(new CustomEvent('focus-profile'))} className="flex items-center justify-between px-2 py-1 cursor-pointer hover:bg-slate-50 rounded-xl transition-colors text-left">
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
          </button>
        </div>
      )}
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
  const [value, setValue] = useState('')
  return (
    <div className="relative w-48 md:w-64 lg:w-80">
      {searchIcon}
      <input
        type="text"
        placeholder="Search objectives, milestones, or topics..."
        value={value}
        onChange={(event) => { setValue(event.target.value); window.dispatchEvent(new CustomEvent('intent-search', { detail: event.target.value })) }}
        className="w-full pl-9 pr-3.5 py-1.5 text-xs bg-slate-50 border border-slate-200/80 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white text-slate-700 placeholder-slate-400 transition-all"
      />
    </div>
  )
}

function DateSelector() {
  const [open, setOpen] = useState(false)
  const [label, setLabel] = useState('Today, Oct 24')
  return (
    <div className="relative"><button onClick={() => setOpen(!open)} className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200/80 rounded-xl hover:bg-slate-50 transition-colors shadow-sm">
      {calendarIcon}
      <span>{label}</span>
      {chevronDownIcon}
    </button>{open && <div className="absolute right-0 top-9 z-30 w-36 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg">{['Today, Oct 24', 'Yesterday, Oct 23', 'Last 7 days'].map((option) => <button key={option} onClick={() => { setLabel(option); setOpen(false) }} className="block w-full rounded-lg px-2.5 py-2 text-left text-xs text-slate-600 hover:bg-slate-50">{option}</button>)}</div>}</div>
  )
}

function SidebarToggle() {
  const { toggleRightSidebar } = useFocus()
  return (
    <button
      type="button"
      className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 active:scale-[0.98] transition-all"
      title="Toggle right sidebar"
      aria-label="Toggle right sidebar"
      onClick={toggleRightSidebar}
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
        <rect height="18" rx="2" ry="2" width="18" x="3" y="3" />
        <line x1="12" x2="12" y1="3" y2="21" />
      </svg>
    </button>
  )
}

export default function Layout({ children }) {
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <FocusProvider>
      <div className="flex h-screen w-screen overflow-hidden bg-[#fcfdff]">
        <Sidebar activePage={location.pathname} collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
        <main className="flex-1 flex flex-col h-full min-w-0 overflow-hidden bg-[#fafbfc]">
          <Outlet />
        </main>
      </div>
    </FocusProvider>
  )
}

export { TopBar, SearchInput, DateSelector, SidebarToggle, logoIcon, calendarIcon, chevronDownIcon, searchIcon }
