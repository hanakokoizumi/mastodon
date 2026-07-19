# Nightcord overlay

Visual customizations for this fork live here so upstream Mastodon merges stay small.

## Rules

- **A:** Restyle upstream classes via `overlay/*.scss`.
- **B:** New widgets go under `app/javascript/mastodon/nightcord/`.
- **Do not** replace upstream Button/Status trees with a component library.
- **Do not** sprinkle Tailwind utilities into upstream `features/**` TSX.

## Layers

| File                           | Surface                                           |
| ------------------------------ | ------------------------------------------------- |
| `foundation`                   | type + wallpaper atmosphere                       |
| `chrome`                       | buttons, column headers, compose actives, filters |
| `shell`                        | single-column frosted side panels                 |
| `timeline`                     | status rhythm                                     |
| `modals`                       | dialogs / boost / report / safety                 |
| `popovers`                     | dropdowns / privacy / emoji-mart                  |
| `feedback`                     | toasts / flash / announcements                    |
| `empty` / `about` / `settings` | call-room + settings                              |

## Hook

```scss
@use 'mastodon/nightcord' as *;
```

Entry must be `index.scss` (Vite resolves folder imports to `index.scss`, not `_index.scss`).

## Smoke check

Login: `admin@localhost` / `mastodonadmin`  
Path: home → compose → about → settings → open a modal / emoji / privacy dropdown.
