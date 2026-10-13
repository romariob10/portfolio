// Build embed URLs from supported hosts, rather than accepting arbitrary HTML.
export function videoEmbedUrl(input) {
  if (!input) return '';
  let url;
  try { url = new URL(input); } catch { return ''; }
  if (url.protocol !== 'https:') return '';
  const host = url.hostname.replace(/^www\./, '');
  const parts = url.pathname.split('/').filter(Boolean);

  if (['youtube.com', 'youtube-nocookie.com', 'youtu.be'].includes(host)) {
    const id = host === 'youtu.be' ? parts[0] : (url.searchParams.get('v') || parts[1]);
    return /^[\w-]{11}$/.test(id || '') ? `https://www.youtube-nocookie.com/embed/${id}` : '';
  }
  if (host === 'rutube.ru') {
    const id = parts[0] === 'video' ? parts[1] : (parts[0] === 'play' && parts[1] === 'embed' ? parts[2] : '');
    return /^[a-f\d]{32}$/i.test(id || '') ? `https://rutube.ru/play/embed/${id}/` : '';
  }
  return '';
}
