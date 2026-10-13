import { parseHTML } from 'linkedom';

const previews = new Map();

function webUrl(value, base) {
  if (typeof value !== 'string' || !value.trim()) return null;
  try {
    const url = new URL(value, base);
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) return null;
    return url;
  } catch { return null; }
}

async function loadPreview(url) {
  const preview = { url: url.href, site: url.hostname, title: url.href.slice(0, 200), description: '', image: '' };
  // A failed or unavailable page still leaves a usable link in the article.
  if (url.protocol !== 'https:' || url.hostname === 'localhost' || url.hostname.endsWith('.local')) return preview;
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(4000) });
    if (!response.ok || !response.headers.get('content-type')?.includes('text/html')) return preview;
    const { document } = parseHTML((await response.text()).slice(0, 500_000));
    const meta = (name) => document.querySelector(`meta[property="${name}"], meta[name="${name}"]`)?.getAttribute('content')?.trim();
    preview.title = (meta('og:title') || document.querySelector('title')?.textContent?.trim() || preview.title).slice(0, 200);
    preview.description = (meta('og:description') || meta('description') || '').slice(0, 400);
    preview.image = webUrl(meta('og:image'), response.url || url.href)?.href || '';
  } catch { /* Publishing must not depend on another site's availability. */ }
  return preview;
}

// Fetch once per URL during the build, including when RU and EN share a link.
export function getLinkPreview(value) {
  const url = webUrl(value);
  if (!url) return null;
  if (!previews.has(url.href)) previews.set(url.href, loadPreview(url));
  return previews.get(url.href);
}
