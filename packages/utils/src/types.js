// @flow

export type Sheet = {
  tags: Array<HTMLStyleElement>,
  ctr: number,
  before: null | Element,
  opts: {
    nonce?: string,
    key: string,
    container: Element,
    speedy: boolean
  }
}

export type RegisteredCache = { [string]: string }

export type Interpolation = any

export type SerializedStyles = {|
  name: string,
  styles: string,
  map?: string,
  next?: SerializedStyles
|}

export type EmotionCache = {
  inserted: { [string]: string | true },
  registered: RegisteredCache,
  sheet: Sheet,
  key: string,
  compat?: true,
  nonce?: string,
  insert: (
    selector: string,
    serialized: SerializedStyles,
    sheet: Sheet,
    shouldCache: boolean
  ) => string | void
}
