import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Canvas, useThree } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { Line, Station } from '../data/metroData';
import { GraphNode } from '../services/odptService';
import metroTracksRaw from '../data/metroTracks.json';

const metroTracks = metroTracksRaw as any;

interface TrainMapProps {
  currentStationName: string;
  candidateStations: GraphNode[];
  destination: GraphNode | null;
  phase: string;
  onArrive: () => void;
  metroData: Record<string, Line>;
  onSelectCandidate: (node: GraphNode) => void;
}

// ------------------------------------------------------------------
// 3D Train Component (R3F)
// ------------------------------------------------------------------
const TrainModel: React.FC<{ pixelPos: [number, number]; angleDeg: number; visible: boolean }> = ({ pixelPos, angleDeg, visible }) => {
  const { size } = useThree();

  if (!visible) return null;

  // Pixel Coordinates System
  // Scene origin (0,0) is center of screen.
  // pixelPos is from Top-Left (Leaflet).

  const x = pixelPos[0] - size.width / 2;
  const y = -pixelPos[1] + size.height / 2;

  // Train Size in Pixels (Slightly Larger for visibility)
  const W = 24;
  const L = 60;
  const H = 24;

  return (
    <group position={[x, y, 0]} rotation={[0, 0, -angleDeg * (Math.PI / 180)]}>
      {/* Tilt for 45-degree Bird's Eye View */}
      {/* Pivot adjustment: Move geometry UP so it rotates around bottom-center */}
      <group rotation={[Math.PI / 4, 0, 0]} position={[0, 0, H / 2]}>

        {/* Train Body */}
        <RoundedBox args={[W, L, H]} radius={4} smoothness={4} position={[0, 0, 0]} castShadow receiveShadow>
          <meshStandardMaterial color="#e5e5e5" roughness={0.4} metalness={0.1} />
        </RoundedBox>

        {/* Roof Stripe */}
        <mesh position={[0, 0, H / 2 + 0.1]} receiveShadow>
          <planeGeometry args={[W * 0.8, L * 0.9]} />
          <meshStandardMaterial color="#ff0000" />
        </mesh>

        {/* Front Window */}
        <mesh position={[0, L / 2 - 2, H / 2 + 0.2]}>
          <boxGeometry args={[W * 0.8, 6, 2]} />
          <meshStandardMaterial color="#111" roughness={0.0} metalness={0.9} />
        </mesh>

        {/* Rear Window */}
        <mesh position={[0, -L / 2 + 2, H / 2 + 0.2]}>
          <boxGeometry args={[W * 0.8, 6, 2]} />
          <meshStandardMaterial color="#111" roughness={0.0} metalness={0.9} />
        </mesh>

        {/* Headlights */}
        <mesh position={[-5, L / 2, 5]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[2, 2, 2]} />
          <meshBasicMaterial color="#ffffaa" toneMapped={false} />
        </mesh>
        <mesh position={[5, L / 2, 5]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[2, 2, 2]} />
          <meshBasicMaterial color="#ffffaa" toneMapped={false} />
        </mesh>

        {/* Shadow (Projected on ground 0, separate from tilted group to stay flat) */}
      </group>
      {/* Shadow stays flat on the map plane */}
      <mesh position={[0, 0, -1]}>
        <circleGeometry args={[W * 1.2, 32]} />
        <meshBasicMaterial color="#000" opacity={0.4} transparent />
      </mesh>
    </group>
  );
};

export const TrainMap: React.FC<TrainMapProps> = ({
  currentStationName,
  candidateStations,
  destination,
  phase,
  onArrive,
  metroData,
  onSelectCandidate
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const linesLayerRef = useRef<L.LayerGroup | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  // Train State for R3F
  const [trainState, setTrainState] = useState<{ pixelPos: [number, number]; angle: number; visible: boolean }>({
    pixelPos: [0, 0],
    angle: 0,
    visible: false
  });

  // Camera Controller for Pixel-Perfect Ortho
  // Defined INSIDE Component to access R3F hooks
  const CameraController = () => {
    const { set, size } = useThree();
    useEffect(() => {
      // Standard Orthographic Camera for Pixel Perfect UI
      // left, right, top, bottom, near, far
      const camera = new THREE.OrthographicCamera(
        -size.width / 2, size.width / 2,
        size.height / 2, -size.height / 2,
        0.1, 2000
      );
      camera.position.set(0, 0, 1000);
      camera.lookAt(0, 0, 0);
      camera.updateProjectionMatrix();
      set({ camera });
    }, [size, set]);
    return null;
  }

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      zoomControl: false,
      attributionControl: false,
      dragging: true,
      scrollWheelZoom: true,
      doubleClickZoom: true,
      boxZoom: false,
      keyboard: false
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(map);

    map.setView([35.6812, 139.7671], 12);

    mapInstanceRef.current = map;
    linesLayerRef.current = L.layerGroup().addTo(map);
    markersLayerRef.current = L.layerGroup().addTo(map);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update R3F Train Position when map moves (if train is visible/stationary)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const onMove = () => {
      // Placeholder for sync
    };

    map.on('move', onMove);
    return () => { map.off('move', onMove); };
  }, []);


  // Render Network (Lines)
  useEffect(() => {
    const layerGroup = linesLayerRef.current;
    if (!layerGroup) return;
    layerGroup.clearLayers();

    // Draw Lines
    // Draw Lines
    Object.values(metroData).forEach(line => {
      const trackData = metroTracks[line.id];

      // Use detailed segments if available, BUT force fallback for Chiyoda (C) due to data issues
      // TODO: Fix Chiyoda track data source
      const useDetailed = trackData && trackData.segments && trackData.segments.length > 0 && line.id !== 'C';

      if (useDetailed) {
        // Render detailed curved segments
        trackData.segments.forEach((segment: any[]) => {
          if (segment && segment.length > 0) {
            const latLngs = segment.map(pt => [pt[0], pt[1]] as [number, number]);

            // Draw thicker, smoother line
            L.polyline(latLngs, {
              color: line.color,
              weight: 6,
              opacity: 1.0,
              lineJoin: 'round',
              lineCap: 'round'
            }).addTo(layerGroup);
          }
        });
      } else {
        // Fallback: Straight lines between stations
        // Ensure valid coordinates
        const latLngs = line.stations
          .map(s => s.coordinates)
          .filter(c => Array.isArray(c) && c.length === 2 && typeof c[0] === 'number' && typeof c[1] === 'number');

        if (latLngs.length > 1) {
          L.polyline(latLngs as any[], {
            color: line.color,
            weight: 6,
            opacity: 1.0,
            lineJoin: 'round',
            lineCap: 'round'
          }).addTo(layerGroup);
        }
      }
    });

    // Stations (Deduplicated)
    const uniqueStations = new Map<string, [number, number]>();
    Object.values(metroData).forEach(line => {
      line.stations.forEach(station => {
        const c = station.coordinates;
        if (Array.isArray(c) && c.length === 2 && !isNaN(c[0])) {
          // Use name as key to ensure one marker per station name
          if (!uniqueStations.has(station.name)) {
            uniqueStations.set(station.name, c as [number, number]);
          }
        }
      });
    });

    uniqueStations.forEach((coords, name) => {
      L.circleMarker(coords, { radius: 3, color: 'transparent', fillColor: '#fff', fillOpacity: 0.5 }).addTo(layerGroup);
    });
  }, [metroData]);

  // Render Markers (Interactive)
  useEffect(() => {
    const layerGroup = markersLayerRef.current;
    if (!layerGroup) return;
    layerGroup.clearLayers();

    // Current
    let currentCoords: [number, number] | null = null;
    Object.values(metroData).forEach(line => {
      const s = line.stations.find(st => st.name === currentStationName);
      if (s) currentCoords = s.coordinates;
    });

    if (currentCoords) {
      L.circleMarker(currentCoords, { radius: 8, color: '#fff', fillColor: '#00f', fillOpacity: 1 }).addTo(layerGroup)
        .bindTooltip("現在地: " + currentStationName, { permanent: true, direction: 'top' });
    }

    // Candidates
    // Candidates
    if (!destination) {
      candidateStations.forEach(node => {
        if (Array.isArray(node.coordinates)) {
          const m = L.circleMarker(node.coordinates as any, { radius: 12, className: 'animate-pulse', color: '#fff', fillColor: 'red', fillOpacity: 0.8 }).addTo(layerGroup);
          m.on('click', () => onSelectCandidate(node));
          m.bindTooltip(node.name + " (選択)", { direction: 'top', permanent: true });
        }
      });
    }

    // Destination
    if (destination && Array.isArray(destination.coordinates)) {
      L.circleMarker(destination.coordinates as any, { radius: 10, color: '#fff', fillColor: '#0f0', fillOpacity: 1 }).addTo(layerGroup)
        .bindTooltip(destination.name, { permanent: true, direction: 'right' });
    }
  }, [currentStationName, candidateStations, destination, metroData, onSelectCandidate]);


  // ------------------------------------------------------------------
  //  ANIMATION LOGIC
  // ------------------------------------------------------------------
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || phase !== 'moving' || !destination) return;

    // 1. Pathfinding (BFS across Network)
    // Build Adjacency Graph from metroData
    const adjacency = new Map<string, string[]>();
    const stationCoords = new Map<string, [number, number]>();

    Object.values(metroData).forEach(line => {
      line.stations.forEach((s, idx) => {
        if (Array.isArray(s.coordinates) && s.coordinates.length === 2) {
          stationCoords.set(s.name, s.coordinates as [number, number]);
        }
        if (!adjacency.has(s.name)) adjacency.set(s.name, []);
        if (idx > 0) adjacency.get(s.name)?.push(line.stations[idx - 1].name);
        if (idx < line.stations.length - 1) adjacency.get(s.name)?.push(line.stations[idx + 1].name);
      });
    });

    // BFS
    const queue: { name: string; path: string[] }[] = [{ name: currentStationName, path: [currentStationName] }];
    const visited = new Set<string>([currentStationName]);
    let foundPathNames: string[] | null = null;

    while (queue.length > 0) {
      const { name, path } = queue.shift()!;
      if (name === destination.name) {
        foundPathNames = path;
        break;
      }
      const neighbors = adjacency.get(name) || [];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push({ name: neighbor, path: [...path, neighbor] });
        }
      }
    }

    if (!foundPathNames) {
      console.warn('[TrainMap] BFS Pathfinding failed.');
      onArrive();
      return;
    }

    // Convert Names to Detailed Track Geometry Points
    const detailedPathPoints: [number, number][] = [];

    if (foundPathNames.length > 0) {
      // Add first point
      const startName = foundPathNames[0];
      const startCoord = stationCoords.get(startName);
      if (startCoord) detailedPathPoints.push(startCoord);
    }

    // Helper: Distance squared
    const distSq = (p1: [number, number], p2: [number, number]) => {
      const dx = p1[0] - p2[0];
      const dy = p1[1] - p2[1];
      return dx * dx + dy * dy;
    }

    // Heuristic tolerance for matching track segment to station (approx 500m-1km)
    // 0.01 degree ~ 1.1km. Let's use 0.0001 (approx 10m?) No, that's too tight for data errors.
    // 0.001 ~ 100m. 0.005 ~ 500m.
    const SEGMENT_TOLERANCE_SQ = 0.005 * 0.005;

    for (let i = 0; i < foundPathNames.length - 1; i++) {
      const currentName = foundPathNames[i];
      const nextName = foundPathNames[i + 1];
      const currentCoord = stationCoords.get(currentName);
      const nextCoord = stationCoords.get(nextName);

      // Find connection
      let connectingLine: Line | null = null;
      let idxCurrent = -1;
      let idxNext = -1;

      // Find Line
      for (const line of Object.values(metroData)) {
        const idx1 = line.stations.findIndex(s => s.name === currentName);
        const idx2 = line.stations.findIndex(s => s.name === nextName);
        if (idx1 !== -1 && idx2 !== -1 && Math.abs(idx1 - idx2) === 1) {
          connectingLine = line;
          idxCurrent = idx1;
          idxNext = idx2;
          break;
        }
      }

      let segmentCoords: [number, number][] = [];
      // Track candidates
      let candidateSegment: [number, number][] | null = null;

      if (connectingLine && metroTracks[connectingLine.id] && currentCoord && nextCoord) {
        const trackData = metroTracks[connectingLine.id];
        // Usually segment index maps to the lower station index
        // But data structure might have gaps or offsets.
        // Ideally we should check the segment at `min(idx1, idx2)`
        const segIdx = Math.min(idxCurrent, idxNext);

        if (trackData.segments && trackData.segments[segIdx]) {
          candidateSegment = trackData.segments[segIdx].map((pt: any) => [pt[0], pt[1]] as [number, number]);

          // Validate!
          // Check Normal Direction: Start->Current, End->Next
          const dStartNormal = distSq(candidateSegment[0], currentCoord);
          const dEndNormal = distSq(candidateSegment[candidateSegment.length - 1], nextCoord);
          const isNormalValid = dStartNormal < SEGMENT_TOLERANCE_SQ && dEndNormal < SEGMENT_TOLERANCE_SQ;

          // Check Reverse Direction: End->Current, Start->Next
          const dStartReverse = distSq(candidateSegment[candidateSegment.length - 1], currentCoord);
          const dEndReverse = distSq(candidateSegment[0], nextCoord);
          const isReverseValid = dStartReverse < SEGMENT_TOLERANCE_SQ && dEndReverse < SEGMENT_TOLERANCE_SQ;

          if (isNormalValid) {
            // Good as is
          } else if (isReverseValid) {
            candidateSegment.reverse();
          } else {
            // Both invalid! This segment does NOT connect these two stations geometrically.
            // Data mismatch. Fallback to straight line.
            console.warn(`[TrainMap] Mismatch segment for ${currentName}->${nextName} on Line ${connectingLine.id}. Fallback to line.`);
            candidateSegment = null;
          }
        }
      }

      if (candidateSegment) {
        segmentCoords = candidateSegment;
      } else {
        // Fallback or Transfer
        if (nextCoord) segmentCoords.push(nextCoord);
      }

      // Append distinct points
      segmentCoords.forEach(pt => {
        const last = detailedPathPoints[detailedPathPoints.length - 1];
        if (!last || distSq(last, pt) > 0.000000001) {
          detailedPathPoints.push(pt);
        }
      });
    }

    console.log('[TrainMap] Path found:', foundPathNames.length, 'stations');
    console.log('[TrainMap] Detailed Track Points:', detailedPathPoints.length);

    // Filter potential NaNs or undefineds just in case
    const pathPoints = detailedPathPoints.filter(p => p && !isNaN(p[0]) && !isNaN(p[1]));

    // 2. Animation
    const startTime = performance.now();
    const duration = 1500 * (pathPoints.length - 1);
    let animationFrameId: number;

    const animate = (time: number) => {
      const elapsed = time - startTime;
      if (elapsed > duration) {
        setTrainState(prev => ({ ...prev, visible: false }));
        onArrive();
        return;
      }

      const progress = elapsed / duration;
      const totalSegs = pathPoints.length - 1;
      const currentSegFloat = progress * totalSegs;
      const currentSegIdx = Math.floor(currentSegFloat);
      const segProgress = currentSegFloat - currentSegIdx;

      if (currentSegIdx >= totalSegs) return;

      const p1 = pathPoints[currentSegIdx];
      const p2 = pathPoints[currentSegIdx + 1];

      if (!p1 || !p2) {
        requestAnimationFrame(animate);
        return;
      }

      // Lerp
      const lat = p1[0] + (p2[0] - p1[0]) * segProgress;
      const lng = p1[1] + (p2[1] - p1[1]) * segProgress;

      // Angle
      const dLat = p2[0] - p1[0];
      const dLon = p2[1] - p1[1];
      const angle = Math.atan2(dLon, dLat) * 180 / Math.PI;

      map.setView([lat, lng], 14, { animate: false });
      const point = map.latLngToContainerPoint([lat, lng]);

      setTrainState({
        pixelPos: [point.x, point.y],
        angle: angle,
        visible: true
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);

  }, [phase, destination, currentStationName, metroData, onArrive]);


  return (
    <div className="absolute inset-0 z-0 bg-black">
      {/* Leaflet Map */}
      <div ref={mapContainerRef} className="w-full h-full opacity-60 mix-blend-screen" />

      {/* 3D Train Overlay - Only render during movement to prevent multiple WebGL contexts */}
      {phase === 'moving' && (
        <div className="absolute inset-0 pointer-events-none z-50">
          <Canvas shadows>
            <CameraController />
            {/* Lighting for 3D Pop */}
            <ambientLight intensity={0.6} />
            <directionalLight
              position={[50, 100, 50]}
              intensity={2.0}
              castShadow
              shadow-mapSize={[1024, 1024]}
            />
            {/* Rim Light for edge definition */}
            <spotLight position={[-50, 50, -10]} intensity={3.0} color="#b0e0e6" />

            <TrainModel
              pixelPos={trainState.pixelPos}
              angleDeg={trainState.angle}
              visible={trainState.visible}
            />
          </Canvas>
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-neutral-900 pointer-events-none opacity-80" />
    </div>
  );
};
