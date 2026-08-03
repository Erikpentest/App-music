import React, { useEffect, useRef } from 'react';
import { VisualizerMode } from '../types';
import { audioEngine } from '../services/audioEngine';

interface Props {
  mode: VisualizerMode;
  isPlaying: boolean;
  className?: string;
  coverUrl?: string;
}

export const AudioVisualizerCanvas: React.FC<Props> = ({ mode, isPlaying, className = '', coverUrl }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI crisp canvas
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    const resizeObserver = new ResizeObserver(() => resizeCanvas());
    resizeObserver.observe(canvas.parentElement || canvas);

    const bufferLength = 128;
    const frequencyData = new Uint8Array(bufferLength);
    const waveformData = new Uint8Array(bufferLength);

    // Particle state for particle mode
    const particles = Array.from({ length: 45 }, () => ({
      x: Math.random() * (canvas.width / (window.devicePixelRatio || 1)),
      y: Math.random() * (canvas.height / (window.devicePixelRatio || 1)),
      radius: Math.random() * 3 + 1,
      speedX: (Math.random() - 0.5) * 1.5,
      speedY: (Math.random() - 0.5) * 1.5,
      hue: Math.random() * 60 + 260, // Purple/Pink/Cyan spectrum
    }));

    let rotationAngle = 0;

    const render = () => {
      const width = canvas.width / (window.devicePixelRatio || 1);
      const height = canvas.height / (window.devicePixelRatio || 1);

      ctx.clearRect(0, 0, width, height);

      if (isPlaying) {
        audioEngine.getFrequencyData(frequencyData);
        audioEngine.getWaveformData(waveformData);
      } else {
        // Idle ambient animation when paused
        for (let i = 0; i < bufferLength; i++) {
          frequencyData[i] = Math.max(5, Math.sin(Date.now() * 0.002 + i * 0.1) * 20 + 20);
          waveformData[i] = 128 + Math.sin(Date.now() * 0.003 + i * 0.05) * 15;
        }
      }

      if (mode === 'bars') {
        const barWidth = (width / bufferLength) * 2.2;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const barHeight = (frequencyData[i] / 255) * height * 0.85;

          const gradient = ctx.createLinearGradient(0, height, 0, height - barHeight);
          gradient.addColorStop(0, '#8b5cf6'); // Violet
          gradient.addColorStop(0.5, '#ec4899'); // Pink
          gradient.addColorStop(1, '#06b6d4'); // Cyan

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.roundRect(x, height - barHeight, barWidth - 2, barHeight, [4, 4, 0, 0]);
          ctx.fill();

          // Glowing peak dot
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(x, height - barHeight - 4, barWidth - 2, 2);

          x += barWidth;
        }
      } else if (mode === 'wave') {
        ctx.lineWidth = 3;
        const gradient = ctx.createLinearGradient(0, 0, width, 0);
        gradient.addColorStop(0, '#ec4899');
        gradient.addColorStop(0.5, '#a855f7');
        gradient.addColorStop(1, '#3b82f6');
        ctx.strokeStyle = gradient;

        ctx.beginPath();
        const sliceWidth = width / bufferLength;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const v = waveformData[i] / 128.0;
          const y = (v * height) / 2;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
          x += sliceWidth;
        }

        ctx.lineTo(width, height / 2);
        ctx.stroke();

        // Fill glow underneath waveform
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.fillStyle = 'rgba(168, 85, 247, 0.12)';
        ctx.fill();
      } else if (mode === 'particles') {
        const avgEnergy = frequencyData.reduce((acc, val) => acc + val, 0) / bufferLength;

        particles.forEach((p, idx) => {
          const freqValue = frequencyData[idx % bufferLength] / 255;
          const boost = isPlaying ? freqValue * 3 : 1;

          p.x += p.speedX * boost;
          p.y += p.speedY * boost;

          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;

          const currentRadius = Math.max(1, p.radius + boost * 2);

          ctx.beginPath();
          ctx.arc(p.x, p.y, currentRadius, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${p.hue}, 90%, 65%, ${Math.min(1, 0.4 + freqValue)})`;
          ctx.shadowBlur = 12;
          ctx.shadowColor = `hsl(${p.hue}, 90%, 65%)`;
          ctx.fill();
          ctx.shadowBlur = 0;
        });
      } else if (mode === 'circle') {
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(centerX, centerY) * 0.45;

        rotationAngle += isPlaying ? 0.008 : 0.002;

        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(rotationAngle);

        const totalBars = 64;
        for (let i = 0; i < totalBars; i++) {
          const angle = (i / totalBars) * Math.PI * 2;
          const index = Math.floor((i / totalBars) * bufferLength);
          const barLen = (frequencyData[index] / 255) * (radius * 0.7) + 8;

          const x1 = Math.cos(angle) * radius;
          const y1 = Math.sin(angle) * radius;
          const x2 = Math.cos(angle) * (radius + barLen);
          const y2 = Math.sin(angle) * (radius + barLen);

          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.lineWidth = 3;
          ctx.strokeStyle = `hsl(${(i * 5 + Date.now() * 0.05) % 360}, 85%, 65%)`;
          ctx.stroke();
        }

        // Central circle ring
        ctx.beginPath();
        ctx.arc(0, 0, radius - 4, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.restore();
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      resizeObserver.disconnect();
    };
  }, [mode, isPlaying]);

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-slate-950/80 border border-slate-800/80 ${className}`}>
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};
