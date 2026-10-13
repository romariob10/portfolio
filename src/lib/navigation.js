// Navigation comes from content folders, not a second list of hardcoded links.
export function parentId(id) {
  return id.split('/').slice(0, -1).join('/');
}

export function pageUrl(id = '') {
  const path = id.replace(/^ru(?:\/|$)/, '');
  return path ? `/${path.split('/').map(encodeURIComponent).join('/')}/` : '/';
}

export function localeOf(id) {
  return id.split('/')[0] === 'en' ? 'en' : 'ru';
}

export function translatedId(id) {
  const language = localeOf(id) === 'ru' ? 'en' : 'ru';
  return [language, ...id.split('/').slice(1)].join('/');
}

export function childrenOf(pages, id = '') {
  return pages
    .filter((page) => parentId(page.id) === id)
    .sort((a, b) => a.data.order - b.data.order || a.data.title.localeCompare(b.data.title, 'ru'));
}

export function ancestorsOf(pages, id) {
  const ancestors = [];
  let parent = parentId(id);

  while (parent) {
    const page = pages.find((page) => page.id === parent);
    if (!page) throw new Error(`Missing section "${parent}" for "${id}".`);
    ancestors.unshift(page);
    parent = parentId(parent);
  }

  return ancestors;
}

export function publishedPages(pages) {
  for (const page of pages) {
    for (const ancestor of ancestorsOf(pages, page.id)) {
      if (ancestor.data.kind !== 'section') {
        throw new Error(`"${ancestor.id}" has children, but is not a section.`);
      }
    }
  }

  // A draft section hides its descendants as well as itself.
  return pages.filter((page) =>
    !page.data.draft && !ancestorsOf(pages, page.id).some((ancestor) => ancestor.data.draft)
  );
}
