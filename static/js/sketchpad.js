import { Drawing, normalizedPoint } from './drawing-model.js';

const book = document.querySelector('#play');
if (book) {
  const canvas = book.querySelector('canvas');
  const context = canvas.getContext('2d');
  const paper = book.querySelector('.sketch-paper');
  const guide = book.querySelector('.scroll-drawing');
  const cursor = book.querySelector('.sketch-pen');
  const status = book.querySelector('#sketch-status');
  const drawing = new Drawing();
  const buffer = document.createElement('canvas');
  buffer.width = 72; buffer.height = 42;
  let opened = false, mode = 'paper', pointer = null;
  let keyPoint = {x: .5, y: .5};

  function render() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    const pixel = mode === 'pixels';
    const ctx = pixel ? buffer.getContext('2d') : context;
    const width = pixel ? buffer.width : canvas.width;
    const height = pixel ? buffer.height : canvas.height;
    if (pixel) ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = ctx.fillStyle = pixel ? '#bd3d1b' : '#343a39';
    ctx.lineWidth = pixel ? 1 : 3;
    ctx.lineCap = ctx.lineJoin = 'round';
    for (const stroke of drawing.strokes) {
      if (stroke.length === 1) {
        ctx.beginPath(); ctx.arc(stroke[0].x * width, stroke[0].y * height, ctx.lineWidth / 2, 0, Math.PI * 2); ctx.fill();
      } else {
        ctx.beginPath();
        stroke.forEach((point, index) => ctx[index ? 'lineTo' : 'moveTo'](point.x * width, point.y * height));
        ctx.stroke();
      }
    }
    if (pixel) { context.imageSmoothingEnabled = false; context.drawImage(buffer, 0, 0, canvas.width, canvas.height); }
    book.querySelector('[data-undo]').disabled = !drawing.canUndo;
    for (const selector of ['[data-clear]', '[data-save]']) book.querySelector(selector).disabled = !drawing.strokes.length;
    cursor.classList.toggle('is-down', drawing.active);
  }
  function finish() { drawing.finish(); pointer = null; render(); }
  function setOpen(value) {
    finish(); opened = value;
    book.classList.toggle('sketchbook-open', value);
    book.classList.toggle('sketchbook-closed', !value);
    book.querySelectorAll('[data-idle]').forEach(el => { el.hidden = value; });
    book.querySelectorAll('[data-edit]').forEach(el => { el.hidden = !value; });
    paper.classList.toggle('is-drawing', value);
    paper.classList.toggle('is-watching', !value);
    guide.classList.toggle('drawing-guide', value);
    cursor.hidden = true;
    if (value) canvas.focus();
    else { book.querySelector('[data-return-focus]').focus(); updateGuide(); }
  }
  book.querySelectorAll('[data-take-pencil]').forEach(button => button.addEventListener('click', () => setOpen(true)));
  book.querySelector('[data-done]').addEventListener('click', () => setOpen(false));
  canvas.style.touchAction = 'none';
  canvas.addEventListener('pointerdown', event => {
    if (!event.isPrimary || event.button !== 0) return;
    canvas.focus(); cursor.hidden = true; pointer = event.pointerId;
    canvas.setPointerCapture(pointer);
    drawing.start(normalizedPoint(event.clientX, event.clientY, canvas.getBoundingClientRect())); render();
  });
  canvas.addEventListener('pointermove', event => {
    if (pointer !== event.pointerId) return;
    drawing.move(normalizedPoint(event.clientX, event.clientY, canvas.getBoundingClientRect())); render();
  });
  for (const name of ['pointerup', 'pointercancel', 'lostpointercapture']) canvas.addEventListener(name, finish);
  canvas.addEventListener('blur', () => { finish(); cursor.hidden = true; });
  canvas.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault(); if (event.repeat) return;
      if (drawing.active) finish(); else drawing.start(keyPoint);
      status.textContent = drawing.active ? 'Pen down. Arrow keys draw.' : 'Pen lifted.';
    } else if (event.key.startsWith('Arrow')) {
      event.preventDefault();
      const step = event.shiftKey ? .04 : .012;
      keyPoint.x = Math.max(0, Math.min(1, keyPoint.x + (event.key === 'ArrowRight' ? step : event.key === 'ArrowLeft' ? -step : 0)));
      keyPoint.y = Math.max(0, Math.min(1, keyPoint.y + (event.key === 'ArrowDown' ? step : event.key === 'ArrowUp' ? -step : 0)));
      drawing.move(keyPoint);
    } else if (event.key === 'Escape') finish();
    else return;
    cursor.hidden = false; cursor.style.left = `${keyPoint.x * 100}%`; cursor.style.top = `${keyPoint.y * 100}%`; render();
  });
  book.querySelector('[data-undo]').addEventListener('click', () => { drawing.undo(); render(); status.textContent = 'Drawing updated.'; });
  book.querySelector('[data-clear]').addEventListener('click', () => { drawing.clear(); render(); status.textContent = 'Drawing cleared. Undo restores it.'; });
  book.querySelectorAll('[data-mode]').forEach(button => button.addEventListener('click', () => {
    finish(); mode = button.dataset.mode;
    paper.classList.toggle('pixel-paper', mode === 'pixels');
    book.querySelectorAll('[data-mode]').forEach(item => {
      const selected = item === button;
      item.dataset.state = selected ? 'on' : 'off'; item.setAttribute('aria-pressed', String(selected));
    }); render();
  }));
  book.querySelector('[data-save]').addEventListener('click', () => {
    finish();
    const output = document.createElement('canvas'); output.width = canvas.width; output.height = canvas.height + 32;
    const ctx = output.getContext('2d'); ctx.fillStyle = '#fffdf7'; ctx.fillRect(0, 0, output.width, output.height); ctx.drawImage(canvas, 0, 0);
    ctx.fillStyle = '#626971'; ctx.font = '12px Arial, Helvetica, sans-serif';
    ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
    ctx.fillText('Made on varunpuskur.com', canvas.width - 16, canvas.height + 16);
    const today = new Date();
    const date = [today.getFullYear(), String(today.getMonth() + 1).padStart(2, '0'), String(today.getDate()).padStart(2, '0')].join('-');
    const link = document.createElement('a');
    link.download = `varunpuskur-${mode === 'pixels' ? 'pixel-art' : 'sketch'}-${date}.png`;
    link.href = output.toDataURL('image/png'); link.click();
    status.textContent = 'PNG prepared for download.';
  });

  // Reveal the original line drawing in proportion to scrolling through Art.
  const paths = [...guide.querySelectorAll('[data-pen-stroke]')];
  const lengths = paths.map(path => path.getTotalLength());
  const total = lengths.reduce((a, b) => a + b, 0);
  const pencil = guide.querySelector('.drawing-pencil');
  const section = book.closest('section') || book;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let progress = 0, target = 0, frame = 0;
  function paintGuide() {
    let remaining = progress * total, position = null;
    paths.forEach((path, index) => {
      const drawn = Math.max(0, Math.min(lengths[index], remaining));
      path.style.strokeDashoffset = String(1 - drawn / lengths[index]);
      path.style.opacity = drawn > 0 ? '1' : '0';
      if (remaining >= 0 && remaining <= lengths[index]) position = path.getPointAtLength(drawn);
      remaining -= lengths[index];
    });
    if (pencil) {
      pencil.style.opacity = !reduced.matches && progress > .001 && progress < .999 ? '1' : '0';
      if (position) pencil.setAttribute('transform', `translate(${position.x} ${position.y})`);
    }
  }
  function animate() {
    frame = 0; if (opened) return;
    progress += (target - progress) * .18;
    if (Math.abs(target - progress) < .001) progress = target;
    paintGuide(); if (progress !== target) frame = requestAnimationFrame(animate);
  }
  function updateGuide() {
    if (opened) return;
    const intro = section.querySelector('.sketch-intro');
    const offset = innerWidth <= 760 && intro ? intro.offsetHeight + 30 : 0;
    target = reduced.matches ? 1 : Math.max(0, Math.min(1, (innerHeight * .65 - section.getBoundingClientRect().top - offset) / (innerHeight * .86)));
    if (reduced.matches) { progress = 1; paintGuide(); }
    else if (!frame) frame = requestAnimationFrame(animate);
  }
  addEventListener('scroll', updateGuide, {passive: true});
  addEventListener('resize', updateGuide);
  reduced.addEventListener('change', updateGuide);
  updateGuide(); render();
}
