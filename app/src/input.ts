export type InputAction =
  | 'up' | 'down' | 'left' | 'right' | 'enter' | 'back'
  | 'ch_plus' | 'ch_minus' | 'num'

export interface InputEvent {
  action: InputAction
  value?: number
}

export function attachInput(onEvent: (ev: InputEvent) => void) {
  let numBuf = ''
  let numTimer: number | undefined

  window.addEventListener('keydown', (e) => {
    switch (e.key) {
      case 'ArrowUp': return onEvent({ action: 'up' })
      case 'ArrowDown': return onEvent({ action: 'down' })
      case 'ArrowLeft': return onEvent({ action: 'left' })
      case 'ArrowRight': return onEvent({ action: 'right' })
      case 'Enter': return onEvent({ action: 'enter' })
      case 'Backspace': return onEvent({ action: 'back' })
      case 'PageUp': return onEvent({ action: 'ch_plus' })
      case 'PageDown': return onEvent({ action: 'ch_minus' })
    }
    if (/^[0-9]$/.test(e.key)) {
      numBuf += e.key
      if (numTimer) clearTimeout(numTimer)
      numTimer = window.setTimeout(() => {
        const val = Number(numBuf)
        numBuf = ''
        onEvent({ action: 'num', value: val })
      }, 800)
    }
  })
}
