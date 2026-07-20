# Legacy deploy files (Fly.io)

These files (`fly.toml`, `Dockerfile`, `.dockerignore`) came from a Fly.io Launch
of the legacy onboarder app in June 2026 (originally on the `flyio-new-files`
branch). They are kept here with the app they belong to.

The legacy app was also served via GitHub Pages at
`https://bilalzdeveloper.github.io/uksc-onboarder/`. Note: renaming the GitHub
repository changes that Pages URL, which breaks the app's registered Google
OAuth redirect URI — accepted, because the Telegram intake flow has replaced
this app (see `docs/telegram-intake.md` at the repo root).
