import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, Send, Bot, User, X, Minimize2, Maximize2, 
  HelpCircle, Lightbulb, RefreshCw, ChevronDown, Check, Copy 
} from 'lucide-react';
import { ChatMessage } from '../../types/quantum';

interface AITutorChatProps {
  currentContext?: string;
  isOpen: boolean;
  onClose: () => void;
  externalPrompt?: string;
}

const DEFAULT_SUGGESTIONS = [
  "Explain why Hadamard creates equal superposition",
  "What is the physical meaning of the No-Cloning Theorem?",
  "How does phase kickback work in quantum algorithms?",
  "Does quantum entanglement allow faster-than-light communication?",
  "Explain Grover's amplitude amplification step-by-step",
];

const staticGuideReply = (question: string) => {
  const q = question.toLowerCase();

  if (q.includes('hadamard') || q.includes('superposition'))
    return "The Hadamard gate maps |0⟩ to (|0⟩ + |1⟩)/√2 and |1⟩ to (|0⟩ − |1⟩)/√2. The important point is that this creates a coherent superposition, not a classical 50/50 choice.";

  if (q.includes('entangl'))
    return "Entanglement creates correlations that cannot generally be described as independent states. Measuring one qubit can determine the correlated outcome of another, but it cannot transmit usable information faster than light.";

  if (q.includes('grover'))
    return "Grover's algorithm repeatedly amplifies the marked state's amplitude. Each iteration applies an oracle followed by inversion about the mean, gradually increasing the probability of measuring the target.";

  if (q.includes('no-cloning') || q.includes('cloning'))
    return "The No-Cloning Theorem says an unknown arbitrary quantum state cannot be copied perfectly. A universal cloning operation would violate the linearity of quantum mechanics.";

  if (q.includes('qubit'))
    return "A qubit is a normalized quantum state α|0⟩ + β|1⟩, where |α|² + |β|² = 1. Measurement returns classical outcomes with probabilities determined by those amplitudes.";

  return "This GitHub Pages build is running in static mode, so the external AI service is optional. For this topic, start with the state, identify the operation being applied, then inspect how the amplitudes and measurement probabilities change.";
};

export const AITutorChat: React.FC<AITutorChatProps> = ({
  currentContext,
  isOpen,
  onClose,
  externalPrompt,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Hi! I’m your quantum learning guide. Ask me about qubits, gates, circuits, algorithms, or quantum code, and I’ll explain the idea step by step.",
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-fill external prompt if provided
  useEffect(() => {
    if (externalPrompt) {
      sendMessage(externalPrompt);
    }
  }, [externalPrompt]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const sendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: textToSend.trim(),
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || ''}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            ...messages.slice(-8).map(({ role, content }) => ({ role, content })),
            { role: 'user', content: textToSend.trim() },
          ],
          context: currentContext || 'User is exploring the Quantum Computing Learning Platform.',
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || data.details || `Server returned error ${response.status}`);
      }
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.reply || "I couldn’t reach the tutor service right now. Please try again in a moment.",
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error('Learning Guide chat error:', err);
      // GitHub Pages is static: keep the learning flow useful when no backend is configured.
      const fallbackMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: staticGuideReply(textToSend),
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-black/75 border-l border-white/10 shadow-2xl backdrop-blur-md flex flex-col transition-all duration-300">
      {/* Header */}
      <div className="p-4 bg-white/[.06] border-b border-white/10 flex items-center justify-between backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[#dfff3f]/10 border border-[#dfff3f]/30 text-[#e9ff8a] shadow-[0_0_10px_rgba(34,211,238,0.25)]">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2 font-mono">
              QUANTUM GUIDE
            </h3>
            <p className="text-[11px] text-zinc-400 truncate max-w-[260px]">
              {currentContext ? `Context: ${currentContext}` : 'Ask anything while you work through the topic'}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg bg-white/[.05] hover:bg-white/[.08] text-zinc-400 hover:text-zinc-200 border border-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Message List */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div className="w-7 h-7 rounded-lg bg-[#dfff3f]/10 border border-[#dfff3f]/30 text-[#dfff3f] flex items-center justify-center shrink-0 mt-0.5 shadow-[0_0_8px_rgba(34,211,238,0.2)]">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-gradient-to-r from-[#dfff3f] to-[#f4a81d] text-white shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                  : 'bg-white/[.06] border border-white/10 text-zinc-200 shadow-md whitespace-pre-wrap backdrop-blur-sm'
              }`}
            >
              <div>{msg.content}</div>

              {msg.role === 'assistant' && (
                <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-zinc-400">
                  <span className="font-mono text-[#dfff3f]/80">Learning Guide</span>
                  <button
                    onClick={() => copyMessage(msg.id, msg.content)}
                    className="hover:text-zinc-200 flex items-center gap-1 font-mono"
                  >
                    {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    {copiedId === msg.id ? 'Copied' : 'Copy'}
                  </button>
                </div>
              )}
            </div>

            {msg.role === 'user' && (
              <div className="w-7 h-7 rounded-lg bg-white/[.08] border border-white/15 text-zinc-300 flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3 items-center text-xs text-[#e9ff8a] font-mono">
            <div className="w-7 h-7 rounded-lg bg-[#dfff3f]/20 border border-[#dfff3f]/40 text-[#e9ff8a] flex items-center justify-center shrink-0 animate-spin">
              <RefreshCw className="w-4 h-4" />
            </div>
            <span>Thinking...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested prompts */}
      <div className="p-2.5 bg-white/[.045] border-t border-white/10 overflow-x-auto flex gap-1.5 no-scrollbar">
        {DEFAULT_SUGGESTIONS.map((sug, i) => (
          <button
            key={i}
            onClick={() => sendMessage(sug)}
            className="px-2.5 py-1 rounded-lg bg-white/[.05] hover:bg-white/[.08] border border-white/10 hover:border-[#dfff3f]/30 text-[11px] text-zinc-300 hover:text-[#e9ff8a] whitespace-nowrap transition-colors font-mono"
          >
            {sug}
          </button>
        ))}
      </div>

      {/* Input bar */}
      <div className="p-3 bg-black/70 border-t border-white/10">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage(input);
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about qubits, circuits, or code..."
            className="flex-1 px-3.5 py-2.5 rounded-xl bg-black/45 border border-white/15 text-xs text-zinc-200 placeholder-slate-500 focus:outline-none focus:border-[#dfff3f] font-mono"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-2.5 rounded-xl bg-gradient-to-r from-[#dfff3f] to-[#f4a81d] hover:from-[#efff96] hover:to-[#ffb347] text-slate-950 disabled:opacity-40 transition-all shadow-[0_0_10px_rgba(34,211,238,0.3)] active:scale-95"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
