import { site } from '../utils'

if (location.origin === site) {
  require('./init')
  require('./DOMWatcher')
}
