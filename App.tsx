import React, { useState, Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { Experience } from './components/Experience';
import { SwitchButton } from './components/SwitchButton';
import { TrainMap } from './components/TrainMap';
import { StationSearch } from './components/StationSearch';
import { METRO_DATA, Line, Station } from './data/metroData';
import { fetchAndTransformMetroData, buildNetworkGraph, GraphNode, getReachableStations, fetchFare } from './services/odptService';

// --- Types & Game State ---
type GamePhase = 'setup' | 'rolling' | 'selecting_direction' | 'moving' | 'result';

interface TripState {
  currentStationName: string; // Graph Node ID (Name)
  lineId: string; // Current visual line context (mostly for color)
  timeToKill: number; // in hours
}

// --- Helper Components ---
const DiceFace = ({ value }: { value: number | null }) => {
  if (!value) return <div className="w-12 h-12 bg-neutral-800 rounded-lg opacity-20" />;
  const pips = {
    1: [4], 2: [2, 6], 3: [2, 4, 6], 4: [0, 2, 6, 8], 5: [0, 2, 4, 6, 8], 6: [0, 2, 3, 5, 6, 8]
  }[value] || [];

  return (
    <div className="w-16 h-16 bg-white rounded-xl shadow-lg grid grid-cols-3 grid-rows-3 gap-1 p-2 border border-neutral-200">
      {Array(9).fill(0).map((_, i) => (
        <div key={i} className="flex items-center justify-center">
          {pips.includes(i) && <div className={`w-3 h-3 rounded-full ${value === 1 ? 'bg-red-600' : 'bg-neutral-900'}`} />}
        </div>
      ))}
    </div>
  );
};

// --- Realistic Ticket Component ---
const RealTicket = ({
  fromName,
  toName,
  dateStr,
  priceVal
}: {
  fromName: string,
  toName: string,
  dateStr: string,
  priceVal: string
}) => {
  // Ticket Background Pattern
  const patternStyle = {
    backgroundColor: '#e1f5f8', // Light cyan base
    backgroundImage: `
            radial-gradient(#bcebf3 2px, transparent 2.5px), 
            radial-gradient(#bcebf3 2px, transparent 2.5px)
        `,
    backgroundSize: '10px 10px',
    backgroundPosition: '0 0, 5px 5px'
  };

  // Dynamic Font Size Helper
  const getFontSize = (text: string, baseSize: string, smallSize: string, tinySize: string) => {
    if (text.length > 8) return tinySize;
    if (text.length > 5) return smallSize;
    return baseSize;
  };

  const toNameClean = toName.replace(/\s*\(.*?\)\s*/g, '');
  const fromNameClean = fromName.replace(/\s*\(.*?\)\s*/g, '').slice(0, 6);

  return (
    <div className="relative w-full aspect-[1.8/1] shadow-xl overflow-hidden rounded-[4px] text-black font-sans select-none" style={patternStyle}>
      {/* Top Border */}
      <div className="absolute top-0 left-0 right-0 h-[1%] bg-white opacity-50"></div>

      {/* Content Container - Responsive Padding */}
      <div className="absolute inset-0 px-[5%] py-[3%] flex flex-col">

        {/* Header: Metro Name (Top Right) */}
        <div className="flex flex-col items-end w-full mb-[1%]">
          <div className="text-[3.5cqw] md:text-xl font-bold tracking-tight leading-none">東京メトロ線</div>
          <div className="text-[2cqw] md:text-xs font-bold tracking-tight leading-none mt-0.5">(東京地下鉄)</div>
        </div>

        {/* Middle Section: From -> Price */}
        <div className="flex items-end justify-center w-full mt-[1%] space-x-1 md:space-x-3">
          {/* From Station */}
          <div className="flex flex-col items-center mb-1">
            <span className="text-[2cqw] md:text-[9px] font-bold opacity-70 mb-0.5">From</span>
            <span className={`font-bold border-b-2 border-black pb-0 leading-none whitespace-nowrap ${getFontSize(fromNameClean, 'text-[5cqw] md:text-3xl', 'text-[4cqw] md:text-2xl', 'text-[3cqw] md:text-xl')}`}>
              {fromNameClean}
            </span>
          </div>

          {/* Arrow */}
          <div className="mb-[1%] mx-[1%]">
            {/* Responsive Arrow using SVG or scalable borders */}
            <div className="w-0 h-0 border-l-[2.5cqw] md:border-l-[14px] border-l-black border-y-[1.5cqw] md:border-y-[8px] border-y-transparent"></div>
          </div>

          {/* Price */}
          <div className="flex items-baseline">
            <span className="text-[12cqw] md:text-6xl font-black tracking-tighter leading-none font-mono">
              {priceVal.replace(/[^0-9]/g, '') || '170'}
            </span>
            <span className="flex flex-col items-start ml-1">
              <span className="text-[3cqw] md:text-lg font-bold leading-none">円</span>
              <span className="text-[2.5cqw] md:text-sm font-bold bg-black text-white px-1 leading-none mt-0.5">区間</span>
            </span>
          </div>
        </div>

        {/* Bottom Section: To Station (Centered/Right) */}
        <div className="flex items-baseline justify-center w-full mt-[2%]">
          <span className="text-[3cqw] md:text-sm font-bold mr-2 opacity-80">To</span>
          <span className={`font-black tracking-tight leading-none whitespace-nowrap ${getFontSize(toNameClean, 'text-[8cqw] md:text-5xl', 'text-[6cqw] md:text-4xl', 'text-[5cqw] md:text-3xl')}`}>
            {toNameClean}
          </span>
          <span className="text-[3cqw] md:text-lg font-bold ml-1">まで</span>
        </div>

        {/* Footer Info (Bottom) */}
        <div className="mt-auto flex justify-between items-end w-full pt-1">
          <div className="text-[2cqw] md:text-[9px] font-bold leading-tight space-y-0.5">
            <div className="flex items-center space-x-1">
              <span className="bg-black text-white px-1 py-px rounded-sm border border-transparent">地</span>
              <span>発売当日限り有効</span>
            </div>
            <div>下車前途無効</div>
          </div>

          <div className="flex flex-col items-end">
            <div className="text-[4cqw] md:text-xl font-bold mb-0 leading-none">大人</div>
          </div>
        </div>
      </div>

      {/* Vertical Date (Left) */}
      <div
        className="absolute left-[1%] top-0 bottom-0 flex flex-col justify-center items-center text-[2.5cqw] md:text-lg font-mono tracking-widest leading-none opacity-80"
        style={{ writingMode: 'vertical-rl', textOrientation: 'sideways' }}
      >
        {dateStr}
      </div>

      {/* Vertical Serial Number (Right) */}
      <div
        className="absolute right-[1%] top-0 bottom-0 flex flex-col justify-center items-center text-[2.5cqw] md:text-lg font-mono tracking-widest leading-none opacity-80"
        style={{ writingMode: 'vertical-rl', textOrientation: 'sideways' }}
      >
        {priceVal}
      </div>

      {/* Punch Hole */}
      <div className="absolute -left-[1.5%] top-1/2 w-[4%] h-[8%] md:w-4 md:h-4 bg-neutral-900 rounded-full"></div>
    </div>
  );
};

// --- Time Calculation Helper ---
const generateSchedule = (moveStations: number, timeToKillHours: number) => {
  const now = new Date();
  const coeff = 1000 * 60 * 5;
  const roundedNow = new Date(Math.round(now.getTime() / coeff) * coeff);

  const travelTimeMin = moveStations * 3;
  const arrivalTime = new Date(roundedNow.getTime() + travelTimeMin * 60000);

  const stayTimeMin = timeToKillHours * 60;
  const returnBaseTime = new Date(arrivalTime.getTime() + stayTimeMin * 60000);

  const returns = [];
  for (let i = 0; i < 3; i++) {
    const t = new Date(returnBaseTime.getTime() + i * 12 * 60000);
    returns.push(t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  }

  const y = now.getFullYear().toString().slice(-2);
  const m = (now.getMonth() + 1);
  const d = now.getDate();
  const dateStr = `${y}.-${m}.-${d}`;

  const serial = Math.floor(1000 + Math.random() * 9000);

  return {
    dep: roundedNow.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    arr: arrivalTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    returns,
    ticketDate: dateStr,
    serial: `0123 ${serial}`
  };
};

export default function App() {
  // Game Flow State
  const [phase, setPhase] = useState<GamePhase>('setup');
  const [isLoading, setIsLoading] = useState(false);

  // Data State
  const [metroData, setMetroData] = useState<Record<string, Line>>(METRO_DATA);
  const [networkGraph, setNetworkGraph] = useState<Map<string, GraphNode> | null>(null);

  // Trip Configuration
  const [trip, setTrip] = useState<TripState>({
    currentStationName: '', // Default empty as per user request
    lineId: 'G',
    timeToKill: 2,
  });

  // Load Data & Build Graph
  useEffect(() => {
    // Initial Build with static data
    setNetworkGraph(buildNetworkGraph(METRO_DATA));

    // We now have full static data in METRO_DATA, so we don't need to fetch on load.
    // This prevents potential API errors or partial data from overwriting the complete static set.

    /*
    const apiKey = import.meta.env.VITE_ODPT_API_KEY;
    if (apiKey) {
      setIsLoading(true);
      fetchAndTransformMetroData(apiKey)
        .then(data => {
          if (data) {
            setMetroData(data);
            setNetworkGraph(buildNetworkGraph(data));
          }
        })
        .catch(console.error)
        .finally(() => setIsLoading(false));
    }
    */
  }, []);

  // Dice Logic
  const [trigger, setTrigger] = useState(0);
  const [results, setResults] = useState<[number | null, number | null]>([null, null]);
  const [finalMoveCount, setFinalMoveCount] = useState<number>(0);

  // Destinations
  const [candidateStations, setCandidateStations] = useState<GraphNode[]>([]);
  const [destination, setDestination] = useState<GraphNode | null>(null);

  // UI Visibility
  const [showUI, setShowUI] = useState(true);

  // --- Handlers ---

  const handleRoll = () => {
    if (phase !== 'rolling' && phase !== 'setup') return;
    setPhase('rolling');
    setTrigger((prev) => prev + 1);
    setResults([null, null]);
    setCandidateStations([]);
    setDestination(null);
  };

  const handleResult = (index: 0 | 1, value: number) => {
    setResults((prev) => {
      const newResults = [...prev] as [number | null, number | null];
      newResults[index] = value;
      return newResults;
    });
  };

  // When dice settle, calculate candidates
  useEffect(() => {
    if (phase === 'rolling' && results[0] !== null && results[1] !== null) {
      const total = results[0] + results[1];
      setFinalMoveCount(total);

      if (networkGraph) {
        const candidates = getReachableStations(trip.currentStationName, total, networkGraph);
        setCandidateStations(candidates);
      }

      const timer = setTimeout(() => {
        setPhase('selecting_direction');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [results, phase, trip.currentStationName, networkGraph]);

  const confirmDestination = (node: GraphNode) => {
    setDestination(node);
    const nextLineId = node.lines[0];
    setTrip(prev => ({ ...prev, lineId: nextLineId })); // Update visual context
    setPhase('moving');
  };

  const handleTrainArrived = () => {
    setPhase('result');
  };

  const resetGame = () => {
    setPhase('setup');
    setResults([null, null]);
    setDestination(null);
    setCandidateStations([]);

    // Continuous Play: Set current station to where we arrived
    if (destination) {
      setTrip(prev => ({ ...prev, currentStationName: destination.name }));
    }
  };

  const currentStationNode = networkGraph?.get(trip.currentStationName);

  // Schedule & Fare
  const [ticketPrice, setTicketPrice] = useState<number>(0);

  useEffect(() => {
    if (phase === 'result' && destination && trip.currentStationName) {
      // Calculate Mock Fare first
      const base = 170; // Metro base
      const dist = finalMoveCount;
      let price = base;
      if (dist > 3) price = 200;
      if (dist > 6) price = 250;
      if (dist > 10) price = 290;
      if (dist > 15) price = 330;
      setTicketPrice(price);

      // Try Real API
      const apiKey = import.meta.env.VITE_ODPT_API_KEY;
      if (apiKey) {
        fetchFare(trip.currentStationName, destination.name, apiKey).then(p => {
          if (p) setTicketPrice(p);
        });
      }
    }
  }, [phase, destination, trip.currentStationName, finalMoveCount]);

  const schedule = destination ? generateSchedule(finalMoveCount, trip.timeToKill) : null;

  return (
    <div className="w-full h-screen relative overflow-hidden font-sans text-white select-none">

      {/* --- BACKGROUND MAP LAYER (Z-0) --- */}
      <TrainMap
        currentStationName={trip.currentStationName}
        candidateStations={candidateStations}
        destination={destination}
        phase={phase}
        onArrive={handleTrainArrived}
        metroData={metroData}
        onSelectCandidate={confirmDestination}
      />

      {/* --- 3D SCENE LAYER (Z-10) --- */}
      {phase !== 'moving' && phase !== 'result' && (
        <div className={`absolute inset-0 z-10 transition-opacity duration-300 ${showUI ? 'opacity-100' : 'opacity-0'}`} style={{ pointerEvents: 'none' }}>
          <Canvas dpr={1} camera={{ position: [0, 6, 10], fov: 45 }} style={{ pointerEvents: 'none' }}>
            <Suspense fallback={null}>
              <Experience triggerThrow={trigger} onResult={handleResult} />
            </Suspense>
          </Canvas>
        </div>
      )}

      {/* --- UI TOGGLE BUTTON (Z-30) --- */}
      <div className="absolute top-4 right-4 z-30">
        <button
          onClick={() => setShowUI(!showUI)}
          className="bg-black/60 backdrop-blur-md p-3 rounded-full border border-white/20 text-white hover:bg-black/80 transition-all shadow-lg"
          title={showUI ? "地図のみ表示" : "UIを表示"}
        >
          {showUI ? (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          )}
        </button>
      </div>

      {/* --- UI LAYER (Z-20) --- */}
      <div className={`absolute inset-0 z-20 pointer-events-none flex flex-col justify-between p-4 md:p-8 transition-opacity duration-300 ${showUI ? 'opacity-100' : 'opacity-0'}`}>

        {/* HEADER */}
        <header className="w-full flex justify-between items-start pointer-events-auto">
          <div className="bg-black/80 backdrop-blur-md p-3 rounded-xl border border-white/10">
            <h1 className="text-xl font-bold tracking-wider text-white">METRO DICE</h1>
            <p className="text-xs text-neutral-400">暇つぶし運命サイコロ {isLoading ? '(データ取得中...)' : ''}</p>
          </div>
        </header>

        {/* CENTER CONTENT */}
        <main className="flex-1 flex items-center justify-center pointer-events-auto">

          {/* 1. SETUP PHASE */}
          {phase === 'setup' && (
            <div className="w-full max-w-md bg-black/80 backdrop-blur-xl border border-white/20 p-6 rounded-3xl shadow-2xl animate-fade-in-up">
              <h2 className="text-2xl font-bold mb-6 text-center">旅のしおり</h2>

              {/* Current Station Display (Since we can be anywhere) */}
              <div className="mb-6 text-center p-4 bg-white/5 rounded-lg border border-white/10">
                <label className="block text-sm text-neutral-400 mb-1">現在地</label>
                <div className="text-2xl font-bold text-white">{trip.currentStationName}</div>

                {/* Station Selection (Searchable) */}
                <StationSearch
                  nodes={Array.from(networkGraph?.values() || [])}
                  value={trip.currentStationName}
                  onChange={(node) => setTrip(p => ({ ...p, currentStationName: node.name, lineId: node.lines[0] }))}
                  metroData={metroData}
                />
              </div>

              {/* Time to Kill */}
              <div className="mb-6">
                <label className="block text-sm text-neutral-300 mb-1">滞在時間: <span className="text-white font-bold">{trip.timeToKill}時間</span></label>
                <input
                  type="range"
                  min="0.5"
                  max="5"
                  step="0.5"
                  value={trip.timeToKill}
                  onChange={(e) => setTrip(p => ({ ...p, timeToKill: parseFloat(e.target.value) }))}
                  className="w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>

              {/* 3D Scene Layer (Dice, Title) - Hide during train movement to prevent Context Loss */}
              {phase !== 'moving' && (
                <div className="w-full h-40 relative z-20 cursor-pointer pointer-events-auto">
                  <Canvas camera={{ position: [0, 4, 6], fov: 35 }} shadows>
                    <ambientLight intensity={0.5} />
                    <spotLight position={[5, 10, 5]} angle={0.3} penumbra={1} intensity={10} castShadow />
                    <SwitchButton onClick={handleRoll} disabled={phase !== 'setup' || !trip.currentStationName} />
                    <Environment preset="city" environmentIntensity={0.8} />
                  </Canvas>
                </div>
              )}
              <p className="text-center text-xs text-neutral-400 mt-2">押して運命を決める</p>
            </div>
          )}

          {/* 2. ROLLING PHASE */}
          {phase === 'rolling' && (
            <div className="flex flex-col items-center pointer-events-none">
              <div className="flex space-x-6 mb-8">
                <div className={`transform transition-all duration-500 ${results[0] ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-4 opacity-0 scale-90'}`}>
                  <DiceFace value={results[0]} />
                </div>
                <div className={`transform transition-all duration-500 delay-75 ${results[1] ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-4 opacity-0 scale-90'}`}>
                  <DiceFace value={results[1]} />
                </div>
              </div>
              {results[0] && results[1] && (
                <div className="text-6xl font-black drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] animate-bounce">
                  {finalMoveCount} 駅移動！
                </div>
              )}
            </div>
          )}

          {/* 3. SELECTION PHASE */}
          {phase === 'selecting_direction' && (
            <div className="w-full max-w-lg animate-fade-in-up pointer-events-none">
              <div className="bg-black/80 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl text-center">
                <h2 className="text-3xl font-bold mb-2">{finalMoveCount}駅先の候補</h2>
                <p className="text-neutral-300 mb-4">地図上のマーカーを選択してください</p>

                {/* List View as well */}
                <div className="grid grid-cols-2 gap-2 max-h-[30vh] overflow-y-auto pointer-events-auto">
                  {candidateStations.map(node => (
                    <button
                      key={node.id}
                      onClick={() => confirmDestination(node)}
                      className="bg-white/10 hover:bg-white/20 p-3 rounded-lg text-left transition-colors flex flex-col"
                    >
                      <span className="font-bold text-lg">{node.name}</span>
                      <span className="text-xs text-neutral-400">{node.lines.join(', ')}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 4. RESULT PHASE */}
          {phase === 'result' && destination && schedule && (
            <div className="w-full max-w-lg bg-white/95 text-black p-0 rounded-3xl shadow-2xl overflow-hidden animate-pop-in flex flex-col max-h-[90vh]">

              {/* TICKET */}
              <div className="p-4 bg-neutral-200/50">
                <RealTicket
                  fromName={trip.currentStationName}
                  toName={destination.name}
                  dateStr={schedule.ticketDate}
                  priceVal={ticketPrice.toString()}
                />
              </div>

              <div className="px-6 py-4 overflow-y-auto">
                <div className="flex justify-between items-center mb-6 text-sm border-b pb-4 border-dashed border-neutral-300">
                  <div className="text-center">
                    <span className="text-neutral-500 text-xs">DEP</span>
                    <div className="font-mono font-bold text-lg">{schedule.dep}</div>
                  </div>
                  <div className="text-center">
                    <span className="bg-neutral-800 text-white text-[10px] px-2 py-1 rounded-full">{finalMoveCount} stops</span>
                  </div>
                  <div className="text-center">
                    <span className="text-neutral-500 text-xs">ARR</span>
                    <div className="font-mono font-bold text-lg">{schedule.arr}</div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-bold text-sm mb-2 text-neutral-400 uppercase tracking-widest">Recommended Spots</h3>
                  <ul className="space-y-3">
                    {(destination.originalStations[0]?.spots || []).map((spot, i) => (
                      <li key={i} className="bg-white border border-neutral-100 p-3 rounded-lg shadow-sm hover:shadow-md transition-all">
                        <div className="flex justify-between items-start mb-1">
                          <div className="flex items-center">
                            <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold mr-2 shrink-0">{i + 1}</span>
                            <span className="font-bold text-sm">{spot.name}</span>
                          </div>
                          <span className="text-[10px] bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-full whitespace-nowrap ml-2">
                            所要: {spot.time}
                          </span>
                        </div>

                        {/* Description */}
                        {spot.description && (
                          <div className="text-xs text-neutral-500 mb-2 pl-7 leading-relaxed">
                            {spot.description}
                          </div>
                        )}

                        {/* Footer: Walking Time & Coordinates */}
                        <div className="flex items-center justify-end space-x-3 pl-7 text-[10px] text-neutral-400 font-mono">
                          {spot.minutes !== undefined && (
                            <span className="flex items-center">
                              <span className="mr-1">🚶</span>駅徒歩{spot.minutes}分
                            </span>
                          )}
                          {spot.coords && (
                            <span className="flex items-center" title="座標">
                              <span className="mr-1">📍</span>{spot.coords[0].toFixed(4)}, {spot.coords[1].toFixed(4)}
                            </span>
                          )}
                        </div>
                      </li>
                    ))}
                    {(!destination.originalStations[0]?.spots?.length) && (
                      <li className="text-center text-neutral-400 text-sm py-4 bg-neutral-50 rounded-lg">
                        スポット情報はまだありません
                        <div className="text-[10px] mt-1 text-neutral-300">No spots available</div>
                      </li>
                    )}
                  </ul>
                </div>

                <button
                  onClick={resetGame}
                  className="w-full bg-neutral-900 text-white py-4 rounded-xl font-bold hover:bg-neutral-700 transition-colors shrink-0 shadow-lg"
                >
                  ここから次の旅へ (CONTINUE)
                </button>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}