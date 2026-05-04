import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, MessageType, User, Role } from '../types';
import { ALL_USERS, AVAILABLE_GIFTS, MOCK_GIFS } from '../constants';
import { Send, Gift as GiftIcon, Image as ImageIcon, MessageSquare, Crown, Star, User as UserIcon } from 'lucide-react';

interface ChatPanelProps {
  messages: ChatMessage[];
  onSendMessage: (type: MessageType, content: string) => void;
  isLoadingAI: boolean;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({ messages, onSendMessage, isLoadingAI }) => {
  const [activeTab, setActiveTab] = useState<'CHAT' | 'GIFTS' | 'GIFS'>('CHAT');
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendText = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      onSendMessage(MessageType.TEXT, inputText.trim());
      setInputText('');
    }
  };

  const getUser = (id: string): User | undefined => ALL_USERS.find(u => u.id === id);

  const getRoleIcon = (role: Role) => {
    switch (role) {
      case Role.ADMIN: return <Crown size={12} className="text-red-500" />;
      case Role.VIP: return <Star size={12} className="text-yellow-400" />;
      default: return <UserIcon size={12} className="text-blue-400" />;
    }
  };

  const renderMessageContent = (msg: ChatMessage) => {
    if (msg.type === MessageType.SYSTEM) {
      return <div className="text-center text-xs text-slate-500 my-2 italic">{msg.content}</div>;
    }

    const user = getUser(msg.senderId);
    if (!user) return null;

    const isMe = user.id === 'u1';

    return (
      <div key={msg.id} className={`flex flex-col mb-4 ${isMe ? 'items-end' : 'items-start'}`}>
        <div className="flex items-baseline gap-1.5 mb-1 px-1">
          {!isMe && <span title={user.role}>{getRoleIcon(user.role)}</span>}
          <span className={`text-xs font-medium ${isMe ? 'text-slate-400' : 'text-slate-300'}`}>
            {isMe ? 'You' : user.name}
          </span>
          {isMe && <span title={user.role}>{getRoleIcon(user.role)}</span>}
        </div>
        
        <div className={`relative max-w-[85%] rounded-2xl px-3 py-2 shadow-sm ${
          isMe ? 'bg-violet-600 text-white rounded-tr-sm' : 'bg-slate-800 text-slate-100 rounded-tl-sm border border-slate-700'
        }`}>
          {msg.type === MessageType.TEXT && (
            <p className="text-sm break-words">{msg.content}</p>
          )}
          
          {msg.type === MessageType.GIFT && (() => {
            const gift = AVAILABLE_GIFTS.find(g => g.id === msg.content);
            return gift ? (
              <div className="flex flex-col items-center justify-center p-2">
                <span className={`text-4xl ${gift.animationClass}`}>{gift.emoji}</span>
                <span className="text-xs mt-1 opacity-80 font-medium">Sent a {gift.name}!</span>
              </div>
            ) : <p>Sent a gift</p>;
          })()}

          {msg.type === MessageType.GIF && (
            <div className="rounded-lg overflow-hidden border border-slate-700/50 mt-1">
              <img src={msg.content} alt="GIF" className="w-full h-auto max-h-32 object-cover" loading="lazy" />
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/80 backdrop-blur-md border-l border-slate-800 w-full md:w-80 lg:w-96 shrink-0">
      
      {/* Tabs */}
      <div className="flex border-b border-slate-800 bg-slate-900/50 p-2 gap-1">
        <button 
          onClick={() => setActiveTab('CHAT')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'CHAT' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'}`}
        >
          <MessageSquare size={16} /> Chat
        </button>
        <button 
          onClick={() => setActiveTab('GIFTS')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'GIFTS' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'}`}
        >
          <GiftIcon size={16} /> Gifts
        </button>
        <button 
          onClick={() => setActiveTab('GIFS')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'GIFS' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'}`}
        >
          <ImageIcon size={16} /> GIFs
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 scroll-smooth">
        {messages.map(renderMessageContent)}
        {isLoadingAI && (
          <div className="flex items-start mb-4">
            <div className="bg-slate-800 rounded-2xl rounded-tl-sm px-4 py-3 border border-slate-700 flex gap-1">
              <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
              <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area based on Tab */}
      <div className="p-3 bg-slate-900 border-t border-slate-800">
        {activeTab === 'CHAT' && (
          <form onSubmit={handleSendText} className="flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 bg-slate-800 text-white rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 border border-slate-700"
            />
            <button 
              type="submit"
              disabled={!inputText.trim()}
              className="bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full p-2 w-10 h-10 flex items-center justify-center transition-colors"
            >
              <Send size={16} />
            </button>
          </form>
        )}

        {activeTab === 'GIFTS' && (
          <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto p-1">
            {AVAILABLE_GIFTS.map(gift => (
              <button
                key={gift.id}
                onClick={() => onSendMessage(MessageType.GIFT, gift.id)}
                className="flex flex-col items-center justify-center p-2 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition-colors group"
              >
                <span className="text-2xl group-hover:scale-110 transition-transform">{gift.emoji}</span>
                <span className="text-[10px] text-slate-400 mt-1 font-medium">{gift.cost} 🪙</span>
              </button>
            ))}
          </div>
        )}

        {activeTab === 'GIFS' && (
          <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-1">
            {MOCK_GIFS.map((url, idx) => (
              <button
                key={idx}
                onClick={() => onSendMessage(MessageType.GIF, url)}
                className="relative rounded-lg overflow-hidden border border-slate-700 hover:border-violet-500 transition-colors group aspect-video"
              >
                <img src={url} alt="GIF option" className="w-full h-full object-cover group-hover:scale-105 transition-transform" loading="lazy" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
