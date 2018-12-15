// @flow
import { createMacro } from 'babel-plugin-macros'

export default createMacro(({ references, state, babel }) => {
  throw new Error('something')
})
