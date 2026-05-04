import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading, disabled }) => {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus input when not loading
  useEffect(() => {
    if (!isLoading && !disabled && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoading, disabled]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading && !disabled) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="p-4 bg-slate-900/90 border-t border-slate-800 flex items-center gap-3 backdrop-blur-lg"
    >
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder={disabled ? "Game over..." : "Type your guess here..."}
        disabled={isLoading || disabled}
        className="flex-1 bg-slate-800 text-slate-100 placeholder-slate-400 rounded-full px-6 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500 border border-slate-700 transition-all disabled:opacity-50"
        autoComplete="off"
      />
      <button
        type="submit"
        disabled={!inputValue.trim() || isLoading || disabled}
        className="bg-violet-600 hover:bg-violet-500 text-white rounded-full p-3 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-violet-900/20"
      >
        {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
      </button>
    </form>
  );
};
