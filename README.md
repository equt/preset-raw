This preset is a fork (?) of the [`@unocss/preset-typography`]. And it provides
the same functionality, but allowing you defining as many variants as possible.

[`@unocss/preset-typography`]:
  https://github.com/unocss/unocss/tree/main/packages/preset-typography

This preset currently does nothing (add nothing to your bundle) if no options
configured. Two options are available,

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

  Now there should be two utility classes available, i.e., `prose-light` &
  `prose-dark`, you could apply it to component like

  ```html
  <markdown-renderer class="prose dark:prose-dark" :input="source" />
  ```

- `css` - `(theme: Theme) => Record<string, CSSObject>`

  You could add CSS like object with the above added variables & theme
  available.

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
