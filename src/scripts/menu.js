// One selected item owns both the arrow and the text preview.
function selectMenuLink(link) {
  const menu = document.querySelector('.menu');
  if (!menu) return;
  const selected = menu.querySelector('.is-selected');
  if (selected === link) return;
  selected?.classList.remove('is-selected');
  link?.classList.add('is-selected');
  const preview = document.querySelector('.preview');
  const previewText = document.querySelector('[data-preview-text]');
  if (preview && previewText) {
    const text = link?.dataset.preview || '';
    // Text is never inserted as HTML; edited content cannot create scripts.
    previewText.textContent = text;
    preview.classList.toggle('is-visible', Boolean(text));
  }
}

// Normal links handle navigation. This script only adds previews and shortcuts.
function setupMenu() {
  const menu = document.querySelector('.menu');
  if (!menu) return;
  menu.dataset.selectionReady = '';
  const links = [...menu.querySelectorAll('[data-menu-link]')];

  for (const link of links) {
    link.addEventListener('focus', () => selectMenuLink(link));
  }
  menu.addEventListener('pointermove', (event) => {
    if (event.pointerType !== 'touch') selectMenuLink(event.target.closest('[data-menu-link]'));
  });
  menu.addEventListener('pointerleave', () => selectMenuLink(null));
  menu.addEventListener('focusout', (event) => {
    if (!menu.contains(event.relatedTarget)) selectMenuLink(null);
  });
}

document.addEventListener('astro:page-load', setupMenu);

document.addEventListener('astro:before-preparation', (event) => {
  if (event.sourceElement?.closest('[data-back]')) event.direction = 'back';
});

document.addEventListener('astro:before-swap', (event) => {
  // Reading views fade; menu-to-menu moves rotate on desktop and slide on phones.
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
  const selected = document.querySelector('.menu-link.is-selected');
  const index = links.indexOf(selected || document.activeElement);
  if (event.key.startsWith('Arrow') && document.activeElement?.matches('[data-menu-link]')) {
    document.activeElement.classList.add('is-arrow-focused');
  }
  if (links.length && ['ArrowUp', 'ArrowDown'].includes(event.key)) {
    event.preventDefault();
    const next = event.key === 'ArrowDown' ? (index + 1) % links.length : (index <= 0 ? links.length - 1 : index - 1);
    clearArrowFocus();
    links[next].classList.add('is-arrow-focused');
    selectMenuLink(links[next]);
    links[next].focus();
  } else if (event.key === 'ArrowRight' && index >= 0) {
    event.preventDefault();
    clearArrowFocus();
    links[index].classList.add('is-arrow-focused');
    links[index].focus();
    links[index].click();
  } else if (['ArrowLeft', 'Escape'].includes(event.key)) {
    const back = document.querySelector('[data-back]');
    if (back) { event.preventDefault(); back.click(); }
  }
});
