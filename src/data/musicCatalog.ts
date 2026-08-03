import { Playlist, Track } from '../types';

// High quality copyright-free audio stream URLs from reliable open audio sources (SoundHelix / FMA / Wikimedia)
export const INITIAL_TRACKS: Track[] = [
  {
    id: 'track-1',
    title: 'Horizonte Neon',
    artist: 'Synthwave Brasil',
    album: 'Cyber Noite Vol. 1',
    duration: 372,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    genre: 'Synthwave',
    year: 2024,
    bpm: 120,
    chords: ['Am', 'F', 'C', 'G'],
    isLiked: true,
    lyrics: `[Verso 1]
Luzes da cidade piscam no capô
Velocidade na estrada, o vento me levou
Sintetizadores soam na escuridão
Cada nota vibe bate no meu coração

[Refrão]
No horizonte neon, vou me perder
A noite é eterna pra quem quer viver
Siga as estrelas de LED no ar
O som do futuro não vai parar

[Verso 2]
Raios magenta no retrovisor
Memórias do passado ganham mais cor
O asfalto molhado reflete o luar
Continuo correndo sem querer chegar`
  },
  {
    id: 'track-2',
    title: 'Café na Chuva',
    artist: 'Lo-Fi Foco & Estudo',
    album: 'Tarde Silenciosa',
    duration: 423,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=800&q=80',
    genre: 'Lo-Fi',
    year: 2024,
    bpm: 85,
    chords: ['Cmaj7', 'Am7', 'Dm7', 'G7'],
    isLiked: false,
    lyrics: `[Instrumental Lo-Fi]
Gotas na janela, aroma de café fresco.
Lofi beats suave guiando o foco nas leituras.

[Ponte Suave]
Respire fundo...
Deixe as preocupações passarem como nuvens...`
  },
  {
    id: 'track-3',
    title: 'Noite de Verão',
    artist: 'Sertanejo Acústico',
    album: 'Violão & Luar',
    duration: 344,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
    genre: 'Sertanejo',
    year: 2023,
    bpm: 105,
    chords: ['G', 'D', 'Em', 'C'],
    isLiked: true,
    lyrics: `[Verso 1]
Sombra da varanda, cerveja gelada
Violão na mão e a galera reunida
A brisa do campo trazendo lembrança
Daquela pessoa que mudou minha vida

[Refrão]
E nessa noite de verão
Vou cantar pro seu coração
Sei que o tempo não apagou
O nosso grande amor!`
  },
  {
    id: 'track-4',
    title: 'Caminho do Sol',
    artist: 'Bossa Nova Trio',
    album: 'Brisa de Ipanema',
    duration: 502,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80',
    genre: 'MPB / Bossa',
    year: 2022,
    bpm: 92,
    chords: ['Dmaj7', 'Bm7', 'Em7', 'A7b9'],
    isLiked: false,
    lyrics: `[Verso 1]
O mar balança devagar
A brisa suave vem me abraçar
Caminho do sol ao entardecer
Coisa mais linda é ver você

[Refrão]
Olha que coisa mais cheia de graça
O samba de roda que vem e que passa
Sorriso sincero, olhar de luar...`
  },
  {
    id: 'track-5',
    title: 'Energia Urbana',
    artist: 'DJ Eletro Brasil',
    album: 'Pista & Luzes',
    duration: 388,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
    genre: 'Eletrônica',
    year: 2024,
    bpm: 128,
    chords: ['Fm', 'Db', 'Ab', 'Eb'],
    isLiked: true,
    lyrics: `[Drop Eletrônico]
Bassline forte pulsa no peito.
Sentindo a batida, o momento é perfeito!

[Build up]
3, 2, 1... Sinta a energia solar!`
  },
  {
    id: 'track-6',
    title: 'Vento do Norte',
    artist: 'Os Garotos do Rock',
    album: 'Estrada sem Fim',
    duration: 410,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?auto=format&fit=crop&w=800&q=80',
    genre: 'Rock Nacional',
    year: 2021,
    bpm: 135,
    chords: ['E5', 'G5', 'A5', 'C5'],
    isLiked: false,
    lyrics: `[Verso 1]
O vento sopra no meu rosto
Guitarras urram na amplificação
Deixamos a cidade pra trás
Sem olhar pra trás, buscando razão

[Refrão]
Nós somos filhos do rock and roll
Acelera o carro, sente o calor!`
  },
  {
    id: 'track-7',
    title: 'Amanhecer em Sampa',
    artist: 'Samba & Poesia',
    album: 'Roda da Paulistana',
    duration: 360,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=800&q=80',
    genre: 'Samba / MPB',
    year: 2023,
    bpm: 98,
    chords: ['C6', 'A7', 'Dm7', 'G7'],
    isLiked: true,
    lyrics: `[Verso 1]
A lua vai embora e o samba continua
O pandeiro marca o passo no meio da rua
Amanheceu em São Paulo com alegria
Transformando tristeza em poesia`
  },
  {
    id: 'track-8',
    title: 'Jazz da Meia Noite',
    artist: 'Paulista Jazz Quartet',
    album: 'Notas de Veludo',
    duration: 440,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1511735111819-9a3f7709049c?auto=format&fit=crop&w=800&q=80',
    genre: 'Jazz',
    year: 2022,
    bpm: 78,
    chords: ['Fm7', 'Bb7', 'Ebmaj7', 'Abmaj7'],
    isLiked: false,
    lyrics: `[Solo de Saxofone & Piano]
Notas aveludadas flutuando no clube de jazz.
Harmonia complexa, improvisos marcantes.`
  }
];

export const FEATURED_PLAYLISTS: Playlist[] = [
  {
    id: 'pl-1',
    name: 'Top 50 Brasil - Destaques',
    description: 'As músicas mais ouvidas e aclamadas de todos os gêneros.',
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80',
    tracks: [INITIAL_TRACKS[0], INITIAL_TRACKS[2], INITIAL_TRACKS[3], INITIAL_TRACKS[4]],
    createdAt: '2026-08-01'
  },
  {
    id: 'pl-2',
    name: 'Lo-Fi & Foco Intenso',
    description: 'Beats tranquilos e envolventes para estudo, programação e concentração.',
    coverUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=800&q=80',
    tracks: [INITIAL_TRACKS[1], INITIAL_TRACKS[7], INITIAL_TRACKS[3]],
    createdAt: '2026-08-02'
  },
  {
    id: 'pl-3',
    name: 'Sertanejo & Modão de Ouro',
    description: 'Modões inesquecíveis para cantar de peito aberto com amigos.',
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
    tracks: [INITIAL_TRACKS[2], INITIAL_TRACKS[6]],
    createdAt: '2026-08-01'
  },
  {
    id: 'pl-4',
    name: 'Cyberpunk & Synthwave Night',
    description: 'Vibes de sintetizadores vintage, neon e estradas noturnas.',
    coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    tracks: [INITIAL_TRACKS[0], INITIAL_TRACKS[4]],
    createdAt: '2026-08-03'
  }
];

export const GENRE_CATEGORIES = [
  { name: 'Sertanejo', color: 'from-amber-600 to-orange-800', icon: '🎸' },
  { name: 'MPB / Bossa', color: 'from-emerald-600 to-teal-800', icon: '🇧🇷' },
  { name: 'Lo-Fi', color: 'from-indigo-600 to-purple-800', icon: '☕' },
  { name: 'Synthwave', color: 'from-pink-600 to-rose-900', icon: '⚡' },
  { name: 'Eletrônica', color: 'from-cyan-600 to-blue-800', icon: '🎧' },
  { name: 'Rock Nacional', color: 'from-red-600 to-amber-900', icon: '🤘' },
  { name: 'Samba', color: 'from-yellow-500 to-amber-700', icon: '🪘' },
  { name: 'Jazz', color: 'from-violet-600 to-slate-900', icon: '🎷' }
];
