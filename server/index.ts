import express, { Request, Response } from 'express';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '1mb' }));

// Lazy-initialized Gemini client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is not set.');
    }
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'online',
    version: '1.0.0',
    platform: 'QubitLab SIH Quantum Learning Platform',
    timestamp: new Date().toISOString(),
  });
});

// Quantum AI Tutor Chat Endpoint
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { messages, context } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      res.status(400).json({ error: 'Messages array is required.' });
      return;
    }

    const latestMessage = messages[messages.length - 1];
    const userPrompt = typeof latestMessage?.content === 'string' ? latestMessage.content.trim() : '';

    if (!userPrompt) {
      res.status(400).json({ error: 'The latest message must contain text.' });
      return;
    }

    // Check if GEMINI_API_KEY is available
    if (!process.env.GEMINI_API_KEY) {
      res.status(503).json({
        error: 'The AI tutor is not configured on this deployment.',
        details: 'Set GEMINI_API_KEY in the server environment and redeploy.',
      });
      return;
    }

    const ai = getGeminiClient();

    const systemInstruction = `You are the Quantum AI Copilot for QubitLab, an elite quantum computing learning platform built for the Smart India Hackathon (SIH).
You hold a Ph.D. in Theoretical Quantum Physics and have industry mastery in IBM Quantum Composer, Qiskit, Cirq, and PennyLane.
Your pedagogical style is rigorous yet intuitive:
1. Ground your answers in physical reality and linear algebra (Dirac bra-ket notation, statevectors, density matrices).
2. Clearly distinguish between classical bits and quantum qubits.
3. If code is requested, provide syntactically valid Qiskit (v1.0+) or Cirq snippets with comments.
4. Keep explanations clear, engaging, and format equations using clean markdown or LaTeX notations (e.g., |0>, |1>, |ψ>).
5. The user's active context is: "${context || 'Interactive Quantum Workbench'}".`;

    const conversationHistory = messages.slice(0, -1).map((m: { role: string; content: string }) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        ...conversationHistory,
        {
          role: 'user',
          parts: [{ text: userPrompt }],
        },
      ],
      config: {
        systemInstruction,
        temperature: 0.7,
        maxOutputTokens: 1200,
      },
    });

    const reply = response.text || 'I analyzed your quantum query, but no response was generated.';
    res.json({ reply });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    res.status(500).json({
      error: 'Failed to process the AI Tutor query.',
    });
  }
});

// Setup Vite middleware for development or serve static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`QubitLab Quantum OS server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
