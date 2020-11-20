import getters from './getters'
import { importAll } from '@/utils'

export default (() => {
  const modulesContext = require.context('./modules', false, /\.js$/)
  const modules = importAll(modulesContext)
  return {
    modules,
    getters
  }
})()
