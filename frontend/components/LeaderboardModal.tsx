import React from 'react';
import { ALL_USERS } from '../constants';
import { Role, User } from '../types';
import { Trophy, X, Crown, Star, User as UserIcon, Coins } from 'lucide-react';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const sortedUsers = [...ALL_USERS].sort((a, b) => b.wins - a.wins);

  const getRoleIcon = (role: Role) => {
    switch (role) {
      case Role.ADMIN: return <Crown size={16} className="text-red-500" />;
      case Role.VIP: return <Star size={16} className="text-yellow-400" />;
      default: return <UserIcon size={16} className="text-blue-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
        
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-800/50">
          <div className="flex items-center gap-2">
            <Trophy className="text-yellow-500" size={24} />
            <h2 className="text-xl font-bold text-white">Global Leaderboard</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-4 overflow-y-auto max-h-[60vh]">
          <div className="space-y-3">
            {sortedUsers.map((user, index) => (
              <div 
                key={user.id} 
                className={`flex items-center justify-between p-3 rounded-xl border ${
                  index === 0 ? 'bg-yellow-500/10 border-yellow-500/30' : 
                  index === 1 ? 'bg-slate-300/10 border-slate-300/30' :
                  index === 2 ? 'bg-amber-700/10 border-amber-700/30' :
                  'bg-slate-800/50 border-slate-700/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 text-center font-bold ${
                    index === 0 ? 'text-yellow-500 text-xl' : 
                    index === 1 ? 'text-slate-300 text-lg' :
                    index === 2 ? 'text-amber-600 text-lg' :
                    'text-slate-500'
                  }`}>
                    #{index + 1}
                  </div>
                  <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full border-2 border-slate-700" />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-slate-100">{user.name}</span>
                      <span title={user.role}>{getRoleIcon(user.role)}</span>
                    </div>
                    <div className="text-xs text-slate-400 flex items-center gap-1">
                      <Coins size={12} className="text-yellow-500" /> {user.coins.toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-emerald-400">{user.wins}</div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider">Wins</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
