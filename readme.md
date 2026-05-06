## Bear cards — little collection write-up

I log each pack I open (and what card I got), then render a small dashboard to see if anything weird is going on with **production**, **distribution**, and (inevitably) **duplicates**.

The dashboard is a static page. View it however you like:

- **Hosted:** push to GitHub and enable Pages (Settings → Pages → *Deploy from a branch* → `main` / `/ (root)`). The site loads at `https://<user>.github.io/<repo>/`.
- **Locally:** it fetches `data/packs.csv` at runtime, so `file://` won't work — serve over HTTP:
  ```bash
  python3 -m http.server 8000
  # then http://localhost:8000/
  ```

Charts use [Observable Plot](https://observablehq.com/plot/) and [d3](https://d3js.org/), loaded from a CDN. There is no build step.

### Layout

```
index.html                  shell
dashboard/
  styles.css                all styling
  main.js                   entry — loads data, registers chart order
  lib/                      decoder, rarity, data loader, helpers
  charts/                   one file per figure
```

To tweak a chart, edit its file in `dashboard/charts/`. To reorder or hide one, edit the `charts` array in `dashboard/main.js`. To add a new chart, drop a new module into `dashboard/charts/` (default export `{ title, desc, wide?, render(ctx) }`) and import it from `main.js`.

## Figures

### 1 — Production timeline vs card discovery

Timeline: **production date** on x, **card number** on y, **flavour** as colour. Useful for spotting flavour "waves" and any card-number clustering.

### 2 — Card distribution heatmap

The "is anything fishy?" view: x = card number, y = flavour, colour = how many times you've seen that combo. Rare cards and any flavour-tied cards stand out instantly.

### 3 — Rarity curve

Cards sorted from most common → rarest. The shape gives you informal "tiers".

### 4 — Batch consistency

x = batch prefix (`26082`), y = card number, colour = flavour. Tells you whether a batch only coughs up a small subset of cards (poor mixing) or looks nicely shuffled.

### 5 — Flavour ↔ card network

Flavours on one side, cards on the other. A line means you've seen that pairing (thicker = more often). "Wide" cards (everywhere) vs "narrow" ones (maybe tied to a line/batch) jump out.

### 6 — Duplicate tracker

x = packs opened, y = unique cards collected so far. The collector curve — you can literally see when it flattens into "cool, another duplicate".

### 7 — Time-of-production patterns

Grouped by the line/shift letter (the `D` in `26082 15D`). Top: flavour mix. Bottom: how many distinct cards each line has produced in your sample.

### 8 — Calendar heatmap

Each square is a production day. Colour = packs from that day; overlay = average rarity score (when available). A nice view of what you've sampled and whether any days look consistently "better".

## Data format

`data/packs.csv` columns:

- `flavour` — flavour of the cards
- `acquisition_date` — when the pack was opened
- `best_before_date` — best-before printed on the pack
- `production_code` — production code, e.g. `26082 15D`
- `production_time` — time of day printed on the pack
- `card_number` — the card found inside

The production code is `YY DOY CC L`:

- `YY` — last two digits of the year of production
- `DOY` — day of the year (001–366), zero-padded
- `CC` — batch / line cycle, two digits
- `L` — factory line / shift / plant letter

`data/cards.csv` is the card lookup (`card_number`, `name`, `code`).
