import { useCallback, useEffect, useRef, useState } from 'react'

export function useSpokenReplies() {
  const [voiceEnabled, setVoiceEnabledState] = useState(() => {
    try { return localStorage.getItem('avela_voice_enabled') !== 'false' } catch { return true }
  })
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [activeSpeechMessageId, setActiveSpeechMessageId] = useState<string | null>(null)
  const [autoplayBlocked, setAutoplayBlocked] = useState(false)
  const voiceEnabledRef = useRef(voiceEnabled)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window

  const stopSpeech = useCallback(() => {
    utteranceRef.current = null
    if (supported) window.speechSynthesis.cancel()
    setIsSpeaking(false); setIsPaused(false); setActiveSpeechMessageId(null)
  }, [supported])
  const setVoiceEnabled = useCallback((enabled: boolean) => {
    voiceEnabledRef.current = enabled
    setVoiceEnabledState(enabled)
    try { localStorage.setItem('avela_voice_enabled', String(enabled)) } catch { /* Keep the in-memory preference. */ }
    if (!enabled) stopSpeech()
  }, [stopSpeech])
  const speakMessage = useCallback((id: string, text: string, force = false) => {
    if (!supported || (!voiceEnabledRef.current && !force) || !text.trim()) return
    stopSpeech()
    setAutoplayBlocked(false)
    setActiveSpeechMessageId(id)
    try {
      const utterance = new SpeechSynthesisUtterance(text.replace(/\n+/g, '. '))
      utterance.lang = 'en-IN'
      utteranceRef.current = utterance
      utterance.onstart = () => { if (utteranceRef.current === utterance) setIsSpeaking(true) }
      utterance.onend = () => {
        if (utteranceRef.current !== utterance) return
        utteranceRef.current = null; setIsSpeaking(false); setIsPaused(false); setActiveSpeechMessageId(null)
      }
      utterance.onerror = () => {
        if (utteranceRef.current !== utterance) return
        utteranceRef.current = null; setIsSpeaking(false); setIsPaused(false); setAutoplayBlocked(true)
      }
      window.speechSynthesis.speak(utterance)
    } catch { setAutoplayBlocked(true) }
  }, [stopSpeech, supported])
  const pauseSpeech = useCallback(() => {
    if (supported) { window.speechSynthesis.pause(); setIsPaused(true) }
  }, [supported])
  const resumeSpeech = useCallback(() => {
    if (supported) { window.speechSynthesis.resume(); setIsPaused(false) }
  }, [supported])
  useEffect(() => () => { if (supported) window.speechSynthesis.cancel() }, [supported])
  return { voiceEnabled, setVoiceEnabled, speechSynthesisSupported: supported, isSpeaking, isPaused,
    activeSpeechMessageId, autoplayBlocked, speakMessage, pauseSpeech, resumeSpeech, stopSpeech }
}
