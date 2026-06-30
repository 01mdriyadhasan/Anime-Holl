

/* =====================
   পাসওয়ার্ড সিস্টেম
   (আপনার দেওয়া ফাইল অনুযায়ী)
===================== */
const APP_PASSWORD = "920612";
let adminUnlocked = false;

function openAdmin() {
  if (adminUnlocked) {
    showPage('admin');
  } else {
    document.getElementById('adminPassInput').value = '';
    document.getElementById('adminPassErr').textContent = '';
    document.getElementById('adminLoginModal').classList.add('open');
    setTimeout(() => document.getElementById('adminPassInput').focus(), 100);
  }
}

function closeAdminModal() {
  document.getElementById('adminLoginModal').classList.remove('open');
}

function checkAdminPass() {
  const pass = document.getElementById('adminPassInput').value;
  if (pass === APP_PASSWORD) {
    adminUnlocked = true;
    closeAdminModal();
    showPage('admin');
  } else {
    document.getElementById('adminPassErr').textContent = '❌ ভুল পাসওয়ার্ড! আবার চেষ্টা করুন।';
    document.getElementById('adminPassInput').value = '';
    document.getElementById('adminPassInput').focus();
  }
}

/* =====================
   ডেটা
===================== */
const CAT_MAP = {
  anime: '🌸 Anime', movie: '🎬 Movie',
  tv: '📺 TV Series', animation: '🎨 US Animation', kids: '🧒 Kids'
};
const CATS = [
  { id: 'all', name: 'সব কন্টেন্ট' },
  { id: 'anime', name: '🌸 Anime' },
  { id: 'movie', name: '🎬 Movie' },
  { id: 'tv', name: '📺 TV' },
  { id: 'animation', name: '🎨 Animation' },
  { id: 'kids', name: '🧒 Kids' },
];

const DEFAULTS = [
  {
    id:1, title:'Bleach: Thousand-Year Blood War',
    category:'anime', language:'Hindi', duration:'24:00', year:'2022',
    thumbnail:'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=700&q=80',
    videoUrl:'', views:125000, rating:5,
    description:'সোল রিপার ইচিগো কুরোসাকি ওয়ান্ডেনরেইখের বিরুদ্ধে চূড়ান্ত যুদ্ধে অবতীর্ণ হন। Bleach সিরিজের সবচেয়ে মহাকাব্যিক আর্ক।',
    isNew:false, isTrending:true, createdAt: Date.now()-86400000
  },
  {
    id:2, title:'Attack on Titan: Final Season',
    category:'anime', language:'Japanese', duration:'45:00', year:'2023',
    thumbnail:'https://images.unsplash.com/photo-1611746869696-d09bce200020?w=700&q=80',
    videoUrl:'', views:98500, rating:5,
    description:'এরেন ইয়েগার এবং তার সঙ্গীরা মানবজাতির অস্তিত্ব রক্ষার জন্য রাম্বলিং শুরু করে। ইতিহাসের অন্যতম সেরা ফিনালে।',
    isNew:true, isTrending:true, createdAt: Date.now()-172800000
  },
  {
    id:3, title:'Demon Slayer: Swordsmith Village',
    category:'anime', language:'Hindi', duration:'44:00', year:'2023',
    thumbnail:'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=700&q=80',
    videoUrl:'', views:88000, rating:4,
    description:'তানজিরো তলোয়ার কারিগর গ্রামে যায় — কিন্তু শত্রু পিছু নেয়। উপপ্রধান এবং মিতসুরি অ্যানিমেশন চমৎকার।',
    isNew:false, isTrending:true, createdAt: Date.now()-259200000
  },
  {
    id:4, title:'One Piece: Wano Arc',
    category:'anime', language:'Hindi', duration:'24:00', year:'2023',
    thumbnail:'https://images.unsplash.com/photo-1614854262318-831574f15f1f?w=700&q=80',
    videoUrl:'', views:112000, rating:5,
    description:'লুফি ওয়ানো দেশে কাইডোর বিরুদ্ধে গিয়ার ফিফথ ব্যবহার করেন — One Piece-এর সেরা মুহূর্ত।',
    isNew:false, isTrending:true, createdAt: Date.now()-345600000
  },
  {
    id:5, title:'Spider-Man: Across the Spider-Verse',
    category:'animation', language:'English', duration:'2:20:00', year:'2023',
    thumbnail:'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=700&q=80',
    videoUrl:'', views:75000, rating:5,
    description:'মাইলস মোরালেস মাল্টিভার্সে যাত্রা করেন। সেরা অ্যানিমেটেড মুভি হিসেবে অস্কার বিজয়ী।',
    isNew:true, isTrending:false, createdAt: Date.now()-432000000
  },
  {
    id:6, title:'Jujutsu Kaisen Season 2',
    category:'anime', language:'Hindi', duration:'24:00', year:'2023',
    thumbnail:'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=700&q=80',
    videoUrl:'', views:94000, rating:4,
    description:'গোজো সাতোরুর অতীত এবং শিবুয়া ইনসিডেন্ট — JJK ইতিহাসের সেরা অ্যানিমেশন সিকোয়েন্স।',
    isNew:true, isTrending:true, createdAt: Date.now()-518400000
  },
];

function getVideos() {
  const s = localStorage.getItem('sv2_videos');
  if (s) return JSON.parse(s);
  localStorage.setItem('sv2_videos', JSON.stringify(DEFAULTS));
  return DEFAULTS;
}
function saveVideos(v) { localStorage.setItem('sv2_videos', JSON.stringify(v)); }
function nextId() { const v=getVideos(); return v.length ? Math.max(...v.map(x=>x.id))+1 : 1; }

/* =====================
   PAGE NAVIGATION
===================== */
let activePage = 'home';
let homeCategory = 'all';
let browseCategory = 'all';
let heroVideo = null;
let currentRating = 0;
let editingId = null;
let searchTimer = null;

function showPage(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('page-' + page).classList.add('active');
  const nb = document.getElementById('nav-' + page);
  if (nb) nb.classList.add('active');
  activePage = page;
  window.scrollTo(0, 0);
  if (page === 'home') renderHome();
  if (page === 'browse') renderBrowse();
  if (page === 'admin') renderAdmin();
}

/* =====================
   HELPERS
===================== */
function fmtViews(n) {
  n = n || 0;
  if (n >= 1000000) return (n/1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n/1000).toFixed(0) + 'K';
  return n;
}
function timeAgo(ts) {
  const s = (Date.now() - ts) / 1000;
  if (s < 3600) return Math.floor(s/60) + ' মিনিট আগে';
  if (s < 86400) return Math.floor(s/3600) + ' ঘণ্টা আগে';
  return Math.floor(s/86400) + ' দিন আগে';
}
function starsHtml(n) {
  let s = '';
  for (let i=1; i<=5; i++) s += i<=n ? '★' : '☆';
  return s;
}
function catLabel(cat) { return CAT_MAP[cat] || cat || ''; }

function vCardHTML(v, fullWidth=false) {
  return `
  <div class="vcard${fullWidth?' vcard-full':''}" onclick="watchVideo(${v.id})">
    <div class="vcard-thumb">
      <img src="${v.thumbnail}" alt="${v.title}"
        onerror="this.src='https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400'">
      <div class="vcard-play"><div class="play-circle">▶</div></div>
      <div class="vcard-corner-tags">
        ${v.isNew ? '<span class="tag tag-purple" style="font-size:10px">NEW</span>' : ''}
        ${v.isTrending ? '<span class="tag tag-red" style="font-size:10px">🔥</span>' : ''}
        ${v.language ? `<span class="tag tag-glass" style="font-size:10px">${v.language}</span>` : ''}
      </div>
      ${v.duration ? `<span class="vcard-dur">${v.duration}</span>` : ''}
      ${v.rating ? `<span class="vcard-stars">${starsHtml(v.rating)}</span>` : ''}
    </div>
    <div class="vcard-info">
      <div class="vcard-title">${v.title}</div>
      <div class="vcard-meta">
        <span>👁 ${fmtViews(v.views)}</span>
        <span>•</span>
        <span>${catLabel(v.category)}</span>
        ${v.year ? `<span>• ${v.year}</span>` : ''}
      </div>
    </div>
  </div>`;
}

/* =====================
   HOME PAGE
===================== */
function renderHome() {
  const videos = getVideos();

  // Hero - pick first trending video
  const trending = videos.filter(v => v.isTrending);
  heroVideo = trending[0] || videos[0] || null;
  if (heroVideo) {
    document.getElementById('heroImg').src = heroVideo.thumbnail;
    document.getElementById('heroTitle').textContent = heroVideo.title;
    document.getElementById('heroDesc').textContent = heroVideo.description || 'আজই দেখুন এই দারুণ কন্টেন্ট!';
    document.getElementById('heroTags').innerHTML = `
      <span class="tag tag-purple">${catLabel(heroVideo.category).replace(/[🌸🎬📺🎨🧒]\s*/,'').toUpperCase()}</span>
      ${heroVideo.isTrending ? '<span class="tag tag-red">🔥 TRENDING</span>' : ''}
      ${heroVideo.language ? `<span class="tag tag-glass">${heroVideo.language}</span>` : ''}
      ${heroVideo.rating ? `<span class="tag tag-glass">${starsHtml(heroVideo.rating)}</span>` : ''}`;
  }

  // Category pills
  document.getElementById('homePills').innerHTML = CATS.map(c =>
    `<button class="pill ${homeCategory===c.id?'pill-active':'pill-off'}" onclick="setHomeCategory('${c.id}')">${c.name}</button>`
  ).join('');

  const filtered = homeCategory === 'all' ? videos : videos.filter(v => v.category === homeCategory);

  // Trending carousel
  const trendList = filtered.filter(v => v.isTrending);
  document.getElementById('trendingRow').innerHTML = trendList.length
    ? trendList.map(v => vCardHTML(v)).join('')
    : '<p style="color:var(--text-muted);padding:20px 0">ট্রেন্ডিং ভিডিও নেই।</p>';

  // New releases
  const newList = filtered.filter(v => v.isNew).slice(0, 8);
  document.getElementById('newGrid').innerHTML = newList.length
    ? newList.map(v => vCardHTML(v)).join('')
    : '<p style="color:var(--text-muted)">নতুন রিলিজ নেই।</p>';

  // All videos
  const allTitle = homeCategory === 'all' ? '🎬 সব ভিডিও' : `🎬 ${catLabel(homeCategory)} ভিডিও`;
  document.getElementById('allTitle').textContent = allTitle;
  document.getElementById('allGrid').innerHTML = filtered.length
    ? filtered.map(v => vCardHTML(v)).join('')
    : '<p style="color:var(--text-muted)">এই ক্যাটাগরিতে ভিডিও নেই।</p>';
}

function setHomeCategory(cat) { homeCategory = cat; renderHome(); }
function playHero() { if (heroVideo) watchVideo(heroVideo.id); }
function infoHero() { if (heroVideo) watchVideo(heroVideo.id); }

/* =====================
   BROWSE PAGE
===================== */
function renderBrowse(q='', cat='all') {
  const videos = getVideos();
  document.getElementById('browsePills').innerHTML = CATS.map(c =>
    `<button class="pill ${cat===c.id?'pill-active':'pill-off'}" onclick="setBrowseCat('${c.id}')">${c.name}</button>`
  ).join('');
  let results = cat==='all' ? videos : videos.filter(v => v.category===cat);
  if (q.trim()) {
    const lq = q.toLowerCase();
    results = results.filter(v =>
      v.title.toLowerCase().includes(lq) || (v.description||'').toLowerCase().includes(lq)
    );
  }
  document.getElementById('browseLabel').textContent =
    q ? `"${q}" এর ফলাফল — ${results.length}টি` : `${results.length}টি ভিডিও পাওয়া গেছে`;
  document.getElementById('browseGrid').innerHTML = results.length
    ? results.map(v => vCardHTML(v)).join('')
    : '<div class="empty"><span>🔍</span><p>কোনো ভিডিও পাওয়া যায়নি।</p></div>';
}
function setBrowseCat(cat) { browseCategory = cat; renderBrowse(document.getElementById('searchInput').value, cat); }
function debounceSearch() {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => renderBrowse(document.getElementById('searchInput').value, browseCategory), 350);
}

/* =====================
   WATCH PAGE
===================== */
function watchVideo(id) {
  const videos = getVideos();
  const v = videos.find(x => x.id === id);
  if (!v) return;
  // increment views
  const idx = videos.indexOf(v);
  videos[idx].views = (v.views || 0) + 1;
  saveVideos(videos);

  // Player
  let playerHTML = '';
  if (v.videoUrl) {
    playerHTML = `<video src="${v.videoUrl}" poster="${v.thumbnail}" controls autoplay style="width:100%;height:100%;background:#000"></video>`;
  } else {
    playerHTML = `
      <div class="watch-no-video">
        <img class="bg-blur" src="${v.thumbnail}" onerror="">
        <div class="watch-no-video-inner">
          <div style="font-size:60px">▶</div>
          <p style="font-size:15px;margin-top:10px">ভিডিও URL সংযুক্ত করা হয়নি</p>
          <p style="font-size:13px;color:#6b7280;margin-top:4px">Admin Panel থেকে Video URL যোগ করুন</p>
        </div>
      </div>`;
  }
  document.getElementById('watchPlayer').innerHTML = playerHTML;

  // Tags
  document.getElementById('watchTags').innerHTML = `
    <span class="tag tag-purple">${catLabel(v.category).replace(/[🌸🎬📺🎨🧒]\s*/,'').toUpperCase()}</span>
    ${v.isNew ? '<span class="tag tag-purple">NEW</span>' : ''}
    ${v.isTrending ? '<span class="tag tag-red">🔥 TRENDING</span>' : ''}
    ${v.language ? `<span class="tag tag-glass">${v.language}</span>` : ''}
    ${v.rating ? `<span class="tag tag-glass">${starsHtml(v.rating)}</span>` : ''}`;

  document.getElementById('watchTitle').textContent = v.title;
  document.getElementById('watchMeta').innerHTML = `
    <span class="watch-meta-item">👁 ${(v.views||0).toLocaleString()} views</span>
    ${v.duration ? `<span class="watch-meta-item">⏱ ${v.duration}</span>` : ''}
    ${v.year ? `<span class="watch-meta-item">📅 ${v.year}</span>` : ''}
    ${v.language ? `<span class="watch-meta-item">🌐 ${v.language}</span>` : ''}
    <span class="watch-meta-item">🕐 ${timeAgo(v.createdAt||Date.now())}</span>`;
  document.getElementById('watchDesc').textContent = v.description || 'কোনো বিবরণ নেই।';

  // Recommendations
  const recs = videos.filter(x => x.id !== id).slice(0, 5);
  document.getElementById('watchRec').innerHTML = recs.map(r => `
    <div class="rec-item" onclick="watchVideo(${r.id})">
      <div class="rec-thumb">
        <img src="${r.thumbnail}" onerror="this.src='https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300'">
      </div>
      <div class="rec-info">
        <h4>${r.title}</h4>
        <span>${catLabel(r.category)} • ${fmtViews(r.views)} views</span>
        ${r.rating ? `<div class="stars-disp" style="font-size:11px">${starsHtml(r.rating)}</div>` : ''}
      </div>
    </div>`).join('');

  showPage('watch');
}

/* =====================
   ADMIN PAGE
===================== */
function renderAdmin() {
  const videos = getVideos();
  const totalViews = videos.reduce((s,v) => s+(v.views||0), 0);
  document.getElementById('adminStats').innerHTML = `
    <div class="stat-card"><div class="stat-icon">🎬</div><div class="stat-val">${videos.length}</div><div class="stat-lbl">মোট ভিডিও</div></div>
    <div class="stat-card"><div class="stat-icon">👁</div><div class="stat-val">${fmtViews(totalViews)}</div><div class="stat-lbl">মোট ভিউ</div></div>
    <div class="stat-card"><div class="stat-icon">🔥</div><div class="stat-val">${videos.filter(v=>v.isTrending).length}</div><div class="stat-lbl">ট্রেন্ডিং</div></div>
    <div class="stat-card"><div class="stat-icon">✨</div><div class="stat-val">${videos.filter(v=>v.isNew).length}</div><div class="stat-lbl">নতুন রিলিজ</div></div>`;

  document.getElementById('vidCount').textContent = videos.length + 'টি ভিডিও';

  if (videos.length === 0) {
    document.getElementById('adminTable').innerHTML =
      '<div class="empty"><span>🎬</span><p>কোনো ভিডিও নেই। প্রথম ভিডিওটি যোগ করুন!</p></div>';
    return;
  }

  document.getElementById('adminTable').innerHTML = `
    <table>
      <thead><tr>
        <th>কভার</th><th>টাইটেল</th><th>ক্যাটাগরি</th>
        <th>রেটিং</th><th>ভিউ</th><th>ট্যাগ</th><th>অ্যাকশন</th>
      </tr></thead>
      <tbody>${videos.map(v => `
        <tr>
          <td><img class="tbl-thumb" src="${v.thumbnail}"
            onerror="this.src='https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=200'"></td>
          <td>
            <div class="tbl-title">${v.title}</div>
            ${v.language ? `<div style="font-size:12px;color:var(--text-muted);margin-top:2px">${v.language} • ${v.year||''}</div>` : ''}
          </td>
          <td><span class="tag tag-glass" style="font-size:11px">${catLabel(v.category)}</span></td>
          <td><span class="stars-disp">${v.rating ? starsHtml(v.rating) : '—'}</span></td>
          <td>${(v.views||0).toLocaleString()}</td>
          <td>
            ${v.isNew ? '<span class="tag tag-purple" style="font-size:10px">NEW</span> ' : ''}
            ${v.isTrending ? '<span class="tag tag-red" style="font-size:10px">🔥</span>' : ''}
          </td>
          <td>
            <div class="action-btns">
              <button class="act-btn act-edit" onclick="editVideo(${v.id})">✏️ এডিট</button>
              <button class="act-btn act-del" style="background:#ef4444;color:white;padding:6px 14px;font-size:13px;" onclick="deleteVideo(${v.id})">🗑️ Delete</button>
            </div>
          </td>
        </tr>`).join('')}
      </tbody>
    </table>`;
}

/* =====================
   ADMIN FORM
===================== */
function setRating(n) {
  currentRating = n;
  document.querySelectorAll('#starRow .star-btn').forEach(btn => {
    btn.classList.toggle('active', parseInt(btn.dataset.v) <= n);
  });
}

function prevThumb() {
  const url = document.getElementById('f_thumb').value;
  const box = document.getElementById('thumbPreview');
  if (url) {
    box.innerHTML = `<img src="${url}" onerror="this.parentElement.innerHTML='<span>লোড হয়নি</span>'">`;
  } else {
    box.innerHTML = '<span>ছবির URL দিন</span>';
  }
}

function loadThumbFile(event) {
  const file = event.target.files[0];
  if (!file) return;
  const nameEl = document.getElementById('thumbFileName');
  nameEl.textContent = '⏳ লোড হচ্ছে...';
  nameEl.style.display = 'block';
  const reader = new FileReader();
  reader.onload = function(e) {
    document.getElementById('f_thumb').value = e.target.result;
    document.getElementById('thumbPreview').innerHTML =
      `<img src="${e.target.result}">`;
    nameEl.textContent = `✅ ${file.name} (${(file.size/1024).toFixed(0)} KB)`;
  };
  reader.readAsDataURL(file);
}

function loadVideoFile(event) {
  const file = event.target.files[0];
  if (!file) return;
  const nameEl = document.getElementById('videoFileName');
  nameEl.textContent = '⏳ ভিডিও লোড হচ্ছে, একটু অপেক্ষা করুন...';
  nameEl.style.display = 'block';
  if (file.size > 80 * 1024 * 1024) {
    nameEl.textContent = '❌ ফাইলটি ৮০MB-এর বেশি। URL ব্যবহার করুন।';
    nameEl.style.color = '#f87171';
    event.target.value = '';
    return;
  }
  const reader = new FileReader();
  reader.onload = function(e) {
    document.getElementById('f_video').value = e.target.result;
    nameEl.textContent = `✅ ${file.name} (${(file.size/1024/1024).toFixed(1)} MB) — লোড সম্পন্ন`;
    nameEl.style.color = 'var(--primary-light)';
  };
  reader.onerror = function() {
    nameEl.textContent = '❌ ফাইল পড়তে সমস্যা হয়েছে। URL ব্যবহার করুন।';
    nameEl.style.color = '#f87171';
  };
  reader.readAsDataURL(file);
}

function resetForm() {
  editingId = null; currentRating = 0;
  document.getElementById('uploadFormTitle').textContent = '➕ নতুন ভিডিও আপলোড করুন';
  ['f_title','f_desc','f_thumb','f_video','f_lang','f_dur','f_year'].forEach(id => {
    document.getElementById(id).value = '';
  });
  document.getElementById('f_cat').value = 'anime';
  document.getElementById('f_new').checked = false;
  document.getElementById('f_trend').checked = false;
  document.querySelectorAll('#starRow .star-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('thumbPreview').innerHTML = '<span>ছবির URL দিন</span>';
  // ফাইল ইনপুট রিসেট
  document.getElementById('f_thumb_file').value = '';
  document.getElementById('f_video_file').value = '';
  const tn = document.getElementById('thumbFileName');
  const vn = document.getElementById('videoFileName');
  tn.style.display = 'none'; tn.textContent = '';
  vn.style.display = 'none'; vn.textContent = '';
}

function scrollToUploadForm() {
  resetForm();
  document.getElementById('uploadFormCard').scrollIntoView({ behavior: 'smooth' });
}

function editVideo(id) {
  const v = getVideos().find(x => x.id === id);
  if (!v) return;
  editingId = id;
  document.getElementById('uploadFormTitle').textContent = '✏️ ভিডিও এডিট করুন';
  document.getElementById('f_title').value = v.title || '';
  document.getElementById('f_desc').value = v.description || '';
  document.getElementById('f_thumb').value = v.thumbnail || '';
  document.getElementById('f_video').value = v.videoUrl || '';
  document.getElementById('f_cat').value = v.category || 'anime';
  document.getElementById('f_lang').value = v.language || '';
  document.getElementById('f_dur').value = v.duration || '';
  document.getElementById('f_year').value = v.year || '';
  document.getElementById('f_new').checked = !!v.isNew;
  document.getElementById('f_trend').checked = !!v.isTrending;
  if (v.rating) setRating(v.rating);
  prevThumb();
  document.getElementById('uploadFormCard').scrollIntoView({ behavior: 'smooth' });
}

function saveVideo() {
  const title = document.getElementById('f_title').value.trim();
  const thumb = document.getElementById('f_thumb').value.trim();
  if (!title) { showToast('❌ টাইটেল দিতে হবে!'); return; }
  if (!thumb) { showToast('❌ থাম্বনেইল URL দিতে হবে!'); return; }

  const videos = getVideos();
  const data = {
    title,
    description: document.getElementById('f_desc').value.trim(),
    thumbnail: thumb,
    videoUrl: document.getElementById('f_video').value.trim(),
    category: document.getElementById('f_cat').value,
    language: document.getElementById('f_lang').value.trim(),
    duration: document.getElementById('f_dur').value.trim(),
    year: document.getElementById('f_year').value.trim(),
    rating: currentRating || 0,
    isNew: document.getElementById('f_new').checked,
    isTrending: document.getElementById('f_trend').checked,
    views: 0,
  };

  if (editingId) {
    const idx = videos.findIndex(v => v.id === editingId);
    if (idx !== -1) {
      videos[idx] = { ...videos[idx], ...data };
      saveVideos(videos);
      showToast('✅ ভিডিও সফলভাবে আপডেট হয়েছে!');
    }
  } else {
    data.id = nextId();
    data.createdAt = Date.now();
    videos.unshift(data);
    saveVideos(videos);
    showToast('✅ নতুন ভিডিও সফলভাবে যোগ হয়েছে!');
  }

  resetForm();
  renderAdmin();
}

function deleteVideo(id) {
  if (!confirm('আপনি কি সত্যিই এই ভিডিওটি মুছতে চান?')) return;
  let videos = getVideos().filter(v => v.id !== id);
  saveVideos(videos);
  showToast('🗑️ ভিডিও মুছে ফেলা হয়েছে।');
  renderAdmin();
}

/* =====================
   TOAST
===================== */
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

/* =====================
   INIT
===================== */
renderHome();
