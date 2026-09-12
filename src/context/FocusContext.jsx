import { createContext, useContext, useEffect, useRef, useState } from 'react'

const FocusContext = createContext(null)

export function FocusProvider({ children }) {
  const apiRef = useRef(null)
  const [mood, setMood] = useState(60)
  const [analysis, setAnalysis] = useState(null)
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    const api = window.focusAPI
    if (!api) return
    apiRef.current = api

    const onMood = (m) => setMood(m)
    const onAnalysis = (d) => setAnalysis(d)
    const onConn = (s) => setConnected(s.connected)

    api.onMoodUpdate(onMood)
    api.onAnalysisUpdate(onAnalysis)
    api.onConnUpdate(onConn)

    return () => {
      api.onMoodUpdate.removeListener(onMood)
      api.onAnalysisUpdate.removeListener(onAnalysis)
      api.onConnUpdate.removeListener(onConn)
    }
  }, [])

  const sendSettings = (s) => apiRef.current?.sendSettings?.(s)
  const sendTasks = (t) => apiRef.current?.sendTasks?.(t)
  const toggleMonitoring = (e) => apiRef.current?.toggleMonitoring?.(e)
  const nudge = (d) => apiRef.current?.nudge?.(d)

  return (
    <FocusContext.Provider value={{ mood, analysis, connected, sendSettings, sendTasks, toggleMonitoring, nudge }}>
      {children}
    </FocusContext.Provider>
  )
}

export function useFocus() {
  return useContext(FocusContext)
}
