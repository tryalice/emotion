// @flow
// https://github.com/thysultan/stylis.js/tree/master/plugins/rule-sheet
// inlined to avoid umd wrapper and peerDep warnings/installing stylis
// since we use stylis after closure compiler

import type { StylisPlugin } from './types'
import { insert } from '@emotion/sheet'
import { type Sheet as SheetType } from '@emotion/utils'

const delimiter = '/*|*/'
const needle = delimiter + '}'

function toSheet(block) {
  if (block) {
    insert(Sheet.current, block + '}')
  }
}

export let Sheet: { current: SheetType } = {
  current: (null: any)
}

export let ruleSheet: StylisPlugin = (
  context,
  content,
  selectors,
  parents,
  line,
  column,
  length,
  ns,
  depth,
  at
) => {
  switch (context) {
    // property
    case 1: {
      switch (content.charCodeAt(0)) {
        case 64: {
          // @import
          insert(Sheet.current, content + ';')
          return ''
        }
        // charcode for l
        case 108: {
          // charcode for b
          // this ignores label
          if (content.charCodeAt(2) === 98) {
            return ''
          }
        }
      }
      break
    }
    // selector
    case 2: {
      if (ns === 0) return content + delimiter
      break
    }
    // at-rule
    case 3: {
      switch (ns) {
        // @font-face, @page
        case 102:
        case 112: {
          Sheet.current.insert(selectors[0] + content)
          return ''
        }
        default: {
          return content + (at === 0 ? delimiter : '')
        }
      }
    }
    case -2: {
      content.split(needle).forEach(toSheet)
    }
  }
}

export let removeLabel: StylisPlugin = (context, content) => {
  if (
    context === 1 &&
    // charcode for l
    content.charCodeAt(0) === 108 &&
    // charcode for b
    content.charCodeAt(2) === 98
    // this ignores label
  ) {
    return ''
  }
}
