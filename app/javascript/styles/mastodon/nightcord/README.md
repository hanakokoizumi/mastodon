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

## Project Sekai profile card

The card uses the game's light player-profile palette and teal section bars. The bundled `project-sekai-logo.png` is the unmodified logo supplied by the user from https://upload.wikimedia.org/wikipedia/fr/2/25/Project_Sekai_-_Colorful_Stage%21_feat._Hatsune_Miku_Logo.png (retrieved 2026-10-11). Logo rights belong to the game's rights holders; it identifies the game associated with the user-supplied ID.

The rounded ID numerals use a self-hosted digits-only subset of Nunito Medium from Google Fonts. Its SIL Open Font License is included under `app/javascript/fonts/nunito/OFL.txt`. No font or logo request is made to external services at runtime.

## Smoke check

Login: `admin@localhost` / `mastodonadmin`  
Path: home → compose → about → settings → open a modal / emoji / privacy dropdown.
