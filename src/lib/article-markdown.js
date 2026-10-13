import { getLinkPreview } from './link-preview.js';

const text = (value) => ({ type: 'text', value });
const element = (tagName, properties, children = []) => ({ type: 'element', tagName, properties, children });

export const articleMarkdown = {
  name: 'article-markdown',
  options: { position: true },
  element: {
    filter: ['p', 'img'],
    async visit(node, context) {
      if (node.tagName === 'img') {
        context.setProperty(node, 'loading', 'lazy');
        context.setProperty(node, 'decoding', 'async');
        return;
      }
      const child = node.children?.length === 1 ? node.children[0] : null;
      if (child?.tagName === 'img') {
        const caption = child.properties?.title;
        const image = element('img', { ...child.properties, loading: 'lazy', decoding: 'async' });
        return element('figure', {}, [image, ...(caption ? [element('figcaption', {}, [text(caption)])] : [])]);
      }
      // Only a URL on its own line becomes a card. Inline and labelled links stay links.
      if (child?.tagName !== 'a' || context.parent(node)?.type !== 'root') return;
      const href = child.properties?.href;
      try {
        if (new URL(context.textContent(child)).href !== new URL(href).href) return;
      } catch { return; }
      // Explicit [URL](URL) is still a labelled link, not an automatic preview.
      const offset = child.position?.start?.offset;
      if (offset !== undefined && context.source[offset] === '[') return;
      const preview = await getLinkPreview(href);
      if (!preview) return;
      return element('a', { href, className: ['link-preview'], rel: ['noopener', 'noreferrer'] }, [
        ...(preview.image ? [element('img', { src: preview.image, alt: '', loading: 'lazy', decoding: 'async', className: ['link-preview-image'] })] : []),
        element('span', { className: ['link-preview-text'] }, [
          element('span', { className: ['link-preview-site'] }, [text(preview.site)]),
          element('strong', {}, [text(preview.title)]),
          ...(preview.description ? [element('span', { className: ['link-preview-description'] }, [text(preview.description)])] : []),
        ]),
      ]);
    },
  },
};
