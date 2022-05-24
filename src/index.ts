import type { CSSObject, CSSValues, Preset } from '@unocss/core'
import {
  toEscapedSelector,
  entriesToCss,
  normalizeCSSEntries,
} from '@unocss/core'

const LAYER = 'raw'

const PSEUDO_RE = /::?(?:[():\-\d\w]+)$/g

const resolveSelector = (
  scope: string,
  selector: string,
  excluding: string,
): string => {
  const [withoutPseudo, pseudo] = [
    selector.replace(PSEUDO_RE, ''),
    (selector.match(PSEUDO_RE) ?? [])[0],
  ]

  return `${scope} :where(${withoutPseudo})${excluding}${pseudo ?? ''}`
}

export type RawOptions<Theme> = {
  variants?: Record<string, (theme: Theme) => CSSValues>
  css?: (theme: Theme) => Record<string, CSSObject>
}

export default function <Theme>(options?: RawOptions<Theme>): Preset<Theme> {
  const selectors = Object.keys(options?.variants ?? {})
  const excluding = selectors.map(selector => `:not(.not-${selector})`).join('')
  const scopes: Array<string> = []

  return {
    name: '@equt/preset-raw',
    enforce: 'post',
    layers: { [LAYER]: -1 },
    shortcuts: [],
    rules: selectors.map(selector => [
      new RegExp(`^${selector}$`),
      (_, { theme, rawSelector }) => {
        scopes.push(toEscapedSelector(rawSelector))
        return options?.variants?.[selector]?.(theme)
      },
      { layer: LAYER },
    ]),
    preflights: [
      {
        layer: LAYER,
        getCSS: ({ theme }) =>
          // TODO Waiting for https://github.com/unocss/unocss/pull/1003
          Object.entries(options?.css?.(theme as Theme) ?? {})
            .map<[string, string]>(([selector, css]) => [
              selector
                .split(',')
                .map(part =>
                  resolveSelector(
                    `:where(${scopes.join(',')})`,
                    part,
                    excluding,
                  ),
                )
                .join(','),
              entriesToCss(normalizeCSSEntries(css)),
            ])
            .reduce((acc, [selector, css]) => acc + `${selector}{${css}}`, ''),
      },
    ],
  }
}
