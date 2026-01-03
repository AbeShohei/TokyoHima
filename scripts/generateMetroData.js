import fs from 'fs';
import https from 'https';
import path from 'path';
import dotenv from 'dotenv';

// Try standard dotenv first
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

console.log("Loaded ENV Keys:", Object.keys(process.env).filter(k => k.includes('ODPT') || k.includes('VITE')));

const loadEnv = () => {
    // 1. Try process.env
    if (process.env.VITE_ODPT_API_KEY) {
        return process.env.VITE_ODPT_API_KEY;
    }

    // 2. Try manual parsing if dotenv failed
    try {
        const envPath = path.resolve(process.cwd(), '.env.local');
        if (fs.existsSync(envPath)) {
            const content = fs.readFileSync(envPath, 'utf-8');
            console.log("Reading .env.local manually...");
            fs.writeFileSync('debug_env.txt', content);
            console.log("DUMPED ENV TO DEBUG_ENV.TXT");

            // Log for debugging (first few chars) to confirm we see it
            // console.log("Content Start:", content.substring(0, 50));

            const parts = content.split('VITE_ODPT_API_KEY=');
            if (parts.length > 1) {
                let keyRef = parts[1];
                keyRef = keyRef.split('\n')[0];
                keyRef = keyRef.split('\r')[0];
                keyRef = keyRef.trim().replace(/^["']|["']$/g, '');
                return keyRef;
            }
        }
    } catch (e) {
        console.error("Read Error", e);
    }
    return null;
};

const API_KEY = loadEnv();

if (!API_KEY) {
    console.error("API Key not found via dotenv or manual parse.");
    console.log("If you are sure .env.local exists, please check file permissions or encoding.");
    process.exit(1);
} else {
    console.log("API Key loaded: " + API_KEY.substring(0, 5) + "...");
}

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
                    resolve(JSON.parse(data));
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', reject);
    });
};

const main = async () => {
    try {
        console.log("Fetching Railways...");
        const railways = await fetchJson(`${API_BASE_URL}/odpt:Railway?acl:consumerKey=${API_KEY}&odpt:operator=odpt.Operator:TokyoMetro`);

        console.log("Fetching Stations...");
        const stations = await fetchJson(`${API_BASE_URL}/odpt:Station?acl:consumerKey=${API_KEY}&odpt:operator=odpt.Operator:TokyoMetro`);

        if (!Array.isArray(railways) || !Array.isArray(stations)) {
            console.error("API returned invalid data format. Check API Key validity.");
            console.log("Railways:", railways);
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
                    lineStations.push({
                        id: sId,
                        name: sData['dc:title'],
                        coordinates: [sData['geo:lat'], sData['geo:long']],
                        spots: []
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

        fs.writeFileSync(path.resolve(process.cwd(), 'src/data/metroData.ts'), fileContent);
        console.log("Successfully generated src/data/metroData.ts with all lines!");

    } catch (e) {
        console.error("Generation failed:", e);
    }
};

main();
