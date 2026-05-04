import React from 'react';
import { Message, Sender } from '../types';
import { Bot, User, Info } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.sender === Sender.USER;
  const isSystem = message.sender === Sender.SYSTEM;

  if (isSystem) {
    return (
      <div className="flex justify-center my-4">
        <div className="bg-slate-800/50 text-slate-400 text-xs px-4 py-2 rounded-full flex items-center gap-2 border border-slate-700/50">
          <Info size={14} />
          <span>{message.text}</span>
        </div>
      </div>
    );
  }

  // Simple markdown bold parser for the bot's words
  const renderText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="text-emerald-400 font-bold tracking-widest">{part.slice(2, -2)}</strong>;
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className={`flex w-full my-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[80%] sm:max-w-[70%] ${isUser ? 'flex-row-reverse' : 'flex-row'} items-end gap-2`}>
        
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-lg
          ${isUser ? 'bg-emerald-600' : 'bg-violet-600'}`}>
          {isUser ? <User size={18} className="text-white" /> : <Bot size={18} className="text-white" />}
        </div>

        {/* Message Content */}
        <div className={`px-4 py-3 rounded-2xl shadow-md text-sm sm:text-base
          ${isUser 
            ? 'bg-emerald-600/20 text-emerald-50 rounded-br-sm border border-emerald-500/30' 
            : 'bg-slate-800 text-slate-100 rounded-bl-sm border border-slate-700'}`}>
          <div className="whitespace-pre-wrap break-words leading-relaxed">
            {renderText(message.text)}
          </div>
          <div className={`text-[10px] mt-1 opacity-50 ${isUser ? 'text-right' : 'text-left'}`}>
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    </div>
  );
};
