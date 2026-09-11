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
  'Explain superposition like I am a beginner',
  'What does a CNOT gate actually do?',
  'Explain this Qiskit code',
  'How does Grover search work?',
  'What is a tensor product?',
];

const looksLikeCode = (text: string) => {
  if (/```[\s\S]*```/.test(text) || /`[^`]+`/.test(text)) return true;
  const signals = [
    /(^|\n)\s*(import|from|def|class|const|let|var|function)\b/m,
    /qiskit|QuantumCircuit|pennylane|qml\.|cirq/i,
    /[{};]|=>|console\.log|print\(|\.h\(|\.cx\(|\.measure\(/,
  ];
  return signals.filter((signal) => signal.test(text)).length >= 2;
};

const explainCodeConversationally = (text: string): string | null => {
  if (!looksLikeCode(text)) return null;
  const fenced = text.match(/```(?:[a-zA-Z0-9_+-]+)?\s*([\s\S]*?)```/);
  const inline = text.match(/`([^`]+)`/);
  const code = fenced?.[1]?.trim() || inline?.[1]?.trim() || text;
  const lines = code.split('\n').filter((line) => line.trim());
  const notes: string[] = [];

  if (/^\s*import\s+|^\s*from\s+.*\s+import\s+/m.test(code)) notes.push('The import lines bring the libraries or functions into the program so we can use them later.');
  if (/def\s+\w+\s*\(/.test(code)) notes.push('The `def` line creates a Python function. The indented block is the work that function performs when called.');
  if (/function\s+\w+\s*\(|=>/.test(code)) notes.push('This creates a JavaScript or TypeScript function, which packages reusable logic into one place.');
  if (/for\s+|while\s*\(/.test(code)) notes.push('The loop repeats a piece of code, usually for each item or while a condition remains true.');
  if (/if\s*\(|if\s+/.test(code)) notes.push('The `if` statement checks a condition and decides which path the program should take.');
  if (/return\b/.test(code)) notes.push('`return` sends a value back to whoever called the function.');
  if (/print\(|console\.log/.test(code)) notes.push('This line prints something so the programmer can see the result while running the program.');
  if (/qiskit|QuantumCircuit|pennylane|qml\.|cirq/i.test(code)) notes.push('This is quantum code. It is building or running a quantum circuit rather than only doing classical computation.');
  if (/\.h\(|hadamard|\.x\(|\.y\(|\.z\(|\.cx\(|\.cnot|\.cz\(|\.swap|\.rx\(|\.ry\(|\.rz\(/i.test(code)) notes.push('These calls apply quantum gates to selected qubits. The target and control qubits determine what changes.');
  if (/measure|measurement/i.test(code)) notes.push('The measurement step turns the quantum state into classical results, so repeated runs can produce a distribution of bitstrings.');
  if (/statevector|aer|backend|sampler|simulate/i.test(code)) notes.push('This part is about simulation or execution: it decides how the circuit is run and how its result is collected.');

  const explanation = notes.length
    ? notes.map((note) => `• ${note}`).join('\n')
    : 'I can see the code, but it uses patterns outside the walkthrough rules I have locally.';

  return `Sure — let’s break it down without making it unnecessarily complicated.\n\n${explanation}\n\nA useful way to read this kind of program is: imports → setup → operations → output. If you paste the full snippet, I can walk through it section by section and explain what each important line is doing.`;
};

const humanizeReply = (reply: string): string => {
  const cleaned = reply.trim();
  if (!cleaned) return 'I’m not sure what to explain yet. Try asking me about a quantum topic or paste some code.';
  if (/^(The answer is|I don’t have|I do not have)/.test(cleaned)) return cleaned;
  return cleaned;
};

export const AITutorChat: React.FC<AITutorChatProps> = ({ currentContext, isOpen, onClose, externalPrompt }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'welcome', role: 'assistant', content: 'Hey! I’m here to learn with you. Ask me a quantum question, or paste some code and we’ll go through it together.', timestamp: Date.now() },
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

  const getReply = async (question: string): Promise<string> => {
    const codeReply = explainCodeConversationally(question);
    if (codeReply) return codeReply;
    // Keep the main learning experience local, deterministic and available without an API key.
    return humanizeReply(answerLocally(question));
  };

  const sendMessage = async (textToSend: string) => {
    const text = textToSend.trim();
    if (!text || isLoading) return;
    const now = Date.now();
    const userMessage: ChatMessage = { id: `user-${now}`, role: 'user', content: text, timestamp: now };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    await new Promise((resolve) => window.setTimeout(resolve, 180));
    const reply = await getReply(text);
    setMessages((prev) => [...prev, { id: `assistant-${Date.now()}`, role: 'assistant', content: reply, timestamp: Date.now() }]);
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
          <div className="p-2 rounded-xl bg-[#dfff3f]/10 border border-[#dfff3f]/30 text-[#e9ff8a]"><Sparkles className="w-5 h-5" /></div>
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-zinc-100 font-mono">QUBITLAB GUIDE</h3>
            <p className="text-[11px] text-zinc-400 truncate max-w-[330px]">{currentContext || 'Learn quantum computing, one question at a time.'}</p>
          </div>
        </div>
        <button onClick={onClose} aria-label="Close guide" className="p-1.5 rounded-lg bg-white/[.05] hover:bg-white/[.1] text-zinc-400 hover:text-zinc-200 border border-white/10"><X className="w-5 h-5" /></button>
      </div>

      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && <div className="w-7 h-7 rounded-lg bg-[#dfff3f]/10 border border-[#dfff3f]/30 text-[#dfff3f] flex items-center justify-center shrink-0 mt-0.5"><Bot className="w-4 h-4" /></div>}
            <div className={`max-w-[86%] rounded-2xl p-3.5 text-xs leading-relaxed ${msg.role === 'user' ? 'bg-gradient-to-r from-[#dfff3f] to-[#f4a81d] text-slate-950' : 'bg-white/[.06] border border-white/10 text-zinc-200 whitespace-pre-wrap'}`}>
              <div>{msg.content}</div>
              {msg.role === 'assistant' && <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-end text-[10px] text-zinc-400"><button onClick={() => void copyMessage(msg.id, msg.content)} className="hover:text-zinc-200 flex items-center gap-1 font-mono">{copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}{copiedId === msg.id ? 'Copied' : 'Copy'}</button></div>}
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
          <input type="text" value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask a question or paste code..." aria-label="Ask a question or paste code" className="flex-1 px-3.5 py-2.5 rounded-xl bg-black/45 border border-white/15 text-xs text-zinc-200 placeholder-slate-500 focus:outline-none focus:border-[#dfff3f] font-mono" />
          <button type="submit" disabled={!input.trim() || isLoading} aria-label="Send question" className="p-2.5 rounded-xl bg-gradient-to-r from-[#dfff3f] to-[#f4a81d] text-slate-950 disabled:opacity-40"><Send className="w-4 h-4" /></button>
        </form>
      </div>
    </div>
  );
};
