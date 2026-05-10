import { useEffect, useState } from 'react';
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import {
  Award, Briefcase, Contact, FileText, FolderOpen, GraduationCap, Home,
  LayoutDashboard, Link as LinkIcon, LogOut, Mail, Menu, Plus, Settings,
  Sparkles, Trash2, Upload, Wrench
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { cacheBustAsset, normalizeExternalUrl } from '../utils/cms';

const inputClass = 'w-full px-3 py-2.5 bg-dark-900 border border-white/10 rounded-lg text-white text-sm font-body placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-accent-500';
const labelClass = 'block text-xs font-mono text-slate-400 mb-1.5';

const notifyCmsUpdated = () => {
  const stamp = String(Date.now());
  localStorage.setItem('portfolio_cms_updated', stamp);
  window.dispatchEvent(new CustomEvent('portfolio:cms-updated', { detail: stamp }));
};

const listSections = {
  skills: {
    title: 'Skills',
    icon: Wrench,
    fields: [
      ['category', 'Category'], ['name', 'Name'], ['level', 'Level', 'number'], ['icon', 'Icon'], ['order', 'Order', 'number'],
    ],
  },
  experience: {
    title: 'Experience',
    icon: Briefcase,
    fields: [
      ['title', 'Title'], ['role', 'Role'], ['company', 'Company'], ['period', 'Duration'], ['description', 'Description', 'textarea'],
      ['bullets', 'Work bullets', 'array'], ['tags', 'Tags', 'array'], ['order', 'Order', 'number'],
    ],
  },
  education: {
    title: 'Education',
    icon: GraduationCap,
    fields: [
      ['institution', 'Institution'], ['degree', 'Degree'], ['period', 'Period'], ['grade', 'Grade'], ['location', 'Location'],
      ['details', 'Details', 'array'], ['order', 'Order', 'number'],
    ],
  },
  certifications: {
    title: 'Certifications',
    icon: Award,
    fields: [
      ['title', 'Title'], ['issuer', 'Issuer'], ['date', 'Date'], ['credentialUrl', 'Credential URL'], ['order', 'Order', 'number'],
    ],
  },
  socialLinks: {
    title: 'Social Links',
    icon: LinkIcon,
    fields: [
      ['platform', 'Platform'], ['label', 'Label'], ['url', 'URL'], ['icon', 'Icon'], ['order', 'Order', 'number'], ['visible', 'Visible', 'checkbox'],
    ],
  },
  techStack: {
    title: 'Tech Stack',
    icon: Sparkles,
    fields: [
      ['name', 'Name'], ['category', 'Category'], ['color', 'Color'], ['symbol', 'Symbol'], ['order', 'Order', 'number'],
    ],
  },
  achievements: {
    title: 'Achievements',
    icon: Award,
    fields: [
      ['title', 'Title'], ['description', 'Description', 'textarea'], ['date', 'Date'], ['order', 'Order', 'number'],
    ],
  },
  testimonials: {
    title: 'Testimonials',
    icon: Mail,
    fields: [
      ['name', 'Name'], ['role', 'Role'], ['company', 'Company'], ['quote', 'Quote', 'textarea'], ['avatar', 'Avatar URL'], ['visible', 'Visible', 'checkbox'], ['order', 'Order', 'number'],
    ],
  },
};

const singletonSections = {
  hero: {
    title: 'Hero / Profile',
    icon: Home,
    fields: [
      ['name', 'Name'], ['title', 'Title'], ['summary', 'Summary', 'textarea'], ['location', 'Location'],
      ['availability', 'Availability'], ['profileImage', 'Profile Image URL'], ['resumeUrl', 'Resume URL'], ['typingRoles', 'Typing Roles', 'array'],
    ],
  },
  about: {
    title: 'About',
    icon: FileText,
    fields: [
      ['heading', 'Heading'], ['body', 'Body', 'textarea'], ['highlights', 'Highlights', 'array'],
    ],
  },
  resume: {
    title: 'Resume',
    icon: FileText,
    fields: [['title', 'Title'], ['fileUrl', 'File URL'], ['version', 'Version']],
  },
  contactInfo: {
    title: 'Contact Info',
    icon: Contact,
    fields: [['email', 'Email'], ['phone', 'Phone'], ['location', 'Location'], ['headline', 'Headline'], ['description', 'Description', 'textarea']],
  },
  settings: {
    title: 'Site Settings',
    icon: Settings,
    fields: [
      ['siteTitle', 'Site Title'], ['ownerName', 'Owner Name'], ['contactEmail', 'Contact Email'], ['resumeUrl', 'Resume URL'],
      ['seoTitle', 'SEO Title'], ['seoDescription', 'SEO Description', 'textarea'], ['ogImage', 'Open Graph Image URL'],
    ],
  },
};

function Sidebar({ collapsed, setCollapsed }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const links = [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { to: '/admin/projects', icon: FolderOpen, label: 'Projects' },
    ...Object.entries(singletonSections).map(([key, cfg]) => ({ to: `/admin/${key}`, icon: cfg.icon, label: cfg.title })),
    ...Object.entries(listSections).map(([key, cfg]) => ({ to: `/admin/${key}`, icon: cfg.icon, label: cfg.title })),
    { to: '/admin/messages', icon: Mail, label: 'Messages' },
  ];

  return (
    <aside className={`fixed left-0 top-0 h-full z-40 bg-dark-800 border-r border-white/5 flex flex-col transition-all ${collapsed ? 'w-16' : 'w-64'}`}>
      <div className="flex items-center justify-between p-4 border-b border-white/5">
        {!collapsed && <span className="font-mono text-accent-400 font-semibold text-sm">&lt;cms/&gt;</span>}
        <button onClick={() => setCollapsed(p => !p)} className="text-slate-400 hover:text-white p-1"><Menu size={18} /></button>
      </div>
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {links.map(({ to, icon: Icon, label, end }) => (
          <NavLink key={to} to={to} end={end} className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${isActive ? 'bg-accent-500/15 text-accent-400 border border-accent-500/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
            <Icon size={17} className="shrink-0" />
            {!collapsed && <span className="truncate">{label}</span>}
          </NavLink>
        ))}
      </nav>
      <button onClick={() => { logout(); navigate('/admin/login'); }} className="m-2 flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/5">
        <LogOut size={17} /> {!collapsed && <span className="text-sm">Log Out</span>}
      </button>
    </aside>
  );
}

function Field({ name, label, type = 'text', value, onChange }) {
  if (type === 'textarea') {
    return <div><label className={labelClass}>{label}</label><textarea rows={5} value={value || ''} onChange={e => onChange(name, e.target.value)} className={inputClass} /></div>;
  }
  if (type === 'array') {
    return <div><label className={labelClass}>{label} (one per line)</label><textarea rows={4} value={(value || []).join('\n')} onChange={e => onChange(name, e.target.value.split('\n').map(v => v.trim()).filter(Boolean))} className={inputClass} /></div>;
  }
  if (type === 'checkbox') {
    return <label className="flex items-center gap-2 text-sm text-slate-300"><input type="checkbox" checked={value !== false} onChange={e => onChange(name, e.target.checked)} className="accent-purple-500" /> {label}</label>;
  }
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <input
        type={type === 'url' ? 'text' : type}
        inputMode={type === 'url' ? 'url' : undefined}
        value={value ?? ''}
        onChange={e => onChange(name, type === 'number' ? Number(e.target.value) : e.target.value)}
        placeholder={type === 'url' ? 'https://example.com or example.com' : undefined}
        className={inputClass}
      />
    </div>
  );
}

function UploadBox({ kind, onUploaded }) {
  const [loading, setLoading] = useState(false);
  const accept = kind === 'resume' ? 'application/pdf' : 'image/*';

  const upload = async (file) => {
    if (!file) return;
    setLoading(true);
    const body = new FormData();
    body.append(kind === 'resume' ? 'resume' : 'image', file);
    try {
      const { data } = await api.post(`/upload/${kind === 'resume' ? 'resume' : 'image'}`, body, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      await onUploaded(data.url);
      toast.success('Upload complete');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <label className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-accent-500/40 text-accent-300 text-sm cursor-pointer hover:bg-accent-500/10">
      <Upload size={15} /> {loading ? 'Uploading...' : `Upload ${kind === 'resume' ? 'PDF' : 'Image'}`}
      <input type="file" accept={accept} className="hidden" onChange={e => upload(e.target.files?.[0])} />
    </label>
  );
}

function ImagePreview({ src, version, label = 'Current image' }) {
  const preview = cacheBustAsset(src, version);
  if (!preview) return null;
  return (
    <div className="flex items-center gap-4 rounded-xl bg-dark-900 border border-white/10 p-3">
      <img src={preview} alt={label} className="h-20 w-20 rounded-xl object-cover border border-white/10" />
      <div>
        <p className="text-white text-sm font-medium">{label}</p>
        <p className="text-slate-500 text-xs font-mono break-all">{src}</p>
      </div>
    </div>
  );
}

function SingletonPage({ section, config }) {
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/cms/${section}`);
      setForm(data.item || {});
    } catch {
      toast.error(`Failed to load ${config.title}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [section]);
  const setField = (name, value) => setForm(p => ({ ...p, [name]: value }));

  const persistUploadedAsset = async (field, url) => {
    const next = { ...form, [field]: url };
    setForm(next);
      const { data } = await api.put(`/cms/${section}`, next);
      setForm(data.item || next);
      await load();
      notifyCmsUpdated();
  };

  const save = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/cms/${section}`, form);
      toast.success(`${config.title} saved`);
      notifyCmsUpdated();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Save failed');
    }
  };

  if (loading) return <Panel title={config.title}>Loading...</Panel>;

  return (
    <Panel title={config.title}>
      <form onSubmit={save} className="space-y-4">
        {(section === 'hero' || section === 'resume') && (
          <div className="space-y-3">
            {section === 'hero' && <ImagePreview src={form.profileImage} version={form.updatedAt} label="Profile image preview" />}
            <UploadBox
              kind={section === 'resume' ? 'resume' : 'image'}
              onUploaded={url => persistUploadedAsset(section === 'resume' ? 'fileUrl' : 'profileImage', url)}
            />
          </div>
        )}
        <div className="grid md:grid-cols-2 gap-4">
          {config.fields.map(([name, label, type]) => <Field key={name} name={name} label={label} type={type} value={form[name]} onChange={setField} />)}
        </div>
        <button className="btn-primary text-sm">Save Changes</button>
      </form>
    </Panel>
  );
}

function ListPage({ section, config }) {
  const empty = Object.fromEntries(config.fields.map(([name, , type]) => [name, type === 'checkbox' ? true : type === 'array' ? [] : type === 'number' ? 0 : '']));
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);

  const normalizeForm = (item) => {
    if (section !== 'projects') return item;
    return {
      ...item,
      technologies: item.technologies?.length ? item.technologies : item.techStack || [],
      image: item.image || item.images?.[0] || '',
      githubUrl: item.githubUrl || item.githubLink || '',
      liveDemoUrl: item.liveDemoUrl || item.liveDemo || '',
    };
  };

  const normalizeProjectPayload = (payload) => {
    if (section !== 'projects') return payload;
    return {
      ...payload,
      githubUrl: normalizeExternalUrl(payload.githubUrl),
      liveDemoUrl: normalizeExternalUrl(payload.liveDemoUrl),
    };
  };

  const validateProjectUrls = (payload) => {
    if (section !== 'projects') return true;
    const rawGithub = form.githubUrl?.trim();
    const rawLiveDemo = form.liveDemoUrl?.trim();
    if (rawGithub && !payload.githubUrl) {
      toast.error('Enter a valid GitHub URL, for example github.com/user/repo');
      return false;
    }
    if (rawLiveDemo && !payload.liveDemoUrl) {
      toast.error('Enter a valid Live Demo URL, for example your-app.vercel.app');
      return false;
    }
    return true;
  };

  const load = async () => {
    try {
      const { data } = await api.get(`/cms/${section}`);
      setItems(data.items || []);
    } catch {
      toast.error(`Failed to load ${config.title}`);
    }
  };

  useEffect(() => { load(); setEditing(null); setForm(empty); }, [section]);
  const setField = (name, value) => setForm(p => ({ ...p, [name]: value }));

  const save = async (e) => {
    e.preventDefault();
    const payload = normalizeProjectPayload(form);
    if (!validateProjectUrls(payload)) return;
    try {
      if (editing?._id) await api.put(`/cms/${section}/${editing._id}`, payload);
      else await api.post(`/cms/${section}`, payload);
      toast.success(`${config.title} saved`);
      notifyCmsUpdated();
      setEditing(null);
      setForm(empty);
      load();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Save failed');
    }
  };

  const remove = async (id) => {
    if (!confirm('Delete this item?')) return;
    try {
      await api.delete(`/cms/${section}/${id}`);
      toast.success('Deleted');
      notifyCmsUpdated();
      load();
    } catch {
      toast.error('Delete failed');
    }
  };

  return (
    <Panel title={config.title}>
      <form onSubmit={save} className="glass rounded-xl p-4 border border-white/5 mb-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-display font-semibold">{editing ? 'Edit Item' : 'New Item'}</h3>
          {editing && <button type="button" onClick={() => { setEditing(null); setForm(empty); }} className="text-slate-400 text-sm">Cancel</button>}
        </div>
        {section === 'projects' && (
          <div className="space-y-3">
            <ImagePreview src={form.image} version={form.updatedAt} label="Project image preview" />
            <UploadBox kind="image" onUploaded={url => setField('image', url)} />
          </div>
        )}
        <div className="grid md:grid-cols-2 gap-4">
          {config.fields.map(([name, label, type]) => <Field key={name} name={name} label={label} type={type} value={form[name]} onChange={setField} />)}
        </div>
        <button className="btn-primary text-sm flex items-center gap-2"><Plus size={15} /> {editing ? 'Update' : 'Add'} Item</button>
      </form>

      <div className="space-y-3">
        {items.map(item => (
          <div key={item._id} className="glass rounded-xl p-4 border border-white/5 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <h3 className="text-white font-body font-medium truncate">{item.title || item.name || item.institution || item.platform}</h3>
              <p className="text-slate-500 text-xs font-mono truncate">{item.company || item.category || item.issuer || item.url || item.degree}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { const next = normalizeForm(item); setEditing(next); setForm(next); }} className="btn-outline py-2 text-xs">Edit</button>
              <button onClick={() => remove(item._id)} className="p-2 text-slate-400 hover:text-red-400"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function Panel({ title, children }) {
  return (
    <div>
      <h2 className="text-xl font-display font-semibold text-white mb-6">{title}</h2>
      <div className="glass rounded-xl p-6 border border-white/5">{children}</div>
    </div>
  );
}

function DashboardHome() {
  const [stats, setStats] = useState({});
  const { user } = useAuth();
  useEffect(() => {
    api.get('/cms/analytics').then(({ data }) => setStats(data)).catch(() => {});
  }, []);
  const cards = [
    ['Total Projects', stats.projects || 0, FolderOpen],
    ['Skills Count', stats.skills || 0, Wrench],
    ['Experience Entries', stats.experience || 0, Briefcase],
    ['Contact Submissions', stats.messages || 0, Mail],
  ];
  return (
    <div>
      <h2 className="text-2xl font-display font-bold text-white mb-2">Welcome back, {user?.username}</h2>
      <p className="text-slate-500 text-sm mb-8">Manage every portfolio section from MongoDB-backed CMS collections.</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(([label, value, Icon]) => (
          <div key={label} className="glass rounded-xl p-5 border border-white/5">
            <Icon size={20} className="text-accent-400 mb-4" />
            <div className="text-3xl font-display font-bold text-white">{value}</div>
            <div className="text-xs text-slate-500 font-mono mt-1">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProjectsPage() {
  return <ListPage section="projects" config={{
    title: 'Projects',
    fields: [
      ['title', 'Title'], ['shortDescription', 'Short Description'], ['description', 'Description', 'textarea'],
      ['detailedDescription', 'Detailed Description', 'textarea'], ['technologies', 'Tech Stack', 'array'],
      ['image', 'Project Image URL'], ['category', 'Category'], ['githubUrl', 'GitHub URL', 'url'], ['liveDemoUrl', 'Live Demo URL', 'url'],
      ['featured', 'Featured', 'checkbox'], ['status', 'Status'], ['order', 'Order', 'number'],
    ],
  }} />;
}

function MessagesPage() {
  const [messages, setMessages] = useState([]);
  useEffect(() => { api.get('/messages').then(({ data }) => setMessages(data.messages || [])); }, []);
  return (
    <Panel title="Messages">
      <div className="space-y-3">
        {messages.map(msg => (
          <div key={msg._id} className="rounded-xl bg-dark-900 border border-white/10 p-4">
            <div className="flex justify-between gap-3">
              <div>
                <h3 className="text-white font-medium">{msg.name}</h3>
                <a href={`mailto:${msg.email}`} className="text-accent-400 text-sm">{msg.email}</a>
              </div>
              <span className="text-slate-600 text-xs font-mono">{new Date(msg.createdAt).toLocaleString()}</span>
            </div>
            {msg.subject && <p className="text-slate-300 text-sm mt-3">{msg.subject}</p>}
            <p className="text-slate-400 text-sm mt-2 whitespace-pre-wrap">{msg.message}</p>
          </div>
        ))}
      </div>
    </Panel>
  );
}

export default function AdminDashboard() {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div className="min-h-screen bg-dark-950">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <main className="transition-all duration-300 min-h-screen p-6" style={{ marginLeft: collapsed ? 64 : 256 }}>
        <div className="max-w-6xl mx-auto pt-4">
          <Routes>
            <Route path="/" element={<DashboardHome />} />
            <Route path="/projects" element={<ProjectsPage />} />
            {Object.entries(singletonSections).map(([section, config]) => (
              <Route key={section} path={`/${section}`} element={<SingletonPage section={section} config={config} />} />
            ))}
            {Object.entries(listSections).map(([section, config]) => (
              <Route key={section} path={`/${section}`} element={<ListPage section={section} config={config} />} />
            ))}
            <Route path="/messages" element={<MessagesPage />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
