## Theme Inheritance Audit

This file lists the theme files from `github.com/sujithq/ideal-octo-guacamole`
that originally were still inherited by this site, and records the current
state after vendoring them into this repository.

Comparison basis:

- Theme root: `C:\Users\squintelier\source\repos\github\sujithq\ideal-octo-guacamole`
- Site root: `C:\Users\squintelier\source\repos\github\sujithq\sujithq.github.io`
- Compared Hugo directories: `layouts`, `assets`, `static`, `archetypes`,
  `content`, `data`, `i18n`
- Override rule: a file is considered overridden only when this repository
  contains a file at the same relative path

Current summary:

- Theme files in compared directories: 39
- Vendored or overridden by this repository: 39
- Still inherited from the theme: 0

### Files that were vendored locally

- `archetypes/default.md`
- `layouts/_default/documentation.html`
- `layouts/_default/index.rss.xml`
- `layouts/_default/search.html`
- `layouts/partials/article-list.html`
- `layouts/partials/favicons.html`
- `layouts/partials/fonts.html`
- `layouts/partials/gravatar/avatar-params.html`
- `layouts/partials/gravatar/avatar-url.html`
- `layouts/partials/header.html`
- `layouts/partials/helper/icon.html`
- `layouts/partials/helper/image.html`
- `layouts/partials/socials.html`

### Interpretation

These files have now been copied into this repository, so the theme no longer
provides any files in the compared Hugo override directories.