import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, Send, Bot, User, X, RefreshCw, Check, Copy, Bug, Code2 } from 'lucide-react';
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
  'Debug this quantum code',
  'How does Grover search work?',
];

const looksLikeCode = (text: string) => {
  if (/```[\s\S]*```/.test(text) || /`[^`]+`/.test(text)) return true;
  const signals = [
    /(^|\n)\s*(import|from|def|class|const|let|var|function)\b/m,
    /qiskit|QuantumCircuit|pennylane|qml\.|cirq|numpy/i,
    /[{};]|=>|console\.log|print\(|\.h\(|\.cx\(|\.measure\(|\.rx\(|\.ry\(|\.rz\(/,
  ];
  return signals.filter((signal) => signal.test(text)).length >= 2;
};

const extractCode = (text: string) => {
  const fenced = text.match(/```(?:[a-zA-Z0-9_+-]+)?\s*([\s\S]*?)```/);
  if (fenced?.[1]?.trim()) return fenced[1].trim();
  const inline = text.match(/`([^`]+)`/);
  if (inline?.[1]?.trim()) return inline[1].trim();
  return text;
};

const explainCodeConversationally = (text: string): string | null => {
  if (!looksLikeCode(text)) return null;
  const code = extractCode(text);
  const lines = code.split('\n').filter((line) => line.trim());
  const notes: string[] = [];

  if (/^\s*import\s+|^\s*from\s+.*\s+import\s+/m.test(code)) notes.push('The import lines bring libraries or functions into the program so we can use them later.');
  if (/def\s+\w+\s*\(/.test(code)) notes.push('The `def` line creates a Python function. The indented block is the work that function performs when it is called.');
  if (/function\s+\w+\s*\(|=>/.test(code)) notes.push('This creates a JavaScript or TypeScript function, which keeps reusable logic together.');
  if (/for\s+|while\s*\(/.test(code)) notes.push('The loop repeats a block of code, usually for each item or while a condition remains true.');
  if (/if\s*\(|if\s+/.test(code)) notes.push('The `if` statement checks a condition and decides which path the program should take.');
  if (/return\b/.test(code)) notes.push('`return` sends a value back to the code that called the function.');
  if (/print\(|console\.log/.test(code)) notes.push('This prints a value so the programmer can inspect the result.');
  if (/qiskit|QuantumCircuit|pennylane|qml\.|cirq/i.test(code)) notes.push('This is quantum code. It is constructing, transforming, or simulating a quantum circuit.');
  if (/\.h\(|hadamard|\.x\(|\.y\(|\.z\(|\.cx\(|\.cnot|\.cz\(|\.swap|\.rx\(|\.ry\(|\.rz\(/i.test(code)) notes.push('These calls apply quantum gates to selected qubits. The target and control qubits determine what changes.');
  if (/measure|measurement/i.test(code)) notes.push('The measurement step turns quantum information into classical results, so repeated runs can produce different bitstrings.');
  if (/statevector|aer|backend|sampler|simulate/i.test(code)) notes.push('This part handles simulation or execution and collects the circuit result.');

  const explanation = notes.length ? notes.map((note) => `• ${note}`).join('\n') : 'I can see the code, but I do not recognize enough of its structure locally to give a reliable walkthrough.';
  return `Sure — let’s break it down without making it unnecessarily complicated.\n\n${explanation}\n\nA useful way to read this kind of program is: imports → setup → quantum operations → execution/measurement → output. If you paste the full snippet, I can check it for likely issues too.`;
};

const debugQuantumCode = (text: string): string | null => {
  const lower = text.toLowerCase();
  if (!/(debug|bug|error|fix|not working|wrong|issue|problem|exception)/.test(lower) || !looksLikeCode(text)) return null;

  const code = extractCode(text);
  const lines = code.split('\n');
  const findings: string[] = [];

  if (/quantumcircuit\(\s*0\s*\)/i.test(code)) findings.push('You created a circuit with 0 qubits. Give QuantumCircuit a positive number of qubits.');
  if (/\.(cx|cnot|cz|swap)\(\s*(\d+)\s*,\s*(\d+)\s*\)/i.test(code)) {
    const match = code.match(/\.(cx|cnot|cz|swap)\(\s*(\d+)\s*,\s*(\d+)\s*\)/i);
    if (match && match[2] === match[3]) findings.push('A two-qubit gate is using the same qubit as both control/source and target. Use two different qubit indices.');
  }
  if (/quantumcircuit\(\s*(\d+)\s*\)/i.test(code)) {
    const count = Number(code.match(/quantumcircuit\(\s*(\d+)\s*\)/i)?.[1]);
    const indices = [...code.matchAll(/\.(?:h|x|y|z|s|t|rx|ry|rz|measure)\(\s*(\d+)/gi)].map((m) => Number(m[1]));
    const multi = [...code.matchAll(/\.(?:cx|cnot|cz|swap)\(\s*(\d+)\s*,\s*(\d+)/gi)].flatMap((m) => [Number(m[1]), Number(m[2])]);
    const maxIndex = Math.max(-1, ...indices, ...multi);
    if (maxIndex >= count) findings.push(`Your circuit declares ${count} qubit${count === 1 ? '' : 's'}, but q[${maxIndex}] is referenced. Qubit indices normally run from 0 to ${count - 1}.`);
  }
  if (/measure_all|measure_all\(\)/i.test(code) && /measure\(/i.test(code)) findings.push('You appear to use both `measure_all()` and explicit measurement calls. That can be intentional, but check that you are not measuring the same qubits twice by accident.');
  if (/\.measure\(/i.test(code) && !/ClassicalRegister|creg|QuantumCircuit/i.test(code)) findings.push('Check that the measurement destination matches the classical register/circuit API expected by your SDK version.');
  if (/qml\.|pennylane/i.test(code) && /QuantumCircuit|from qiskit/i.test(code)) findings.push('The snippet mixes PennyLane and Qiskit APIs. That can be valid in an integration, but make sure objects from one framework are not passed directly into the other without the required conversion.');
  if (/cirq/i.test(code) && /QuantumCircuit|qiskit/i.test(code)) findings.push('The snippet mixes Cirq and Qiskit concepts. Check that gates, qubits, and circuit objects belong to the framework you are calling them on.');
  if (/\.h\(\s*([0-9]+)\s*\)/i.test(code) && /\.cx\(\s*([0-9]+)\s*,\s*([0-9]+)\s*\)/i.test(code)) findings.push('If this is intended to create a Bell state, verify that H is applied to the control qubit before CNOT and that the CNOT target is the other qubit.');
  if (/rx\(|ry\(|rz\(/i.test(code) && /theta|angle/i.test(code) && /degrees|°/.test(lower)) findings.push('Rotation APIs normally expect angles in radians. If you are supplying degrees, convert them first unless the specific API says otherwise.');
  if (/statevector/i.test(lower) && /measure/i.test(lower)) findings.push('Be careful about when you inspect the statevector. Measurement changes the quantum state in the usual measurement model, while many simulators expose a pre-measurement statevector separately.');

  const syntaxBraces = (code.match(/{/g) || []).length - (code.match(/}/g) || []).length;
  if (syntaxBraces !== 0) findings.push('The `{` and `}` braces do not balance in this snippet, so check the block structure.');
  const pythonParens = (code.match(/\(/g) || []).length - (code.match(/\)/g) || []).length;
  if (pythonParens !== 0) findings.push('The parentheses do not balance in this snippet. Check the function calls and expressions.');

  if (!findings.length) findings.push('I do not see an obvious issue from these quick checks. That does not prove the code is correct; the next step is to look at the exact error message and expected vs actual output.');

  const linePreview = lines.map((line, index) => `${index + 1}: ${line}`).slice(0, 8).join('\n');
  return `Let’s debug it step by step.\n\n${findings.map((item) => `• ${item}`).join('\n')}\n\nWhat I would check next:\n1. Run the smallest version of the circuit.\n2. Check the exact error message and the line it points to.\n3. Compare the expected state/probabilities with the simulated result.\n4. Change one thing at a time and run it again.\n\nFirst lines I inspected:\n${linePreview}${lines.length > 8 ? '\n…' : ''}`;
};

const humanizeReply = (reply: string): string => {
  const cleaned = reply.trim();
  if (!cleaned) return 'I’m not sure what to explain yet. Try asking me about a quantum topic or paste some code.';
  return cleaned;
};

export const AITutorChat: React.FC<AITutorChatProps> = ({ currentContext, isOpen, onClose, externalPrompt }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'welcome', role: 'assistant', content: 'Hey! I’m here to learn with you. Ask me a quantum question, paste some code, or send an error and we’ll work through it together.', timestamp: Date.now() },
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

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isLoading]);

  const getReply = async (question: string): Promise<string> => {
    const debugReply = debugQuantumCode(question);
    if (debugReply) return debugReply;
    const codeReply = explainCodeConversationally(question);
    if (codeReply) return codeReply;
    return humanizeReply(answerLocally(question));
  };

  const sendMessage = async (textToSend: string) => {
    const text = textToSend.trim();
    if (!text || isLoading) return;
    const now = Date.now();
    setMessages((prev) => [...prev, { id: `user-${now}`, role: 'user', content: text, timestamp: now }]);
    setInput('');
    setIsLoading(true);
    await new Promise((resolve) => window.setTimeout(resolve, 180));
    const reply = await getReply(text);
    setMessages((prev) => [...prev, { id: `assistant-${Date.now()}`, role: 'assistant', content: reply, timestamp: Date.now() }]);
    setIsLoading(false);
  };

  const copyMessage = async (id: string, text: string) => {
    try { await navigator.clipboard.writeText(text); setCopiedId(id); window.setTimeout(() => setCopiedId(null), 1600); } catch { /* clipboard is optional */ }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-black/85 border-l border-white/10 shadow-2xl backdrop-blur-md flex flex-col">
      <div className="p-4 bg-white/[.06] border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-2 rounded-xl bg-[#dfff3f]/10 border border-[#dfff3f]/30 text-[#e9ff8a]"><Sparkles className="w-5 h-5" /></div>
          <div className="min-w-0"><h3 className="text-sm font-bold text-zinc-100 font-mono">QUBITLAB GUIDE</h3><p className="text-[11px] text-zinc-400 truncate max-w-[330px]">{currentContext || 'Learn, code, debug, and experiment.'}</p></div>
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
        {isLoading && <div className="flex gap-3 items-center text-xs text-[#e9ff8a] font-mono"><div className="w-7 h-7 rounded-lg bg-[#dfff3f]/20 border border-[#dfff3f]/40 flex items-center justify-center animate-spin"><RefreshCw className="w-4 h-4" /></div><span>Checking...</span></div>}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-2.5 bg-white/[.045] border-t border-white/10 overflow-x-auto flex gap-1.5 no-scrollbar">
        {DEFAULT_SUGGESTIONS.map((suggestion) => <button key={suggestion} onClick={() => void sendMessage(suggestion)} className="px-2.5 py-1 rounded-lg bg-white/[.05] hover:bg-white/[.08] border border-white/10 hover:border-[#dfff3f]/30 text-[11px] text-zinc-300 hover:text-[#e9ff8a] whitespace-nowrap font-mono">{suggestion}</button>)}
      </div>

      <div className="px-3 pt-2 bg-black/70 flex gap-2">
        <span className="inline-flex items-center gap-1 text-[10px] text-zinc-500 font-mono"><Code2 className="w-3 h-3" /> Code explain</span>
        <span className="inline-flex items-center gap-1 text-[10px] text-zinc-500 font-mono"><Bug className="w-3 h-3" /> Debug help</span>
      </div>

      <div className="p-3 bg-black/70 border-t border-white/10">
        <form onSubmit={(event) => { event.preventDefault(); void sendMessage(input); }} className="flex items-center gap-2">
          <textarea value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); void sendMessage(input); } }} rows={2} placeholder="Ask a question, paste quantum code, or send an error..." aria-label="Ask a question, paste quantum code, or send an error" className="flex-1 resize-none px-3.5 py-2.5 rounded-xl bg-black/45 border border-white/15 text-xs text-zinc-200 placeholder-slate-500 focus:outline-none focus:border-[#dfff3f] font-mono" />
          <button type="submit" disabled={!input.trim() || isLoading} aria-label="Send question" className="p-2.5 rounded-xl bg-gradient-to-r from-[#dfff3f] to-[#f4a81d] text-slate-950 disabled:opacity-40"><Send className="w-4 h-4" /></button>
        </form>
      </div>
    </div>
  );
};
