# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

SimpleDevUtils is a static "coming soon" landing page with a waitlist signup form. It is a pure frontend site — no build step, no framework, no package manager.

## Stack

- `index.html` — full page markup (currently a coming soon page; `style.css` has styles for the eventual full tools page)
- `style.css` — shared stylesheet with CSS variables for the dark theme (`--bg`, `--accent`, etc.)
- `main.js` — vanilla JS: waitlist form submission + tool category filter logic
- `nginx.conf` — nginx config for the production server; proxies `/api/waitlist` to `localhost:4000`

## Development

No build step. Serve the files directly:

```bash
python3 -m http.server 8000
```

The waitlist form POSTs JSON to `/api/waitlist`. In local dev this will 404 unless you have a backend running on port 4000.

## Deployment

Push to `main` triggers `.github/workflows/deploy.yml`, which SCPs `index.html`, `style.css`, and `main.js` to the DigitalOcean droplet at `/var/www/simpledevutils`. Requires `DROPLET_HOST` and `DROPLET_SSH_KEY` repository secrets.

The `nginx.conf` is not deployed automatically — it must be updated on the server manually.

## Architecture notes

- `style.css` contains styles for sections (`tools`, `features`, `cta-banner`, `footer`, nav) that don't yet exist in `index.html`. These are pre-built for the upcoming full site.
- Tool cards use a `data-cat` attribute for client-side category filtering via `.filter-btn` buttons in `main.js`.
- The `/api/waitlist` backend (port 4000) is external to this repo and identified to the backend via `X-Site-Name: simpledevutils` header set in nginx.
