import fs from 'fs';
import https from 'https';

const query = `
[out:json][timeout:25];
(
  relation["operator"="Tokyo Metro"]["route"="subway"];
);
out geom;
`;

const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

console.log("Fetching data from Overpass API...");

https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            console.log(`Received ${json.elements.length} elements.`);

            // Transform to a simpler format for our app?
            // Element has 'members'. Some members are 'way' with 'geometry'.
            // We want to combine them into lines.

            const lines = {};

            json.elements.forEach(rel => {
                const name = rel.tags.name || rel.tags['name:en'] || rel.id;
                const color = rel.tags.colour || '#999';
                const ref = rel.tags.ref; // e.g. "G", "M"

                // Aggregate geometry
                const geometries = [];
                rel.members.forEach(m => {
                    if (m.type === 'way' && m.geometry) {
                        geometries.push(m.geometry.map(p => [p.lat, p.lon]));
                    }
                });

                if (ref) {
                    if (!lines[ref]) lines[ref] = { name, color, segments: [] };
                    lines[ref].segments.push(...geometries);
                }
            });

            fs.writeFileSync('./data/metroTracks.json', JSON.stringify(lines, null, 2));
            console.log("Saved to ./data/metroTracks.json");

        } catch (e) {
            console.error("Error parsing/saving:", e);
            console.log("Raw Data sample:", data.substring(0, 200));
        }
    });
}).on('error', (e) => {
    console.error("Request error:", e);
});
