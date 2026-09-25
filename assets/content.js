const contentPath = (name) => `content/${name}.json`;

async function loadContent(name) {
  const response = await fetch(contentPath(name), { cache: 'no-cache' });
  if (!response.ok) throw new Error(`Unable to load ${name}`);
  return response.json();
}

function make(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined && text !== null) element.textContent = text;
  return element;
}

function assetUrl(value) {
  if (!value || typeof value !== 'string') return '';
  if (/^https:\/\//i.test(value)) return value;
  if (/^[a-z][a-z0-9+.-]*:/i.test(value)) return '';
  return value.replace(/^\/+/, '');
}

function safeExternalUrl(value) {
  if (!value || typeof value !== 'string') return '';
  try {
    const url = new URL(value);
    return url.protocol === 'https:' ? url.href : '';
  } catch {
    return '';
  }
}

function filename(value) {
  return decodeURIComponent(String(value).split('/').pop() || 'Download document').replace(/[-_]/g, ' ');
}

function fileExtension(value) { const cleanValue = String(value || '').split(/[?#]/)[0]; const match = cleanValue.match(/\.([a-z0-9]+)$/i); return match ? match[1].toLowerCase() : ''; } function powerpointEmbedUrl(value) { if (!['ppt', 'pptx'].includes(fileExtension(value))) return ''; try { const publicUrl = new URL(assetUrl(value), window.location.href); if (publicUrl.protocol !== 'https:') return ''; return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(publicUrl.href)}`; } catch { return ''; } } function appendMedia(container, item) {
  const images = Array.isArray(item.images) ? item.images.filter(Boolean) : [];
  const documents = Array.isArray(item.documents) ? item.documents.filter(Boolean) : [];

  if (images.length) {
    const gallery = make('div', 'project-gallery');
    images.forEach((imagePath, index) => {
      const source = assetUrl(imagePath);
      if (!source) return;
      const image = document.createElement('img');
      image.src = source;
      image.alt = `${item.title} visual ${index + 1}`;
      image.loading = 'lazy';
      gallery.append(image);
    });
    container.append(gallery);
  }

  if (documents.length) {
    const presentations = documents.map((documentPath) => ({ documentPath, embedUrl: powerpointEmbedUrl(documentPath) })).filter(({ embedUrl }) => embedUrl); presentations.forEach(({ documentPath, embedUrl }) => { const presentation = make('section', 'project-presentation'); presentation.append(make('h3', '', 'Interactive presentation')); const frame = document.createElement('iframe'); frame.className = 'presentation-frame'; frame.src = embedUrl; frame.title = `${item.title || 'Project'} presentation: ${filename(documentPath)}`; frame.loading = 'lazy'; frame.allowFullscreen = true; presentation.append(frame); presentation.append(make('p', 'presentation-note', 'Use the viewer controls to move through the slides. A direct download remains available below.')); container.append(presentation); }); const resources = make('div', 'project-resources');
    resources.append(make('h3', '', 'Downloads'));
    const links = make('div', 'resource-links');
    documents.forEach((documentPath) => {
      const source = assetUrl(documentPath);
      if (!source) return;
      const link = make('a', 'resource-link', filename(documentPath));
      link.href = source;
      link.setAttribute('download', '');
      links.append(link);
    });
    resources.append(links);
    container.append(resources);
  }
}

function createProjectCard(item) {
  const article = make('article', 'project-card reveal visible');
  article.id = item.id || '';
  article.dataset.category = item.category || 'analytics';
  article.append(make('span', 'tag', item.workType || 'Applied project'));
  article.append(make('h2', '', item.title || 'Untitled project'));
  article.append(make('p', '', item.summary || 'Project summary coming soon.'));

  const meta = make('div', 'meta');
  [item.focus && `Focus: ${item.focus}`, item.domain && `Domain: ${item.domain}`, item.scale && `Scale: ${item.scale}`]
    .filter(Boolean)
    .forEach((value) => meta.append(make('span', '', value)));
  if (meta.children.length) article.append(meta);

  const tools = Array.isArray(item.tools) ? item.tools.filter(Boolean) : [];
  if (tools.length) {
    const toolRow = make('div', 'tool-row');
    tools.forEach((tool) => toolRow.append(make('span', 'tool-chip', tool)));
    article.append(toolRow);
  }

  const highlights = Array.isArray(item.highlights) ? item.highlights.filter(Boolean) : [];
  if (highlights.length) {
    article.append(make('h3', '', 'Work demonstrated'));
    const list = document.createElement('ul');
    highlights.forEach((highlight) => list.append(make('li', '', highlight)));
    article.append(list);
  }

  appendMedia(article, item);

  if (item.statusNote) {
    const note = make('div', 'placeholder');
    note.append(make('strong', '', 'Portfolio note: '));
    note.append(document.createTextNode(item.statusNote));
    article.append(note);
  }
  return article;
}

function createHomeCard(item, featured = false) {
  const article = make('article', `card reveal visible${featured ? ' featured' : ''}`);
  article.append(make('span', item.isResearch ? 'tag research' : 'tag', item.workType));
  article.append(make('h3', '', item.title));
  article.append(make('p', '', item.summary));
  const link = make('a', 'card-link', item.isResearch ? 'View research profile ' : 'Open case study ');
  link.href = item.isResearch ? 'research.html' : `projects.html#${item.id}`;
  link.append(make('span', '', '↗'));
  article.append(link);
  return article;
}

async function renderProfile() {
  const targets = document.querySelectorAll('[data-profile]');
  if (!targets.length && !document.querySelector('#managed-about-copy')) return;
  const profile = await loadContent('profile');
  targets.forEach((target) => {
    const key = target.dataset.profile;
    if (profile[key]) target.textContent = profile[key];
  });

  const about = document.querySelector('#managed-about-copy');
  if (about && Array.isArray(profile.aboutParagraphs)) {
    about.replaceChildren(...profile.aboutParagraphs.filter(Boolean).map((paragraph) => make('p', '', paragraph)));
  }

  const headshot = document.querySelector('#managed-headshot');
  if (headshot && profile.headshot) {
    const image = document.createElement('img');
    image.src = assetUrl(profile.headshot);
    image.alt = profile.headshotAlt || `Professional headshot of ${profile.name}`;
    image.className = 'profile-photo';
    headshot.replaceWith(image);
  }
}

async function renderProjects() {
  const grid = document.querySelector('#managed-project-grid');
  if (!grid) return;
  const projects = await loadContent('projects');
  const published = projects.filter((item) => item.published !== false);
  grid.replaceChildren(...published.map(createProjectCard));
  if (!published.length) grid.append(make('p', 'lead', 'New case studies are being prepared.'));
}

async function renderFeatured() {
  const grid = document.querySelector('#managed-featured-grid');
  if (!grid) return;
  const [projects, research] = await Promise.all([loadContent('projects'), loadContent('research')]);
  const featured = projects.filter((item) => item.published !== false && item.featured).slice(0, 3);
  const items = [];
  if (featured[0]) items.push(featured[0]);
  items.push({ isResearch: true, workType: 'Professional research', title: research.title, summary: research.overview });
  items.push(...featured.slice(1));
  grid.replaceChildren(...items.slice(0, 4).map((item, index) => createHomeCard(item, index === 0)));
}

async function renderResearch() {
  const overview = document.querySelector('#managed-research-overview');
  if (!overview) return;
  const research = await loadContent('research');
  document.querySelectorAll('[data-research]').forEach((target) => {
    const key = target.dataset.research;
    if (research[key]) target.textContent = research[key];
  });

  const fields = document.querySelector('#managed-research-fields');
  if (fields) {
    const definitions = [
      ['Population and setting', research.population],
      ['Primary exposure', research.exposure],
      ['Outcome', research.outcome],
      ['Analytical approach', research.approach],
      ['Interpretation', research.interpretation]
    ];
    fields.replaceChildren(...definitions.map(([term, description]) => {
      const row = document.createElement('div');
      row.append(make('dt', '', term), make('dd', '', description || 'To be added after public-release review.'));
      return row;
    }));
  }

  const publications = document.querySelector('#managed-publications');
  if (publications) {
    const entries = Array.isArray(research.publications) ? research.publications : [];
    publications.replaceChildren();
    if (!entries.length) {
      const note = make('div', 'notice');
      note.append(make('strong', '', 'Publication text pending. '));
      note.append(document.createTextNode('Add the exact approved abstract and citation only after confirming public-release permission, authorship, and publication status.'));
      publications.append(note);
    } else {
      entries.forEach((entry) => {
        const card = make('article', 'publication-entry');
        card.append(make('h3', '', entry.title || 'Publication'));
        if (entry.citation) card.append(make('p', 'publication-citation', entry.citation));
        if (entry.abstract) card.append(make('p', 'muted', entry.abstract));
        const actions = make('div', 'resource-links');
        const external = safeExternalUrl(entry.url);
        if (external) {
          const link = make('a', 'resource-link', 'View publication');
          link.href = external;
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
          actions.append(link);
        }
        if (entry.document) {
          const link = make('a', 'resource-link', 'Download public document');
          link.href = assetUrl(entry.document);
          actions.append(link);
        }
        if (actions.children.length) card.append(actions);
        publications.append(card);
      });
    }
  }
}

function renderTimeline(container, entries, emptyMessage) {
  if (!container) return;
  container.replaceChildren();
  if (!Array.isArray(entries) || !entries.length) {
    container.append(make('div', 'notice', emptyMessage));
    return;
  }
  entries.forEach((entry) => {
    const row = make('div', 'resume-entry');
    row.append(make('time', '', entry.dates || ''));
    const detail = document.createElement('div');
    detail.append(make('h3', '', entry.title || ''));
    if (entry.organization) detail.append(make('p', '', entry.organization));
    if (entry.details) detail.append(make('p', '', entry.details));
    row.append(detail);
    container.append(row);
  });
}

function renderResumeResearch(container, research) {
  if (!container) return;
  container.replaceChildren();
  if (!research || !research.title) {
    container.append(make('div', 'notice', 'Professional research details will appear here after they are added in the editor.'));
    return;
  }

  const row = make('div', 'resume-entry');
  row.append(make('time', '', research.publicationStatus || 'Professional research'));
  const detail = document.createElement('div');
  const heading = make('h3');
  const link = make('a', '', research.title);
  link.href = 'research.html';
  heading.append(link);
  detail.append(heading);
  if (research.team) detail.append(make('p', '', research.team));
  if (research.overview) detail.append(make('p', '', research.overview));
  row.append(detail);
  container.append(row);
}

function renderResumeProjects(container, projects) {
  if (!container) return;
  container.replaceChildren();
  const selected = Array.isArray(projects)
    ? projects.filter((item) => item.published !== false && item.featured).slice(0, 3)
    : [];
  if (!selected.length) {
    container.append(make('div', 'notice', 'Projects marked “Feature on homepage” will appear here automatically.'));
    return;
  }

  selected.forEach((project) => {
    const row = make('div', 'resume-entry');
    row.append(make('time', '', project.workType || 'Applied project'));
    const detail = document.createElement('div');
    const heading = make('h3');
    const link = make('a', '', project.title || 'Untitled project');
    link.href = `projects.html#${project.id || ''}`;
    heading.append(link);
    detail.append(heading);
    if (project.summary) detail.append(make('p', '', project.summary));
    const tools = Array.isArray(project.tools) ? project.tools.filter(Boolean) : [];
    if (tools.length) detail.append(make('p', 'small', `Tools and methods: ${tools.join(', ')}`));
    row.append(detail);
    container.append(row);
  });
}

async function renderResume() {
  const summary = document.querySelector('#managed-resume-summary');
  if (!summary) return;
  const [resume, contact, projects, research] = await Promise.all([
    loadContent('resume'),
    loadContent('contact'),
    loadContent('projects'),
    loadContent('research')
  ]);
  summary.textContent = resume.summary || '';
  const location = document.querySelector('#managed-resume-location');
  if (location) location.textContent = resume.location || '[Location to add]';
  const skills = document.querySelector('#managed-resume-skills');
  if (skills && Array.isArray(resume.skills)) skills.replaceChildren(...resume.skills.filter(Boolean).map((skill) => make('div', 'skill-pill', skill)));
  renderTimeline(document.querySelector('#managed-experience'), resume.experience, 'Professional history will appear here after verified entries are added in the editor.');
  renderTimeline(document.querySelector('#managed-education'), resume.education, 'Education details will appear here after verified entries are added in the editor.');
  renderResumeResearch(document.querySelector('#managed-resume-research'), research);
  renderResumeProjects(document.querySelector('#managed-resume-projects'), projects);

  const documentLink = document.querySelector('#managed-resume-document');
  if (documentLink && resume.resumeDocument) {
    documentLink.href = assetUrl(resume.resumeDocument);
    documentLink.hidden = false;
  }
  const email = document.querySelector('#managed-resume-email');
  if (email) email.textContent = contact.email || '[Professional email]';
  const linkedin = document.querySelector('#managed-resume-linkedin');
  if (linkedin) linkedin.textContent = contact.linkedin || '[LinkedIn URL]';
  const github = document.querySelector('#managed-resume-github');
  if (github) github.textContent = contact.github || '[GitHub URL]';
}

async function renderContact() {
  const roles = document.querySelector('#managed-contact-roles');
  if (!roles) return;
  const contact = await loadContent('contact');
  roles.replaceChildren(...(contact.roles || []).filter(Boolean).map((role) => make('div', 'skill-pill', role)));
  const availability = document.querySelector('#managed-availability');
  if (availability) availability.textContent = contact.availability || 'Open to relevant conversations';

  const details = [
    ['email', contact.email, contact.email ? `mailto:${contact.email}` : ''],
    ['linkedin', contact.linkedin, safeExternalUrl(contact.linkedin)],
    ['github', contact.github, safeExternalUrl(contact.github)]
  ];
  details.forEach(([key, value, href]) => {
    const target = document.querySelector(`[data-contact="${key}"]`);
    if (!target) return;
    target.textContent = value || `[${key === 'email' ? 'Professional email' : `${key[0].toUpperCase()}${key.slice(1)} URL`} to add]`;
    if (href) {
      target.href = href;
      if (key !== 'email') {
        target.target = '_blank';
        target.rel = 'noopener noreferrer';
      }
    } else {
      target.removeAttribute('href');
    }
  });
}

Promise.allSettled([
  renderProfile(),
  renderProjects(),
  renderFeatured(),
  renderResearch(),
  renderResume(),
  renderContact()
]).then((results) => {
  if (results.some((result) => result.status === 'rejected')) document.documentElement.dataset.contentStatus = 'fallback';
});
