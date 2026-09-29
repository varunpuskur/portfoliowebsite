// Original artwork magnification and the native HTML dialog gallery.
(() => {
  function magnifier(root) {
    const surface = root.querySelector('.lens-surface');
    const image = surface.querySelector('img');
    const lens = root.querySelector('.graphite-lens');
    const toggle = root.querySelector('.lens-toggle');
    let pinned = false, hovered = false, x = .5, y = .5;

    function paint() {
      const {width, height} = surface.getBoundingClientRect();
      const radius = Math.min(74, width / 2, height / 2);
      const left = Math.max(radius, Math.min(width - radius, x * width));
      const top = Math.max(radius, Math.min(height - radius, y * height));
      root.classList.toggle('is-inspecting', pinned || hovered);
      Object.assign(lens.style, {
        width:`${radius * 2}px`, height:`${radius * 2}px`, left:`${left}px`, top:`${top}px`,
        backgroundImage:`url("${image.src}")`,
        backgroundSize:`${width * 2.4}px ${height * 2.4}px`,
        backgroundPosition:`${radius - x * width * 2.4}px ${radius - y * height * 2.4}px`
      });
      toggle.setAttribute('aria-pressed', String(pinned));
      toggle.textContent = pinned ? 'Close magnifier' : 'Look closer';
    }
    function position(event) {
      const rect = surface.getBoundingClientRect();
      x = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
      y = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));
    }
    surface.addEventListener('pointermove', event => {
      if (event.pointerType === 'touch' && !pinned) return;
      position(event);
      if (event.pointerType !== 'touch') hovered = true;
      paint();
    });
    surface.addEventListener('pointerdown', event => {
      if (event.pointerType === 'touch' && pinned) { position(event); paint(); }
    });
    surface.addEventListener('pointerleave', () => { hovered = false; paint(); });
    surface.addEventListener('blur', () => { hovered = false; paint(); });
    surface.addEventListener('keydown', event => {
      if (event.key === 'Escape') { pinned = hovered = false; paint(); return; }
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault(); if (!event.repeat) pinned = !pinned; paint(); return;
      }
      if (!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key)) return;
      event.preventDefault(); pinned = true;
      x = Math.max(.05, Math.min(.95, x + (event.key === 'ArrowLeft' ? -.05 : event.key === 'ArrowRight' ? .05 : 0)));
      y = Math.max(.05, Math.min(.95, y + (event.key === 'ArrowUp' ? -.05 : event.key === 'ArrowDown' ? .05 : 0)));
      paint();
    });
    toggle.addEventListener('click', () => { pinned = !pinned; hovered = false; paint(); });
    new ResizeObserver(paint).observe(surface);
    image.addEventListener('load', paint);
    paint();
    return () => { pinned = hovered = false; x = y = .5; paint(); };
  }
  const resetters = new Map();
  document.querySelectorAll('.art-lens').forEach(root => resetters.set(root, magnifier(root)));

  const dialog = document.getElementById('drawing-viewer');
  if (!dialog) return;
  const works = JSON.parse(document.getElementById('artwork-data').textContent);
  const thumbs = [...dialog.querySelectorAll('[data-thumb]')];
  let current = 0, opener = null;
  function show(index) {
    current = (index + works.length) % works.length;
    const work = works[current];
    document.getElementById('viewer-title').textContent = work.name;
    document.getElementById('viewer-medium').textContent = work.medium;
    const image = document.getElementById('viewer-image');
    image.src = '/static/images/' + work.id + '.webp';
    image.alt = work.alt; image.width = work.width; image.height = work.height;
    document.getElementById('viewer-count').textContent = `${String(current + 1).padStart(2, '0')} / ${works.length}`;
    document.getElementById('viewer-count').setAttribute('aria-label', `${work.name}. Drawing ${current + 1} of ${works.length}`);
    thumbs.forEach((thumb, i) => thumb.setAttribute('aria-pressed', String(i === current)));
    resetters.get(dialog.querySelector('.art-lens'))();
    const rail = thumbs[current].parentElement;
    rail.scrollLeft = thumbs[current].offsetLeft - rail.clientWidth / 2 + thumbs[current].clientWidth / 2;
  }
  document.querySelectorAll('[data-art-index]').forEach(button => {
    button.addEventListener('click', () => {
      opener = button; dialog.showModal(); document.body.classList.add('viewer-open');
      show(Number(button.dataset.artIndex)); thumbs[current].focus({preventScroll:true});
    });
  });
  dialog.querySelector('.drawing-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => {
    document.body.classList.remove('viewer-open'); opener?.focus({preventScroll:true});
  });
  dialog.addEventListener('click', event => {
    const rect = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
  });
  dialog.querySelector('[data-art-prev]').addEventListener('click', () => show(current - 1));
  dialog.querySelector('[data-art-next]').addEventListener('click', () => show(current + 1));
  thumbs.forEach((thumb, i) => thumb.addEventListener('click', () => show(i)));
  dialog.addEventListener('keydown', event => {
    if (event.defaultPrevented || event.target.closest('.lens-surface')) return;
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault(); show(current + (event.key === 'ArrowRight' ? 1 : -1));
      if (event.target.closest('[data-thumb]')) thumbs[current].focus({preventScroll:true});
    }
  });
})();
