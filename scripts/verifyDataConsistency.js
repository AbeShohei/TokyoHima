
import fs from 'fs';
import path from 'path';

// Helper to load TS file content crudely (since we can't run TS directly easily without ts-node)
// Actually, let's just read the JSON part if possible, or use a simple regex to extract the object.
// Or better, let's just inspect the generated metroData.ts file content in the script by reading it as text
// and deducing consistency.

// Crudely read JSON file to avoid module issues
const loadJson = (relativePath) => {
    return JSON.parse(fs.readFileSync(path.resolve(process.cwd(), relativePath), 'utf-8'));
};

const metroTracksRaw = loadJson('data/metroTracks.json');

const loadMetroData = () => {
    const p = path.resolve(process.cwd(), 'data/metroData.ts');
    const content = fs.readFileSync(p, 'utf-8');
    // This is hacky but acts as a quick check without compiling TS
    // We look for 'export const METRO_DATA: Record<string, Line> = {' and parse the JSON-like object after it.
    // Since I generated it with JSON.stringify, it should be parseable JSON if I strip the prefix.

    const startMarker = 'export const METRO_DATA: Record<string, Line> = ';
    const startIndex = content.indexOf(startMarker);
    if (startIndex === -1) throw new Error("Could not find METRO_DATA start");

    let jsonStr = content.substring(startIndex + startMarker.length);
    // Remove trailing semicolon/newline
    jsonStr = jsonStr.trim();
    if (jsonStr.endsWith(';')) jsonStr = jsonStr.slice(0, -1);

    return JSON.parse(jsonStr);
};

const main = () => {
    try {
        console.log("Loading Data...");
        const metroData = loadMetroData();
        const metroTracks = metroTracksRaw;

        console.log("Metro Data Keys:", Object.keys(metroData));
        console.log("Metro Tracks Keys:", Object.keys(metroTracks));

        Object.values(metroData).forEach(line => {
            console.log(`\nChecking Line: ${line.id} (${line.name})`);

            // 1. Check Stations Match
            if (line.stations.length === 0) {
                console.error(`  [ERROR] Line ${line.id} has 0 stations!`);
            }

            let validCoords = 0;
            line.stations.forEach(s => {
                if (Array.isArray(s.coordinates) && s.coordinates.length === 2 && !isNaN(s.coordinates[0]) && !isNaN(s.coordinates[1])) {
                    validCoords++;
                } else {
                    console.error(`  [ERROR] Invalid Coords for station ${s.name}:`, s.coordinates);
                }
            });
            console.log(`  Stations: ${line.stations.length}, Valid Coords: ${validCoords}`);

            // 2. Check Track Data Existence
            if (metroTracks[line.id]) {
                console.log(`  [OK] Has High-Res Track Data`);
            } else {
                console.log(`  [WARN] Missing High-Res Track Data. Should use fallback.`);
            }
        });

    } catch (e) {
        console.error("Verification Failed:", e);
    }
};

main();
