// Normal links handle navigation. This script only adds previews and shortcuts.
function setupMenu() {
  const menu = document.querySelector('.menu');
  if (!menu) return;

  const links = [...menu.querySelectorAll('[data-menu-link]')];
  const preview = document.querySelector('.preview');
  const previewText = document.querySelector('[data-preview-text]');

  function showPreview(link) {
    if (!preview || !previewText) return;
    const text = link.dataset.preview || '';
    // Text is never inserted as HTML; edited content cannot create scripts.
    previewText.textContent = text;
    preview.classList.toggle('is-visible', Boolean(text));
  }

  for (const link of links) {
    link.addEventListener('pointerenter', () => showPreview(link));
    link.addEventListener('focus', () => showPreview(link));
  }
  menu.addEventListener('pointerleave', () => {
    if (preview && !menu.contains(document.activeElement)) preview.classList.remove('is-visible');
  });
}

document.addEventListener('astro:page-load', setupMenu);

document.addEventListener('astro:before-preparation', (event) => {
  if (event.sourceElement?.closest('[data-back]')) event.direction = 'back';
});

document.addEventListener('astro:before-swap', (event) => {
  // Reading views fade; the rotating list is reserved for menu-to-menu moves.
  const involvesArticle = document.querySelector('.article-page') || event.newDocument.querySelector('.article-page');
  event.newDocument.documentElement.toggleAttribute('data-article-transition', Boolean(involvesArticle));
});

function clearArrowFocus() {
  document.querySelectorAll('.is-arrow-focused').forEach((link) => link.classList.remove('is-arrow-focused'));
}

document.addEventListener('pointerdown', clearArrowFocus);

document.addEventListener('keydown', (event) => {
  if (event.key === 'Tab') clearArrowFocus();
  const target = event.target;
  if (event.altKey || event.ctrlKey || event.metaKey || target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target.isContentEditable) return;

  const links = [...document.querySelectorAll('[data-menu-link]')];
  const index = links.indexOf(document.activeElement);
  if (links.length && ['ArrowUp', 'ArrowDown'].includes(event.key)) {
    event.preventDefault();
    const next = event.key === 'ArrowDown' ? (index + 1) % links.length : (index <= 0 ? links.length - 1 : index - 1);
    clearArrowFocus();
    links[next].classList.add('is-arrow-focused');
    links[next].focus();
  } else if (event.key === 'ArrowRight' && index >= 0) {
    event.preventDefault();
    links[index].click();
  } else if (['ArrowLeft', 'Escape'].includes(event.key)) {
    const back = document.querySelector('[data-back]');
    if (back) { event.preventDefault(); back.click(); }
  }
});
