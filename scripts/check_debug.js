
const fs = require('fs');
const path = require('path');

// Manually parse metroData.ts because it's a TS file
const content = fs.readFileSync(path.resolve(__dirname, '../data/metroData.ts'), 'utf8');
const jsonStart = content.indexOf('{');
const jsonEnd = content.lastIndexOf(';');
const jsonStr = content.substring(jsonStart, jsonEnd);
const metroData = JSON.parse(jsonStr);

console.log("--- Data Check ---");
const lines = ['C', 'H', 'G', 'M'];
lines.forEach(id => {
    const line = metroData[id];
    if (!line) {
        console.log(`${id}: MISSING in metroData`);
    } else {
        console.log(`${id}: Found, ${line.stations.length} stations. Color: ${line.color}`);
        // Check coords
        const invalid = line.stations.filter(s => !s.coordinates || s.coordinates.length !== 2);
        if (invalid.length > 0) console.log(`  ${id}: ${invalid.length} stations have invalid coords`);
    }
});
