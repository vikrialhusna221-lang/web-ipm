// ══════════════════════════════════════════════════════════
//  SUPABASE CONFIGURATION
//  Ganti SUPABASE_URL dan SUPABASE_KEY dengan milik kamu!
//  Dapatkan dari: Supabase Dashboard → Project Settings → API
// ══════════════════════════════════════════════════════════
const SUPABASE_URL = 'https://sbipkblxezdrkmsnlwol.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNiaXBrYmx4ZXpkcmttc25sd29sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5ODgzMDIsImV4cCI6MjA4NzU2NDMwMn0.eJQgQnMST3EeXtvMEPSANuCtgIpWbByVyTsHqGCLsrw';

// ── CLOUDINARY CONFIG (untuk upload gambar) ──
// Cloud Name dan Upload Preset dikonfigurasi di fungsi uploadToImgBB (bawah)

const SB_HEADERS = {
  'apikey': SUPABASE_KEY,
  'Authorization': `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json',
  'Prefer': 'return=representation'
};

// ── SUPABASE HELPER FUNCTIONS dengan LOGGING DETAIL ──
async function sbFetch(table, options = {}) {
  const { filter = '', order = 'id.desc' } = options;
  const url = `${SUPABASE_URL}/rest/v1/${table}?order=${order}${filter ? '&' + filter : ''}`;
  console.log(`📡 [FETCH] ${table}`, { url, filter, order });
  try {
    const res = await fetch(url, { headers: SB_HEADERS });
    const data = await res.json();
    if (!res.ok) {
      console.error(`❌ [FETCH ERROR] ${table}:`, { status: res.status, error: data });
      throw new Error(`Gagal fetch ${table}: ${res.status} - ${JSON.stringify(data)}`);
    }
    console.log(`✅ [FETCH SUCCESS] ${table}:`, { count: data.length, data });
    return data;
  } catch (err) {
    console.error(`❌ [FETCH EXCEPTION] ${table}:`, err.message);
    throw err;
  }
}

async function sbInsert(table, data) {
  console.log(`📡 [INSERT] ${table}`, { data });
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
      method: 'POST',
      headers: SB_HEADERS,
      body: JSON.stringify(data)
    });
    const responseData = await res.json();
    if (!res.ok) {
      console.error(`❌ [INSERT ERROR] ${table}:`, { status: res.status, error: responseData });
      throw new Error(`Gagal insert ke ${table}: ${res.status} - ${JSON.stringify(responseData)}`);
    }
    console.log(`✅ [INSERT SUCCESS] ${table}:`, responseData);
    return responseData;
  } catch (err) {
    console.error(`❌ [INSERT EXCEPTION] ${table}:`, err.message);
    throw err;
  }
}

async function sbUpdate(table, id, data) {
  console.log(`📡 [UPDATE] ${table}?id=eq.${id}`, { data });
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${id}`, {
      method: 'PATCH',
      headers: SB_HEADERS,
      body: JSON.stringify(data)
    });
    const responseData = await res.json();
    if (!res.ok) {
      console.error(`❌ [UPDATE ERROR] ${table}:`, { status: res.status, id, error: responseData });
      throw new Error(`Gagal update ${table}: ${res.status} - ${JSON.stringify(responseData)}`);
    }
    console.log(`✅ [UPDATE SUCCESS] ${table}:`, responseData);
    return responseData;
  } catch (err) {
    console.error(`❌ [UPDATE EXCEPTION] ${table}:`, err.message);
    throw err;
  }
}

async function sbDelete(table, id) {
  console.log(`📡 [DELETE] ${table}?id=eq.${id}`);
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${id}`, {
      method: 'DELETE',
      headers: SB_HEADERS
    });
    if (!res.ok) {
      const error = await res.text();
      console.error(`❌ [DELETE ERROR] ${table}:`, { status: res.status, id, error });
      throw new Error(`Gagal hapus dari ${table}: ${res.status} - ${error}`);
    }
    console.log(`✅ [DELETE SUCCESS] ${table}: id=${id}`);
    return true;
  } catch (err) {
    console.error(`❌ [DELETE EXCEPTION] ${table}:`, err.message);
    throw err;
  }
}

// ── AUTH (tetap pakai data lokal untuk keamanan) ──
const MOCK_USERS = [
  { email: 'vikri al husna', password: '56964321', name: 'Vikri Al Husna', role: 'admin' },
  { email: 'windi antika', password: 'ilovepip', name: 'Windi Antika', role: 'admin' },
  { email: 'deva lia fajria', password: 'ilovepip', name: 'Deva Lia Fajria', role: 'admin' },
  { email: 'khanza zabirah', password: 'ilovepip', name: 'Khanza Zabirah', role: 'admin' },
  { email: 'andika zuhriyanto', password: 'ilovepip', name: 'Andika Zuhriyanto', role: 'admin' },
  { email: 'zahra khuzaifah', password: 'ilovepip', name: 'Zahra Khuzaifah', role: 'admin' }
];

const MOCK_MEMBERS = [
  { username: 'hafis alfatrah', password: 'smamuhi', name: 'Hafis Alfatrah' },
  { username: 'vikri al husna', password: '56964321', name: 'vikri al husna' },
  { username: 'romi nazarrudin', password: 'smamuhi', name: 'Romi Nazarrudin' },
  { username: 'fahmi arifuddin herliyanto', password: 'smamuhi', name: 'Fahmi Arifuddin Herliyanto' },
  { username: 'zahwa alya aneira', password: 'smamuhi', name: 'Zahwa Alya Aneira' },
  { username: 'afifah zahra indriyani', password: 'smamuhi', name: 'Afifah Zahra Indriyani' },
  { username: 'zharotu fitri', password: 'smamuhi', name: 'Zharotu Fitri' },
  { username: 'merryn berlian isnaini', password: 'smamuhi', name: 'Merryn Berlian Isnaini' },
  { username: 'nabila zaskiya chandra', password: 'smamuhi', name: 'Nabila Zaskiya Chandra' },
  { username: 'azizah hanifah ulhak', password: 'smamuhi', name: 'Azizah Hanifah Ulhak' },
  { username: 'zahra khuzaifah', password: 'smamuhi', name: 'Zahra Khuzaifah' },
  { username: 'sinta bella rahma dini', password: 'smamuhi', name: 'Sinta Bella Rahma Dini' },
  { username: 'nur fatihah', password: 'smamuhi', name: 'Nur Fatihah' },
  { username: 'naifa kinasih', password: 'smamuhi', name: 'Naifa Kinasih' },
  { username: 'esa putri almadina', password: 'smamuhi', name: 'Esa Putri Almadina' },
  { username: 'dzaki tristan aji', password: 'smamuhi', name: 'Dzaki Tristan Aji' },
  { username: 'tia eka yuniarsih', password: 'smamuhi', name: 'Tia Eka Yuniarsih' },
  { username: 'kalica nazwa safitri', password: 'smamuhi', name: 'Kalica Nazwa Safitri' },
  { username: 'clara wahyuning tyas', password: 'smamuhi', name: 'Clara Wahyuning Tyas' },
  { username: 'nasywa diva zahra', password: 'smamuhi', name: 'Nasywa Diva Zahra' },
  { username: 'nadhira arthalitha rasyid', password: 'smamuhi', name: 'Nadhira Arthalitha Rasyid' },
  { username: 'qurota ayun permata ningrum', password: 'smamuhi', name: 'Qurota Ayun Permata Ningrum' },
  { username: 'muhammad galang putra', password: 'smamuhi', name: 'Muhammad Galang Putra' },
  { username: 'rayhan firadaus putra', password: 'smamuhi', name: 'Rayhan Firadaus Putra' },
  { username: 'annisa azmi fatonah', password: 'smamuhi', name: 'Annisa Azmi Fatonah' },
  { username: 'windi antika', password: 'smamuhi', name: 'Windi Antika' },
  { username: 'deva lia fajria', password: 'smamuhi', name: 'Deva Lia Fajria' },
  { username: 'khanza zabirah', password: 'smamuhi', name: 'Khanza Zabirah' },
  { username: 'andika zuhriyanto', password: 'smamuhi', name: 'Andika Zuhriyanto' },
  { username: 'rizki vetra alfarezi', password: 'smamuhi', name: 'Rizki Vetra Alfarezi' },
  { username: 'silviana putri', password: 'smamuhi', name: 'Silviana Putri' },
  { username: 'eka sri utami', password: 'smamuhi', name: 'Eka Sri Utami' },
  { username: 'jesika nafin', password: 'smamuhi', name: 'Jesika Nafin' },
  { username: 'putri raisa nabila', password: 'smamuhi', name: 'Putri Raisa Nabila' },
  { username: 'dinda cantika putri', password: 'smamuhi', name: 'Dinda Cantika Putri' },
  { username: 'fitria rahma septika', password: 'smamuhi', name: 'Fitria Rahma Septika' },
  { username: 'vatikah nurul utami', password: 'smamuhi', name: 'Vatikah Nurul Utami' },
  { username: 'azkia ikrimatuuz zahra', password: 'smamuhi', name: 'Azkia Ikrimatuuz Zahra' },
  { username: 'shanaz nadya safwa', password: 'smamuhi', name: 'Shanaz Nadya Safwa' },
  { username: 'salwa aqilah putri', password: 'smamuhi', name: 'Salwa Aqilah Putri' },
  { username: 'azzahra nur rohma', password: 'smamuhi', name: 'Azzahra Nur Rohma' },
  { username: 'fiona inka safitri', password: 'smamuhi', name: 'Fiona Inka Safitri' },
  { username: 'rasya khoirunnisa', password: 'smamuhi', name: 'Rasya Khoirunnisa' },
  { username: 'talitha nur azizah', password: 'smamuhi', name: 'Talitha Nur Azizah' },
];

let state = {
  isLoggedIn: false,
  currentView: 'public',
  currentPage: 'home',
  newsPage: 1,
  newsPerPage: 6,
  pendingDelete: null,
  pendingDeleteType: null,
  news: [],
  achievements: [],
  events: [],
  programs: [],
  members: [],
  dokumentasi: [],
  edukasi: [],
  calendarEvents: [],
  bidang_data: [],
  // Calendar state
  calendarMonth: new Date().getMonth(),
  calendarYear: new Date().getFullYear()
};

// ── LOAD DATA FROM SUPABASE ON STARTUP ──
async function loadAllData() {
  showLoadingOverlay(true);
  try {
    console.log('📥 Mengambil data dari Supabase...');
    const [news, achievements, events, programs, members, dokumentasi, edukasi, organizationInfo] = await Promise.all([
      sbFetch('news').catch(e => { console.warn('⚠️ Gagal load news:', e); return []; }),
      sbFetch('achievements').catch(e => { console.warn('⚠️ Gagal load achievements:', e); return []; }),
      sbFetch('events', { order: 'date.asc' }).catch(e => { console.warn('⚠️ Gagal load events:', e); return []; }),
      sbFetch('programs').catch(e => { console.warn('⚠️ Gagal load programs:', e); return []; }),
      sbFetch('members').catch(e => { console.warn('⚠️ Gagal load members:', e); return []; }),
      sbFetch('dokumentasi').catch(e => { console.warn('⚠️ Gagal load dokumentasi:', e); return []; }),
      sbFetch('edukasi').catch(e => { console.warn('⚠️ Gagal load edukasi:', e); return []; }),
      sbFetch('organization_info').catch(e => { console.warn('⚠️ Gagal load organization_info:', e); return []; })
    ]);
    
    console.log('📰 Raw news data:', JSON.stringify(news, null, 2));
    console.log('🏆 Raw achievements data:', JSON.stringify(achievements, null, 2));
    console.log('👥 Raw members data:', JSON.stringify(members, null, 2));
    
    state.news         = news         || [];
    state.achievements = achievements || [];
    state.events       = events       || [];
    state.programs     = programs     || [];
    state.dokumentasi  = dokumentasi  || [];
    state.edukasi          = edukasi          || [];
    state.organizationInfo = organizationInfo || [];
    
    // Load calendar events dari localStorage
    const calendarEvents = JSON.parse(localStorage.getItem('calendarEvents') || '[]');
    const backupEvents = JSON.parse(localStorage.getItem('backupEvents') || '[]');
    
    // Load backup data jika ada
    const backupNews = JSON.parse(localStorage.getItem('backupNews') || '[]');
    const backupAch = JSON.parse(localStorage.getItem('backupAchievements') || '[]');
    if (backupNews.length > 0) {
      console.log('💾 Merging backup news...');
      state.news = [...state.news, ...backupNews.filter(bn => !state.news.some(n => n.id === bn.id))];
    }
    if (backupAch.length > 0) {
      console.log('💾 Merging backup achievements...');
      state.achievements = [...state.achievements, ...backupAch.filter(ba => !state.achievements.some(a => a.id === ba.id))];
    }
    if (backupEvents.length > 0) {
      console.log('💾 Merging backup events...');
      state.events = [...state.events, ...backupEvents.filter(be => !state.events.some(e => e.id === be.id))];
    }
    
    // Merge dari calendarEvents (tambahan dari localStorage)
    if (calendarEvents.length > 0) {
      console.log('💾 Merging calendar events dari localStorage...');
      state.events = [...state.events, ...calendarEvents.filter(ce => !state.events.some(e => e.id === ce.id))];
    }
    state.calendarEvents = calendarEvents;
    console.log('📅 Total events:', state.events.length);
    
    // Sinkronisasi members dari Supabase ke localStorage
    if (members && members.length > 0) {
      console.log('💾 Menyinkronisasi members dari Supabase...');
      localStorage.setItem('members', JSON.stringify(members));
    }
    
    // Sinkronisasi dokumentasi ke localStorage
    if (dokumentasi && dokumentasi.length > 0) {
      console.log('💾 Menyinkronisasi dokumentasi dari Supabase...');
      localStorage.setItem('backupDokumentasi', JSON.stringify(dokumentasi));
    }
    
    // Sinkronisasi edukasi ke localStorage
    if (edukasi && edukasi.length > 0) {
      console.log('💾 Menyinkronisasi edukasi dari Supabase...');
      localStorage.setItem('backupEdukasi', JSON.stringify(edukasi));
    }
    
    console.log('✅ State news:', state.news);
    console.log('✅ State achievements:', state.achievements);
    console.log('✅ State events:', state.events);
    console.log('✅ State dokumentasi:', state.dokumentasi);
    console.log('✅ State edukasi:', state.edukasi);
    console.log('✅ Members sudah disinkronisasi');
    
    renderHome();
    loadPublicDokumentasi();
    console.log('✅ Semua data berhasil dimuat dari Supabase & localStorage');
  } catch (err) {
    console.error('❌ Gagal memuat data dari Supabase:', err);
    showToast('⚠️ Data akan menggunakan cache lokal. Periksa koneksi internet atau konfigurasi Supabase.', 'warning');
  } finally {
    showLoadingOverlay(false);
  }
}

let loadingOverlayTimeout = null;

function showLoadingOverlay(show) {
  // Clear any existing timeout
  if (loadingOverlayTimeout) {
    clearTimeout(loadingOverlayTimeout);
    loadingOverlayTimeout = null;
  }

  let overlay = document.getElementById('loading-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'loading-overlay';
    overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(255,255,255,0.85);z-index:9999;display:none;align-items:center;justify-content:center;flex-direction:column;gap:1rem;backdrop-filter:blur(4px);pointer-events:auto;';
    overlay.innerHTML = '<div style="width:50px;height:50px;border:4px solid rgba(0,128,0,0.2);border-top-color:#008000;border-radius:50%;animation:spin 1s linear infinite;"></div><p style="color:#008000;font-weight:600;font-size:1rem;">Memuat data...</p><style>@keyframes spin{to{transform:rotate(360deg)}}</style>';
    document.body.appendChild(overlay);
  }
  
  if (show) {
    overlay.style.display = 'flex';
    // Force hide overlay after 15 seconds as a safety mechanism
    loadingOverlayTimeout = setTimeout(() => {
      console.warn('⚠️ Loading overlay timeout - forcing it to hide');
      overlay.style.display = 'none';
    }, 15000);
  } else {
    overlay.style.display = 'none';
  }
}

// ── MOBILE MENU TOGGLE ──
function toggleMobileMenu() {
  const navLinks = document.getElementById('nav-links');
  const navToggle = document.getElementById('nav-toggle');
  navLinks.classList.toggle('active');
  navToggle.classList.toggle('active');
}

function closeMobileMenu() {
  const navLinks = document.getElementById('nav-links');
  const navToggle = document.getElementById('nav-toggle');
  navLinks.classList.remove('active');
  navToggle.classList.remove('active');
}

// Close menu when clicking outside
document.addEventListener('click', function(e) {
  const navbar = document.querySelector('.navbar');
  if (!navbar.contains(e.target)) {
    closeMobileMenu();
  }
});

// ── NAVIGATION ──
function showPage(page) {
  console.log('🔀 showPage() called with page:', page);
  
  if (page === 'login') {
    console.log('→ Navigating to login page');
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    const loginPage = document.getElementById('page-login');
    if (loginPage) loginPage.classList.add('active');
    else console.error('❌ page-login element not found');
    return;
  }
  
  if (page === 'admin') {
    if (!state.isLoggedIn) { showPage('login'); return; }
    console.log('→ Navigating to admin dashboard');
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById('admin-dashboard').classList.add('active');
    refreshAdminData();
    return;
  }
  
  if (page === 'member-dashboard') {
    console.log('→ Navigating to member dashboard');
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById('member-dashboard').classList.add('active');
    return;
  }

  console.log('→ Navigating to public page:', page);
  // Remove active from all views
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  
  // Add active back to public-site
  const publicSite = document.getElementById('public-site');
  if (publicSite) {
    publicSite.classList.add('active');
    console.log('✓ public-site activated');
  } else {
    console.error('❌ public-site element not found');
  }

  // Hide all page divs
  document.querySelectorAll('[id^="page-"]').forEach(p => p.classList.remove('active'));
  
  // Show target page
  const target = document.getElementById('page-' + page);
  if (target) {
    target.classList.add('active');
    console.log('✓ page-' + page + ' activated');
  } else {
    console.error('❌ page-' + page + ' element not found');
  }

  // Update nav highlight
  document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
  const navEl = document.getElementById('nav-' + page);
  if (navEl) {
    navEl.classList.add('active');
    console.log('✓ nav-' + page + ' highlighted');
  }

  closeMobileMenu();
  state.currentPage = page;

  // Render content
  if (page === 'home') renderHome();
  if (page === 'news') renderNewsList();
  if (page === 'achievements') renderAchievements();
  if (page === 'dokumentasi') loadPublicDokumentasi();
  if (page === 'kalender') renderPublicCalendar();

  window.scrollTo({ top: 0, behavior: 'smooth' });
  console.log('✅ Navigation complete!');
}

function showNewsDetail(id, event) {
  if (event) {
    event.stopPropagation();
    event.preventDefault();
  }
  
  console.log('📰 Showing news detail for ID:', id);
  const n = state.news.find(x => x.id === id);
  if (!n) {
    console.error('❌ Berita dengan ID', id, 'tidak ditemukan');
    return;
  }
  
  console.log('📰 News data:', n);
  console.log('📰 News image_url:', n.image_url);
  
  document.getElementById('detail-title').textContent = n.title;
  document.getElementById('detail-meta').textContent = '📅 ' + formatDate(n.created_at);
  const detailImg = document.getElementById('detail-img');
  
  if (n.image_url && n.image_url.startsWith('http')) {
    console.log('✅ Loading image from URL:', n.image_url);
    detailImg.innerHTML = `<img src="${n.image_url}" alt="Foto berita" style="width:100%;height:auto;border-radius:12px;" onerror="console.error('❌ Gagal load image:', this.src); this.parentElement.innerHTML='<div style=\\'display:flex;align-items:center;justify-content:center;height:360px;font-size:4rem;\\'> 📰</div>'">`;
  } else {
    console.log('⚠️ Image is emoji or empty:', n.image_url);
    detailImg.innerHTML = n.image_url || '📰';
  }
  
  document.getElementById('detail-body').innerHTML = n.content.split('\n\n').map(p => `<p>${p}</p>`).join('');
  document.querySelectorAll('[id^="page-"]').forEach(p => p.classList.remove('active'));
  document.getElementById('page-news-detail').classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── RENDER HELPERS ──
function formatDate(d) {
  return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}

function renderHome() {
  console.log('🏠 Render Home - News data:', state.news);
  console.log('🏠 Render Home - Achievements data:', state.achievements);
  
  // News grid
  const grid = document.getElementById('home-news-grid');
  grid.innerHTML = state.news.slice(0, 3).map(n => {
    console.log('📰 Rendering news card:', n.title, 'Image:', n.image_url);
    return `
    <div class="card" onclick="showNewsDetail(${n.id}, event)" style="cursor: pointer;">
      ${renderImg(n.image_url, "📰")}
      <div class="card-body">
        <div class="card-meta"><span>${formatDate(n.created_at)}</span><span class="tag">Berita</span></div>
        <div class="card-title">${n.title}</div>
        <div class="card-excerpt">${n.content.substring(0, 100)}...</div>
      </div>
    </div>`;
  }).join('');

  // Achievements
  const ag = document.getElementById('home-ach-grid');
  ag.innerHTML = state.achievements.slice(0, 4).map(a => {
    console.log('🏆 Rendering achievement card:', a.title, 'Image:', a.image_url);
    return `
    <div class="ach-card">
      ${renderAchImg(a.image_url, "🏆")}
      <div>
        <div class="ach-year">${a.year}</div>
        <div class="ach-title">${a.title}</div>
        <div class="ach-desc">${a.description}</div>
      </div>
    </div>`;
  }).join('');
}

function renderNewsList() {
  console.log('📰 Render News List - Total news:', state.news.length);
  const start = (state.newsPage - 1) * state.newsPerPage;
  const paginated = state.news.slice(start, start + state.newsPerPage);
  const grid = document.getElementById('news-grid');
  grid.innerHTML = paginated.map(n => {
    console.log('📰 Rendering news item:', n.title, 'Image:', n.image_url);
    return `
    <div class="card" onclick="showNewsDetail(${n.id}, event)" style="cursor: pointer;">
      ${renderImg(n.image_url, "📰")}
      <div class="card-body">
        <div class="card-meta"><span>${formatDate(n.created_at)}</span><span class="tag">Berita</span></div>
        <div class="card-title">${n.title}</div>
        <div class="card-excerpt">${n.content.substring(0, 110)}...
      </div>
    </div>`;
  }).join('');

  // Pagination
  const pages = Math.ceil(state.news.length / state.newsPerPage);
  const pg = document.getElementById('news-pagination');
  pg.innerHTML = Array.from({length: pages}, (_, i) => i+1).map(p =>
    `<button class="page-btn ${p === state.newsPage ? 'active' : ''}" onclick="setNewsPage(${p})">${p}</button>`
  ).join('');
}

function setNewsPage(p) { state.newsPage = p; renderNewsList(); window.scrollTo({top: 200, behavior:'smooth'}); }

function renderAchievements() {
  console.log('🏆 Render Achievements - Total achievements:', state.achievements.length);
  document.getElementById('ach-grid').innerHTML = state.achievements.map(a => {
    console.log('🏆 Rendering achievement:', a.title, 'Image:', a.image_url);
    return `
    <div class="ach-card">
      ${renderAchImg(a.image_url, "🏆")}
      <div>
        <div class="ach-year">${a.year}</div>
        <div class="ach-title">${a.title}</div>
        <div class="ach-desc">${a.description}</div>
      </div>
    </div>`;
  }).join('');
}

// ── INTERACTIVE HELPERS ──
function togglePasswordVisibility(inputId) {
  const input = document.getElementById(inputId);
  const button = event.target.closest('.password-toggle');
  
  if (input.type === 'password') {
    input.type = 'text';
    button.textContent = '🙈';
  } else {
    input.type = 'password';
    button.textContent = '👁️';
  }
}

function setButtonLoading(btn, isLoading) {
  if (isLoading) {
    btn.classList.add('loading');
    btn.disabled = true;
  } else {
    btn.classList.remove('loading');
    btn.disabled = false;
  }
}

function validateForm(inputs) {
  let isValid = true;
  inputs.forEach(input => {
    if (!input.value.trim()) {
      input.style.borderColor = 'var(--danger)';
      input.style.animation = 'shake .3s ease';
      isValid = false;
      setTimeout(() => {
        input.style.borderColor = '';
        input.style.animation = '';
      }, 300);
    }
  });
  return isValid;
}

// ── AUTH ──
// Toggle between Admin and Member login with overlay animation
function toggleLoginMode() {
  const overlayPanel = document.getElementById('overlayPanel');
  const memberForm = document.getElementById('memberForm');
  const adminForm = document.getElementById('adminForm');
  const toggleBtn = document.getElementById('toggleBtn');
  const overlayTitle = document.getElementById('overlayTitle');
  const overlayText = document.getElementById('overlayText');
  const loginForms = document.querySelector('.login-forms');

  // Fade out current content
  overlayTitle.style.opacity = '0';
  overlayText.style.opacity = '0';
  toggleBtn.style.opacity = '0';
  overlayTitle.style.transform = 'scale(0.95)';

  // Slide out current form
  const currentForm = memberForm.style.display === 'flex' ? memberForm : adminForm;
  currentForm.style.opacity = '0.3';
  currentForm.style.transform = 'translateX(-20px)';

  // Wait for animation, then toggle
  setTimeout(() => {
    // Update overlay panel content
    if (memberForm.style.display === 'flex') {
      // Switching to Admin - update overlay to show Anggota info
      overlayTitle.textContent = 'Dashboard Admin';
      overlayText.textContent = 'Kelola konten dan monitor dashboard dengan mudah';
      toggleBtn.textContent = 'Anggota';
    } else {
      // Switching to Member - update overlay to show Admin info
      overlayTitle.textContent = 'Bergabung Sekarang';
      overlayText.textContent = 'Akses konten eksklusif dan fitur komunitas';
      toggleBtn.textContent = 'Admin';
    }

    // Toggle form visibility
    if (memberForm.style.display === 'flex') {
      memberForm.style.display = 'none';
      adminForm.style.display = 'flex';
      adminForm.style.opacity = '0';
      adminForm.style.transform = 'translateX(20px)';
    } else {
      adminForm.style.display = 'none';
      memberForm.style.display = 'flex';
      memberForm.style.opacity = '0';
      memberForm.style.transform = 'translateX(20px)';
    }

    // Fade in new content
    setTimeout(() => {
      overlayTitle.style.opacity = '1';
      overlayTitle.style.transform = 'scale(1)';
      overlayText.style.opacity = '1';
      toggleBtn.style.opacity = '1';
      
      const newForm = memberForm.style.display === 'flex' ? memberForm : adminForm;
      newForm.style.opacity = '1';
      newForm.style.transform = 'translateX(0)';
    }, 50);
  }, 250);

  // Clear form errors
  document.getElementById('member-error').style.display = 'none';
  document.getElementById('admin-error').style.display = 'none';
}

// Member/Anggota login function
function doLoginMember() {
  const usernameInput = document.getElementById('member-nama-login');
  const passInput = document.getElementById('member-pass-login');
  const username = usernameInput.value.trim().toLowerCase();
  const pass = passInput.value.trim();
  const errEl = document.getElementById('member-error');
  const btn = event.target;

  // Validate required fields
  if (!username || !pass) {
    errEl.textContent = '📝 Nama dan Password wajib diisi!';
    errEl.style.display = 'block';
    validateForm([usernameInput, passInput]);
    return;
  }

  // Set loading state
  setButtonLoading(btn, true);
  errEl.style.display = 'none';

  // Simulate network delay
  setTimeout(() => {
    // Check against MOCK_MEMBERS
    const member = MOCK_MEMBERS.find(m => m.username.toLowerCase() === username && m.password === pass);
    
    if (!member) {
      errEl.textContent = '❌ Nama atau Password salah. Silakan coba lagi.';
      errEl.style.display = 'block';
      setButtonLoading(btn, false);
      return;
    }

    errEl.style.display = 'none';
    state.isLoggedIn = true;
    
    // Store member info
    localStorage.setItem('currentMember', JSON.stringify({
      name: member.name,
      username: member.username,
      avatar: member.name.charAt(0).toUpperCase()
    }));
    
    showToast('✨ Selamat datang, ' + member.name + '!', 'success');
    setTimeout(() => showPage('member-dashboard'), 600);
    setButtonLoading(btn, false);
  }, 800);
}

function doLogin() {
  const emailInput = document.getElementById('login-email');
  const passInput = document.getElementById('login-pass');
  const email = emailInput.value.trim();
  const pass = passInput.value.trim();
  const errEl = document.getElementById('admin-error');
  const btn = event.target;

  // Validate required fields
  if (!email || !pass) {
    errEl.textContent = '📝 Username dan Password wajib diisi!';
    errEl.style.display = 'block';
    validateForm([emailInput, passInput]);
    return;
  }

  // Set loading state
  setButtonLoading(btn, true);
  errEl.style.display = 'none';

  // Simulate network delay
  setTimeout(() => {
    const user = MOCK_USERS.find(u => u.email === email && u.password === pass);
    if (!user) {
      errEl.textContent = '❌ Username atau Password salah. Silakan coba lagi.';
      errEl.style.display = 'block';
      setButtonLoading(btn, false);
      return;
    }
    errEl.style.display = 'none';
    state.isLoggedIn = true;
    showToast('✨ Selamat datang, ' + user.name + '!', 'success');
    setTimeout(() => showPage('admin'), 600);
    setButtonLoading(btn, false);
  }, 800);
}

function doLogout() {
  state.isLoggedIn = false;
  showToast('Anda telah logout.', 'success');
  showPage('home');
}

// ── ADMIN PANEL SWITCH ──
function switchPanel(name, el) {
  document.querySelectorAll('.admin-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
  document.getElementById('panel-' + name).classList.add('active');
  el.classList.add('active');
  const titles = { 'dashboard': 'Dashboard', 'news-admin': 'Kelola Berita', 'ach-admin': 'Kelola Prestasi', 'calendar-admin': 'Kalender Acara', 'member-bidang': 'Bidang Anggota' };
  document.getElementById('topbar-title').textContent = titles[name] || name;
  if (name === 'news-admin') renderAdminNews();
  if (name === 'ach-admin') renderAdminAch();
  if (name === 'calendar-admin') renderAdminCalendar();
  if (name === 'member-bidang') renderAdminMemberBidang();
  if (name === 'dashboard') refreshAdminData();
}

function refreshAdminData() {
  document.getElementById('stat-news').textContent = state.news.length;
  document.getElementById('stat-ach').textContent = state.achievements.length;
  const tbody = document.querySelector('#dash-news-table tbody');
  tbody.innerHTML = state.news.slice(0, 5).map(n => `
    <tr><td><div class="td-title">${n.title}</div></td>
    <td style="color:var(--muted)">${formatDate(n.created_at)}</td>
    <td><span class="status-badge badge-green">Terbit</span></td></tr>`).join('');
}

function renderAdminNews() {
  const tbody = document.querySelector('#news-admin-table tbody');
  tbody.innerHTML = state.news.map(n => `
    <tr>
      <td>${renderThumb(n.image_url, "📰")}</td>
      <td><div class="td-title">${n.title}</div><div class="td-sub">${formatDate(n.created_at)}</div></td>
      <td style="color:var(--muted);font-size:.82rem">${formatDate(n.created_at)}</td>
      <td><span class="status-badge badge-green">Terbit</span></td>
      <td><div class="action-btns">
        <button class="btn-icon edit" title="Edit" onclick="openNewsModal(${n.id})">✏️</button>
        <button class="btn-icon delete" title="Hapus" onclick="openDelete('news',${n.id},'${n.title.replace(/'/g,"\\'")}')">🗑️</button>
      </div></td>
    </tr>`).join('');
}

function renderAdminAch() {
  const tbody = document.querySelector('#ach-admin-table tbody');
  tbody.innerHTML = state.achievements.map(a => `
    <tr>
      <td>${renderThumb(a.image_url, "🏆")}</td>
      <td><div class="td-title">${a.title}</div></td>
      <td style="font-family:'DM Mono',monospace;font-size:.82rem">${a.year}</td>
      <td style="color:var(--muted);font-size:.82rem;max-width:240px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${a.description}</td>
      <td><div class="action-btns">
        <button class="btn-icon edit" title="Edit" onclick="openAchModal(${a.id})">✏️</button>
        <button class="btn-icon delete" title="Hapus" onclick="openDelete('ach',${a.id},'${a.title.replace(/'/g,"\\'")}')">🗑️</button>
      </div></td>
    </tr>`).join('');
}

// Render Admin Member Bidang (Read-only view of member data)
function renderAdminMemberBidang() {
  const container = document.getElementById('admin-member-bidang-content');
  container.innerHTML = `
    <div style="display:grid; gap:2rem;">
      ${state.bidang_data.map(bidang => `
        <div style="background:var(--white); border:1.5px solid rgba(0,128,0,0.08); border-radius:12px; padding:2rem; transition:all .3s;">
          <h3 style="font-size:1.3rem; color:var(--gold); margin-bottom:1rem; display:flex; align-items:center; gap:0.5rem;">
            <span>${bidang.icon}</span> ${bidang.name}
          </h3>
          <p style="color:var(--muted); margin-bottom:1.5rem; line-height:1.6;">${bidang.description}</p>
          
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:1rem; margin-bottom:1.5rem;">
            <div style="background:rgba(0,128,0,0.08); padding:1rem; border-radius:8px; border-left:3px solid var(--gold);">
              <div style="font-size:.85rem; color:var(--muted); font-weight:600; margin-bottom:.5rem;">Ketua Bidang</div>
              <p style="margin:0; font-weight:700; color:var(--text);">${bidang.leader}</p>
            </div>
            <div style="background:rgba(0,128,0,0.08); padding:1rem; border-radius:8px; border-left:3px solid var(--gold);">
              <div style="font-size:.85rem; color:var(--muted); font-weight:600; margin-bottom:.5rem;">Sekretaris</div>
              <p style="margin:0; font-weight:700; color:var(--text);">${bidang.secretary}</p>
            </div>
            <div style="background:rgba(0,128,0,0.08); padding:1rem; border-radius:8px; border-left:3px solid var(--gold);">
              <div style="font-size:.85rem; color:var(--muted); font-weight:600; margin-bottom:.5rem;">Jumlah Anggota</div>
              <p style="margin:0; font-weight:700; color:var(--text);">${bidang.members.length} orang</p>
            </div>
          </div>
          
          <div style="background:rgba(255,255,0,0.08); padding:1rem; border-radius:8px;">
            <div style="font-size:.9rem; color:var(--muted); font-weight:600; margin-bottom:.75rem;">👥 Anggota Bidang:</div>
            <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(180px, 1fr)); gap:0.75rem;">
              ${bidang.members.map(member => `
                <div style="background:var(--white); padding:.75rem; border-radius:6px; border:1px solid rgba(0,128,0,0.12); font-size:.9rem; color:var(--text); text-align:center;">
                  ${member}
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

// ── CRUD NEWS ──
function openNewsModal(id) {
  const modal = document.getElementById('modal-news');
  if (id) {
    const n = state.news.find(x => x.id === id);
    if (!n) { showToast('Berita tidak ditemukan.', 'error'); return; }
    document.getElementById('news-modal-title').textContent = 'Edit Berita';
    document.getElementById('news-edit-id').value = id;
    document.getElementById('news-form-title').value = n.title;
    document.getElementById('news-form-content').value = n.content;
  } else {
    document.getElementById('news-modal-title').textContent = 'Tambah Berita';
    document.getElementById('news-edit-id').value = '';
    document.getElementById('news-form-title').value = '';
    document.getElementById('news-form-content').value = '';
    document.getElementById('news-img-preview').style.display = 'none';
    document.getElementById('news-img-input').value = '';
  }
  modal.classList.add('open');
}

// ── CLOUDINARY UPLOAD ──
const CLOUDINARY_CLOUD_NAME = 'dzkez0hsc';
const CLOUDINARY_UPLOAD_PRESET = 'ipm,uploud';

async function uploadToImgBB(file) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  
  console.log('📤 Mengunggah file ke Cloudinary:', file.name, 'Ukuran:', file.size, 'bytes');
  console.log('☁️ Menggunakan Cloud Name:', CLOUDINARY_CLOUD_NAME, '| Preset:', CLOUDINARY_UPLOAD_PRESET);
  
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: formData
  });
  
  const data = await res.json();
  console.log('📨 Raw Response dari Cloudinary:', JSON.stringify(data, null, 2));
  
  if (data.error) {
    console.error('❌ Cloudinary Error:', data.error);
    throw new Error('Upload Cloudinary gagal: ' + (data.error?.message || 'Unknown error'));
  }
  
  const imageUrl = data.secure_url;
  
  if (!imageUrl) {
    console.error('❌ Tidak ada URL dalam response Cloudinary:', JSON.stringify(data, null, 2));
    throw new Error('Cloudinary tidak mengembalikan URL gambar');
  }
  
  console.log('✅ URL gambar Cloudinary berhasil didapat:', imageUrl);
  console.log('📊 Full Cloudinary data:', JSON.stringify(data, null, 2));
  
  return imageUrl;
}

// ── IMAGE RENDER HELPERS ──
function renderImg(src, fallback) {
  console.log('🖼️ renderImg called with:', { src, fallback, type: typeof src, startsWith_http: src?.startsWith('http') });
  
  if (src && typeof src === 'string' && src.startsWith('http')) {
    console.log('✅ Valid URL detected, creating img tag with src:', src);
    return `<div class="card-img"><img src="${src}" alt="Foto berita" style="width:100%;height:100%;object-fit:cover;" onerror="console.error('❌ Gagal load image, src was:', '${src}'); this.parentElement.innerHTML='<div style=\\'display:flex;align-items:center;justify-content:center;height:100%;font-size:2rem;\\'>${fallback}</div>'"></div>`;
  }
  
  console.log('⚠️ Not a valid HTTP URL, using fallback:', fallback);
  return `<div class="card-img">${src || fallback}</div>`;
}

function renderAchImg(src, fallback) {
  console.log('🏆 renderAchImg called with:', { src, fallback, type: typeof src, startsWith_http: src?.startsWith('http') });
  
  if (src && typeof src === 'string' && src.startsWith('http')) {
    console.log('✅ Valid URL detected for achievement, creating img tag with src:', src);
    return `<img src="${src}" style="width:60px;height:60px;object-fit:cover;border-radius:10px;flex-shrink:0;" onerror="console.error('❌ Gagal load achievement image, src was:', '${src}'); this.outerHTML='<div style=\\'width:60px;height:60px;background:linear-gradient(135deg, var(--gold-light) 0%, #FFFF00 100%);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:2rem;\\'>${fallback}</div>'">`;
  }
  
  console.log('⚠️ Not a valid HTTP URL for achievement, using fallback:', fallback);
  return `<div class="ach-icon">${src || fallback}</div>`;
}

function renderThumb(src, fallback) {
  console.log('📸 renderThumb called with:', { src, fallback, type: typeof src, startsWith_http: src?.startsWith('http') });
  
  if (src && typeof src === 'string' && src.startsWith('http')) {
    console.log('✅ Valid URL detected for thumb, creating img tag with src:', src);
    return `<img src="${src}" style="width:44px;height:44px;object-fit:cover;border-radius:8px;" onerror="console.error('❌ Gagal load thumbnail, src was:', '${src}'); this.outerHTML='<div style=\\'width:44px;height:44px;background:linear-gradient(135deg, var(--gold), var(--gold-light));border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:0.9rem;font-weight:700;color:#000;\\'>${fallback}</div>'">`;
  }
  
  console.log('⚠️ Not a valid HTTP URL for thumb, using fallback:', fallback);
  return `<div class="td-img">${src || fallback}</div>`;
}

async function saveNews() {
  const title = document.getElementById('news-form-title').value.trim();
  const content = document.getElementById('news-form-content').value.trim();
  if (!title || !content) { showToast('Judul dan konten wajib diisi.', 'error'); return; }
  
  const editId = document.getElementById('news-edit-id').value;
  const btn = document.querySelector('#modal-news .btn-primary');
  const fileInput = document.getElementById('news-img-input');
  const file = fileInput.files[0];
  
  if (btn) setButtonLoading(btn, true);
  try {
    let imageUrl = null;
    
    // Jika ada file baru, upload ke Cloudinary
    if (file) {
      showToast('⏳ Mengupload gambar ke server...', 'info');
      try {
        imageUrl = await uploadToImgBB(file);
        showToast('✅ Gambar berhasil diupload!', 'success');
      } catch (uploadErr) {
        console.error('Upload error:', uploadErr);
        showToast('⚠️ Gagal upload gambar, tapi berita tetap bisa disimpan tanpa gambar.', 'warning');
      }
    }
    
    const newsData = { 
      title, 
      content, 
      image_url: imageUrl || '📰',
      created_at: new Date().toISOString() 
    };
    
    if (editId) {
      // ✅ EDIT MODE: WAJIB SYNC KE SUPABASE
      console.log('📝 [UPDATE] news ID', editId, 'to Supabase:', newsData);
      const updated = await sbUpdate('news', +editId, newsData);
      console.log('✅ [UPDATE SUCCESS]:', updated);
      
      // Update state
      state.news = await sbFetch('news');
      
      // Backup to localStorage
      localStorage.setItem('backupNews', JSON.stringify(state.news));
      console.log('💾 News updated & backed up to localStorage');
      
      showToast('✅ Berita berhasil diperbarui & tersimpan di Supabase!', 'success');
      
    } else {
      // ✅ ADD MODE: WAJIB SYNC KE SUPABASE
      console.log('📡 [INSERT] news to Supabase:', newsData);
      const inserted = await sbInsert('news', newsData);
      console.log('✅ [INSERT SUCCESS]:', inserted);
      
      // Update state with fresh data from Supabase
      state.news = await sbFetch('news');
      
      // Backup to localStorage
      localStorage.setItem('backupNews', JSON.stringify(state.news));
      console.log('💾 News added & backed up to localStorage');
      
      showToast('✅ Berita berhasil ditambahkan & tersimpan di Supabase!', 'success');
    }
    
    fileInput.value = '';
    document.getElementById('news-img-preview').style.display = 'none';
    closeModal('modal-news');
    renderAdminNews();
    renderHome();
    refreshAdminData();
    
  } catch (err) {
    console.error('❌ [ERROR] Gagal menyimpan berita:', err);
    showToast('❌ GAGAL MENYIMPAN: ' + (err.message || 'Periksa koneksi & Supabase key'), 'error');
  } finally {
    if (btn) setButtonLoading(btn, false);
  }
}

// ── CRUD ACHIEVEMENTS ──
function openAchModal(id) {
  if (id) {
    const a = state.achievements.find(x => x.id === id);
    if (!a) { showToast('Prestasi tidak ditemukan.', 'error'); return; }
    document.getElementById('ach-modal-title').textContent = 'Edit Prestasi';
    document.getElementById('ach-edit-id').value = id;
    document.getElementById('ach-form-title').value = a.title;
    document.getElementById('ach-form-desc').value = a.description;
    document.getElementById('ach-form-year').value = a.year;
  } else {
    document.getElementById('ach-modal-title').textContent = 'Tambah Prestasi';
    document.getElementById('ach-edit-id').value = '';
    document.getElementById('ach-form-title').value = '';
    document.getElementById('ach-form-desc').value = '';
    document.getElementById('ach-form-year').value = new Date().getFullYear();
    document.getElementById('ach-img-preview').style.display = 'none';
    document.getElementById('ach-img-input').value = '';
  }
  document.getElementById('modal-ach').classList.add('open');
}

async function saveAch() {
  const title = document.getElementById('ach-form-title').value.trim();
  const desc = document.getElementById('ach-form-desc').value.trim();
  const year = +document.getElementById('ach-form-year').value;
  if (!title || !desc || !year) { showToast('Semua field wajib diisi.', 'error'); return; }
  
  const editId = document.getElementById('ach-edit-id').value;
  const btn = document.querySelector('#modal-ach .btn-primary');
  const fileInput = document.getElementById('ach-img-input');
  const file = fileInput.files[0];
  
  if (btn) setButtonLoading(btn, true);
  try {
    let imageUrl = null;
    
    // Jika ada file baru, upload ke Cloudinary
    if (file) {
      showToast('⏳ Mengupload gambar ke server...', 'info');
      try {
        imageUrl = await uploadToImgBB(file);
        showToast('✅ Gambar berhasil diupload!', 'success');
      } catch (uploadErr) {
        console.error('Upload error:', uploadErr);
        showToast('⚠️ Gagal upload gambar, tapi prestasi tetap bisa disimpan.', 'warning');
      }
    }
    
    const achData = {
      title,
      description: desc,
      image_url: imageUrl || '🏆',
      year
    };
    
    if (editId) {
      // ✅ EDIT MODE: WAJIB SYNC KE SUPABASE
      console.log('📝 [UPDATE] achievement ID', editId, 'to Supabase:', achData);
      const updated = await sbUpdate('achievements', +editId, achData);
      console.log('✅ [UPDATE SUCCESS]:', updated);
      
      // Update state
      state.achievements = await sbFetch('achievements');
      
      // Backup to localStorage
      localStorage.setItem('backupAchievements', JSON.stringify(state.achievements));
      console.log('💾 Achievement updated & backed up to localStorage');
      
      showToast('✅ Prestasi berhasil diperbarui & tersimpan di Supabase!', 'success');
      
    } else {
      // ✅ ADD MODE: WAJIB SYNC KE SUPABASE
      console.log('📡 [INSERT] achievement to Supabase:', achData);
      const inserted = await sbInsert('achievements', achData);
      console.log('✅ [INSERT SUCCESS]:', inserted);
      
      // Update state with fresh data from Supabase
      state.achievements = await sbFetch('achievements');
      
      // Backup to localStorage
      localStorage.setItem('backupAchievements', JSON.stringify(state.achievements));
      console.log('💾 Achievement added & backed up to localStorage');
      
      showToast('✅ Prestasi berhasil ditambahkan & tersimpan di Supabase!', 'success');
    }
    
    fileInput.value = '';
    document.getElementById('ach-img-preview').style.display = 'none';
    closeModal('modal-ach');
    renderAdminAch();
    renderHome();
    refreshAdminData();
    
  } catch (err) {
    console.error('❌ [ERROR] Gagal menyimpan prestasi:', err);
    showToast('❌ GAGAL MENYIMPAN: ' + (err.message || 'Periksa koneksi & Supabase key'), 'error');
  } finally {
    if (btn) setButtonLoading(btn, false);
  }
}

// ── DELETE ──
function openDelete(type, id, name) {
  state.pendingDelete = id;
  state.pendingDeleteType = type;
  document.getElementById('delete-msg').textContent = `Yakin ingin menghapus "${name}"? Tindakan ini tidak dapat dibatalkan.`;
  document.getElementById('modal-delete').classList.add('open');
}

async function confirmDelete() {
  const btn = document.querySelector('#modal-delete .btn-danger');
  if (btn) setButtonLoading(btn, true);
  try {
    if (state.pendingDeleteType === 'news') {
      try {
        console.log('🗑️ Deleting news ID', state.pendingDelete, 'from Supabase...');
        await sbDelete('news', state.pendingDelete);
        console.log('✅ Deleted dari Supabase');
      } catch (sbErr) {
        console.warn('⚠️ Supabase delete failed, deleting from local:', sbErr);
      }
      state.news = state.news.filter(n => n.id !== state.pendingDelete);
      renderAdminNews();
      showToast('✅ Berita berhasil dihapus.', 'success');
    } else {
      try {
        console.log('🗑️ Deleting achievement ID', state.pendingDelete, 'from Supabase...');
        await sbDelete('achievements', state.pendingDelete);
        console.log('✅ Deleted dari Supabase');
      } catch (sbErr) {
        console.warn('⚠️ Supabase delete failed, deleting from local:', sbErr);
      }
      state.achievements = state.achievements.filter(a => a.id !== state.pendingDelete);
      renderAdminAch();
      showToast('✅ Prestasi berhasil dihapus.', 'success');
    }
    refreshAdminData();
    closeModal('modal-delete');
  } catch (err) {
    console.error('❌ Error saat hapus:', err);
    showToast('❌ Gagal menghapus: ' + err.message, 'error');
  } finally {
    if (btn) setButtonLoading(btn, false);
  }
}

// ── MODALS ──
function closeModal(id) { document.getElementById(id).classList.remove('open'); }
document.querySelectorAll('.modal-overlay').forEach(m => m.addEventListener('click', e => { if (e.target === m) m.classList.remove('open'); }));

// ── IMAGE PREVIEW ──
function previewImg(input, previewId) {
  const file = input.files[0];
  if (!file) return;
  
  // Validasi ukuran file
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    showToast('❌ Ukuran file terlalu besar (max 5MB)', 'error');
    input.value = '';
    return;
  }
  
  // Validasi tipe file
  if (!file.type.startsWith('image/')) {
    showToast('❌ File harus berupa gambar', 'error');
    input.value = '';
    return;
  }
  
  const reader = new FileReader();
  reader.onload = e => {
    const img = document.getElementById(previewId);
    img.src = e.target.result;
    img.style.display = 'block';
    showToast('✅ Preview gambar berhasil. Klik Simpan untuk upload ke server.', 'success');
  };
  reader.onerror = () => {
    showToast('❌ Gagal membaca file gambar', 'error');
  };
  reader.readAsDataURL(file);
}

// ── WHATSAPP MESSAGE ──
function sendWhatsApp() {
  const name = document.getElementById('contact-name').value.trim();
  const email = document.getElementById('contact-email').value.trim();
  const subject = document.getElementById('contact-subject').value.trim();
  const message = document.getElementById('contact-message').value.trim();
  
  if (!name || !email || !subject || !message) {
    showToast('Semua field harus diisi terlebih dahulu.', 'error');
    return;
  }
  
  const whatsappNumber = '6285184459363';
  const whatsappMessage = `Halo IPM SMA MUHAMMADIYAH 1 METRO,\n\nNama: ${name}\nEmail: ${email}\nSubjek: ${subject}\n\nPesan:\n${message}`;
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
  
  window.open(whatsappUrl, '_blank');
  
  document.getElementById('contact-name').value = '';
  document.getElementById('contact-email').value = '';
  document.getElementById('contact-subject').value = '';
  document.getElementById('contact-message').value = '';
  
  showToast('Membuka WhatsApp untuk mengirim pesan...', 'success');
}

// ── TOAST ──
function showToast(msg, type = 'info') {
  const c = document.getElementById('toast-container');
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  const icons = { success: '✓', error: '✕', info: 'ℹ' };
  t.innerHTML = `<span>${icons[type]||'ℹ'}</span><span>${msg}</span>`;
  c.appendChild(t);
  setTimeout(() => { t.style.opacity = '0'; t.style.transform = 'translateX(20px)'; t.style.transition = 'all .3s'; setTimeout(() => t.remove(), 300); }, 3000);
}

// ── INTERACTIVE ENHANCEMENTS ──
// Add ripple effect to buttons
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const ripple = document.createElement('span');
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ripple.style.width = ripple.style.height = '20px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.style.background = 'rgba(255,255,255,0.5)';
    ripple.style.borderRadius = '50%';
    ripple.style.position = 'absolute';
    ripple.style.pointerEvents = 'none';
    ripple.style.transform = 'scale(1)';
    ripple.style.animation = 'expand .6s ease-out';
    this.style.position = 'relative';
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});

// Add expand animation to stylesheet
const style = document.createElement('style');
style.textContent = '@keyframes expand { to { transform: scale(4); opacity: 0; } }';
document.head.appendChild(style);

// Smooth scroll behavior
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// Lazy load animations for cards
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.animation = 'fadeUp 0.6s ease-out forwards';
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.card, .ach-card').forEach(card => {
  card.style.opacity = '0';
  observer.observe(card);
});

// Add hover scale to images
document.querySelectorAll('.card-img').forEach(img => {
  img.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
  const parent = img.closest('.card');
  if (parent) {
    parent.addEventListener('mouseenter', () => img.style.transform = 'scale(1.1)');
    parent.addEventListener('mouseleave', () => img.style.transform = 'scale(1)');
  }
});

// ═════════════════════════════════════════════
// MEMBER LOGIN & DASHBOARD FUNCTIONS
// ═════════════════════════════════════════════

// ── HELPER: Parse date string to YYYY-MM-DD (fix timezone issue) ──
function normalizeDate(dateStr) {
  if (!dateStr) return null;
  if (dateStr.includes('T')) return dateStr.split('T')[0]; // Already ISO
  // Parse as local date (not UTC)
  const [year, month, day] = dateStr.split('-');
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

// Member Login
function doLoginMember() {
  const nama = document.getElementById('member-nama-login').value.trim();
  const password = document.getElementById('member-pass-login').value.trim();
  const errorDiv = document.getElementById('member-error');
  
  if (!nama || !password) {
    errorDiv.textContent = '📝 Nama dan Password wajib diisi!';
    errorDiv.style.display = 'block';
    return;
  }
  
  // Cek data lokal (lebih cepat)
  let members = JSON.parse(localStorage.getItem('members') || '[]');
  let member = members.find(m => 
    (m.fullname.toLowerCase() === nama.toLowerCase() && m.password === password)
  );
  
  if (member) {
    errorDiv.style.display = 'none';
    localStorage.setItem('currentMember', JSON.stringify(member));
    
    // Update member dashboard info
    document.getElementById('member-name').textContent = member.fullname;
    document.getElementById('member-welcome-name').textContent = member.fullname;
    document.getElementById('member-avatar').textContent = member.fullname.charAt(0).toUpperCase();
    document.getElementById('member-topbar-title').textContent = 'Dashboard';
    
    alert('✅ Berhasil login sebagai ' + member.fullname);
    document.getElementById('member-nama-login').value = '';
    document.getElementById('member-pass-login').value = '';
    
    // Redirect ke member dashboard
    showPage('member-dashboard');
    return;
  }
  
  // Jika tidak ditemukan di lokal, tampilkan error
  errorDiv.textContent = '❌ Nama atau password salah.';
  errorDiv.style.display = 'block';
}

// Show Member Login Modal
function showMemberLoginModal() {
  showPage('login');
  toggleLoginMode(); // Switch to member mode
}

// Toggle Login Mode
function toggleLoginMode() {
  const memberForm = document.getElementById('memberForm');
  const adminForm = document.getElementById('adminForm');
  const toggled = memberForm.style.display === 'none';
  
  memberForm.style.display = toggled ? 'flex' : 'none';
  adminForm.style.display = toggled ? 'none' : 'flex';
  
  const overlayPanel = document.getElementById('overlayPanel');
  const overlayTitle = document.getElementById('overlayTitle');
  const overlayText = document.getElementById('overlayText');
  const toggleBtn = document.getElementById('toggleBtn');
  
  if (toggled) {
    overlayTitle.textContent = 'Member access';
    overlayText.textContent = 'Akses untuk administrator sistem';
    toggleBtn.textContent = 'Member';
  } else {
    overlayTitle.textContent = 'Admin access';
    overlayText.textContent = 'Anggota IPM login di sini';
    toggleBtn.textContent = 'Admin';
  }
}

// Member Logout
function doMemberLogout() {
  localStorage.removeItem('currentMember');
  state.currentMember = null;
  showPage('home');
  showToast('Anda telah logout.', 'success');
}

// Initialize Member Dashboard
function initMemberDashboard() {
  const member = state.currentMember;
  document.getElementById('member-name').textContent = member.name;
  document.getElementById('member-welcome-name').textContent = member.name.split(' ')[0];
  document.getElementById('member-avatar').textContent = member.avatar;
  
  switchMemberPanel('dashboard', document.querySelector('.sidebar-link'));
  renderMemberDashboard();
  renderCalendar();
  renderMemberPrograms();
  renderBidangData();
}

// Switch Member Panel
function switchMemberPanel(name, el) {
  document.querySelectorAll('.member-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
  
  const panelId = 'member-panel-' + name;
  const panel = document.getElementById(panelId);
  if (panel) panel.classList.add('active');
  if (el) el.classList.add('active');
  
  const titles = {
    'dashboard': 'Dashboard',
    'calendar': 'Kalender',
    'news': 'Berita',
    'achievements': 'Prestasi',
    'programs': 'Program Kerja',
    'bidang': 'Data Bidang'
  };
  document.getElementById('member-topbar-title').textContent = titles[name] || name;
  
  // Re-render content based on active panel
  if (name === 'calendar') renderCalendar();
  if (name === 'news') renderMemberNews();
  if (name === 'programs') renderMemberPrograms();
  if (name === 'bidang') renderBidangData();
  if (name === 'dashboard') renderMemberDashboard();
}

// Render Member Dashboard
function renderMemberDashboard() {
  const currentMonth = new Date().getMonth() + 1;
  const eventCount = state.events.filter(e => new Date(e.date).getMonth() + 1 === currentMonth).length;
  
  document.getElementById('stat-events').textContent = eventCount;
  document.getElementById('stat-programs').textContent = state.programs.length;
  document.getElementById('stat-bidang').textContent = state.bidang_data.length;
  
  let totalMembers = 0;
  state.bidang_data.forEach(b => {
    if (b.members) totalMembers += b.members.length;
  });
  document.getElementById('stat-members').textContent = totalMembers;
  
  // Render upcoming events
  const dashEvents = document.getElementById('dashboard-events');
  const futureEvents = state.events
    .filter(e => new Date(e.date) >= new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 5);
  
  dashEvents.innerHTML = futureEvents.map(e => `
    <div class="event-item" style="border-left:4px solid var(--gold);">
      <div class="event-date">${new Date(e.date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
      <div class="event-name">${e.name}</div>
      <div class="event-desc">${e.description || '-'}</div>
    </div>
  `).join('') || '<p style="color:var(--muted);">Tidak ada acara mendatang.</p>';

  // Add recent news and achievements section
  const dashboardHtml = document.getElementById('member-panel-dashboard');
  if (dashboardHtml) {
    const newsSection = document.createElement('div');
    newsSection.style.cssText = 'margin-top:2.5rem;';
    newsSection.innerHTML = `
      <h3 style="font-family:'Playfair Display',serif; font-size:1.4rem; color:var(--text); margin-bottom:1.5rem; border-bottom:2px solid rgba(0,128,0,0.1); padding-bottom:1rem;">📰 Berita Terbaru</h3>
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:1.5rem; margin-bottom:2.5rem;">
        ${state.news && state.news.length > 0 ? state.news.slice(0, 3).map(n => `
          <div style="background:var(--white); border:1.5px solid rgba(0,128,0,0.08); border-radius:12px; overflow:hidden; transition:all .3s; cursor:pointer;" onclick="switchMemberPanel('news', document.querySelector('[onclick*=switchMemberPanel])">
            <div style="padding:1.5rem; min-height:200px; display:flex; flex-direction:column;">
              <div style="font-size:.85rem; color:var(--muted); margin-bottom:.5rem;">📅 ${formatDate(n.created_at)}</div>
              <h4 style="font-size:1.05rem; font-weight:700; color:var(--text); margin-bottom:.75rem; line-height:1.3; flex:1;">${n.title}</h4>
              <p style="color:var(--muted); font-size:.9rem; line-height:1.5; flex:1;">${n.content.substring(0, 80)}...</p>
              <div style="color:var(--gold); font-weight:600; font-size:.85rem; margin-top:.75rem;">Baca →</div>
            </div>
          </div>
        `).join('') : '<p style="color:var(--muted); grid-column:1/-1;">Belum ada berita.</p>'}
      </div>

      <h3 style="font-family:'Playfair Display',serif; font-size:1.4rem; color:var(--text); margin-bottom:1.5rem; border-bottom:2px solid rgba(0,128,0,0.1); padding-bottom:1rem;">🏆 Prestasi Terbaru</h3>
      <div style="display:grid; gap:1rem;">
        ${state.achievements && state.achievements.length > 0 ? state.achievements.slice(0, 3).map(a => `
          <div style="background:var(--white); border:1.5px solid rgba(0,128,0,0.08); border-radius:12px; padding:1.25rem; display:flex; gap:1.25rem; align-items:flex-start;">
            <div style="font-size:2rem; flex-shrink:0;">${a.image}</div>
            <div style="flex:1; min-width:0;">
              <div style="font-size:.85rem; color:var(--gold); font-weight:700; margin-bottom:.35rem;">📅 ${a.year}</div>
              <h4 style="font-size:1rem; font-weight:700; color:var(--text); margin-bottom:.35rem; line-height:1.3;">${a.title}</h4>
              <p style="color:var(--muted); font-size:.9rem; line-height:1.5;">${a.description}</p>
            </div>
          </div>
        `).join('') : '<p style="color:var(--muted);">Belum ada prestasi.</p>'}
      </div>
    `;
    // Append to dashboard panel if not already present
    if (!document.getElementById('member-dash-news-section')) {
      newsSection.id = 'member-dash-news-section';
      dashboardHtml.appendChild(newsSection);
    }
  }
}

// Calendar Variables
let currentCalendarDate = new Date();

// Previous Month
function previousMonth() {
  currentCalendarDate.setMonth(currentCalendarDate.getMonth() - 1);
  renderCalendar();
}

// Next Month
function nextMonth() {
  currentCalendarDate.setMonth(currentCalendarDate.getMonth() + 1);
  renderCalendar();
}

// Render Calendar
function renderCalendar() {
  const year = currentCalendarDate.getFullYear();
  const month = currentCalendarDate.getMonth();
  const monthName = new Date(year, month).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
  
  document.getElementById('calendar-month').textContent = monthName.charAt(0).toUpperCase() + monthName.slice(1);
  
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();
  
  const calendarDays = document.getElementById('calendar-days');
  calendarDays.innerHTML = '';
  
  // Empty cells for days before month starts
  for (let i = 0; i < startingDayOfWeek; i++) {
    const emptyDay = document.createElement('div');
    emptyDay.className = 'calendar-day empty';
    calendarDays.appendChild(emptyDay);
  }
  
  // Days of month
  const today = new Date();
  for (let day = 1; day <= daysInMonth; day++) {
    const dayDiv = document.createElement('div');
    dayDiv.className = 'calendar-day';
    dayDiv.textContent = day;
    
    const currentDate = new Date(year, month, day);
    if (currentDate.toDateString() === today.toDateString()) {
      dayDiv.classList.add('today');
    }
    
    // Check for events
    const hasEvent = state.events.some(e => new Date(e.date).toDateString() === currentDate.toDateString());
    if (hasEvent) {
      dayDiv.classList.add('has-event');
    }
    
    dayDiv.addEventListener('click', () => {
      document.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('selected'));
      dayDiv.classList.add('selected');
      renderCalendarEvents(year, month, day);
    });
    
    calendarDays.appendChild(dayDiv);
  }
  
  // Render events
  renderCalendarEvents(year, month, today.getDate());
}

// Render Calendar Events
function renderCalendarEvents(year, month, day) {
  const selectedDate = new Date(year, month, day);
  const eventsList = document.getElementById('calendar-events');
  
  // Gunakan state.events dari Supabase (bukan localStorage)
  const allEvents = state.events ? state.events.filter(e => new Date(e.date).toDateString() === selectedDate.toDateString()) : [];
  console.log('📅 Render Calendar Events for', selectedDate.toDateString(), ':', allEvents);
  
  eventsList.innerHTML = allEvents.length > 0 ? allEvents.map(e => `
    <div class="event-item" style="background:rgba(0,128,0,0.08); border-left:4px solid var(--gold); padding:0.75rem; border-radius:6px;">
      <div class="event-name" style="font-weight:700; color:var(--text);">${e.title}</div>
      <div class="event-desc" style="font-size:0.85rem; color:var(--muted); margin-top:0.25rem;">${e.description || ''}</div>
      ${e.location ? `<div class="event-location" style="font-size:0.8rem; color:var(--gold);">📍 ${e.location}</div>` : ''}
    </div>
  `).join('') : '<div style="color:var(--muted); text-align:center; padding:1rem;">Tidak ada acara</div>';
}

// Render Member Programs
function renderMemberPrograms() {
  const container = document.getElementById('member-programs-content');
  
  container.innerHTML = `
    <div class="work-programs">
      ${state.programs.map((prog, idx) => `
        <div class="bidang-section">
          <div class="bidang-title">
            <span>🎯</span> ${prog.bidang} - ${prog.name}
          </div>
          <div class="program-card">
            <h4>${prog.name}</h4>
            <p>${prog.description}</p>
            <div class="program-meta">
              <div class="program-meta-item">
                <span class="status-indicator ${prog.status === 'Aktif' ? 'active' : 'pending'}"></span>
                Status: ${prog.status}
              </div>
              <div class="program-meta-item">📅 ${prog.date}</div>
              <div class="program-meta-item">👥 ${prog.responsible}</div>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

// Render Bidang Data
function renderBidangData() {
  const container = document.getElementById('member-bidang-content');
  
  container.innerHTML = `
    <div style="display:grid; gap:2rem;">
      ${state.bidang_data.map(bidang => `
        <div style="background:var(--white); border:1.5px solid rgba(0,128,0,0.08); border-radius:12px; padding:2rem; transition:all .3s;">
          <h3 style="font-size:1.3rem; color:var(--gold); margin-bottom:1rem; display:flex; align-items:center; gap:0.5rem;">
            <span>${bidang.icon}</span> ${bidang.name}
          </h3>
          <p style="color:var(--muted); margin-bottom:1.5rem; line-height:1.6;">${bidang.description}</p>
          
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:1rem; margin-bottom:1.5rem;">
            <div style="background:rgba(0,128,0,0.08); padding:1rem; border-radius:8px; border-left:3px solid var(--gold);">
              <div style="font-size:.85rem; color:var(--muted); font-weight:600; margin-bottom:.5rem;">Ketua Bidang</div>
              <p style="margin:0; font-weight:700; color:var(--text);">${bidang.leader}</p>
            </div>
            <div style="background:rgba(0,128,0,0.08); padding:1rem; border-radius:8px; border-left:3px solid var(--gold);">
              <div style="font-size:.85rem; color:var(--muted); font-weight:600; margin-bottom:.5rem;">Sekretaris</div>
              <p style="margin:0; font-weight:700; color:var(--text);">${bidang.secretary}</p>
            </div>
            <div style="background:rgba(0,128,0,0.08); padding:1rem; border-radius:8px; border-left:3px solid var(--gold);">
              <div style="font-size:.85rem; color:var(--muted); font-weight:600; margin-bottom:.5rem;">Jumlah Anggota</div>
              <p style="margin:0; font-weight:700; color:var(--text);">${bidang.members.length} orang</p>
            </div>
          </div>
          
          <div style="background:rgba(255,255,0,0.08); padding:1rem; border-radius:8px;">
            <div style="font-size:.9rem; color:var(--muted); font-weight:600; margin-bottom:.75rem;">👥 Anggota Bidang:</div>
            <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(180px, 1fr)); gap:0.75rem;">
              ${bidang.members.map(member => `
                <div style="background:var(--white); padding:.75rem; border-radius:6px; border:1px solid rgba(0,128,0,0.12); font-size:.9rem; color:var(--text); text-align:center;">
                  ${member}
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

// Render Member News
function renderMemberNews() {
  const container = document.getElementById('member-news-content');
  if (!state.news || state.news.length === 0) {
    container.innerHTML = '<p style="color:var(--muted); text-align:center; padding:2rem;">Belum ada berita.</p>';
    return;
  }
  container.innerHTML = state.news.map(n => `
    <div style="background:var(--white); border:1.5px solid rgba(0,128,0,0.08); border-radius:12px; overflow:hidden; transition:all .3s; cursor:pointer;" onclick="showNewsDetail(${n.id}, event)">>
      <div style="padding:1.5rem;">
        <div style="font-size:.85rem; color:var(--muted); margin-bottom:.5rem;">📅 ${formatDate(n.created_at)}</div>
        <h3 style="font-size:1.2rem; font-weight:700; color:var(--text); margin-bottom:.75rem; line-height:1.4;">${n.title}</h3>
        <p style="color:var(--muted); margin-bottom:1rem; line-height:1.6;">${n.content.substring(0, 150)}...</p>
        <div style="color:var(--gold); font-weight:600; font-size:.9rem;">Baca selengkapnya →</div>
      </div>
    </div>
  `).join('');
}

// Render Member Achievements
function renderMemberAchievements() {
  const container = document.getElementById('member-achievements-content');
  if (!state.achievements || state.achievements.length === 0) {
    container.innerHTML = '<p style="color:var(--muted); text-align:center; padding:2rem;">Belum ada prestasi.</p>';
    return;
  }
  container.innerHTML = state.achievements.map(a => `
    <div style="background:var(--white); border:1.5px solid rgba(0,128,0,0.08); border-radius:12px; padding:1.5rem; transition:all .3s; display:flex; gap:1.5rem; align-items:flex-start;">
      <div style="font-size:2.5rem; flex-shrink:0;">${a.image}</div>
      <div style="flex:1;">
        <div style="font-size:.9rem; color:var(--gold); font-weight:700; margin-bottom:.5rem;;">📅 ${a.year}</div>
        <h3 style="font-size:1.15rem; font-weight:700; color:var(--text); margin-bottom:.5rem;">${a.title}</h3>
        <p style="color:var(--muted); font-size:.95rem; line-height:1.6;">${a.description}</p>
      </div>
    </div>
  `).join('');
}

// Admin Calendar Variables
let adminCalendarDate = new Date();

// Admin Calendar Functions
function adminPreviousMonth() {
  adminCalendarDate.setMonth(adminCalendarDate.getMonth() - 1);
  renderAdminCalendar();
}

function adminNextMonth() {
  adminCalendarDate.setMonth(adminCalendarDate.getMonth() + 1);
  renderAdminCalendar();
}

function renderAdminCalendar() {
  const year = adminCalendarDate.getFullYear();
  const month = adminCalendarDate.getMonth();
  const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  const monthName = monthNames[month] + ' ' + year;
  
  const monthEl = document.getElementById('admin-calendar-month');
  if (monthEl) {
    monthEl.textContent = monthName;
    console.log('📅 Admin Calendar Month:', monthName);
  }
  
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();
  
  const calendarDays = document.getElementById('admin-calendar-days');
  if (!calendarDays) return;
  
  calendarDays.innerHTML = '';
  
  // Empty cells for days before month starts
  for (let i = 0; i < startingDayOfWeek; i++) {
    const emptyDay = document.createElement('div');
    emptyDay.className = 'calendar-day empty';
    calendarDays.appendChild(emptyDay);
  }
  
  // Days of month
  const today = new Date();
  const allEvents = state.events || [];
  
  for (let day = 1; day <= daysInMonth; day++) {
    const dayDiv = document.createElement('div');
    dayDiv.className = 'calendar-day';
    
    const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    // Check for events on this day (fix timezone issue)
    const dayEvents = allEvents.filter(e => {
      const eventDate = normalizeDate(e.date);
      return eventDate === dateString;
    });
    
    // Create day content
    const dayNumberDiv = document.createElement('div');
    dayNumberDiv.className = 'day-number';
    dayNumberDiv.textContent = day;
    dayDiv.appendChild(dayNumberDiv);
    
    if (dayEvents.length > 0) {
      dayDiv.classList.add('has-event');
      
      const indicatorDiv = document.createElement('div');
      indicatorDiv.className = 'event-indicator';
      
      // Show up to 3 event dots
      for (let i = 0; i < Math.min(dayEvents.length, 3); i++) {
        const dot = document.createElement('span');
        dot.className = 'event-dot';
        indicatorDiv.appendChild(dot);
      }
      
      // Show + if more than 3 events
      if (dayEvents.length > 3) {
        const more = document.createElement('span');
        more.className = 'event-dot-more';
        more.textContent = '+';
        indicatorDiv.appendChild(more);
      }
      
      dayDiv.appendChild(indicatorDiv);
      dayDiv.title = dayEvents.map(e => e.title).join(', ');
    } else {
      dayDiv.classList.add('day-number-only');
    }
    
    if (currentDate.toDateString() === today.toDateString()) {
      dayDiv.classList.add('today');
    }
    
    dayDiv.addEventListener('click', () => {
      document.querySelectorAll('#admin-calendar-days .calendar-day').forEach(d => d.classList.remove('selected'));
      dayDiv.classList.add('selected');
      renderAdminCalendarEvents(year, month, day);
    });
    
    calendarDays.appendChild(dayDiv);
  }
  
  // Render events for today
  renderAdminCalendarEvents(year, month, today.getDate());
}

// ADD CALENDAR EVENT (Admin can mark event) - SYNC WITH SUPABASE
async function addCalendarEvent() {
  const date = document.getElementById('calendar-event-date').value;
  const title = document.getElementById('calendar-event-title').value;
  const desc = document.getElementById('calendar-event-desc').value;
  
  if (!date || !title) {
    alert('⚠️ Tanggal dan nama acara wajib diisi');
    return;
  }
  
  try {
    // Auto-add timestamp
    const now = new Date();
    const eventData = {
      date,
      title,
      description: desc,
      created_at: now.toISOString(),
      status: 'Dijadwalkan'
    };
    
    // ✅ SAVE TO SUPABASE
    console.log('📡 [INSERT] events', eventData);
    const result = await sbInsert('events', eventData);
    console.log('✅ [INSERT SUCCESS] events:', result);
    
    // ✅ Also save to localStorage backup
    let calendarEvents = JSON.parse(localStorage.getItem('calendarEvents') || '[]');
    let backupEvents = JSON.parse(localStorage.getItem('backupEvents') || '[]');
    const newEvent = {...eventData, id: result[0]?.id || Date.now()};
    calendarEvents.push(newEvent);
    backupEvents.push(newEvent);
    localStorage.setItem('calendarEvents', JSON.stringify(calendarEvents));
    localStorage.setItem('backupEvents', JSON.stringify(backupEvents));
    console.log('💾 Calendar event saved ke local backup');
    
    // Update state
    state.events.push(newEvent);
    
    // Clear form
    document.getElementById('calendar-event-date').value = '';
    document.getElementById('calendar-event-title').value = '';
    document.getElementById('calendar-event-desc').value = '';
    
    alert('✅ Acara berhasil ditandai pada kalender & tersimpan di Supabase');
    
    // Reload calendar data
    state.events = await sbFetch('events');
    
    // Refresh calendar display
    renderAdminCalendar();
    const today = new Date();
    renderAdminCalendarEvents(today.getFullYear(), today.getMonth(), today.getDate());
    
  } catch (err) {
    console.error('❌ [INSERT ERROR] events:', err);
    
    // Jika RLS error, fallback ke localStorage
    if (err.message.includes('42501') || err.message.includes('401')) {
      console.warn('⚠️ RLS Policy Issue - Fallback ke localStorage');
      
      // Simpan ke localStorage backup
      let calendarEvents = JSON.parse(localStorage.getItem('calendarEvents') || '[]');
      let backupEvents = JSON.parse(localStorage.getItem('backupEvents') || '[]');
      const newEvent = {
        id: Date.now(),
        date,
        title,
        description: desc,
        created_at: new Date().toISOString(),
        status: 'Dijadwalkan'
      };
      calendarEvents.push(newEvent);
      backupEvents.push(newEvent);
      localStorage.setItem('calendarEvents', JSON.stringify(calendarEvents));
      localStorage.setItem('backupEvents', JSON.stringify(backupEvents));
      
      // Update state
      state.events.push(newEvent);
      
      // Clear form
      document.getElementById('calendar-event-date').value = '';
      document.getElementById('calendar-event-title').value = '';
      document.getElementById('calendar-event-desc').value = '';
      
      alert('✅ Acara disimpan lokal (belum sync Supabase). Kontak admin untuk fix RLS di Supabase.');
      
      // Refresh calendar display
      renderAdminCalendar();
    } else {
      alert('❌ GAGAL MENYIMPAN: ' + err.message);
    }
  }
}

function renderAdminCalendarEvents(year, month, day) {
  const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  const eventsList = document.getElementById('admin-calendar-events');
  
  // Get events for this date (fix timezone issue)
  const dayEvents = (state.events || []).filter(e => {
    const eventDate = normalizeDate(e.date);
    return eventDate === dateString;
  });
  
  console.log('📅 Admin Calendar Events for', dateString, ':', dayEvents);
  
  if (dayEvents.length > 0) {
    eventsList.innerHTML = dayEvents.map(e => `
      <div class="event-item" style="background:linear-gradient(135deg, rgba(0,128,0,0.08), rgba(255,255,0,0.04)); border-left:4px solid var(--gold); padding:1rem; border-radius:8px;">
        <div class="event-name" style="font-weight:700; color:var(--text); margin-bottom:0.35rem;">📌 ${e.title}</div>
        ${e.description ? `<div class="event-desc" style="color:var(--muted); font-size:0.9rem;">${e.description}</div>` : ''}
        <div class="event-date" style="font-size:0.8rem; color:var(--gold); margin-top:0.5rem;">📅 ${new Date(e.date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
      </div>
    `).join('');
  } else {
    eventsList.innerHTML = '<div style="text-align:center; color:var(--muted); padding:1.5rem; font-style:italic;">📭 Tidak ada acara pada tanggal ini</div>';
  }
}

// ── Static bidang_data (tidak berubah, hardcoded) ──
state.bidang_data = [
  {
    name: 'Bidang Perkaderan', icon: '🔹',
    description: 'Bidang yang menangani proses pembinaan dan pengembangan kader IPM dengan fokus pada pembentukan karakter dan kepemimpinan.',
    leader: 'M. Romi Nazarrudin', secretary: 'Nabila Zaskiya Chandra',
    members: ['Dzaki Tristan Aji', 'Tia Eka Yuniarsih', 'Kalica Nazwa Safitri', 'Clara Wahyuning Tyas', 'Nasywa Diva Zahra']
  },
  {
    name: 'Bidang KDI (Kajian Dakwah Islam)', icon: '📖',
    description: 'Bidang yang bertanggung jawab atas pelaksanaan kajian dakwah Islam dan pengembangan wawasan keislaman anggota.',
    leader: 'Fahmi Arifuddin Herliyanto', secretary: 'Azizah Hanifah Ulhak',
    members: ['Nadhira Arthalitha Rasyid', 'Qurota Ayun Permata Ningrum', 'Muhammad Galang Putra', 'Rayhan Firadaus Putra', 'Annisa Azmi Fatonah']
  },
  {
    name: 'Bidang PIP (Pengkajian Ilmu Pengetahuan)', icon: '🔬',
    description: 'Bidang yang mengelola program pengkajian ilmu pengetahuan, teknologi, dan inovasi untuk pengembangan kompetensi akademik.',
    leader: 'Vikri Al Husna', secretary: 'Zahra Khuzaifah',
    members: ['Windi Antika', 'Deva Lia Fajria', 'Khanza Zabirah', 'Andika Zuhriyanto']
  },
  {
    name: 'Bidang ASBO (Apresiasi Seni Budaya dan Olahraga)', icon: '🎭',
    description: 'Bidang yang mengembangkan apresiasi seni budaya dan olahraga sebagai bagian dari pembinaan holistik anggota.',
    leader: 'Zahwa Alya Aneira', secretary: 'Sinta Bella Rahma Dini',
    members: ['Rizki Vetra Alfarezi', 'Silviana Putri', 'Eka Sri Utami', 'Jesika Nafin', 'Putri Raisa Nabila']
  },
  {
    name: 'Bidang Advokasi', icon: '⚖️',
    description: 'Bidang yang menangani advokasi isu-isu sosial dan lingkungan untuk meningkatkan kepedulian anggota terhadap masyarakat.',
    leader: 'Afifah Zahra Indriyani', secretary: 'Nur Fatihah',
    members: ['Dinda Cantika Putri', 'Fitria Rahma Septika', 'Vatikah Nurul Utami', 'Azkia Ikrimatuuz Zahra', 'Shanaz Nadya Safwa']
  },
  {
    name: 'Bidang PKKWU (Pengembangan Kreatifitas dan Kewirausahaan)', icon: '💼',
    description: 'Bidang yang mengembangkan kreativitas dan jiwa kewirausahaan anggota IPM untuk persiapan masa depan.',
    leader: 'Zharotu Fitri', secretary: 'Naifa Kinasih',
    members: ['Salwa Aqilah Putri', 'Azzahra Nur Rohma', 'Fiona Inka Safitri', 'Rasya Khoirunnisa', 'Talitha Nur Azizah']
  }
];

// ═══════════════════════════════════════════════════════════════════════════════
// ── NEW FEATURES: Member Login Tabs, Google OAuth, OTP, Share Buttons ──
// ═══════════════════════════════════════════════════════════════════════════════

// MEMBER TAB SWITCHING


// SHARE TO SOCIAL MEDIA
function shareToSocial(platform) {
  const title = document.title;
  const url = window.location.href;
  const urls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`,
    copy: () => {
      navigator.clipboard.writeText(url);
      alert('✅ Link disalin ke clipboard');
    }
  };
  
  if (platform === 'copy') {
    urls.copy();
  } else {
    window.open(urls[platform], '_blank', 'width=600,height=400');
  }
}

// MANAGE MEMBERS - Load Data
function loadMembersTable() {
  const members = JSON.parse(localStorage.getItem('members') || '[]');
  const tbody = document.querySelector('#manage-members-table tbody');
  tbody.innerHTML = '';
  
  members.forEach(member => {
    const row = tbody.insertRow();
    row.innerHTML = `
      <td><strong>${member.fullname}</strong></td>
      <td>${member.email}</td>
      <td>${member.bidang}</td>
      <td>${member.registeredAt}</td>
      <td><span style="background:var(--success); color:white; padding:0.25rem 0.75rem; border-radius:20px; font-size:0.8rem;">${member.status}</span></td>
      <td style="display:flex; gap:0.5rem;">
        <button class="btn-sm btn-primary" onclick="openMemberModal('${member.id}')">Edit</button>
        <button class="btn-sm btn-danger" onclick="deleteMember('${member.id}')">Hapus</button>
      </td>
    `;
  });
}

// OPEN MEMBER MODAL
function openMemberModal(memberId = null) {
  document.getElementById('member-edit-id').value = '';
  document.getElementById('member-form-fullname').value = '';
  document.getElementById('member-form-email').value = '';
  document.getElementById('member-form-password').value = '';
  document.getElementById('member-form-phone').value = '';
  document.getElementById('member-form-bidang').value = '';
  document.getElementById('member-form-status').value = '';
  
  if (memberId) {
    const members = JSON.parse(localStorage.getItem('members') || '[]');
    const member = members.find(m => m.id === memberId);
    if (member) {
      document.getElementById('member-modal-title').textContent = 'Edit Anggota';
      document.getElementById('member-edit-id').value = memberId;
      document.getElementById('member-form-fullname').value = member.fullname;
      document.getElementById('member-form-email').value = member.email;
      document.getElementById('member-form-password').value = member.password || '';
      document.getElementById('member-form-phone').value = member.phone;
      document.getElementById('member-form-bidang').value = member.bidang;
      document.getElementById('member-form-status').value = member.status;
    }
  } else {
    document.getElementById('member-modal-title').textContent = 'Tambah Anggota Baru';
  }
  
  document.getElementById('modal-member').classList.add('open');
}

// SAVE MEMBER
async function saveMember() {
  const fullname = document.getElementById('member-form-fullname').value.trim();
  const email = document.getElementById('member-form-email').value.trim();
  const password = document.getElementById('member-form-password').value.trim();
  const phone = document.getElementById('member-form-phone').value.trim();
  const bidang = document.getElementById('member-form-bidang').value;
  const status = document.getElementById('member-form-status').value;
  const memberId = document.getElementById('member-edit-id').value;
  
  if (!fullname || !email || !password || !phone || !bidang || !status) {
    showToast('⚠️ Semua field harus diisi', 'error');
    return;
  }
  
  try {
    const memberData = {
      fullname,
      email,
      password,
      phone,
      bidang,
      status,
      registered_at: new Date().toISOString()
    };
    
    if (memberId) {
      // EDIT MODE - WAJIB SYNC KE SUPABASE
      console.log('📝 [UPDATE] members ID', memberId, memberData);
      const updated = await sbUpdate('members', parseInt(memberId), memberData);
      console.log('✅ [UPDATE SUCCESS]:', updated);
    } else {
      // ADD MODE - WAJIB SYNC KE SUPABASE
      console.log('📡 [INSERT] members', memberData);
      const inserted = await sbInsert('members', memberData);
      console.log('✅ [INSERT SUCCESS]:', inserted);
    }
    
    // Reload dari Supabase
    state.members = await sbFetch('members');
    
    // Backup ke localStorage (HANYA setelah Supabase berhasil)
    localStorage.setItem('members', JSON.stringify(state.members));
    
    showToast('✅ Member berhasil disimpan & tersinkronisasi di Supabase!', 'success');
    closeModal('modal-member');
    loadMembersTable();
  } catch (err) {
    console.error('❌ [ERROR]:', err);
    showToast('❌ GAGAL MENYIMPAN: ' + err.message, 'error');
  }
}

// DELETE MEMBER
async function deleteMember(id) {
  if (!confirm('Apakah Anda yakin ingin menghapus anggota ini?')) return;
  
  try {
    console.log('🗑️ [DELETE] members ID', id);
    await sbDelete('members', id);
    console.log('✅ [DELETE SUCCESS]');
    
    state.members = await sbFetch('members');
    localStorage.setItem('members', JSON.stringify(state.members));
    
    showToast('✅ Anggota berhasil dihapus dari Supabase!', 'success');
    loadMembersTable();
  } catch (err) {
    console.error('❌ [DELETE ERROR]:', err);
    showToast('❌ GAGAL MENGHAPUS: ' + err.message, 'error');
  }
}

// INFO DATA MANAGEMENT
async function saveInfoData(field) {
  const fieldId = 'info-' + field;
  const valueInput = document.getElementById(fieldId);
  
  if (!valueInput) {
    console.error('Input element not found:', fieldId);
    showToast('❌ Field tidak ditemukan', 'error');
    return;
  }
  
  const value = valueInput.value.trim();
  if (!value) {
    showToast('⚠️ Field tidak boleh kosong', 'error');
    return;
  }
  
  try {
    const infoData = {
      field_name: field,
      field_value: value,
      updated_by: 'Admin',
      created_at: new Date().toISOString()
    };
    
    console.log('📡 [UPSERT] organization_info', field, '=', value);
    
    // Cek apakah field sudah ada
    const existing = state.organizationInfo?.find(o => o.field_name === field);
    
    if (existing) {
      // UPDATE
      const updated = await sbUpdate('organization_info', existing.id, infoData);
      console.log('✅ [UPDATE SUCCESS]:', updated);
    } else {
      // INSERT
      const inserted = await sbInsert('organization_info', infoData);
      console.log('✅ [INSERT SUCCESS]:', inserted);
    }
    
    // Reload dari Supabase
    state.organizationInfo = await sbFetch('organization_info');
    
    // Backup ke localStorage
    localStorage.setItem('organizationInfo', JSON.stringify(state.organizationInfo));
    
    showToast('✅ Info "' + field + '" berhasil disimpan di Supabase!', 'success');
  } catch (err) {
    console.error('❌ [ERROR]:', err);
    showToast('❌ GAGAL MENYIMPAN: ' + err.message, 'error');
  }
}

// EDUKASI MANAGEMENT
function openEdukasiModal() {
  document.getElementById('edukasi-edit-id').value = '';
  document.getElementById('edukasi-form-title').value = '';
  document.getElementById('edukasi-form-cat').value = '';
  document.getElementById('edukasi-form-desc').value = '';
  document.getElementById('edukasi-form-date').value = '';
  document.getElementById('edukasi-img-preview').style.display = 'none';
  document.getElementById('modal-edukasi').classList.add('open');
}

async function saveEdukasi() {
  const title = document.getElementById('edukasi-form-title').value.trim();
  const cat = document.getElementById('edukasi-form-cat').value.trim();
  const desc = document.getElementById('edukasi-form-desc').value.trim();
  const date = document.getElementById('edukasi-form-date').value;
  const edukasiId = document.getElementById('edukasi-edit-id').value;
  
  if (!title || !cat || !desc) {
    showToast('⚠️ Mohon isi semua field wajib', 'error');
    return;
  }
  
  try {
    const edukasiData = {
      title,
      description: desc,
      category: cat,
      date: date || new Date().toISOString().split('T')[0]
    };
    
    if (edukasiId) {
      // EDIT MODE - WAJIB SYNC KE SUPABASE
      console.log('📝 [UPDATE] edukasi ID', edukasiId, edukasiData);
      const updated = await sbUpdate('edukasi', parseInt(edukasiId), edukasiData);
      console.log('✅ [UPDATE SUCCESS]:', updated);
    } else {
      // ADD MODE - WAJIB SYNC KE SUPABASE
      console.log('📡 [INSERT] edukasi', edukasiData);
      const inserted = await sbInsert('edukasi', edukasiData);
      console.log('✅ [INSERT SUCCESS]:', inserted);
    }
    
    // Reload dari Supabase
    state.edukasi = await sbFetch('edukasi');
    
    // Backup ke localStorage (HANYA setelah Supabase berhasil)
    localStorage.setItem('edukasi', JSON.stringify(state.edukasi));
    
    showToast('✅ Edukasi berhasil disimpan & tersinkronisasi di Supabase!', 'success');
    closeModal('modal-edukasi');
    loadEdukasiTable();
  } catch (err) {
    console.error('❌ [ERROR]:', err);
    showToast('❌ GAGAL MENYIMPAN: ' + err.message, 'error');
  }
}

function loadEdukasiTable() {
  const edukasi = JSON.parse(localStorage.getItem('edukasi') || '[]');
  const tbody = document.querySelector('#edukasi-admin-table tbody');
  if (tbody) {
    tbody.innerHTML = '';
    edukasi.forEach(item => {
      const row = tbody.insertRow();
      row.innerHTML = `
        <td></td>
        <td>${item.title}</td>
        <td>${item.category}</td>
        <td>${item.date}</td>
        <td><button class="btn-sm btn-danger" onclick="deleteEdukasi('${item.id}')">Hapus</button></td>
      `;
    });
  }
  
  // Load di public page
  const eduGrid = document.getElementById('edukasi-grid');
  if (eduGrid) {
    eduGrid.innerHTML = edukasi.map(item => `
      <div class="card" style="background:var(--white); border:1.5px solid rgba(0,128,0,0.1); border-radius:12px; padding:1.5rem; transition:all .3s;">
        <div style="font-size:2.5rem; margin-bottom:1rem;">📚</div>
        <h3 style="font-weight:700; color:var(--text); margin-bottom:0.5rem;">${item.title}</h3>
        <span style="background:rgba(0,128,0,0.1); color:var(--gold); padding:0.25rem 0.75rem; border-radius:20px; font-size:0.8rem; font-weight:600;">${item.category}</span>
        <p style="color:var(--muted); margin-top:0.75rem; font-size:0.9rem; line-height:1.6;">${item.description}</p>
        <div style="color:var(--muted); font-size:0.85rem; margin-top:1rem;">📅 ${item.date}</div>
      </div>
    `).join('');
  }
}

async function deleteEdukasi(id) {
  if (!confirm('Hapus materi ini?')) return;
  
  try {
    console.log('🗑️ [DELETE] edukasi ID', id);
    await sbDelete('edukasi', id);
    console.log('✅ [DELETE SUCCESS]');
    
    state.edukasi = await sbFetch('edukasi');
    localStorage.setItem('edukasi', JSON.stringify(state.edukasi));
    
    showToast('✅ Edukasi berhasil dihapus dari Supabase!', 'success');
    loadEdukasiTable();
  } catch (err) {
    console.error('❌ [DELETE ERROR]:', err);
    showToast('❌ GAGAL MENGHAPUS: ' + err.message, 'error');
  }
}

// DOKUMENTASI MANAGEMENT
function openDokumentasiModal() {
  document.getElementById('dokumentasi-edit-id').value = '';
  document.getElementById('dokumentasi-form-title').value = '';
  document.getElementById('dokumentasi-form-url').value = '';
  document.getElementById('dokumentasi-form-cat').value = '';
  document.getElementById('dokumentasi-form-desc').value = '';
  document.getElementById('modal-dokumentasi').classList.add('open');
}

async function saveDokumentasi() {
  const title = document.getElementById('dokumentasi-form-title').value.trim();
  const url = document.getElementById('dokumentasi-form-url').value.trim();
  const cat = document.getElementById('dokumentasi-form-cat').value.trim();
  const desc = document.getElementById('dokumentasi-form-desc').value.trim();
  const dokId = document.getElementById('dokumentasi-edit-id').value;
  
  if (!title || !url || !cat) {
    showToast('⚠️ Mohon isi field wajib (Judul, URL, Kategori)', 'error');
    return;
  }
  
  try {
    const dokData = {
      title,
      description: desc || '',
      category: cat,
      url,
      file_url: '',
      author: 'Admin'
    };
    
    if (dokId) {
      // EDIT MODE - WAJIB SYNC KE SUPABASE
      console.log('📝 [UPDATE] dokumentasi ID', dokId, dokData);
      const updated = await sbUpdate('dokumentasi', parseInt(dokId), dokData);
      console.log('✅ [UPDATE SUCCESS]:', updated);
    } else {
      // ADD MODE - WAJIB SYNC KE SUPABASE
      console.log('📡 [INSERT] dokumentasi', dokData);
      const inserted = await sbInsert('dokumentasi', dokData);
      console.log('✅ [INSERT SUCCESS]:', inserted);
    }
    
    // Reload dari Supabase
    state.dokumentasi = await sbFetch('dokumentasi');
    
    // Backup ke localStorage (HANYA setelah Supabase berhasil)
    localStorage.setItem('dokumentasi', JSON.stringify(state.dokumentasi));
    
    showToast('✅ Dokumentasi berhasil disimpan & tersinkronisasi di Supabase!', 'success');
    closeModal('modal-dokumentasi');
    loadDokumentasiTable();
  } catch (err) {
    console.error('❌ [ERROR]:', err);
    showToast('❌ GAGAL MENYIMPAN: ' + err.message, 'error');
  }
}

function loadDokumentasiTable() {
  const dok = JSON.parse(localStorage.getItem('dokumentasi') || '[]');
  const tbody = document.querySelector('#dokumentasi-admin-table tbody');
  if (tbody) {
    tbody.innerHTML = '';
    dok.forEach(item => {
      const row = tbody.insertRow();
      row.innerHTML = `
        <td>${item.title}</td>
        <td><a href="${item.url}" target="_blank" style="color:var(--gold);">Buka Link →</a></td>
        <td>${item.category}</td>
        <td><button class="btn-sm btn-danger" onclick="deleteDokumentasi('${item.id}')">Hapus</button></td>
      `;
    });
  }
}

async function deleteDokumentasi(id) {
  if (!confirm('Hapus dokumentasi ini?')) return;
  
  try {
    console.log('🗑️ [DELETE] dokumentasi ID', id);
    await sbDelete('dokumentasi', id);
    console.log('✅ [DELETE SUCCESS]');
    
    state.dokumentasi = await sbFetch('dokumentasi');
    localStorage.setItem('dokumentasi', JSON.stringify(state.dokumentasi));
    
    showToast('✅ Dokumentasi berhasil dihapus dari Supabase!', 'success');
    loadDokumentasiTable();
  } catch (err) {
    console.error('❌ [DELETE ERROR]:', err);
    showToast('❌ GAGAL MENGHAPUS: ' + err.message, 'error');
  }
}

// PUBLIC DOKUMENTASI PAGE
function loadPublicDokumentasi() {
  // Baca dari state.dokumentasi (dari Supabase), bukan localStorage
  const dok = state.dokumentasi || JSON.parse(localStorage.getItem('dokumentasi') || '[]');
  console.log('📋 Load Public Dokumentasi:', dok);
  
  const tbody = document.querySelector('#dokumentasi-public-tbody');
  if (tbody) {
    tbody.innerHTML = '';
    if (dok.length === 0) {
      tbody.innerHTML = '<tr><td colspan="3" style="text-align:center; padding:2rem; color:var(--muted);">Belum ada dokumentasi</td></tr>';
    } else {
      dok.forEach(item => {
        const row = tbody.insertRow();
        row.innerHTML = `
          <td><strong>${item.title}</strong></td>
          <td><span style="background:rgba(0,128,0,0.1); padding:0.25rem 0.75rem; border-radius:20px; font-size:0.85rem;">${item.category}</span></td>
          <td><a href="${item.url}" target="_blank" class="btn-sm" style="background:var(--gold); color:#000; text-decoration:none;">Akses →</a></td>
        `;
      });
    }
  }
}

// PUBLIC CALENDAR
function publicPreviousMonth() {
  state.calendarMonth = (state.calendarMonth - 1 + 12) % 12;
  state.calendarYear = state.calendarMonth === 11 ? state.calendarYear - 1 : state.calendarYear;
  renderPublicCalendar();
}

function publicNextMonth() {
  state.calendarMonth = (state.calendarMonth + 1) % 12;
  state.calendarYear = state.calendarMonth === 0 ? state.calendarYear + 1 : state.calendarYear;
  renderPublicCalendar();
}

function renderPublicCalendar() {
  const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  const monthEl = document.getElementById('public-calendar-month');
  if (monthEl) {
    const monthText = monthNames[state.calendarMonth] + ' ' + state.calendarYear;
    monthEl.textContent = monthText;
    console.log('📅 Public Calendar Month:', monthText);
  }
  
  const daysEl = document.getElementById('public-calendar-days');
  const eventsEl = document.getElementById('public-calendar-events');
  
  if (daysEl && eventsEl) {
    const firstDay = new Date(state.calendarYear, state.calendarMonth, 1).getDay();
    const daysInMonth = new Date(state.calendarYear, state.calendarMonth + 1, 0).getDate();
    const today = new Date();
    
    let html = '';
    
    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      html += '<div class="calendar-day empty"></div>';
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(state.calendarYear, state.calendarMonth, day);
      const dateString = `${state.calendarYear}-${String(state.calendarMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      
      // Check for events on this date (fix timezone issue)
      const dayEvents = state.events.filter(e => {
        const eventDate = normalizeDate(e.date);
        return eventDate === dateString;
      });
      
      const isToday = currentDate.toDateString() === today.toDateString();
      const hasEvent = dayEvents.length > 0;
      
      let dayClass = 'calendar-day';
      if (isToday) dayClass += ' today';
      if (hasEvent) dayClass += ' has-event';
      
      if (hasEvent) {
        html += `
          <div class="${dayClass}" title="${dayEvents.map(e => e.title).join(', ')}">
            <div class="day-number">${day}</div>
            <div class="event-indicator">
              ${dayEvents.slice(0, 3).map((_, i) => `<div class="event-dot"></div>`).join('')}
              ${dayEvents.length > 3 ? '<div class="event-dot-more">+</div>' : ''}
            </div>
          </div>
        `;
      } else {
        html += `<div class="${dayClass}"><div class="day-number">${day}</div></div>`;
      }
    }
    
    daysEl.innerHTML = html;
    
    // Render events list for current month
    const monthEvents = state.events.filter(e => {
      const normalized = normalizeDate(e.date);
      const [eYear, eMonth] = normalized.split('-').map(Number);
      return eYear === state.calendarYear && 
             eMonth === state.calendarMonth + 1;
    }).sort((a, b) => new Date(a.date) - new Date(b.date));
    
    console.log('📅 Public Calendar Events for', monthNames[state.calendarMonth], state.calendarYear, ':', monthEvents);
    
    if (monthEvents.length > 0) {
      eventsEl.innerHTML = monthEvents.map((e, idx) => `
        <div class="event-item" style="background:linear-gradient(135deg, rgba(0,128,0,0.08), rgba(255,255,0,0.04)); border-left:4px solid var(--gold); padding:1rem; border-radius:8px; transition:all .2s;">
          <div class="event-date" style="font-size:0.8rem; color:var(--gold); font-weight:700; margin-bottom:0.35rem;">
            📅 ${new Date(e.date).toLocaleDateString('id-ID', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
          </div>
          <div class="event-name" style="font-weight:700; color:var(--text); margin-bottom:0.35rem; font-size:1rem;">
            📌 ${e.title}
          </div>
          ${e.description ? `<div class="event-desc" style="color:var(--muted); font-size:0.9rem;">${e.description}</div>` : ''}
        </div>
      `).join('');
    } else {
      eventsEl.innerHTML = '<div style="text-align:center; color:var(--muted); padding:2rem; font-style:italic;">Belum ada acara bulan ini</div>';
    }
  }
}

// INIT: Load semua data dari Supabase saat halaman dibuka ──
window.addEventListener('DOMContentLoaded', async () => {
  await loadAllData();
  loadPublicDokumentasi();
  renderPublicCalendar();
  
  // Load organization info
  const orgInfo = JSON.parse(localStorage.getItem('organizationInfo') || '{}');
  if (orgInfo.aktif) document.getElementById('info-aktif').value = orgInfo.aktif;
  if (orgInfo.prestasi) document.getElementById('info-prestasi').value = orgInfo.prestasi;
  if (orgInfo.tahun) document.getElementById('info-tahun').value = orgInfo.tahun;
  if (orgInfo.program) document.getElementById('info-program').value = orgInfo.program;
  
  // Load members and tables
  loadMembersTable();
  loadEdukasiTable();
  loadDokumentasiTable();
});
