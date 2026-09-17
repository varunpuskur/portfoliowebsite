'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Pencil, Grid2X2, Undo2, RotateCcw, Download, ArrowUpRight } from 'lucide-react';
import { ScrollDrawing } from '@/components/scroll-drawing';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

type Point = { x: number; y: number };
type Stroke = Point[];
const WIDTH = 720, HEIGHT = 420;

export function SketchPad() {
  const section = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const strokes = useRef<Stroke[]>([]);
  const [cleared, setCleared] = useState<Stroke[] | null>(null);
  const entryButton = useRef<HTMLButtonElement>(null);
  const returnFocus = useRef(false);
  const pointer = useRef<number | null>(null);
  const drawing = useRef(false);
  const frame = useRef<number | null>(null);
  const keyboardPoint = useRef<Point>({ x: .5, y: .5 });
  const [mode, setMode] = useState('paper');
  const [count, setCount] = useState(0);
  const [keyboard, setKeyboard] = useState(false);
  const [penDown, setPenDown] = useState(false);
  const [cursor, setCursor] = useState<Point>({ x: .5, y: .5 });
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    if (opened) canvas.current?.focus({ preventScroll: true });
    else if (returnFocus.current) { entryButton.current?.focus({ preventScroll: true }); returnFocus.current = false; }
  }, [opened]);

  const render = useCallback(() => {
    const target = canvas.current;
    const ctx = target?.getContext('2d');
    if (!ctx || !target) return;
    const paper = document.createElement('canvas');
    paper.width = WIDTH; paper.height = HEIGHT;
    const pencil = paper.getContext('2d');
    if (!pencil) return;
    pencil.strokeStyle = '#34393d'; pencil.fillStyle = '#34393d';
    pencil.lineWidth = mode === 'pixels' ? 6 : 3;
    pencil.lineCap = 'round'; pencil.lineJoin = 'round';
    for (const stroke of strokes.current) {
      if (!stroke.length) continue;
      pencil.beginPath();
      pencil.moveTo(stroke[0].x * WIDTH, stroke[0].y * HEIGHT);
      for (const p of stroke.slice(1)) pencil.lineTo(p.x * WIDTH, p.y * HEIGHT);
      if (stroke.length === 1) { pencil.arc(stroke[0].x * WIDTH, stroke[0].y * HEIGHT, pencil.lineWidth / 2, 0, Math.PI * 2); pencil.fill(); }
      else pencil.stroke();
    }
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    if (mode === 'paper') { ctx.drawImage(paper, 0, 0); return; }
    const grid = document.createElement('canvas');
    grid.width = 72; grid.height = 42;
    const pixels = grid.getContext('2d');
    if (!pixels) return;
    pixels.strokeStyle = '#bd3d1b'; pixels.fillStyle = '#bd3d1b';
    pixels.lineWidth = 1; pixels.lineCap = 'round'; pixels.lineJoin = 'round';
    for (const stroke of strokes.current) {
      if (!stroke.length) continue;
      pixels.beginPath(); pixels.moveTo(stroke[0].x * 72, stroke[0].y * 42);
      for (const p of stroke.slice(1)) pixels.lineTo(p.x * 72, p.y * 42);
      if (stroke.length === 1) { pixels.arc(stroke[0].x * 72, stroke[0].y * 42, .5, 0, Math.PI * 2); pixels.fill(); }
      else pixels.stroke();
    }
    const data = pixels.getImageData(0, 0, 72, 42);
    for (let i = 0; i < data.data.length; i += 4) {
      data.data[i] = 189; data.data[i + 1] = 61; data.data[i + 2] = 27;
      data.data[i + 3] = data.data[i + 3] > 18 ? 255 : 0;
    }
    pixels.putImageData(data, 0, 0);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(grid, 0, 0, WIDTH, HEIGHT);
  }, [mode]);

  const schedule = useCallback(() => {
    if (frame.current !== null) return;
    frame.current = requestAnimationFrame(() => { frame.current = null; render(); });
  }, [render]);

  useEffect(() => { render(); return () => { if (frame.current !== null) { cancelAnimationFrame(frame.current); frame.current = null; } }; }, [render, opened]);
  const finish = () => { pointer.current = null; drawing.current = false; setPenDown(false); setCount(strokes.current.length); };
  const position = (event: React.PointerEvent<HTMLCanvasElement>): Point => {
    const rect = event.currentTarget.getBoundingClientRect();
    return { x: Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width)), y: Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height)) };
  };
  const download = () => {
    if (!canvas.current) return;
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = WIDTH; exportCanvas.height = HEIGHT;
    const ctx = exportCanvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#fffdf7'; ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.drawImage(canvas.current, 0, 0);
    const link = document.createElement('a');
    link.download = `a-little-${mode === 'paper' ? 'sketch' : 'pixel-art'}.png`;
    link.href = exportCanvas.toDataURL('image/png'); link.click();
  };

  return <section ref={section} id="art" className="sketch-section wrap" aria-labelledby="sketch-title">
    <div className="sketch-intro"><h2 id="sketch-title">I draw, too.</h2><p>Most of my drawings are in graphite. You can see them in the gallery, or have a go on the sketchpad here.</p><Link href="/art" className="text-link">See my drawings</Link><span className="sketch-aside">{opened ? 'Your turn. Make it your own.' : 'Scroll to draw. Click to take the pencil.'}</span><a href="#about" className="sketch-skip">Skip sketchpad</a></div>
    <div id="play" className={'sketchbook ' + (opened ? 'sketchbook-open' : 'sketchbook-closed')}>
      <div className="sketch-toolbar">{!opened ? <><span className="sketch-scroll-label">Sketchpad</span><span className="sketch-sheet-label">Scroll to draw</span></> : <><ToggleGroup type="single" value={mode} onValueChange={value => { if (value) { finish(); setMode(value); } }} className="sketch-modes" aria-label="Drawing style"><ToggleGroupItem value="paper" aria-label="Paper drawing style"><Pencil size={15} />Paper</ToggleGroupItem><ToggleGroupItem value="pixels" aria-label="Pixel drawing style"><Grid2X2 size={15} />Pixels</ToggleGroupItem></ToggleGroup><Button variant="ghost" className="sketch-watch" onClick={() => { finish(); returnFocus.current = true; setOpened(false); }}>Done drawing</Button></>}</div>
      <div className={'sketch-paper ' + (opened && mode === 'pixels' ? 'pixel-paper' : '') + (opened ? ' is-drawing' : ' is-watching')}>
        <ScrollDrawing opened={opened} sectionRef={section} />
        {!opened && <button className="sketch-takeover" onClick={() => setOpened(true)} aria-label="Take the pencil and draw"><span>Take the pencil <ArrowUpRight size={18} /></span></button>}
        {opened && <>

        <canvas ref={canvas} width={WIDTH} height={HEIGHT} tabIndex={0} role="application" aria-label="Interactive sketch pad" aria-describedby="sketch-instructions" onBlur={finish}
          onPointerDown={event => {
            if (!event.isPrimary || event.button !== 0) return;
            event.currentTarget.focus({ preventScroll: true });
            event.currentTarget.setPointerCapture(event.pointerId);
            pointer.current = event.pointerId; drawing.current = true; setKeyboard(false); setPenDown(false);
            setCleared(null); strokes.current.push([position(event)]); setCount(strokes.current.length); schedule();
          }}
          onPointerMove={event => { if (pointer.current !== event.pointerId || !drawing.current) return; strokes.current[strokes.current.length - 1].push(position(event)); schedule(); }}
          onPointerUp={event => { if (pointer.current === event.pointerId) finish(); }}
          onPointerCancel={finish} onLostPointerCapture={finish}
          onKeyDown={event => {
            if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' ', 'Enter', 'Escape'].includes(event.key)) return;
            event.preventDefault(); setKeyboard(true);
            if (event.key === 'Escape') { finish(); return; }
            if (event.key === ' ' || event.key === 'Enter') {
              if (event.repeat) return;
              drawing.current = !drawing.current; setPenDown(drawing.current);
              if (drawing.current) { setCleared(null); strokes.current.push([{ ...keyboardPoint.current }]); setCount(strokes.current.length); schedule(); }
              return;
            }
            const step = event.shiftKey ? .04 : .012;
            keyboardPoint.current = { x: Math.max(0, Math.min(1, keyboardPoint.current.x + (event.key === 'ArrowLeft' ? -step : event.key === 'ArrowRight' ? step : 0))), y: Math.max(0, Math.min(1, keyboardPoint.current.y + (event.key === 'ArrowUp' ? -step : event.key === 'ArrowDown' ? step : 0))) };
            setCursor({ ...keyboardPoint.current });
            if (drawing.current) { strokes.current[strokes.current.length - 1].push({ ...keyboardPoint.current }); schedule(); }
          }} />
        {keyboard && <span className={'sketch-pen ' + (penDown ? 'is-down' : '')} style={{ left: `${cursor.x * 100}%`, top: `${cursor.y * 100}%` }} aria-hidden="true" />}
        </>}
        <span className="paper-corner" aria-hidden="true" />
      </div>
      {opened ? <>
      <div className="sketch-bottom"><div className="sketch-tools"><Button variant="ghost" disabled={!count && !cleared?.length} onClick={() => { finish(); if (!strokes.current.length && cleared) { strokes.current = cleared; setCleared(null); } else { strokes.current.pop(); } setCount(strokes.current.length); render(); }}><Undo2 size={15} />Undo</Button><Button variant="ghost" disabled={!count} onClick={() => { finish(); setCleared(strokes.current); strokes.current = []; setCount(0); render(); }}><RotateCcw size={15} />Clear</Button></div><Button variant="ghost" disabled={!count} onClick={download}><Download size={15} /><span>Save PNG</span></Button></div>
      <p id="sketch-instructions" className="sketch-instructions">Draw with your mouse or finger. Select Done drawing to return to scrolling. <span>Keyboard: arrows move · Enter lifts / lowers the pen.</span></p>
      <span className="sr-only" role="status">{count ? `${count} ${count === 1 ? 'stroke' : 'strokes'}. ${mode === 'pixels' ? 'Pixel' : 'Paper'} style.` : 'Blank drawing pad.'}{keyboard ? (penDown ? ' Pen is down.' : ' Pen is lifted.') : ''}</span>
      </> : <div className="sketch-idle-bottom"><span>Click or tap to draw</span><button ref={entryButton} onClick={() => setOpened(true)}><Pencil size={15} /> Your turn</button></div>}
    </div>
  </section>;
}
