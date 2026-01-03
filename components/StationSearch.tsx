import React, { useState, useEffect, useRef } from 'react';
import { GraphNode } from '../services/odptService';
import { Line } from '../data/metroData';

interface StationSearchProps {
    nodes: GraphNode[];
    value: string; // Current station Name (ID)
    onChange: (node: GraphNode) => void;
    metroData: Record<string, Line>;
}

export const StationSearch: React.FC<StationSearchProps> = ({ nodes, value, onChange, metroData }) => {
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Filter nodes based on query
    // If query is empty, show all? Or show none? 
    // Usually autocomplete shows matching. If empty, maybe show popular or all (limit to 20?)
    const filteredNodes = nodes.filter(node =>
        node.name.includes(query)
    ).sort((a, b) => {
        // Sort exact match first, then starts with, then others
        if (a.name === query) return -1;
        if (b.name === query) return 1;
        if (a.name.startsWith(query)) return -1;
        if (b.name.startsWith(query)) return 1;
        if (b.name.startsWith(query)) return 1;
        return a.name.localeCompare(b.name);
    });

    // Update query when value changes externally (initial load)
    useEffect(() => {
        setQuery(value);
    }, [value]);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                // Reset query to current selected value if we closed without selecting
                if (value) setQuery(value);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [value]);

    const handleSelect = (node: GraphNode) => {
        onChange(node);
        setQuery(node.name);
        setIsOpen(false);
    };

    return (
        <div className="relative w-full" ref={wrapperRef}>
            <label className="block text-sm text-neutral-300 mb-1">現在地</label>
            <div className="relative">
                <input
                    ref={inputRef}
                    type="text"
                    className="w-full bg-black/40 border border-white/20 rounded-xl p-3 pl-10 text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 focus:bg-black/60 transition-all backdrop-blur-sm shadow-inner"
                    placeholder="駅名を入力..."
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={() => {
                        setIsOpen(true);
                        // Optional: select all text on focus?
                    }}
                />
                {/* Search Icon */}
                <svg className="absolute left-3 top-3.5 w-5 h-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute z-50 w-full mt-2 bg-neutral-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl max-h-60 overflow-y-auto overflow-x-hidden animate-fade-in-down custom-scrollbar">
                    {filteredNodes.length > 0 ? (
                        <ul>
                            {filteredNodes.map(node => (
                                <li key={node.id}>
                                    <button
                                        onClick={() => handleSelect(node)}
                                        className="w-full text-left px-4 py-3 hover:bg-white/10 transition-colors flex items-center justify-between group border-b border-white/5 last:border-0"
                                    >
                                        <span className="font-bold text-lg text-white group-hover:text-blue-200 transition-colors">{node.name}</span>

                                        <div className="flex space-x-1 shrink-0 ml-2">
                                            {node.lines.map(lineId => {
                                                const line = metroData[lineId];
                                                if (!line) return null;
                                                return (
                                                    <span
                                                        key={lineId}
                                                        className="px-2 py-0.5 rounded text-[10px] font-bold border border-white/20 shadow-sm whitespace-nowrap"
                                                        style={{
                                                            backgroundColor: line.color,
                                                            color: '#fff',
                                                            textShadow: '0 1px 2px rgba(0,0,0,0.5)'
                                                        }}
                                                    >
                                                        {line.name.replace('線', '').split(' ')[0]} {/* Suffix 'Line' removed for compactness */}
                                                    </span>
                                                );
                                            })}
                                        </div>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="p-4 text-center text-neutral-500 text-sm">
                            見つかりませんでした
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
