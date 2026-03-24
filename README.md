# rechart-data

`rechart-data` is a small Next.js app for loading a local `.json` file and visualizing it quickly with Recharts.

The original DCA crypto repo was simplified to keep only the essential stack:

- Next.js 16
- Tailwind CSS 4
- Recharts
- React 19

## What the app does

- upload a local JSON file
- automatically detect the best data array in the document
- choose the X axis
- enable 1 to 3 numeric series
- switch between `line`, `bar`, and `area`
- preview the first rows in a table
- show a quick summary of the loaded dataset

## Supported formats

The app mainly works with:

1. a root-level array of objects
2. a JSON object containing a nested array of objects

Example:

```json
[
  { "month": "2025-01", "visitors": 1240, "revenue": 4800 },
  { "month": "2025-02", "visitors": 1385, "revenue": 5210 }
]
```

## Getting started

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Project name

The package has been renamed to `rechart-data`. If you want to turn it into a separate GitHub fork, the remaining steps are:

1. create a new remote repo called `rechart-data`
2. point the local remote to it
3. push this cleaned-up base

## License

MIT
