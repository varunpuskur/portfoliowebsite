'use client';

import { useEffect, useRef, type RefObject } from 'react';
import { Pencil } from 'lucide-react';

// Ordered pen strokes, replayed by distance. The cursor and ink share the
// same path geometry, so every mark is made at the pencil tip.
// Keep each entry continuous: SVG dash patterns restart at every move command.
const LINES = [
  'M94 284 C126 273 153 269 177 270',
  'M264 273 L453 273',
  'M540 270 Q580 265 601 247 L604 223 Q598 204 563 198 L477 188 Q444 143 397 132 Q342 123 292 136 Q257 145 222 176 L166 190 Q120 199 107 222 L98 244 L94 284',
  'M264 274 A43 43 0 1 1 178 274 A43 43 0 1 1 264 274',
  'M242 274 A21 21 0 1 1 200 274 A21 21 0 1 1 242 274',
  'M540 274 A43 43 0 1 1 454 274 A43 43 0 1 1 540 274',
  'M518 274 A21 21 0 1 1 476 274 A21 21 0 1 1 518 274',
  'M246 176 Q273 147 305 143 Q353 132 389 143 Q421 153 452 184 L246 176',
  'M327 140 L312 178 L299 251 Q362 259 436 254 L448 192',
  'M337 198 L357 199',
  'M122 223 L160 215 Q169 213 174 202',
  'M557 205 L583 212',
  'M108 245 L165 239',
  'M552 243 L594 231',
  'M140 331 Q322 320 572 332',
  'M81 164 L161 105 L189 129 L249 74 L278 102',
  'M453 111 L506 68 L568 135 L597 112 L642 159',
  'M353 67 A23 23 0 1 1 399 67 A23 23 0 1 1 353 67',
];

export function ScrollDrawing({ opened, sectionRef }: { opened: boolean; sectionRef: RefObject<HTMLElement | null> }) {
  const svg = useRef<SVGSVGElement>(null);
  const pencil = useRef<SVGGElement>(null);
  const progress = useRef(0);

  useEffect(() => {
    const section = sectionRef.current;
    const root = svg.current;
    if (!section || !root || opened) return;
    const paths = Array.from(root.querySelectorAll<SVGPathElement>('[data-pen-stroke]'));
    const lengths = paths.map(path => path.getTotalLength());
    const total = lengths.reduce((sum, length) => sum + length, 0);
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    let target = 0;
    let lastTime = 0;

    const paint = (value: number) => {
      let remaining = value * total;
      let current = paths[0];
      let distance = 0;
      paths.forEach((path, index) => {
        const drawn = Math.max(0, Math.min(lengths[index], remaining));
        path.style.strokeDashoffset = String(1 - drawn / lengths[index]);
        path.style.opacity = drawn > 0 ? '1' : '0';
        if (remaining > 0) { current = path; distance = drawn; }
        remaining -= lengths[index];
      });
      const point = current.getPointAtLength(distance);
      pencil.current?.setAttribute('transform', `translate(${point.x} ${point.y})`);
      if (pencil.current) pencil.current.style.opacity = value > .001 && value < .999 && !reduced.matches ? '1' : '0';
      root.setAttribute('data-progress', value.toFixed(3));
    };

    const animate = (time: number) => {
      const elapsed = lastTime ? Math.min(50, time - lastTime) : 16;
      lastTime = time;
      const difference = target - progress.current;
      progress.current = reduced.matches || Math.abs(difference) < .0003 ? target : progress.current + difference * (1 - Math.exp(-elapsed / 105));
      paint(progress.current);
      if (progress.current !== target) frame = requestAnimationFrame(animate);
      else { frame = 0; lastTime = 0; }
    };
    const update = () => {
      const intro = section.querySelector<HTMLElement>('.sketch-intro');
      const mobileOffset = innerWidth <= 760 ? (intro?.offsetHeight ?? 0) + 30 : 0;
      const top = section.getBoundingClientRect().top + mobileOffset;
      target = reduced.matches ? 1 : Math.max(0, Math.min(1, (innerHeight * .65 - top) / (innerHeight * .86)));
      if (!frame) frame = requestAnimationFrame(animate);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    reduced.addEventListener('change', update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      reduced.removeEventListener('change', update);
    };
  }, [opened, sectionRef]);

  return <svg ref={svg} className={'scroll-drawing' + (opened ? ' drawing-guide' : '')} viewBox="0 0 720 420" aria-hidden="true">
    <g fill="none" stroke="#424847" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      {LINES.map(d => <path key={d} d={d} data-pen-stroke pathLength={1} strokeDasharray="1 1" strokeDashoffset={1} style={{ opacity: 0 }} />)}
    </g>
    <g ref={pencil} className="drawing-pencil" style={{ opacity: 0 }}><Pencil x={-3} y={-25} width={28} height={28} color="#bd3d1b" strokeWidth={1.8} fill="#fffdf7" /></g>
  </svg>;
}
