const cardDataList = [
  { id: 1, title: 'Kartu 01: Satria Bumi Syahrizky', name: 'Satria Bumi Syahrizky', links: [
    { label: '1. Curriculum Vitae (CV)', desc: 'Referensi dan panduan membuat CV.', url: 'https://www.jobscan.co/blog/ats-resume/' },
    { label: '2. Surat Lamaran Kerja', desc: 'Template untuk menyusun surat lamaran.', url: 'https://www.canva.com/resumes/templates/' },
    { label: '3. Spreadsheet', desc: 'Contoh dan panduan terkait spreadsheet.', url: 'https://www.themuse.com/advice/resume-examples' }
  ]},
  { id: 2, title: 'Kartu 02: Muhamad Fariz', name: 'Muhamad Fariz', links: [
    { label: '1. Curriculum Vitae (CV)', desc: 'Contoh dan panduan membuat CV.', url: 'https://www.gramedia.com/best-seller/contoh-surat-lamaran-kerja/' },
    { label: '2. Surat Lamaran Kerja', desc: 'Referensi penulisan surat lamaran kerja.', url: 'https://www.sevima.com/contoh-surat-lamaran-kerja' },
    { label: '3. Spreadsheet', desc: 'Referensi contoh surat dan dokumen kerja.', url: 'https://www.indeed.com/career-advice/cover-letter-samples' }
  ]},
  { id: 3, title: 'Kartu 03: Fadlan Alfahrezy', name: 'Fadlan Alfahrezy', links: [
    { label: '1. Curriculum Vitae (CV)', desc: 'Panduan penggunaan Google Workspace.', url: 'https://support.google.com/a/users/answer/9282959' },
    { label: '2. Surat Lamaran Kerja', desc: 'Kumpulan formula spreadsheet.', url: 'https://exceljet.net/formulas' },
    { label: '3. Spreadsheet', desc: 'Contoh template laporan.', url: 'https://www.smartsheet.com/free-financial-report-templates' }
  ]},
  { id: 4, title: 'Kartu 04: Qiran Ezra', name: 'Qiran Ezra', links: [
    { label: '1. Curriculum Vitae (CV)', desc: 'Platform untuk melihat dan berbagi proyek kode.', url: 'https://github.com/' },
    { label: '2. Surat Lamaran Kerja', desc: 'Inspirasi desain dan portofolio visual.', url: 'https://www.behance.net/' },
    { label: '3. Spreadsheet', desc: 'Panduan studi kasus dan riset UX.', url: 'https://www.nngroup.com/articles/case-studies/' }
  ]},
  { id: 5, title: 'Kartu 05: Salman Hikmatul', name: 'Salman Hikmatul', links: [
    { label: '1. Curriculum Vitae (CV)', desc: 'Contoh pertanyaan dan jawaban wawancara.', url: 'https://www.themuse.com/advice/interview-questions-and-answers' },
    { label: '2. Surat Lamaran Kerja', desc: 'Tips persiapan wawancara kerja.', url: 'https://www.indeed.com/career-advice/interviewing' },
    { label: '3. Spreadsheet', desc: 'Latihan wawancara teknis.', url: 'https://www.pramp.com/' }
  ]},
  { id: 6, title: 'Kartu 06: Rizky Permana', name: 'Rizky Permana', links: [
    { label: '1. Curriculum Vitae (CV)', desc: 'Template dokumen Microsoft Office.', url: 'https://templates.office.com/' },
    { label: '2. Surat Lamaran Kerja', desc: 'Informasi gaji dan karier.', url: 'https://www.glassdoor.com/Salaries/index.htm' },
    { label: '3. Spreadsheet', desc: 'Pencarian lowongan kerja.', url: 'https://www.linkedin.com/jobs/' }
  ]}
];

// Akun dummy frontend untuk demonstrasi. Jangan gunakan untuk keamanan sungguhan.
const memberAccounts = {
  1: { username: 'satria01', password: 'satria123' },
  2: { username: 'fariz02', password: 'fariz456' },
  3: { username: 'fadlan03', password: 'fadlan789' },
  4: { username: 'qiran04', password: 'qiran234' },
  5: { username: 'salman05', password: 'salman567' },
  6: { username: 'rizky06', password: 'rizky890' }
};

let pendingLoginCardId = null;

let currentCardId = 1;
let soundEnabled = true;
let audioCtxInstance = null;
let toastTimer;

const $ = (id) => document.getElementById(id);

function getAudioContext() {
  if (!soundEnabled) return null;
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return null;
  if (!audioCtxInstance) audioCtxInstance = new AudioCtx();
  if (audioCtxInstance.state === 'suspended') audioCtxInstance.resume();
  return audioCtxInstance;
}

window.playAudio = function(type = 'blip') {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = 'triangle';
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    const now = ctx.currentTime;
    const sounds = {
      blip: [950, 1450, 0.035, 0.055],
      start: [330, 1100, 0.2, 0.12],
      select: [523, 784, 0.16, 0.09],
      back: [784, 392, 0.13, 0.08],
      beep: [660, 660, 0.06, 0.06]
    };
    const [startFreq, endFreq, duration, volume] = sounds[type] || sounds.blip;
    oscillator.frequency.setValueAtTime(startFreq, now);
    if (startFreq !== endFreq) oscillator.frequency.exponentialRampToValueAtTime(endFreq, now + duration);
    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    oscillator.start(now);
    oscillator.stop(now + duration);
  } catch (error) {
    // Audio tidak wajib tersedia; website tetap berfungsi tanpa suara.
  }
};

function showToast(message) {
  const toast = $('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2100);
}

function showPage(pageNumber) {
  const pages = { 1: $('page-1'), 2: $('page-2'), 3: $('page-3') };
  Object.entries(pages).forEach(([number, element]) => {
    if (!element) return;
    element.hidden = Number(number) !== pageNumber;
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });
  window.playAudio(pageNumber === 1 ? 'back' : pageNumber === 2 ? 'start' : 'select');
}

window.goToPage = showPage;

function openMemberLogin(cardId) {
  const card = cardDataList.find(item => item.id === cardId);
  if (!card) return;
  pendingLoginCardId = cardId;
  $('login-member-name').textContent = card.title;
  $('login-username').value = '';
  $('login-password').value = '';
  $('login-password').type = 'password';
  $('toggle-password').textContent = 'LIHAT';
  $('login-error').hidden = true;
  $('login-modal').hidden = false;
  document.body.classList.add('login-open');
  window.playAudio('select');
  setTimeout(() => $('login-username').focus(), 30);
}

function closeMemberLogin() {
  $('login-modal').hidden = true;
  document.body.classList.remove('login-open');
  pendingLoginCardId = null;
}

function renderDetail(cardId) {
  const card = cardDataList.find((item) => item.id === cardId);
  if (!card) return;
  currentCardId = cardId;
  const image = document.querySelector(`[data-card-id="${cardId}"] img`);
  const imageSrc = image ? image.getAttribute('src') : '';
  const completed = getCompletedTasks();
  const content = $('detail-box-content');
  const doneCount = card.links.filter((link, index) => completed.includes(taskKey(card.id, index))).length;

  content.innerHTML = `
    <div class="detail-header">
      <div class="member-identity">
        <div class="member-avatar"><img src="${escapeHTML(imageSrc)}" alt="Kartu ${card.id}" /></div>
        <div>
          <span class="card-number">KARTU #${card.id}</span>
          <h2 class="detail-title">${escapeHTML(card.title)}</h2>
          <p class="detail-subtitle">Kelompok Belajar 3 • Detail Aktivitas</p>
        </div>
      </div>
      <div class="active-status">● STATUS: AKTIF</div>
    </div>
    <div class="task-summary">
      <h3>DAFTAR TUGAS</h3>
      <span id="task-count">${doneCount}/${card.links.length} SELESAI</span>
    </div>
    <div class="progress-track" role="progressbar" aria-label="Progres tugas anggota" aria-valuemin="0" aria-valuemax="${card.links.length}" aria-valuenow="${doneCount}">
      <div id="task-progress-fill" class="progress-fill" style="width:${doneCount / card.links.length * 100}%"></div>
    </div>
    <ul class="links-list">
      ${card.links.map((link, index) => {
        const key = taskKey(card.id, index);
        const checked = completed.includes(key);
        return `<li class="link-item ${checked ? 'task-done' : ''}">
          <label class="task-check">
            <input type="checkbox" data-task-key="${key}" ${checked ? 'checked' : ''} aria-label="Tandai ${escapeHTML(link.label)} selesai" />
            <span class="pixel-checkbox" aria-hidden="true"></span>
          </label>
          <div class="link-copy">
            <a href="${escapeHTML(link.url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(link.label)} <span aria-hidden="true">↗</span></a>
            <p>${escapeHTML(link.desc)}</p>
          </div>
          <div class="link-actions">
            <button type="button" class="pixel-btn copy-btn" data-copy-url="${escapeHTML(link.url)}">SALIN</button>
            <a href="${escapeHTML(link.url)}" target="_blank" rel="noopener noreferrer" class="pixel-btn open-link">BUKA ▶</a>
          </div>
        </li>`;
      }).join('')}
    </ul>
    <div class="detail-footer">
      <span>💡 Centang tugas saat sudah selesai. Progres tersimpan di browser ini.</span>
      <button id="detail-back-button" type="button" class="pixel-btn back-detail-btn">← MENU KARTU</button>
    </div>`;
  $('nav-card-indicator').textContent = `#${card.id} / ${cardDataList.length}`;
  showPage(3);
}

window.openDetailView = renderDetail;

function taskKey(cardId, linkIndex) {
  return `pixelhub-task-${cardId}-${linkIndex}`;
}

function getCompletedTasks() {
  try {
    return cardDataList.flatMap(card => card.links.map((_, index) => taskKey(card.id, index)))
      .filter(key => localStorage.getItem(key) === 'true');
  } catch {
    return [];
  }
}

function setTaskCompleted(key, completed) {
  try {
    if (completed) localStorage.setItem(key, 'true');
    else localStorage.removeItem(key);
  } catch {
    showToast('Penyimpanan tidak tersedia di browser ini.');
  }
}

function updateTaskProgress() {
  const card = cardDataList.find(item => item.id === currentCardId);
  if (!card) return;
  const done = card.links.filter((_, index) => getCompletedTasks().includes(taskKey(card.id, index))).length;
  const count = $('task-count');
  const fill = $('task-progress-fill');
  const bar = document.querySelector('.progress-track');
  if (count) count.textContent = `${done}/${card.links.length} SELESAI`;
  if (fill) fill.style.width = `${done / card.links.length * 100}%`;
  if (bar) bar.setAttribute('aria-valuenow', String(done));
}

window.navigateDetail = function(direction) {
  const nextId = direction === 'next'
    ? (currentCardId % cardDataList.length) + 1
    : ((currentCardId - 2 + cardDataList.length) % cardDataList.length) + 1;
  window.playAudio('beep');
  renderDetail(nextId);
};

window.copyToClipboard = async function(url, button) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(url);
    } else {
      const temporary = document.createElement('textarea');
      temporary.value = url;
      temporary.style.position = 'fixed';
      temporary.style.opacity = '0';
      document.body.appendChild(temporary);
      temporary.select();
      const copied = document.execCommand('copy');
      temporary.remove();
      if (!copied) throw new Error('Copy gagal');
    }
    if (button) {
      const original = button.textContent;
      button.textContent = 'TERSALIN!';
      button.classList.add('copied');
      setTimeout(() => {
        button.textContent = original;
        button.classList.remove('copied');
      }, 1600);
    }
    showToast('Tautan berhasil disalin!');
    window.playAudio('beep');
  } catch {
    showToast('Gagal menyalin. Salin tautan dari alamat link.');
  }
};

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);
}

function filterCards() {
  const query = ($('member-search')?.value || '').trim().toLocaleLowerCase('id');
  let visible = 0;
  document.querySelectorAll('[data-card-id]').forEach(card => {
    const data = cardDataList.find(item => item.id === Number(card.dataset.cardId));
    const matches = data.name.toLocaleLowerCase('id').includes(query);
    card.hidden = !matches;
    if (matches) visible++;
  });
  $('search-status').textContent = `Menampilkan ${visible} dari ${cardDataList.length} anggota.`;
  $('empty-search').hidden = visible !== 0;
}

document.addEventListener('click', event => {
  const cardButton = event.target.closest('[data-card-id]');
  if (cardButton) {
    openMemberLogin(Number(cardButton.dataset.cardId));
    return;
  }
  const copyButton = event.target.closest('[data-copy-url]');
  if (copyButton) {
    window.copyToClipboard(copyButton.dataset.copyUrl, copyButton);
    return;
  }
  if (event.target.closest('#detail-back-button')) {
    showPage(2);
    return;
  }
  if (event.target.closest('#btn-lanjut-halaman-2')) showPage(2);
  if (event.target.closest('#back-to-home')) showPage(1);
  if (event.target.closest('#back-to-cards')) showPage(2);
  if (event.target.closest('#prev-card')) window.navigateDetail('prev');
  if (event.target.closest('#next-card')) window.navigateDetail('next');
});

document.addEventListener('change', event => {
  const checkbox = event.target.closest('input[data-task-key]');
  if (!checkbox) return;
  setTaskCompleted(checkbox.dataset.taskKey, checkbox.checked);
  checkbox.closest('.link-item')?.classList.toggle('task-done', checkbox.checked);
  updateTaskProgress();
  showToast(checkbox.checked ? 'Tugas ditandai selesai!' : 'Tanda selesai dibatalkan.');
});

$('member-search')?.addEventListener('input', filterCards);

$('sound-toggle')?.addEventListener('click', () => {
  soundEnabled = !soundEnabled;
  const button = $('sound-toggle');
  button.textContent = soundEnabled ? '♪ SUARA: ON' : '♪ SUARA: OFF';
  button.setAttribute('aria-pressed', String(soundEnabled));
  if (soundEnabled) window.playAudio('beep');
  showToast(soundEnabled ? 'Efek suara aktif.' : 'Efek suara dimatikan.');
});

$('theme-toggle')?.addEventListener('click', () => {
  const enabled = document.body.classList.toggle('light-mode');
  const button = $('theme-toggle');
  button.textContent = enabled ? '☾ MODE GELAP' : '☼ MODE TERANG';
  button.setAttribute('aria-pressed', String(enabled));
  showToast(enabled ? 'Mode terang aktif.' : 'Mode gelap aktif.');
});


$('login-close')?.addEventListener('click', closeMemberLogin);
$('login-modal')?.addEventListener('click', event => {
  if (event.target.matches('[data-close-login="true"]')) closeMemberLogin();
});
$('toggle-password')?.addEventListener('click', () => {
  const password = $('login-password');
  const show = password.type === 'password';
  password.type = show ? 'text' : 'password';
  $('toggle-password').textContent = show ? 'SEMBUNYIKAN' : 'LIHAT';
});
$('member-login-form')?.addEventListener('submit', event => {
  event.preventDefault();
  const account = memberAccounts[pendingLoginCardId];
  const username = $('login-username').value.trim();
  const password = $('login-password').value;
  if (account && username === account.username && password === account.password) {
    const cardId = pendingLoginCardId;
    closeMemberLogin();
    showToast('Login berhasil! Selamat datang.');
    renderDetail(cardId);
  } else {
    $('login-error').hidden = false;
    $('login-password').select();
    window.playAudio('back');
  }
});


document.addEventListener('keydown', event => {
  if (!$('login-modal').hidden && event.key === 'Escape') { closeMemberLogin(); return; }
  if (event.altKey || event.ctrlKey || event.metaKey) return;
  const tag = document.activeElement?.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA') {
    if (event.key === 'Escape' && tag === 'INPUT') {
      $('member-search').value = '';
      filterCards();
    }
    return;
  }
  if (!$('page-3').hidden) {
    if (event.key === 'ArrowRight') window.navigateDetail('next');
    if (event.key === 'ArrowLeft') window.navigateDetail('prev');
    if (event.key === 'Escape') showPage(2);
  } else if (!$('page-2').hidden && event.key === 'Escape') {
    showPage(1);
  } else if (!$('page-1').hidden && (event.key === 'Enter' || event.key === ' ')) {
    event.preventDefault();
    showPage(2);
  }
});

document.querySelectorAll('[data-card-id]').forEach(card => {
  card.addEventListener('mouseenter', () => window.playAudio('blip'));
});
