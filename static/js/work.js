// Project tabs and design comparison, without React or a component library.
(() => {
  function tabs(buttons, onSelect) {
    function choose(index, focus = false) {
      buttons.forEach((button, i) => {
        const active = i === index;
        button.dataset.state = active ? 'active' : 'inactive';
        button.setAttribute('aria-selected', String(active));
        button.tabIndex = active ? 0 : -1;
        const panel = document.getElementById(button.getAttribute('aria-controls'));
        panel.hidden = !active;
        panel.dataset.state = active ? 'active' : 'inactive';
      });
      if (focus) buttons[index].focus();
      onSelect(index);
    }
    buttons.forEach((button, i) => {
      button.addEventListener('click', () => choose(i));
      button.addEventListener('keydown', event => {
        let next;
        if (event.key === 'ArrowRight') next = (i + 1) % buttons.length;
        if (event.key === 'ArrowLeft') next = (i - 1 + buttons.length) % buttons.length;
        if (event.key === 'Home') next = 0;
        if (event.key === 'End') next = buttons.length - 1;
        if (next !== undefined) { event.preventDefault(); choose(next, true); }
      });
    });
    return choose;
  }

  const projectButtons = [...document.querySelectorAll('[data-project]')];
  const chooseProject = tabs(projectButtons, index => {
    history.replaceState(null, '', '#' + projectButtons[index].dataset.project);
  });
  const syncHash = () => {
    const index = projectButtons.findIndex(button => '#' + button.dataset.project === location.hash);
    chooseProject(index >= 0 ? index : 0);
  };
  syncHash();
  window.addEventListener('hashchange', syncHash);

  const stepButtons = [...document.querySelectorAll('[data-step]')];
  tabs(stepButtons, index => {
    const panel = document.getElementById(stepButtons[index].getAttribute('aria-controls'));
    document.querySelector('.file-progress > span').style.width = `${index * 50}%`;
    document.querySelector('.file-progress > i').style.left = `${index * 50}%`;
    document.getElementById('file-footnote').textContent = panel.dataset.note;
  });

  const stages = {
    wireframe: {image:'qc-lofi.webp', alt:'QuickCart product-detail wireframe with an Add to Cart action and recommendations', title:'Early wireframe', note:'The early product screen lays out item details, an Add to Cart action, and recommendations.'},
    prototype: {image:'qc-hifi.webp', alt:'QuickCart revised prototype with recent activity and bottom navigation', title:'Revised prototype', note:'The revised design adds recent activity and bottom navigation after usability feedback.'}
  };
  document.querySelectorAll('[data-stage]').forEach(button => {
    button.addEventListener('click', () => {
      const stage = stages[button.dataset.stage];
      document.querySelectorAll('[data-stage]').forEach(other => {
        const active = other === button;
        other.dataset.state = active ? 'on' : 'off';
        other.setAttribute('aria-pressed', String(active));
      });
      const image = document.querySelector('.comparison-figure img');
      image.src = '/static/images/' + stage.image;
      image.alt = stage.alt;
      document.querySelector('.comparison-figure figcaption').textContent = stage.title;
      document.querySelector('.comparison-note').textContent = stage.note;
    });
  });
})();
