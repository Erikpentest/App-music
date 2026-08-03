import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini AI Client
  let ai: GoogleGenAI | null = null;
  const getAiClient = () => {
    if (!ai) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("GEMINI_API_KEY não configurada no servidor.");
      }
      ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    }
    return ai;
  };

  // API Health Check
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // API Gemini: Generate Song Lyrics & Chords
  app.post('/api/gemini/generate-lyrics', async (req, res) => {
    try {
      const { theme, genre, mood, language } = req.body;
      const client = getAiClient();

      const prompt = `Você é um renomado compositor musical e produtor.
Crie uma letra de música original em ${language || 'português'} com base nos seguintes parâmetros:
- Tema/Inspiração: ${theme || 'Amor e viagens'}
- Gênero Musical: ${genre || 'MPB / Pop Bossa'}
- Clima/Vibe: ${mood || 'Melancólico porém esperançoso'}

Por favor, retorne uma resposta em formato JSON estrito com o seguinte esquema:
{
  "title": "Título da Música",
  "artist": "Nome Artístico Sugerido",
  "genre": "Gênero",
  "bpm": 120,
  "keySignature": "C Major",
  "structure": [
    { "type": "Verso 1", "lyrics": "Linhas do verso...", "chords": "C  G  Am  F" },
    { "type": "Pré-Refrão", "lyrics": "Linhas do pré-refrão...", "chords": "Dm  G" },
    { "type": "Refrão", "lyrics": "Linhas marcantes do refrão...", "chords": "F  G  C  Am" },
    { "type": "Verso 2", "lyrics": "Linhas do verso 2...", "chords": "C  G  Am  F" },
    { "type": "Ponte", "lyrics": "Linhas da ponte...", "chords": "Am  Em  F  G" },
    { "type": "Outro", "lyrics": "Finalização suave...", "chords": "F  Fm  C" }
  ],
  "compositionNotes": "Dicas de arranjo e dinâmica musical (ex: violão suave no início, crescendo de bateria no refrão)."
}`;

      const response = await client.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.8,
        },
      });

      const resultText = response.text || '{}';
      const parsedData = JSON.parse(resultText);
      res.json({ success: true, song: parsedData });
    } catch (error: any) {
      console.error('Erro na geração de letra:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Falha ao gerar composição musical.',
      });
    }
  });

  // API Gemini: Recommend Playlist by Mood / Activity
  app.post('/api/gemini/recommend-songs', async (req, res) => {
    try {
      const { userPrompt, currentMood } = req.body;
      const client = getAiClient();

      const prompt = `Você é um DJ e curador de playlists de alta sensibilidade musical.
O usuário diz: "${userPrompt || 'Quero música para focar nos estudos à noite'}"
Clima atual: "${currentMood || 'Relaxado'}"

Crie uma recomendação de playlist com 5 a 6 faixas conceituais que combinem perfeitamente.
Retorne um JSON estrito:
{
  "playlistName": "Nome da Playlist",
  "description": "Breve descrição poética ou explicativa da vibe",
  "vibeTag": "Vibe da Playlist",
  "tracks": [
    {
      "title": "Nome da Faixa",
      "artist": "Artista Sugerido ou Famoso",
      "genre": "Estilo",
      "reason": "Por que esta música se encaixa na vibe do usuário"
    }
  ]
}`;

      const response = await client.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.7,
        },
      });

      const resultText = response.text || '{}';
      const parsedData = JSON.parse(resultText);
      res.json({ success: true, recommendation: parsedData });
    } catch (error: any) {
      console.error('Erro na recomendação:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Falha ao gerar recomendações.',
      });
    }
  });

  // API Gemini: Song Trivia & Analysis
  app.post('/api/gemini/song-insights', async (req, res) => {
    try {
      const { title, artist } = req.body;
      const client = getAiClient();

      const prompt = `Forneça uma análise poética e curiosidades musicais sobre a música "${title}" do artista/estilo "${artist}".
Retorne em JSON:
{
  "meaning": "Significado e mensagem central da música",
  "musicalCuriosities": ["Curiosidade 1", "Curiosidade 2"],
  "recommendedInstruments": ["Instrumento 1", "Instrumento 2"],
  "similarStyleArtists": ["Artista Similar 1", "Artista Similar 2"]
}`;

      const response = await client.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const parsedData = JSON.parse(response.text || '{}');
      res.json({ success: true, insights: parsedData });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Serve Vite in dev or static files in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🎵 Servidor de Música rodando em http://0.0.0.0:${PORT}`);
  });
}

startServer();
