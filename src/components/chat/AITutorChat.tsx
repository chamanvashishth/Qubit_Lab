import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Send, User, X, RefreshCw, Check, Copy, Brain, Lightbulb } from 'lucide-react';
import { ChatMessage } from '../../types/quantum';
import { answerLocally } from '../../utils/localTutor';

interface AITutorChatProps { currentContext?: string; isOpen: boolean; onClose: () => void; externalPrompt?: string; }

const DEFAULT_SUGGESTIONS = ['Explain superposition like I am a beginner', 'What does a CNOT gate actually do?', 'What gates does the simulator support?', 'How does Grover search work?', 'What is the QubitLab syllabus?'];
const isFollowUp = (text: string) => /^(why|how|what about that|what about it|explain more|tell me more|can you explain|why is that|what does that mean|and why\??|and how\??|okay why\??|then what\??)[?.! ]*$/.test(text.trim().toLowerCase()) || /^(why|how|then what|what next|more|explain|details|why\?)$/.test(text.trim().toLowerCase());

export const AITutorChat: React.FC<AITutorChatProps> = ({ currentContext, isOpen, onClose, externalPrompt }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([{ id: 'welcome', role: 'assistant', content: 'Hi, I am your QubitLab guide. Ask a quantum question, paste code, send an error, or ask about the circuit you just built.', timestamp: Date.now() }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastExternalPrompt = useRef('');

  useEffect(() => { if (externalPrompt && externalPrompt !== lastExternalPrompt.current) { lastExternalPrompt.current = externalPrompt; void sendMessage(externalPrompt); } }, [externalPrompt]);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isLoading]);

  const lastUser = useMemo(() => [...messages].reverse().find((m) => m.role === 'user')?.content ?? '', [messages]);
  const getReply = async (question: string): Promise<string> => {
    const resolvedQuestion = lastUser && isFollowUp(question) ? `${question}\n\nFollow-up to the user's previous question: ${lastUser}` : question;
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        context: currentContext || '',
        messages: [...messages.filter((message) => message.id !== 'welcome' && !message.id.startsWith('welcome-')), { role: 'user', content: resolvedQuestion }].slice(-12).map(({ role, content }) => ({ role, content })),
      }),
    });
    const data = await response.json().catch(() => ({})) as { reply?: unknown; error?: unknown };
    if (!response.ok) throw new Error(typeof data.error === 'string' ? data.error : 'The Gemini service is unavailable. Please try again.');
    if (typeof data.reply !== 'string' || !data.reply.trim()) throw new Error('Gemini returned an empty response. Please try again.');
    return data.reply.trim();
  };

  const sendMessage = async (textToSend: string) => {
    const text = textToSend.trim(); if (!text || isLoading) return;
    const now = Date.now();
    setMessages((prev) => [...prev, { id: `user-${now}`, role: 'user', content: text, timestamp: now }]);
    setInput(''); setIsLoading(true);
    await new Promise((resolve) => window.setTimeout(resolve, 180));
    try {
      const reply = await getReply(text);
      setMessages((prev) => [...prev, { id: `assistant-${Date.now()}`, role: 'assistant', content: reply, timestamp: Date.now() }]);
    } catch (error) {
      console.error('QubitLab AI chat error:', error);
      const fallback = answerLocally(text);
      setMessages((prev) => [...prev, {
        id: `assistant-fallback-${Date.now()}`,
        role: 'assistant',
        content: `${fallback}\n\n[Offline tutor response — the model service is temporarily unavailable.]`,
        timestamp: Date.now(),
      }]);
    } finally { setIsLoading(false); }
  };

  const copyMessage = async (id: string, text: string) => { try { await navigator.clipboard.writeText(text); setCopiedId(id); window.setTimeout(() => setCopiedId(null), 1600); } catch { /* optional */ } };
  const resetChat = () => { setMessages([{ id: `welcome-${Date.now()}`, role: 'assistant', content: 'Fresh start. What quantum concept should we work through?', timestamp: Date.now() }]); setInput(''); };

  if (!isOpen) return null;
  return <div className="fixed inset-0 z-[70] pointer-events-none">
    <div className="absolute inset-0 bg-black/35 backdrop-blur-[2px] pointer-events-auto" onClick={onClose} />
    <section className="pointer-events-auto absolute right-3 sm:right-6 top-20 bottom-3 w-[calc(100%-1.5rem)] sm:w-[440px] max-w-[440px] glass-panel rounded-2xl overflow-hidden flex flex-col shadow-2xl border border-white/10" role="dialog" aria-modal="true" aria-label="QubitLab virtual guide">
      <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-zinc-100">QubitLab Guide</span>
            <span className="w-1.5 h-1.5 rounded-full bg-lime-300" aria-hidden="true" />
          </div>
          <div className="text-xs text-zinc-500 truncate">Interactive quantum tutor</div>
        </div>
        <div className="flex items-center gap-1"><button onClick={resetChat} className="p-2 rounded-lg hover:bg-white/5 text-zinc-500 hover:text-zinc-200" aria-label="Reset conversation"><RefreshCw className="w-4 h-4" /></button><button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5 text-zinc-500 hover:text-zinc-200" aria-label="Close guide"><X className="w-4 h-4" /></button></div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => <div key={message.id} className={`flex gap-2.5 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
          <div className={`max-w-[86%] rounded-xl px-3.5 py-3 text-sm leading-6 ${message.role === 'user' ? 'bg-[#dfff3f]/10 border border-[#dfff3f]/20 text-zinc-200' : 'bg-white/[.035] border border-white/10 text-zinc-300'}`}><div className="whitespace-pre-wrap">{message.content}</div>{message.role === 'assistant' && <div className="flex justify-end mt-2"><button onClick={() => copyMessage(message.id, message.content)} className="text-zinc-600 hover:text-zinc-300" aria-label="Copy response">{copiedId === message.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}</button></div>}</div>
          {message.role === 'user' && <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 mt-1"><User className="w-3.5 h-3.5 text-zinc-500" /></div>}
        </div>)}
        {isLoading && <div className="flex items-center"><div className="rounded-xl bg-white/[.035] border border-white/10 px-3.5 py-3 text-xs text-zinc-500 flex items-center gap-2"><Brain className="w-3.5 h-3.5 text-[#dfff3f]" /><span>Thinking through the question</span><span className="flex gap-1"><i className="w-1 h-1 rounded-full bg-zinc-500 animate-pulse" /><i className="w-1 h-1 rounded-full bg-zinc-500 animate-pulse [animation-delay:150ms]" /><i className="w-1 h-1 rounded-full bg-zinc-500 animate-pulse [animation-delay:300ms]" /></span></div></div>}
        <div ref={messagesEndRef} />
      </div>
      {messages.length === 1 && <div className="px-4 pb-2 flex gap-2 overflow-x-auto responsive-scroll-x">{DEFAULT_SUGGESTIONS.map((suggestion) => <button key={suggestion} onClick={() => sendMessage(suggestion)} className="shrink-0 rounded-lg border border-white/10 bg-white/[.025] px-2.5 py-1.5 text-[10px] text-zinc-500 hover:text-zinc-200 hover:border-white/20"><Lightbulb className="inline w-3 h-3 mr-1" />{suggestion}</button>)}</div>}
      <form onSubmit={(e) => { e.preventDefault(); void sendMessage(input); }} className="p-3 border-t border-white/10"><div className="flex items-end gap-2 rounded-xl bg-black/30 border border-white/10 p-2 focus-within:border-[#dfff3f]/30"><textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); void sendMessage(input); } }} placeholder="Ask about quantum computing..." rows={2} className="flex-1 resize-none bg-transparent outline-none text-sm text-zinc-200 placeholder:text-zinc-700 px-1.5 py-1" disabled={isLoading} aria-label="Message the QubitLab guide" /><button type="submit" disabled={isLoading || !input.trim()} className="w-9 h-9 rounded-lg template-button flex items-center justify-center disabled:opacity-30" aria-label="Send message"><Send className="w-4 h-4" /></button></div><div className="text-[9px] text-zinc-700 mt-1.5 px-1">Grounded in the QubitLab curriculum, simulator and learning data.</div></form>
    </section>
  </div>;
};
