import React, { useMemo } from 'react';
import { PlayerColor } from '../types';

interface Token {
  id: string;
  color: PlayerColor;
  x: number;
  y: number;
}

interface LudoBoardProps {
  tokens: Token[];
}

export const LudoBoard: React.FC<LudoBoardProps> = ({ tokens }) => {
  // Generate the 15x15 grid cells
  const cells = useMemo(() => {
    const grid = [];
    for (let y = 0; y < 15; y++) {
      for (let x = 0; x < 15; x++) {
        let cellClass = 'ludo-cell bg-white';
        let isStar = false;

        // Red Base (Top Left)
        if (x < 6 && y < 6) {
          cellClass = 'ludo-cell bg-red-500 border-red-600';
          if (x > 0 && x < 5 && y > 0 && y < 5) cellClass = 'ludo-cell bg-white rounded-lg m-1 shadow-inner';
        }
        // Green Base (Top Right)
        else if (x > 8 && y < 6) {
          cellClass = 'ludo-cell bg-green-500 border-green-600';
          if (x > 9 && x < 14 && y > 0 && y < 5) cellClass = 'ludo-cell bg-white rounded-lg m-1 shadow-inner';
        }
        // Blue Base (Bottom Left)
        else if (x < 6 && y > 8) {
          cellClass = 'ludo-cell bg-blue-500 border-blue-600';
          if (x > 0 && x < 5 && y > 9 && y < 14) cellClass = 'ludo-cell bg-white rounded-lg m-1 shadow-inner';
        }
        // Yellow Base (Bottom Right)
        else if (x > 8 && y > 8) {
          cellClass = 'ludo-cell bg-yellow-500 border-yellow-600';
          if (x > 9 && x < 14 && y > 9 && y < 14) cellClass = 'ludo-cell bg-white rounded-lg m-1 shadow-inner';
        }
        // Center Home
        else if (x >= 6 && x <= 8 && y >= 6 && y <= 8) {
          cellClass = 'ludo-cell bg-slate-800 border-slate-900';
        }
        // Home Stretches
        else if (y === 7 && x > 0 && x < 6) cellClass = 'ludo-cell bg-red-200';
        else if (x === 7 && y > 0 && y < 6) cellClass = 'ludo-cell bg-green-200';
        else if (x === 7 && y > 8 && y < 14) cellClass = 'ludo-cell bg-blue-200';
        else if (y === 7 && x > 8 && x < 14) cellClass = 'ludo-cell bg-yellow-200';
        // Starting Squares
        else if (x === 1 && y === 6) cellClass = 'ludo-cell bg-red-400';
        else if (x === 8 && y === 1) cellClass = 'ludo-cell bg-green-400';
        else if (x === 6 && y === 13) cellClass = 'ludo-cell bg-blue-400';
        else if (x === 13 && y === 8) cellClass = 'ludo-cell bg-yellow-400';
        // Star Squares (Safe Zones)
        else if ((x === 2 && y === 8) || (x === 6 && y === 2) || (x === 8 && y === 12) || (x === 12 && y === 6)) {
          cellClass = 'ludo-cell bg-slate-200';
          isStar = true;
        }

        grid.push(
          <div key={`${x}-${y}`} className={cellClass}>
            {isStar && <span className="text-slate-400 text-xs">★</span>}
            {/* Render tokens on this cell */}
            {tokens.filter(t => t.x === x && t.y === y).map((token, idx) => (
              <div 
                key={token.id} 
                className={`token token-${token.color.toLowerCase()} animate-bounce-slight`}
                style={{ 
                  transform: tokens.filter(t => t.x === x && t.y === y).length > 1 
                    ? `translate(${(idx % 2) * 4 - 2}px, ${Math.floor(idx / 2) * 4 - 2}px) scale(0.8)` 
                    : 'none'
                }}
              />
            ))}
          </div>
        );
      }
    }
    return grid;
  }, [tokens]);

  return (
    <div className="flex items-center justify-center p-4 w-full h-full bg-slate-800/50 rounded-2xl backdrop-blur-sm border border-slate-700">
      <div className="ludo-grid">
        {cells}
      </div>
    </div>
  );
};
