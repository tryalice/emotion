// @flow
import { isBrowser, type EmotionCache } from '@emotion/utils'
import * as React from 'react'
import createCache from '@emotion/cache'

export let CacheContext = React.createContext(isBrowser ? createCache() : null)

export let ThemeContext = React.createContext<Object>({})
export let CacheProvider: React.ComponentType<{ value: EmotionCache }> =
  // $FlowFixMe
  CacheContext.Provider

let withEmotionCache = function withEmotionCache<Props, Ref: React.Ref<*>>(
  func: (props: Props, cache: EmotionCache, ref: Ref) => React.Node
): React.StatelessFunctionalComponent<Props> {
  let render = (props: Props, ref: Ref) => {
    return (
      <CacheContext.Consumer>
        {(
          // $FlowFixMe we know it won't be null
          cache: EmotionCache
        ) => {
          return func(props, cache, ref)
        }}
      </CacheContext.Consumer>
    )
  }
  // $FlowFixMe
  return React.forwardRef(render)
}

let consume = (func: EmotionCache => React.Node) => {
  return (
    <CacheContext.Consumer>
      {
        // $FlowFixMe we know it won't be null
        func
      }
    </CacheContext.Consumer>
  )
}

if (!isBrowser) {
  class BasicProvider extends React.Component<
    { children: EmotionCache => React.Node },
    { value: EmotionCache }
  > {
    state = { value: createCache() }
    render() {
      return (
        <CacheContext.Provider {...this.state}>
          {this.props.children(this.state.value)}
        </CacheContext.Provider>
      )
    }
  }

  withEmotionCache = function withEmotionCache<Props>(
    func: (props: Props, cache: EmotionCache) => React.Node
  ): React.StatelessFunctionalComponent<Props> {
    return (props: Props) => (
      <CacheContext.Consumer>
        {context => {
          if (context === null) {
            return (
              <BasicProvider>
                {newContext => {
                  return func(props, newContext)
                }}
              </BasicProvider>
            )
          } else {
            return func(props, context)
          }
        }}
      </CacheContext.Consumer>
    )
  }
  consume = (func: EmotionCache => React.Node) => {
    return (
      <CacheContext.Consumer>
        {context => {
          if (context === null) {
            return (
              <BasicProvider>
                {newContext => {
                  return func(newContext)
                }}
              </BasicProvider>
            )
          } else {
            return func(context)
          }
        }}
      </CacheContext.Consumer>
    )
  }
}

export { consume, withEmotionCache }
