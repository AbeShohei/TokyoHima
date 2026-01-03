
const fs = require('fs');
const path = require('path');

// Load tracks
const tracksRaw = fs.readFileSync(path.resolve(__dirname, '../data/metroTracks.json'), 'utf8');
const tracks = JSON.parse(tracksRaw)['C'];

// Load stations (hacky parse for TS file)
const stationsRaw = fs.readFileSync(path.resolve(__dirname, '../data/metroData.ts'), 'utf8');
// Find the object starting after "METRO_DATA: Record<string, Line> = "
const match = stationsRaw.match(/METRO_DATA: Record<string, Line> = ({[\s\S]*?});/);
if (!match) {
    console.error("Could not regex match METRO_DATA");
    process.exit(1);
}
const metroData = JSON.parse(match[1]);
const stations = metroData['C'];

console.log('--- Tracks (High Res) ---');
if (tracks) {
    console.log('Segment count:', tracks.segments.length);
    // Check gaps
    for (let i = 0; i < tracks.segments.length - 1; i++) {
        const segA = tracks.segments[i];
        const segB = tracks.segments[i + 1];
        const end = segA[segA.length - 1];
        const start = segB[0];

        // Euclidean distance approx
        const dist = Math.sqrt(Math.pow(end[0] - start[0], 2) + Math.pow(end[1] - start[1], 2));

        // Gap if > ~100m (0.001 deg is roughly 111m)
        if (dist > 0.001) {
            console.log(`GAP DETECTED between seg ${i} and ${i + 1}`);
            console.log(`  Seg ${i} End: [${end}]`);
            console.log(`  Seg ${i + 1} Start: [${start}]`);
            console.log(`  Distance: ${dist.toFixed(5)}`);
        }
    }
} else {
    console.log('No track data for C');
}

console.log('--- Stations (Fallback) ---');
if (stations) {
    console.log('Station count:', stations.stations.length);
    console.log('Stations:', stations.stations.map(s => s.name).join(', '));
} else {
    console.log('No station data for C');
}
