import { eventBus } from './utils'

// append css to head
eventBus.once('head-ready', () => {
  let scrollBarStyle = document.createElement('style')
  scrollBarStyle.setAttribute('type', 'text/css')
  scrollBarStyle.textContent += '::-webkit-scrollbar{display:none}body{cursor:default;image-rendering:-webkit-optimize-contrast}[class*=btn-]{cursor:pointer}'
  document.head.appendChild(scrollBarStyle)

  scrollBarStyle = null
})

// prevent stop music play
eventBus.once('head-ready', () => {
  window.addEventListener('blur', event =>
    event.stopImmediatePropagation())
})
