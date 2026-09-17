'use client';

import Link from 'next/link';
import { useEffect, useId, useRef, useState } from 'react';
import { ScanSearch, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ArtLens({ src, alt, width, height, priority = false, medium = 'Graphite on paper', inViewer = false }: {
  src: string; alt: string; width: number; height: number; priority?: boolean; medium?: string; inViewer?: boolean;
}) {
  const frame = useRef<HTMLDivElement>(null);
  const hint = useId();
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [point, setPoint] = useState({ x: .5, y: .5 });
  const [pinned, setPinned] = useState(false);
  const [hovered, setHovered] = useState(false);
  useEffect(() => {
    const el = frame.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => setSize({ width: entry.contentRect.width, height: entry.contentRect.height }));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  const active = pinned || hovered;
  const radius = 74;
  const left = Math.max(radius, Math.min(size.width - radius, point.x * size.width));
  const top = Math.max(radius, Math.min(size.height - radius, point.y * size.height));
  return <div className={'art-lens' + (active ? ' is-inspecting' : '')}>
    <div ref={frame} data-art-magnifier className="lens-surface" tabIndex={0} role="group" aria-label="Artwork magnifier" aria-describedby={hint}
      onPointerMove={event => {
        if (event.pointerType === 'touch' && !pinned) return;
        const rect = event.currentTarget.getBoundingClientRect();
        setPoint({ x: Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width)), y: Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height)) });
        if (event.pointerType !== 'touch') setHovered(true);
      }}
      onPointerDown={event => {
        if (event.pointerType === 'touch' && pinned) {
          const rect = event.currentTarget.getBoundingClientRect();
          setPoint({ x: (event.clientX - rect.left) / rect.width, y: (event.clientY - rect.top) / rect.height });
        }
      }}
      onPointerLeave={() => setHovered(false)} onBlur={() => setHovered(false)}
      onKeyDown={event => {
        if (event.key === 'Escape') { setPinned(false); setHovered(false); return; }
        if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setPinned(value => !value); return; }
        if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
        event.preventDefault(); setPinned(true);
        setPoint(p => ({ x: Math.max(.05, Math.min(.95, p.x + (event.key === 'ArrowLeft' ? -.05 : event.key === 'ArrowRight' ? .05 : 0))), y: Math.max(.05, Math.min(.95, p.y + (event.key === 'ArrowUp' ? -.05 : event.key === 'ArrowDown' ? .05 : 0))) }));
      }}>
      <img src={src} alt={alt} width={width} height={height} loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : undefined} draggable={false} />
      <div className="graphite-lens" aria-hidden="true" style={{ left, top, backgroundImage: `url(${src})`, backgroundSize: `${size.width * 2.4}px ${size.height * 2.4}px`, backgroundPosition: `${radius - point.x * size.width * 2.4}px ${radius - point.y * size.height * 2.4}px` }}><span>2.4×</span></div>
    </div>
    <div className="lens-toolbar"><Button variant="ghost" className="lens-toggle" aria-pressed={pinned} onClick={() => { setPinned(value => !value); setHovered(false); }}>{pinned ? <X size={14} /> : <ScanSearch size={14} />}{pinned ? 'Close magnifier' : 'Look closer'}</Button><span>{medium}</span></div>
    <p id={hint} className="sr-only">Hover to magnify. On touch screens, select Look closer, then tap the artwork. With a keyboard, use the arrow keys to move the magnifier. {inViewer ? 'Escape closes the drawing viewer.' : 'Escape closes the magnifier.'}</p>
  </div>;
}

export function HeroArtwork() {
  return <figure className="hero-art interactive-art">
    <div className="art-mat"><ArtLens src="/images/lion.webp" alt="Lion, an original graphite drawing by Varun Puskur" width={1000} height={1291} priority /></div>
    <figcaption><span>Lion</span><Link href="/art">More drawings</Link></figcaption>
  </figure>;
}
