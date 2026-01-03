import fs from 'fs';
import https from 'https';
import path from 'path';
import { STATION_SPOTS } from './spotsData.js';

// Hardcoded key from .env.local (UTF-16 decoded)
const API_KEY = "admyc5p9ythe81w1ie8bgdtjd67mw4ocdgafh5aathjuye8m8r4a1aiio2s4ghon";
const API_BASE_URL = 'https://api.odpt.org/api/v4';

const LINE_COLORS = {
    'G': '#ff9500', 'M': '#f62e36', 'H': '#b5b5ac', 'T': '#009bbf', 'C': '#00bb85',
    'Y': '#c1a470', 'Z': '#8f76d6', 'N': '#00ac9b', 'F': '#9c5e31'
};

const fetchJson = (url) => {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', c => data += c);
            res.on('end', () => {
                try {
                    if (res.statusCode !== 200) {
                        console.error(`API Error Status: ${res.statusCode}`);
                        console.error(`API Error Body: ${data}`);
                        return resolve({ error: true, status: res.statusCode, body: data });
                    }
                    resolve(JSON.parse(data));
                } catch (e) {
                    console.error("JSON Parse Error", e);
                    reject(e);
                }
            });
        }).on('error', reject);
    });
};

const main = async () => {
    try {
        console.log("Fetching Railways with key: " + API_KEY.substring(0, 5) + "...");
        const railways = await fetchJson(`${API_BASE_URL}/odpt:Railway?acl:consumerKey=${API_KEY}&odpt:operator=odpt.Operator:TokyoMetro`);

        console.log("Fetching Stations...");
        const stations = await fetchJson(`${API_BASE_URL}/odpt:Station?acl:consumerKey=${API_KEY}&odpt:operator=odpt.Operator:TokyoMetro`);

        if (railways.error || stations.error) {
            console.error("API Error occurred.");
            return;
        }

        if (!Array.isArray(railways) || !Array.isArray(stations)) {
            console.error("API returned invalid data format (not array).");
            console.log("Railways Type:", typeof railways);
            console.log("Railways Content:", JSON.stringify(railways).substring(0, 200));
            return;
        }

        const stationMap = new Map();
        stations.forEach(s => stationMap.set(s['owl:sameAs'], s));

        const fullData = {};

        railways.forEach(railway => {
            const lineCode = railway['odpt:lineCode'];
            if (!lineCode) return;

            console.log(`Processing Line: ${railway['dc:title']} (${lineCode})`);

            const lineStations = [];
            let sortedStations = [];

            if (railway['odpt:stationOrder']) {
                sortedStations = [...railway['odpt:stationOrder']].sort((a, b) => a['odpt:index'] - b['odpt:index']);
            }

            sortedStations.forEach(item => {
                const sData = stationMap.get(item['odpt:station']);
                if (sData) {
                    const sId = sData['odpt:stationCode'] || item['odpt:station'];
                    const sName = sData['dc:title'];

                    // Merge Recommended Spots
                    let spots = [];
                    if (STATION_SPOTS[sName]) {
                        spots = STATION_SPOTS[sName];
                    }

                    lineStations.push({
                        id: sId,
                        name: sName,
                        coordinates: [sData['geo:lat'], sData['geo:long']],
                        spots: spots
                    });
                }
            });

            fullData[lineCode] = {
                id: lineCode,
                name: railway['dc:title'],
                color: railway['odpt:color'] || LINE_COLORS[lineCode] || '#999',
                stations: lineStations
            };
        });

        const fileContent = `export interface Spot {
  name: string;
  time: string;
  description?: string;
  minutes?: number;
  coords?: [number, number];
}

export interface Station {
  id: string;
  name: string;
  coordinates: [number, number];
  spots: Spot[];
}

export interface Line {
  id: string;
  name: string;
  color: string;
  stations: Station[];
}

// Full Data Generated from ODPT API
export const METRO_DATA: Record<string, Line> = ${JSON.stringify(fullData, null, 2)};

`;

        const outputPath = path.resolve(process.cwd(), 'data/metroData.ts');
        console.log(`Writing to ${outputPath}`);
        fs.writeFileSync(outputPath, fileContent);
        console.log("Successfully generated src/data/metroData.ts with all lines!");
        console.log("Lines generated:", Object.keys(fullData).join(", "));

    } catch (e) {
        console.error("Generation failed:", e);
    }
};

main();
