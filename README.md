# WebSiteFolio — Tradie demo portfolio & business systems

Sales assets for pitching website + business-system packages to Australian trade
businesses (cabinet makers, joiners, kitchen renovators, plumbers). Everything here
is a **self-contained static demo**: no build step, no server, no dependencies.

## Quick start

Open `index.html` in a browser (double-click works — everything runs on `file://`),
or serve the folder for a cleaner URL:

```
python3 -m http.server 8000
# → http://localhost:8000
```

The root page is a presentation hub linking to:

- **4 demo marketing sites**, one per trade (`sites/<business>/`)
- **1 business-management demo app** (`app/`) themed per business via
  `app/index.html?business=<slug>#/dashboard`

## The four demo businesses (all fictional)

| Slug | Business | Trade | Location |
|---|---|---|---|
| `ironbark-cabinetry` | Ironbark Cabinetry | Bespoke cabinet maker | Brunswick, Melbourne VIC |
| `harbourline-joinery` | Harbourline Joinery | Joinery & fit-outs | Hamilton, Newcastle NSW |
| `sunline-kitchens` | Sunline Kitchens | Kitchen renovations | Burleigh Heads, Gold Coast QLD |
| `proflow-plumbing` | ProFlow Plumbing | Plumbing & gas, 24/7 | Penrith, Western Sydney NSW |

> **Fictional-data notice:** every business name, person, phone number, email, ABN,
> licence number, supplier and review in this repository is invented for
> demonstration purposes. Any resemblance to real businesses is coincidental.
> No real brand names are used anywhere in the demo data.

## The systems app (`app/`)

One single-page app, themed per business. Modules: **Dashboard · Schedule ·
Book online · Sales (quotes → jobs → invoices) · Purchasing · Inventory ·
Maintenance**.

- URL scheme: `app/index.html?business=<slug>#/<route>` — e.g.
  `?business=proflow-plumbing#/book` is the customer-facing booking flow the
  marketing sites link to.
- The topbar has a business switcher to flip trades live during a pitch.
- Demo state lives in memory, mirrored to `localStorage` (key `demo:<slug>`).
  Saved state **expires at the start of each new day** so the seeded relative
  dates always look current. "Reset demo data" in the sidebar restores the seed.
- Seed dates are generated relative to today (`DEMO.util.d(offset)`), so the
  calendar and dashboard are always populated for the current week.

## Conventions (load-bearing — read before contributing)

1. **No ES modules, no bundler, no CDN, no external fonts.** Classic
   `<script>` tags only; everything must work over `file://`. All shared code
   hangs off the single global `window.DEMO`.
2. **Hash routing only** in the app (`#/dashboard`), never `history.pushState`.
3. Script load order in `app/index.html` is fixed:
   `core/format.js → core/store.js → data/businesses.js → data/data-*.js →
   core/ui.js → modules/*.js → core/router.js`. Modules self-register into
   `DEMO.routes` and `DEMO.nav`, so order among modules doesn't matter.
4. **The four sites share nothing** — each `sites/<slug>/` folder is fully
   standalone (own CSS reset, own JS, own SVG assets) so a folder can be zipped
   and handed to a client, and so the sites stay visually distinct.
5. Copy is **Australian English** (colour, centre, organised); currency is AUD
   via `Intl.NumberFormat('en-AU')`; dates dd/mm/yyyy; mobiles `04xx xxx xxx`;
   landlines match the state's area code.
6. **No real brands** in demo data — invented suppliers and products only.
7. Imagery is crafted SVG (self-contained, works offline). Each site has an
   `assets/photos/` drop-in point: for a real client, add photos there and swap
   the `<img src>` — layouts don't change.

## Customising for a real client

1. Copy the closest site folder in `sites/`, rename to the client's slug.
2. Swap the palette variables at the top of `css/site.css`, the logo SVG, and
   the copy (name, suburb, phone, ABN, services, testimonials).
3. Drop real photos into `assets/photos/` and point the gallery `<img>` tags at them.
4. To add the client to the systems app: add a theme block in
   `app/css/themes.css`, a `DEMO.registerBusiness(...)` entry in
   `app/js/data/businesses.js`, and a `data-<slug>.js` seed file (copy
   `data-proflow.js` for the shapes), then include it in `app/index.html`.

## Deploying

Any static host (Netlify, GitHub Pages, Cloudflare Pages): upload the folder
as-is. No build step.
