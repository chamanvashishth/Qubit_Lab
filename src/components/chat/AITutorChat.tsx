import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, Send, Bot, User, X, RefreshCw, Check, Copy } from 'lucide-react';
import { ChatMessage } from '../../types/quantum';
import { answerLocally } from '../../utils/localTutor';

interface AITutorChatProps {
  currentContext?: string;
  isOpen: boolean;
  onClose: () => void;
  externalPrompt?: string;
}

const DEFAULT_SUGGESTIONS = [
  'What is quantum computing?',
  'Explain superposition in simple terms',
  'What is a qubit?',
  'Why is Python popular for AI?',
  'How does machine learning work?',
];

export const AITutorChat: React.FC<AITutorChatProps> = ({ currentContext, isOpen, onClose, externalPrompt }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Hey! What would you like to learn?',
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastExternalPrompt = useRef('');

  useEffect(() => {
    if (externalPrompt && externalPrompt !== lastExternalPrompt.current) {
      lastExternalPrompt.current = externalPrompt;
      void sendMessage(externalPrompt);
    }
  }, [externalPrompt]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const getAIReply = async (conversation: ChatMessage[], question: string): Promise<string> => {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            ...conversation
              .filter((message) => message.id !== 'welcome')
              .slice(-10)
              .map((message) => ({ role: message.role, content: message.content })),
            { role: 'user', content: question },
          ],
          context: currentContext || '',
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok || typeof data.reply !== 'string' || !data.reply.trim()) {
        throw new Error('AI service unavailable');
      }

      return data.reply.trim();
    } catch {
      // Keep the guide useful when the AI service is temporarily unavailable.
      return answerLocally(question);
    }
  };

  const sendMessage = async (textToSend: string) => {
    const text = textToSend.trim();
    if (!text || isLoading) return;

    const now = Date.now();
    const userMessage: ChatMessage = { id: `user-${now}`, role: 'user', content: text, timestamp: now };
    const conversation = [...messages, userMessage];

    setMessages(conversation);
    setInput('');
    setIsLoading(true);

    const reply = await getAIReply(messages, text);
    setMessages((prev) => [
      ...prev,
      { id: `assistant-${Date.now()}`, role: 'assistant', content: reply, timestamp: Date.now() },
    ]);
    setIsLoading(false);
  };

  const copyMessage = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      window.setTimeout(() => setCopiedId(null), 1600);
    } catch {
      // Clipboard access is optional; the answer remains visible.
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-black/85 border-l border-white/10 shadow-2xl backdrop-blur-md flex flex-col">
      <div className="p-4 bg-white/[.06] border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-2 rounded-xl bg-[#dfff3f]/10 border border-[#dfff3f]/30 text-[#e9ff8a]">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-zinc-100 font-mono">QUBITLAB GUIDE</h3>
            <p className="text-[11px] text-zinc-400 truncate max-w-[330px]">
              {currentContext || 'Ask me anything.'}
            </p>
          </div>
        </div>
        <button onClick={onClose} aria-label="Close guide" className="p-1.5 rounded-lg bg-white/[.05] hover:bg-white/[.1] text-zinc-400 hover:text-zinc-200 border border-white/10">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && <div className="w-7 h-7 rounded-lg bg-[#dfff3f]/10 border border-[#dfff3f]/30 text-[#dfff3f] flex items-center justify-center shrink-0 mt-0.5"><Bot className="w-4 h-4" /></div>}
            <div className={`max-w-[86%] rounded-2xl p-3.5 text-xs leading-relaxed ${msg.role === 'user' ? 'bg-gradient-to-r from-[#dfff3f] to-[#f4a81d] text-slate-950' : 'bg-white/[.06] border border-white/10 text-zinc-200 whitespace-pre-wrap'}`}>
              <div>{msg.content}</div>
              {msg.role === 'assistant' && (
                <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-end text-[10px] text-zinc-400">
                  <button onClick={() => void copyMessage(msg.id, msg.content)} className="hover:text-zinc-200 flex items-center gap-1 font-mono">
                    {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    {copiedId === msg.id ? 'Copied' : 'Copy'}
                  </button>
                </div>
              )}
            </div>
            {msg.role === 'user' && <div className="w-7 h-7 rounded-lg bg-white/[.08] border border-white/15 text-zinc-300 flex items-center justify-center shrink-0 mt-0.5"><User className="w-4 h-4" /></div>}
          </div>
        ))}
        {isLoading && <div className="flex gap-3 items-center text-xs text-[#e9ff8a] font-mono"><div className="w-7 h-7 rounded-lg bg-[#dfff3f]/20 border border-[#dfff3f]/40 flex items-center justify-center animate-spin"><RefreshCw className="w-4 h-4" /></div><span>Thinking...</span></div>}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-2.5 bg-white/[.045] border-t border-white/10 overflow-x-auto flex gap-1.5 no-scrollbar">
        {DEFAULT_SUGGESTIONS.map((suggestion) => <button key={suggestion} onClick={() => void sendMessage(suggestion)} className="px-2.5 py-1 rounded-lg bg-white/[.05] hover:bg-white/[.08] border border-white/10 hover:border-[#dfff3f]/30 text-[11px] text-zinc-300 hover:text-[#e9ff8a] whitespace-nowrap font-mono">{suggestion}</button>)}
      </div>

      <div className="p-3 bg-black/70 border-t border-white/10">
        <form onSubmit={(event) => { event.preventDefault(); void sendMessage(input); }} className="flex items-center gap-2">
          <input type="text" value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask anything..." aria-label="Ask a question" className="flex-1 px-3.5 py-2.5 rounded-xl bg-black/45 border border-white/15 text-xs text-zinc-200 placeholder-slate-500 focus:outline-none focus:border-[#dfff3f] font-mono" />
          <button type="submit" disabled={!input.trim() || isLoading} aria-label="Send question" className="p-2.5 rounded-xl bg-gradient-to-r from-[#dfff3f] to-[#f4a81d] text-slate-950 disabled:opacity-40"><Send className="w-4 h-4" /></button>
        </form>
      </div>
    </div>
  );
};
