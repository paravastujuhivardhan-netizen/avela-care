import { useLayoutEffect, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
const layers: HTMLElement[] = []
let previousOverflow = ''
const focusable = 'button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
export function ModalShell({ children, onClose, label, className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#173F3A]/40 backdrop-blur-xs' }: {
  children: ReactNode; onClose: () => void; label: string; className?: string
}) {
  const layerRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef(onClose)
  useLayoutEffect(() => { closeRef.current = onClose }, [onClose])
  useLayoutEffect(() => {
    const layer = layerRef.current!
    const root = document.getElementById('root')
    const previous = document.activeElement as HTMLElement | null
    const dialog = (layer.querySelector('[role="dialog"]') || layer.firstElementChild || layer) as HTMLElement
    dialog.setAttribute('role', 'dialog')
    dialog.setAttribute('aria-modal', 'true')
    if (!dialog.hasAttribute('aria-labelledby')) dialog.setAttribute('aria-label', label)
    dialog.tabIndex = -1
    if (!layers.length) { previousOverflow = document.body.style.overflow; document.body.style.overflow = 'hidden' }
    layers.push(layer)
    if (root) root.inert = true
    layers.forEach(item => { item.inert = item !== layer })
    const elements = () => [...dialog.querySelectorAll<HTMLElement>(focusable)].filter(element => element.getClientRects().length > 0)
    ;(dialog.querySelector<HTMLElement>('[data-autofocus]') || elements()[0] || dialog).focus()
    const keyboard = (event: KeyboardEvent) => {
      if (layers.at(-1) !== layer) return
      if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); closeRef.current() }
      if (event.key !== 'Tab') return
      const items = elements(), first = items[0], last = items.at(-1)
      if (!first) { event.preventDefault(); dialog.focus(); return }
      if (event.shiftKey && (document.activeElement === first || !dialog.contains(document.activeElement))) { event.preventDefault(); last?.focus() }
      if (!event.shiftKey && (document.activeElement === last || !dialog.contains(document.activeElement))) { event.preventDefault(); first.focus() }
    }
    document.addEventListener('keydown', keyboard, true)
    return () => {
      document.removeEventListener('keydown', keyboard, true)
      const index = layers.indexOf(layer)
      if (index >= 0) layers.splice(index, 1)
      layers.forEach(item => { item.inert = item !== layers.at(-1) })
      if (!layers.length) { if (root) root.inert = false; document.body.style.overflow = previousOverflow }
      if (previous?.isConnected && !previous.closest('[inert]')) previous.focus()
    }
  }, [label])
  return createPortal(<div ref={layerRef} className={className} onMouseDown={event => {
    if (event.target === event.currentTarget) closeRef.current()
  }}>{children}</div>, document.body)
}
