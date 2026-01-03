# Metro Dice (Ultimate 3D Dice)

An interactive 3D board game using Tokyo Metro data. Determine your destiny station with a roll of the dice!

## Features

- **3D Dice Experience**: Realistic physics-based dice rolling in the browser.
- **Tokyo Metro Map**: Visualize all Tokyo Metro lines and stations.
- **Route Finding**: Automatically calculates reachable stations based on your dice roll.
- **Real-Time Data**: Uses ODPT API for accurate data (Fare calculation).
- **Interactive UI**: Smooth, cinematic user interface.

## Local Development

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Environment Setup**
   Create a `.env.local` file in the root directory:

   ```env
   VITE_ODPT_API_KEY=your_odpt_api_key_here
   ```

   *Note: Without an API key, the app uses pre-generated static data for the map, but fare calculation may be mocked.*

3. **Start Development Server**

   ```bash
   npm run dev
   ```

## Deployment (Vercel)

This project is optimized for deployment on Vercel.

### 1. Project Configuration

- **Framework Preset**: Vite (detected automatically)
- **Root Directory**: `./`
- **Build Command**: `npm run build`
  - *This command has been configured to automatically run data generation scripts (`generateFullMetroData.js` & `fetchTracks.js`) before building the app.*
- **Output Directory**: `dist`

### 2. Environment Variables

In your Vercel Project Settings, add the following Environment Variable:

| Name | Description |
|------|-------------|
| `VITE_ODPT_API_KEY` | Your ODPT API Key (Required for live fare calculation) |

*Note: The map data is pre-built statically, so the app will function even if the API Key usage limit is reached, falling back to static/mock values where necessary.*

### 3. Build Process

The `npm run build` command performs the following:

1. **Generate Metro Data**: Fetches latest station/line data and generates `data/metroData.ts`.
2. **Fetch Tracks**: Fetches detailed track geometry from OpenStreetMap (Overpass API) and generates `data/metroTracks.json`.
3. **Vite Build**: Compiles the React application to static assets.

## Tech Stack

- React 19 / TypeScript
- Vite
- Three.js / React Three Fiber / Cannon (Physics)
- Leaflet / React Leaflet
- TailwindCSS
