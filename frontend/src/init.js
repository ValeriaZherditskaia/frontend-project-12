import Profanity from 'leo-profanity'
import './i18n.js'

Profanity.loadDictionary('ru')
Profanity.loadDictionary('en')

export const rollbarConfig = {
  accessToken: import.meta.env.VITE_ROLLBAR_ACCESS_TOKEN,
  captureUncaught: true,
  captureUnhandledRejections: true,
  environment: import.meta.env.MODE,
}
