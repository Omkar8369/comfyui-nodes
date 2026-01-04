# TransitFlow

A single-page transportation finder that blends buses, trains, ferries, carpools, and micromobility into one view. Search by origin/destination, filter by modes and price, and hold seats while comparing options.

## Running

No build tooling is required. Open `index.html` directly in a browser, or serve the folder locally:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Features

- Search by origin/destination with optional date/time filters.
- Limit by maximum price and selected modes.
- View detailed cards with operators, schedules, eco scores, and amenities.
- Hold seats in an itinerary cart with live totals.
- Service alerts section for rider messaging.
