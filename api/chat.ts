import { GoogleGenAI } from '@google/genai';

type ChatMessage = { role: 'user' | 'assistant'; content: string };

const readBody = async (req: any) => {
  if (typeof req.body === 'string') return JSON.parse(req.body || '{}');
  return req.body || {};
};

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { messages, context } = await readBody(req);
    const safeMessages: ChatMessage[] = Array.isArray(messages)
      ? messages
          .filter((message) =>
            message &&
            (message.role === 'user' || message.role === 'assistant') &&
            typeof message.content === 'string' &&
            message.content.trim()
          )
          .slice(-12)
      : [];

    if (!safeMessages.length) {
      res.status(400).json({ error: 'A non-empty messages array is required.' });
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      res.status(503).json({ error: 'AI service is not configured.' });
      return;
    }

    const ai = new GoogleGenAI({ apiKey });
    const latest = safeMessages[safeMessages.length - 1];

    const history = safeMessages.slice(0, -1).map((message) => ({
      role: message.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: message.content }],
    }));

    const systemInstruction = [
      'You are QubitLab Assistant, a capable general-purpose AI assistant embedded in an interactive learning platform.',
      'Answer the user directly and accurately. You can answer questions beyond quantum computing, while using the active application context when it is relevant.',
      'For quantum computing, be rigorous about physics and mathematics and distinguish facts from intuition.',
      'For programming, provide practical, runnable guidance and state assumptions.',
      'Do not invent sources, credentials, system access, or actions you did not perform.',
      'Keep answers clear and structured. Use equations or code only when they improve the answer.',
      context ? `Active application context: ${String(context).slice(0, 1500)}` : '',
    ].filter(Boolean).join('\n');

    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
      contents: [
        ...history,
        { role: 'user', parts: [{ text: latest.content }] },
      ],
      config: {
        systemInstruction,
        temperature: 0.5,
        maxOutputTokens: 1800,
      },
    });

    res.status(200).json({
      reply: response.text || 'I could not generate a response for that question.',
    });
  } catch (error) {
    console.error('AI chat error:', error);
    res.status(500).json({ error: 'Failed to process the AI request.' });
  }
}
