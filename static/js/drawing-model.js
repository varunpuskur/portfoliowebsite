// Stroke data is separate from rendering, so undo/clear and export use one model.
export class Drawing {
  constructor() { this.strokes = []; this.cleared = null; this.active = false; }
  start(point) { this.cleared = null; this.active = true; this.strokes.push([{...point}]); }
  move(point) { if (this.active) this.strokes.at(-1).push({...point}); }
  finish() { this.active = false; }
  clear() { this.finish(); if (this.strokes.length) { this.cleared = this.strokes; this.strokes = []; } }
  undo() {
    this.finish();
    if (!this.strokes.length && this.cleared) { this.strokes = this.cleared; this.cleared = null; }
    else this.strokes.pop();
  }
  get canUndo() { return this.strokes.length > 0 || Boolean(this.cleared?.length); }
}

export function normalizedPoint(clientX, clientY, rect) {
  return {x:Math.max(0, Math.min(1, (clientX - rect.left) / rect.width)),
          y:Math.max(0, Math.min(1, (clientY - rect.top) / rect.height))};
}
