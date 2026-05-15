export const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Experience', href: '#experience' },
  { label: 'Contact', href: '#contact' },
];

export const groupSkills = (skills = []) => {
  return skills.reduce((groups, skill) => {
    const category = skill.category || 'Skills';
    const existing = groups.find(group => group.category === category);
    const item = { name: skill.name, level: skill.level || 80, icon: skill.icon || '•' };
    if (existing) existing.items.push(item);
    else groups.push({ category, items: [item] });
    return groups;
  }, []);
};

export const socialUrl = (links = [], platform) => {
  return links.find(link => link.platform?.toLowerCase() === platform || link.label?.toLowerCase() === platform)?.url || '';
};

export const backendOrigin = () => {
  const apiBase = import.meta.env.VITE_API_URL;

  if (!apiBase) return '';

  return apiBase.replace('/api', '');
};

export const resolveAssetUrl = (url) => {
  if (!url) return '';
  if (/^https?:\/\//i.test(url) || url.startsWith('data:') || url.startsWith('blob:')) return url;
  if (url.startsWith('/uploads/')) return `${backendOrigin()}${url}`;
  if (url.startsWith('uploads/')) return `${backendOrigin()}/${url}`;
  return url;
};

export const cacheBustAsset = (url, version) => {
  const resolved = resolveAssetUrl(url);
  if (!resolved) return '';
  const key = version ? new Date(version).getTime() || version : '';
  if (!key) return resolved;
  return `${resolved}${resolved.includes('?') ? '&' : '?'}t=${key}`;
};

export const normalizeExternalUrl = (value) => {
  if (!value || typeof value !== 'string') return '';
  const trimmed = value.trim();
  if (!trimmed) return '';
  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const parsed = new URL(withProtocol);
    const validHost = parsed.hostname.includes('.') || parsed.hostname === 'localhost';
    if (!['http:', 'https:'].includes(parsed.protocol) || !validHost) return '';
    return parsed.toString();
  } catch {
    return '';
  }
};

export const applySeo = (cms) => {
  const settings = cms?.settings || {};
  const hero = cms?.hero || {};
  const title = settings.seoTitle || settings.siteTitle || hero.name || 'Portfolio';
  const description = settings.seoDescription || hero.summary || '';

  document.title = title;

  const setMeta = (selector, attr, value) => {
    if (!value) return;
    let el = document.head.querySelector(selector);
    if (!el) {
      el = document.createElement('meta');
      const match = selector.match(/\[(name|property)="([^"]+)"\]/);
      if (match) el.setAttribute(match[1], match[2]);
      document.head.appendChild(el);
    }
    el.setAttribute(attr, value);
  };

  setMeta('meta[name="description"]', 'content', description);
  setMeta('meta[property="og:title"]', 'content', title);
  setMeta('meta[property="og:description"]', 'content', description);
  setMeta('meta[property="og:type"]', 'content', 'website');
  setMeta('meta[property="og:image"]', 'content', resolveAssetUrl(settings.ogImage || hero.profileImage));
};
