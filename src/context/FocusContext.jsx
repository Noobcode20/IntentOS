import { createContext, useContext, useEffect, useRef, useState } from 'react'

const FocusContext = createContext(null)

export function FocusProvider({ children }) {
  const apiRef = useRef(null)
  const [mood, setMood] = useState(60)
  const [analysis, setAnalysis] = useState(null)
  const [connected, setConnected] = useState(false)
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true)

  useEffect(() => {
    const api = window.focusAPI
    if (!api) return
    apiRef.current = api

    const onMood = (m) => setMood(m)
    const onAnalysis = (d) => setAnalysis(d)
    const onConn = (s) => setConnected(s.connected)

    const stopMood = api.onMoodUpdate(onMood)
    const stopAnalysis = api.onAnalysisUpdate(onAnalysis)
    const stopConn = api.onConnUpdate(onConn)

    // Events can be emitted before React mounts, so hydrate the dashboard
    // from the main process once as well as subscribing to future changes.
    api.getState?.().then((state) => {
      if (typeof state?.mood === 'number') setMood(state.mood)
      if (typeof state?.connected === 'boolean') setConnected(state.connected)
      if (state?.analysis) setAnalysis(state.analysis)
    }).catch(() => {})

    return () => {
      stopMood?.()
      stopAnalysis?.()
      stopConn?.()
    }
  }, [])

  const sendSettings = (s) => apiRef.current?.sendSettings?.(s)
  const sendTasks = (t) => apiRef.current?.sendTasks?.(t)
  const toggleMonitoring = (e) => apiRef.current?.toggleMonitoring?.(e)
  const nudge = (d) => apiRef.current?.nudge?.(d)

  return (
    <FocusContext.Provider value={{ mood, analysis, connected, rightSidebarOpen, toggleRightSidebar: () => setRightSidebarOpen((open) => !open), sendSettings, sendTasks, toggleMonitoring, nudge }}>
      {children}
    </FocusContext.Provider>
  )
}

export function useFocus() {
  return useContext(FocusContext)
}
