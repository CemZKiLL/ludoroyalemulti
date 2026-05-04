import React, { useState, useCallback, useEffect } from 'react';
import { ChatMessage, MessageType, PlayerColor } from './types';
import { CURRENT_USER, AI_PLAYERS } from './constants';
import { geminiService } from './services/geminiService';
import { LudoBoard } from './components/LudoBoard';
import { ChatPanel } from './components/ChatPanel';
import { LeaderboardModal } from './components/LeaderboardModal';
import { Trophy, Users, Dices } from 'lucide-react';

// Initial static tokens for visual representation
const INITIAL_TOKENS = [
  { id: 'r1', color: PlayerColor.RED, x: 2, y: 2 },
  { id: 'r2', color: PlayerColor.RED, x: 3, y: 2 },
  { id: 'r3', color: PlayerColor.RED, x: 2, y: 3 },
  { id: 'r4', color: PlayerColor.RED, x: 1, y: 6 }, // One out on start
  
  { id: 'g1', color: PlayerColor.GREEN, x: 11, y: 2 },
  { id: 'g2', color: PlayerColor.GREEN, x: 12, y: 2 },
  { id: 'g3', color: PlayerColor.GREEN, x: 11, y: 3 },
  { id: 'g4', color: PlayerColor.GREEN, x: 12, y: 3 },
  
  { id: 'b1', color: PlayerColor.BLUE, x: 2, y: 11 },
  { id: 'b2', color: PlayerColor.BLUE, x: 3, y: 11 },
  { id: 'b3', color: PlayerColor.BLUE, x: 2, y: 12 },
  { id: 'b4', color: PlayerColor.BLUE, x: 7, y: 12 }, // One on track
  
  { id: 'y1', color: PlayerColor.YELLOW, x: 11, y: 11 },
  { id: 'y2', color: PlayerColor.YELLOW, x: 12, y: 11 },
  { id: 'y3', color: PlayerColor.YELLOW, x: 11, y: 12 },
  { id: 'y4', color: PlayerColor.YELLOW, x: 12, y: 12 },
];

export default function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'sys1', senderId: 'system', type: MessageType.SYSTEM, content: 'Welcome to Ludo Royale! The game has started.', timestamp: Date.now() }
  ]);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [tokens, setTokens] = useState(INITIAL_TOKENS);
  const [diceValue, setDiceValue] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState(false);

  const handleSendMessage = useCallback(async (type: MessageType, content: string) => {
    // 1. Add user message
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      senderId: CURRENT_USER.id,
      type,
      content,
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, userMsg]);

    // 2. Trigger AI response
    setIsLoadingAI(true);
    
    let contextStr = "User just chatted.";
    if (type === MessageType.GIFT) contextStr = "User just sent a gift to the room!";
    if (type === MessageType.GIF) contextStr = "User just posted a funny GIF.";
    if (diceValue) contextStr += ` The last dice roll was a ${diceValue}.`;

    const aiResponses = await geminiService.getAIResponses(
      type === MessageType.TEXT ? content : `[Sent a ${type}]`, 
      contextStr
    );

    if (aiResponses.length > 0) {
      const newMessages = aiResponses.map((resp, idx) => ({
        id: `ai-${Date.now()}-${idx}`,
        senderId: resp.senderId,
        type: MessageType.TEXT,
        content: resp.text,
        timestamp: Date.now() + idx * 1000
      }));
      setMessages(prev => [...prev, ...newMessages]);
    }
    
    setIsLoadingAI(false);
  }, [diceValue]);

  const rollDice = () => {
    if (isRolling) return;
    setIsRolling(true);
    
    // Simulate dice roll animation
    let rolls = 0;
    const interval = setInterval(() => {
      setDiceValue(Math.floor(Math.random() * 6) + 1);
      rolls++;
      if (rolls > 10) {
        clearInterval(interval);
        const finalValue = Math.floor(Math.random() * 6) + 1;
        setDiceValue(finalValue);
        setIsRolling(false);
        
        // Randomly move a red token slightly just for visual effect
        setTokens(prev => {
          const newTokens = [...prev];
          const redTrackToken = newTokens.find(t => t.id === 'r4');
          if (redTrackToken) {
            // Very fake movement logic just to show interaction
            redTrackToken.x = Math.min(14, redTrackToken.x + (Math.random() > 0.5 ? 1 : 0));
            redTrackToken.y = Math.max(0, redTrackToken.y - (Math.random() > 0.5 ? 1 : 0));
          }
          return newTokens;
        });

        // Trigger AI reaction to roll
        handleSendMessage(MessageType.SYSTEM, `[System: User rolled a ${finalValue}]`);
      }
    }, 100);
  };

  return (
    <div className="flex flex-col h-full w-full bg-slate-950/50">
      {/* Header */}
      <header className="bg-slate-900/90 border-b border-slate-800 px-4 py-3 flex items-center justify-between z-20 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-violet-600 to-indigo-700 p-2 rounded-xl shadow-lg shadow-violet-900/50 border border-violet-500/30">
            <Dices className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400 tracking-tight">
              LUDO ROYALE
            </h1>
            <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
              <span className="flex items-center gap-1"><Users size={12}/> 4/4 Players</span>
              <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></span> Live
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-full border border-slate-700">
            <img src={CURRENT_USER.avatarUrl} alt="Avatar" className="w-6 h-6 rounded-full" />
            <span className="text-sm font-bold text-slate-200">{CURRENT_USER.coins.toLocaleString()} 🪙</span>
          </div>
          <button 
            onClick={() => setIsLeaderboardOpen(true)}
            className="flex items-center gap-2 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 px-4 py-2 rounded-full font-bold transition-colors border border-yellow-500/30"
          >
            <Trophy size={18} />
            <span className="hidden sm:inline">Leaderboard</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        
        {/* Left Side: Game Board */}
        <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 overflow-y-auto relative">
          <div className="w-full max-w-2xl flex flex-col items-center gap-6">
            
            {/* Opponents Top Bar */}
            <div className="flex justify-between w-full px-4">
              {AI_PLAYERS.map(ai => (
                <div key={ai.id} className="flex flex-col items-center gap-1">
                  <div className={`w-10 h-10 rounded-full border-2 p-0.5 ${
                    ai.color === PlayerColor.GREEN ? 'border-green-500' :
                    ai.color === PlayerColor.BLUE ? 'border-blue-500' : 'border-yellow-500'
                  }`}>
                    <img src={ai.avatarUrl} alt={ai.name} className="w-full h-full rounded-full" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-300 bg-slate-800 px-2 py-0.5 rounded-full">{ai.name}</span>
                </div>
              ))}
            </div>

            {/* The Board */}
            <LudoBoard tokens={tokens} />

            {/* Player Controls */}
            <div className="flex items-center justify-between w-full bg-slate-800/80 p-4 rounded-2xl border border-slate-700 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full border-2 border-red-500 p-0.5">
                  <img src={CURRENT_USER.avatarUrl} alt="You" className="w-full h-full rounded-full" />
                </div>
                <div>
                  <div className="font-bold text-white">Your Turn</div>
                  <div className="text-xs text-red-400">Red Team</div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {diceValue && (
                  <div className={`w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl font-black text-slate-900 shadow-lg ${isRolling ? 'animate-spin' : 'animate-bounce-slight'}`}>
                    {diceValue}
                  </div>
                )}
                <button 
                  onClick={rollDice}
                  disabled={isRolling}
                  className="bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-red-900/50 transition-all active:scale-95 flex items-center gap-2"
                >
                  <Dices size={20} />
                  {isRolling ? 'Rolling...' : 'Roll Dice'}
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Right Side: Chat & Interactions */}
        <ChatPanel 
          messages={messages} 
          onSendMessage={handleSendMessage} 
          isLoadingAI={isLoadingAI} 
        />

      </main>

      <LeaderboardModal 
        isOpen={isLeaderboardOpen} 
        onClose={() => setIsLeaderboardOpen(false)} 
      />
    </div>
  );
}
