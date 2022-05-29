This preset is a fork (?) of the [`@unocss/preset-typography`]. And it provides
the same functionality, but allowing you to define as many variants as possible.

The preset does nothing (add nothing to your bundle) unless you've configured to
do so. There're two options are available,

- `variants` - `Record<string, (theme: Theme) => CSSValues>`

  The key is the class name, e.g., `prose`, and the value is CSS values that can
  be generated from the current theme.

  ```typescript
  {
    variant: {
      'prose': theme => ({
        '--un-prose-color': theme.color.gray[800],
      }),
      'prose-dark': theme => ({
        '--un-prose-color': theme.color.gray[200],
      })
    }
  }
  ```

  Now there should be two utility classes available, i.e., `prose` &
  `prose-dark`, you could apply it to your component like

  ```html
  <markdown-renderer class="prose dark:prose-dark" :input="source" />
  ```

- `css` - `(theme: Theme) => Record<string, CSSObject>`

  You could add CSS like object with the above variables & theme available.

  ```typescript
  {
    css: theme => ({
      p: {
        color: 'var(--un-prose-color)',
        'font-family': theme.fontFamily?.sans,
      },
    })
  }
  ```

Note

- To have the `theme` correctly typed, assign the correct `Theme` from your
  preset, e.g.,

  ```typescript
  import type { Theme } from '@unocss/preset-mini'

  unocss<Theme>({
    // ...
  })
  ```

- like the [`@unocss/preset-typography`], it's possible to _opt out_ by
  `.not-{CLASS NAME}`, e.g., `.not-prose`.

[`@unocss/preset-typography`]:
  https://github.com/unocss/unocss/tree/main/packages/preset-typography
