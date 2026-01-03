import { Line, Station, METRO_DATA } from '../data/metroData';

const API_BASE_URL = 'https://api.odpt.org/api/v4';

const LINE_COLORS: Record<string, string> = {
    'G': '#ff9500', // Ginza
    'M': '#f62e36', // Marunouchi
    'H': '#b5b5ac', // Hibiya
    'T': '#009bbf', // Tozai
    'C': '#00bb85', // Chiyoda
    'Y': '#c1a470', // Yurakucho
    'Z': '#8f76d6', // Hanzomon
    'N': '#00ac9b', // Namboku
    'F': '#9c5e31', // Fukutoshin
};

export interface ODPT_Railway {
    'owl:sameAs': string;
    'dc:title': string;
    'odpt:stationOrder': {
        'odpt:station': string;
        'odpt:index': number;
    }[];
    'odpt:lineCode'?: string;
    'odpt:color'?: string;
}

export interface ODPT_Station {
    'owl:sameAs': string;
    'dc:title': string;
    'odpt:railway': string;
    'odpt:stationCode'?: string;
    'geo:lat'?: number;
    'geo:long'?: number;
}

export const fetchRailways = async (apiKey: string): Promise<ODPT_Railway[]> => {
    if (!apiKey) return [];
    const params = new URLSearchParams({
        'acl:consumerKey': apiKey,
        'odpt:operator': 'odpt.Operator:TokyoMetro'
    });

    try {
        const res = await fetch(`${API_BASE_URL}/odpt:Railway?${params.toString()}`);
        if (!res.ok) throw new Error('Failed to fetch railways');
        return await res.json();
    } catch (error) {
        console.error('ODPT API Error:', error);
        return [];
    }
};

export const fetchStations = async (apiKey: string): Promise<ODPT_Station[]> => {
    if (!apiKey) return [];
    const params = new URLSearchParams({
        'acl:consumerKey': apiKey,
        'odpt:operator': 'odpt.Operator:TokyoMetro'
    });

    try {
        const res = await fetch(`${API_BASE_URL}/odpt:Station?${params.toString()}`);
        if (!res.ok) throw new Error('Failed to fetch stations');
        return await res.json();
    } catch (error) {
        console.error('ODPT API Error:', error);
        return [];
    }
};

export const fetchAndTransformMetroData = async (apiKey: string): Promise<Record<string, Line> | null> => {
    if (!apiKey) return null;

    const [railways, stations] = await Promise.all([
        fetchRailways(apiKey),
        fetchStations(apiKey)
    ]);

    if (railways.length === 0 || stations.length === 0) return null;

    // Create Station Map
    const stationMap = new Map<string, ODPT_Station>();
    stations.forEach(s => stationMap.set(s['owl:sameAs'], s));

    const newMetroData: Record<string, Line> = {};

    railways.forEach(railway => {
        const lineCode = railway['odpt:lineCode'];
        if (!lineCode) return; // Skip if no code

        const lineId = lineCode;
        const color = railway['odpt:color'] || LINE_COLORS[lineId] || '#999999';

        const lineStations: Station[] = [];

        // Sort by index just in case
        const sortedStations = [...railway['odpt:stationOrder']].sort((a, b) => a['odpt:index'] - b['odpt:index']);

        sortedStations.forEach(item => {
            const sData = stationMap.get(item['odpt:station']);
            if (sData && sData['geo:lat'] && sData['geo:long']) {
                const sId = sData['odpt:stationCode'] || item['odpt:station'];

                // Try to find existing spots from static data
                // We'll search all static lines for a station with matching ID or Name
                let existingSpots: any[] = [];
                Object.values(METRO_DATA).forEach(staticLine => {
                    const found = staticLine.stations.find(s => s.id === sId || s.name === sData['dc:title']);
                    if (found) existingSpots = found.spots;
                });

                lineStations.push({
                    id: sId,
                    name: sData['dc:title'],
                    coordinates: [sData['geo:lat'], sData['geo:long']],
                    spots: existingSpots.length > 0 ? existingSpots : [] // Default empty if no match
                });
            }
        });

        if (lineStations.length > 0) {
            newMetroData[lineId] = {
                id: lineId,
                name: railway['dc:title'],
                color: color,
                stations: lineStations
            };
        }
    });

    return Object.keys(newMetroData).length > 0 ? newMetroData : null;
};

// --- Graph Logic ---

export interface GraphNode {
    id: string; // Unique ID (Use Name for merging)
    name: string;
    lines: string[]; // Line IDs serving this station
    coordinates: [number, number];
    neighbors: Record<string, number>; // neighborID -> distance (1)
    originalStations: Station[]; // Keep track of original station objects (so we know Line IDs)
}

export const buildNetworkGraph = (metroData: Record<string, Line>): Map<string, GraphNode> => {
    const graph = new Map<string, GraphNode>();

    // 1. Create Nodes (Merge stations by Name)
    Object.values(metroData).forEach(line => {
        line.stations.forEach(station => {
            // Use Name as unique key for merging (simplest approach for Tokyo Metro)
            // e.g. "銀座" is the key.
            const key = station.name;

            if (!graph.has(key)) {
                graph.set(key, {
                    id: key,
                    name: station.name,
                    lines: [],
                    coordinates: station.coordinates, // Use first encounter's coords
                    neighbors: {},
                    originalStations: []
                });
            }

            const node = graph.get(key)!;
            if (!node.lines.includes(line.id)) {
                node.lines.push(line.id);
            }
            node.originalStations.push(station);
        });
    });

    // 2. Create Edges (Same Line)
    Object.values(metroData).forEach(line => {
        for (let i = 0; i < line.stations.length - 1; i++) {
            const s1 = line.stations[i];
            const s2 = line.stations[i + 1];

            const n1 = graph.get(s1.name)!;
            const n2 = graph.get(s2.name)!;

            // Distance 1
            n1.neighbors[n2.id] = 1;
            n2.neighbors[n1.id] = 1;
        }
    });

    return graph;
};

export const getReachableStations = (
    startNodeId: string,
    steps: number,
    graph: Map<string, GraphNode>
): GraphNode[] => {
    if (!graph.has(startNodeId)) return [];

    let currentLevel = new Set<string>([startNodeId]);
    // We track visited to avoid cycling back immediately, but for "exact steps" 
    // strictly speaking in a graph walk, you *could* go back and forth.
    // However, for a board game feel, "Distance X" usually implies shortest path or forward movement.
    // Let's assume standard BFS layers: reachable with MINIMUM X steps.
    // Wait, "Dice 6" usually means "Move 6 tiles". If I have a loop of 3, I can end up back at start?
    // User said "乗り換えあり".
    // Let's implement EXACT steps walking, but prevent immediate 1-step reversal (A->B->A).

    // Actually, simpler BFS layer approach is safer for UX. 
    // Layer 1 = neighbors. Layer 2 = neighbors of neighbors (excluding start).
    // If multiple paths lead to same node at same step, that's fine.

    // Better approach for "Dice":
    // Find all nodes that are reachable by a path of length EXACTLY 'steps',
    // WITHOUT traversing the same edge backwards immediately?

    // Let's stick to "Simple BFS Layer" which equates to "Shortest Path" logic for now.
    // If Dice is 6, we show stations roughly 6 stops away.
    // If we want "Exact walk", it's more complex.
    // Given the UI is "Select Destination", showing a set of candidates "Around distance X" is good.

    const visited = new Set<string>([startNodeId]);

    for (let i = 0; i < steps; i++) {
        const nextLevel = new Set<string>();
        currentLevel.forEach(nodeId => {
            const node = graph.get(nodeId);
            if (node) {
                Object.keys(node.neighbors).forEach(neighborId => {
                    if (!visited.has(neighborId)) {
                        visited.add(neighborId);
                        nextLevel.add(neighborId);
                    }
                });
            }
        });
        currentLevel = nextLevel;
        if (currentLevel.size === 0) break;
    }

    return Array.from(currentLevel).map(id => graph.get(id)!);
};

// --- Fare Logic ---

/**
 * Helper to get Name -> URN map.
 * Since we don't store URNs in METRO_DATA, we need to fetch the station list once or use a heuristic.
 * Heuristic: "odpt.Station:TokyoMetro.[Line].[RomanName]" is standard, but RomanName conversion is hard.
 * Reliable way: Fetch all stations from ODPT API (lightweight enough only 180 stations) if key exists.
 */
let stationNameMap: Map<string, string> | null = null;

export const fetchFare = async (fromName: string, toName: string, apiKey: string): Promise<number | null> => {
    if (!apiKey) return null;

    try {
        // 1. Build Map if missing
        if (!stationNameMap) {
            const stations = await fetchStations(apiKey);
            stationNameMap = new Map();
            stations.forEach(s => {
                // Map "銀座" -> "odpt.Station:TokyoMetro.Ginza.Ginza"
                // Store ALL IDs for a name (duplicates exist for multiple lines), but for Fare calculation, usually any valid station ID in the group works?
                // Actually Fare is often defined pair-wise. 
                // Let's store the first one we find.
                if (!stationNameMap!.has(s['dc:title'])) {
                    stationNameMap!.set(s['dc:title'], s['owl:sameAs']);
                }
            });
        }

        const fromId = stationNameMap.get(fromName);
        const toId = stationNameMap.get(toName);

        if (!fromId || !toId) {
            console.warn('Stations not found in ODPT map:', fromName, toName);
            return null;
        }

        // 2. Fetch Fare
        const params = new URLSearchParams({
            'acl:consumerKey': apiKey,
            'odpt:fromStation': fromId,
            'odpt:toStation': toId
        });

        const res = await fetch(`${API_BASE_URL}/odpt:RailwayFare?${params.toString()}`);
        if (!res.ok) return null;
        const data = await res.json();

        if (Array.isArray(data) && data.length > 0) {
            // Priority: ticketFare -> icCardFare -> childTicketFare...
            // We want Adult Ticket Fare
            return data[0]['odpt:ticketFare'] || data[0]['odpt:icCardFare'] || null;
        }

        return null;

    } catch (e) {
        console.error('Fare Fetch Error:', e);
        return null;
    }
};
