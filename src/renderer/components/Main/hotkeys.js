import registerHotkey from '@/libs/registerHotkey'
const { ipcRenderer } = chrome

export default function () {
  function gameViewDevTools () {
    ipcRenderer.send('GameViewOpenDevTools')
  }

  function gameViewRefresh () {
    this.$bus.$emit('GameViewReload')
  }

  function gameViewRefreshIgnoringCache () {
    ipcRenderer.send('GameViewReloadIgnoringCache')
  }

  // Set hotkey
  if (process.platform === 'darwin') {
    // Command + Option + I: open game view DevTools on OSX
    registerHotkey('Command+Option+I', gameViewDevTools)
    // Command + R: refresh game view on OSX
    registerHotkey('Command+R', gameViewRefresh)
    // Command + Shift + R: refresh game view and ignores cache on OSX
    registerHotkey('Command+Shift+R', gameViewRefreshIgnoringCache)
  } else {
    // F12: open game view DevTools
    registerHotkey('F12', gameViewDevTools)
    // F5: refresh game view
    registerHotkey('F5', gameViewRefresh)
    // Ctrl + R: refresh game view
    registerHotkey('Ctrl+R', gameViewRefresh)
    // Shift + F5: refresh game view and ignores cache
    registerHotkey('Shift+F5', gameViewRefreshIgnoringCache)
    // Ctrl + Shift + R: refresh game view and ignores cache
    registerHotkey('Ctrl+Shift+R', gameViewRefreshIgnoringCache)
  }

  // Ctrl + Alt + I: open hostView DevTools
  registerHotkey('Ctrl+Alt+I', () => ipcRenderer.send('HostViewOpenDevTools'))

  // H: hide submenu
  registerHotkey('H', () => {
    const { subHide } = this.$store.state.Config
    if (!subHide && this.$store.state.GameView.subOpen) {
      this.$bus.$emit('GameViewToggleSubmenu')
    }
    this.$store.dispatch('Config/Update', {
      subHide: !subHide
    })
  })

  registerHotkey.listen()
}
