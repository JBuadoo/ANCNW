/**
 * All Nations Church NorthWest — House of Grace
 * Application Logic
 */
document.addEventListener('DOMContentLoaded', () => {
  const state = {
    currentRoute: 'home',
    activeSermon: null,
    isPlaying: false,
    audioElement: new Audio(),
    giving: { amount: 100, frequency: 'One-Time', fund: 'Tithes & General', coverFee: false, feeRate: 0.022 },
    galleryIndex: 0,
    filteredGallery: [...churchData.gallery]
  };

  const $ = s => document.querySelector(s);
  const $$ = s => document.querySelectorAll(s);

  const header = $('.site-header');
  const mobileToggle = $('#mobileToggle');
  const mobileDrawer = $('#mobileDrawer');
  const drawerOverlay = $('#drawerOverlay');
  const drawerClose = $('#drawerClose');
  const audioBar = $('#audioBar');

  /* --- Routing --- */
  const validRoutes = ['home','about','ministries','sermons','events','gallery','give','connect','contact'];

  function getRoute() {
    const h = location.hash.replace('#','').toLowerCase();
    return validRoutes.includes(h) ? h : 'home';
  }

  function navigateTo(route, opts = {}) {
    state.currentRoute = route;
    if (location.hash !== `#${route}`) location.hash = route;

    $$('.page-view').forEach(v => {
      v.classList.toggle('active-view', v.id === `view-${route}`);
    });

    $$('.nav-link, .mobile-link').forEach(l => {
      const t = l.dataset.route || (l.getAttribute('href') || '').replace('#','');
      l.classList.toggle('active', t === route);
    });

    closeMobileDrawer();
    if (opts.subTab) switchTab(opts.subTab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  window.addEventListener('hashchange', () => navigateTo(getRoute()));

  document.addEventListener('click', e => {
    const link = e.target.closest('[data-route]');
    if (link) {
      const r = link.dataset.route;
      if (validRoutes.includes(r)) {
        e.preventDefault();
        navigateTo(r, { subTab: link.dataset.subtab });
      }
    }
  });

  /* --- Header scroll --- */
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 30);
  });

  /* --- Mobile drawer --- */
  function closeMobileDrawer() {
    mobileDrawer.classList.remove('open');
    drawerOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  mobileToggle?.addEventListener('click', () => {
    mobileDrawer.classList.add('open');
    drawerOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  });
  drawerClose?.addEventListener('click', closeMobileDrawer);
  drawerOverlay?.addEventListener('click', closeMobileDrawer);

  /* --- Populate Ministries --- */
  function renderMinistries(containerId, items) {
    const el = $(`#${containerId}`);
    if (!el) return;
    el.innerHTML = items.map(m => `
      <div class="ministry-card">
        <div class="ministry-card__image">
          <img src="${m.image}" alt="${m.title}" loading="lazy">
        </div>
        <div class="ministry-card__body">
          <div class="ministry-card__cat">${m.category}</div>
          <h4 class="ministry-card__title">${m.title}</h4>
          <p class="ministry-card__desc">${m.description}</p>
          <div class="ministry-card__meta">${m.leader} · ${m.meetingTime}</div>
          <button class="btn btn--outline btn--sm open-volunteer" data-ministry="${m.title}">Get Involved</button>
        </div>
      </div>
    `).join('');
  }

  /* --- Populate Sermons --- */
  function renderSermons() {
    const el = $('#sermonsGrid');
    if (!el) return;
    el.innerHTML = churchData.sermons.map(s => `
      <div class="sermon-card">
        <div class="sermon-card__thumb">
          <img src="${s.videoThumbnail}" alt="${s.title}" loading="lazy">
          <span class="sermon-card__duration">${s.duration}</span>
        </div>
        <div class="sermon-card__body">
          <div class="sermon-card__series">${s.series}</div>
          <h4 class="sermon-card__title">${s.title}</h4>
          <div class="sermon-card__speaker">${s.speaker} · ${s.date}</div>
          <div class="sermon-card__footer">
            <button class="btn btn--primary btn--sm play-sermon" data-id="${s.id}">Listen</button>
            <button class="btn btn--outline btn--sm view-notes" data-id="${s.id}">Notes</button>
          </div>
        </div>
      </div>
    `).join('');
  }

  /* --- Populate Events --- */
  function renderEvents(filter = 'All') {
    const el = $('#eventsList');
    if (!el) return;
    const items = filter === 'All' ? churchData.events : churchData.events.filter(e => e.category === filter);

    if (!items.length) {
      el.innerHTML = '<p style="text-align:center;padding:2rem;color:var(--gray-400);">No events in this category.</p>';
      return;
    }

    el.innerHTML = items.map(e => {
      const parts = e.date.split(' ');
      const month = (parts[0] || '').substring(0,3).toUpperCase();
      const day = (parts[1] || '').replace(',','');
      return `
        <div class="event-row">
          <div class="event-row__image"><img src="${e.image}" alt="${e.title}" loading="lazy"></div>
          <div class="event-row__details">
            <span class="event-row__badge">${e.badge || e.category}</span>
            <h4 class="event-row__title">${e.title}</h4>
            <div class="event-row__meta">
              <span>${e.date}</span>
              <span>${e.time}</span>
              <span>${e.location}</span>
            </div>
            <p class="event-row__desc">${e.description}</p>
          </div>
          <div class="event-row__actions">
            <button class="btn btn--primary btn--sm open-rsvp" data-title="${e.title}">RSVP</button>
            <button class="btn btn--outline btn--sm add-cal" data-title="${e.title}" data-date="${e.date}">Add to Calendar</button>
          </div>
        </div>
      `;
    }).join('');
  }

  /* --- Gallery --- */
  function renderGallery(category = 'all') {
    const el = $('#galleryGrid');
    if (!el) return;
    state.filteredGallery = category === 'all' ? churchData.gallery : churchData.gallery.filter(g => g.category === category);
    el.innerHTML = state.filteredGallery.map((g, i) => `
      <div class="gallery-item" data-index="${i}">
        <img src="${g.image}" alt="${g.title}" loading="lazy">
        <div class="gallery-item__overlay">
          <div class="gallery-item__title">${g.title}</div>
          <div class="gallery-item__caption">${g.caption}</div>
        </div>
      </div>
    `).join('');
  }

  /* --- Leadership --- */
  function renderLeaders() {
    const el = $('#leaderGrid');
    if (!el) return;
    el.innerHTML = churchData.leadership.map(l => `
      <div class="leader-card">
        <div class="leader-card__photo"><img src="${l.image}" alt="${l.name}" loading="lazy"></div>
        <div class="leader-card__name">${l.name}</div>
        <div class="leader-card__role">${l.role}</div>
        <p class="leader-card__bio">${l.bio}</p>
      </div>
    `).join('');
  }

  /* --- Life Groups --- */
  function renderLifeGroups() {
    const el = $('#lifegroupsGrid');
    if (!el) return;
    el.innerHTML = churchData.lifeGroups.map(lg => `
      <div class="lifegroup-card">
        <div class="lifegroup-card__type">${lg.type}</div>
        <h4 class="lifegroup-card__name">${lg.name}</h4>
        <div class="lifegroup-card__details">
          <div><strong>Leader:</strong> ${lg.leader}</div>
          <div><strong>When:</strong> ${lg.schedule}</div>
          <div><strong>Where:</strong> ${lg.neighborhood}</div>
        </div>
        <button class="btn btn--outline btn--sm join-group" data-group="${lg.name}">Join Group</button>
      </div>
    `).join('');
  }

  /* --- FAQ --- */
  function renderFAQ() {
    const el = $('#faqList');
    if (!el) return;
    el.innerHTML = churchData.faq.map(f => `
      <div class="faq-item">
        <button class="faq-question">
          <span>${f.question}</span>
          <span class="faq-question__icon">+</span>
        </button>
        <div class="faq-answer">${f.answer}</div>
      </div>
    `).join('');

    el.querySelectorAll('.faq-question').forEach(btn => {
      btn.addEventListener('click', () => {
        const answer = btn.nextElementSibling;
        const icon = btn.querySelector('.faq-question__icon');
        const open = answer.style.display === 'block';

        el.querySelectorAll('.faq-answer').forEach(a => a.style.display = 'none');
        el.querySelectorAll('.faq-question__icon').forEach(i => i.textContent = '+');

        if (!open) {
          answer.style.display = 'block';
          icon.textContent = '\u2212';
        }
      });
    });
  }

  /* --- Audio Player --- */
  function playSermon(id) {
    const s = churchData.sermons.find(x => x.id === id) || churchData.sermons[0];
    state.activeSermon = s;
    state.isPlaying = true;

    $('#audioTitle').textContent = s.title;
    $('#audioSpeaker').textContent = `${s.speaker} · ${s.series}`;
    $('#audioThumb').src = s.videoThumbnail;
    $('#audioDuration').textContent = s.duration;
    $('#audioTime').textContent = '0:00';
    $('#audioFilled').style.width = '0%';
    $('#audioPlayBtn').innerHTML = pauseIcon;
    audioBar.classList.add('active');

    state.audioElement.src = s.audioUrl;
    state.audioElement.play().catch(() => {});
    showToast(`Now Playing: ${s.title}`);
  }

  const playIcon = '<svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>';
  const pauseIcon = '<svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';

  function togglePlay() {
    if (!state.activeSermon) { playSermon(churchData.sermons[0].id); return; }
    if (state.isPlaying) {
      state.audioElement.pause();
      state.isPlaying = false;
      $('#audioPlayBtn').innerHTML = playIcon;
    } else {
      state.audioElement.play().catch(() => {});
      state.isPlaying = true;
      $('#audioPlayBtn').innerHTML = pauseIcon;
    }
  }

  $('#audioPlayBtn')?.addEventListener('click', togglePlay);
  $('#audioCloseBtn')?.addEventListener('click', () => {
    state.audioElement.pause();
    state.isPlaying = false;
    audioBar.classList.remove('active');
  });

  state.audioElement.addEventListener('timeupdate', () => {
    if (!state.audioElement.duration) return;
    const c = state.audioElement.currentTime;
    const pct = (c / state.audioElement.duration) * 100;
    $('#audioFilled').style.width = `${pct}%`;
    const m = Math.floor(c / 60), s = Math.floor(c % 60);
    $('#audioTime').textContent = `${m}:${s < 10 ? '0' : ''}${s}`;
  });

  $('#audioScrubber')?.addEventListener('click', e => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    if (state.audioElement.duration) state.audioElement.currentTime = pos * state.audioElement.duration;
  });

  /* --- Global Click Handlers --- */
  document.addEventListener('click', e => {
    // Sermon play
    const playBtn = e.target.closest('.play-sermon, .sermon-featured__play');
    if (playBtn) {
      playSermon(playBtn.dataset.id || churchData.sermons[0].id);
    }

    // Sermon notes
    const notesBtn = e.target.closest('.view-notes');
    if (notesBtn) {
      const s = churchData.sermons.find(x => x.id === notesBtn.dataset.id);
      if (s) openNotesModal(s);
    }

    // RSVP
    const rsvpBtn = e.target.closest('.open-rsvp');
    if (rsvpBtn) {
      $('#rsvpEventTitle').textContent = rsvpBtn.dataset.title;
      $('#rsvpHiddenEvent').value = rsvpBtn.dataset.title;
      $('#rsvpModal').classList.add('active');
    }

    // Calendar add
    const calBtn = e.target.closest('.add-cal');
    if (calBtn) showToast(`Added to Calendar: ${calBtn.dataset.title}`);

    // Gallery lightbox
    const galItem = e.target.closest('.gallery-item');
    if (galItem) {
      state.galleryIndex = parseInt(galItem.dataset.index, 10);
      updateLightbox();
      $('#lightboxModal').classList.add('active');
    }

    // Volunteer modal
    const volBtn = e.target.closest('.open-volunteer');
    if (volBtn) {
      const sel = $('#volunteerSelect');
      if (sel && volBtn.dataset.ministry) sel.value = volBtn.dataset.ministry;
      $('#volunteerModal').classList.add('active');
    }

    // Join life group
    const grpBtn = e.target.closest('.join-group');
    if (grpBtn) showToast(`Interest submitted for ${grpBtn.dataset.group}. The host will reach out.`);
  });

  /* --- Lightbox Nav --- */
  function updateLightbox() {
    const item = state.filteredGallery[state.galleryIndex];
    if (!item) return;
    $('#lightboxImg').src = item.image;
    $('#lightboxCaption').innerHTML = `<strong>${item.title}</strong> — ${item.caption}`;
  }

  $('#lightboxPrev')?.addEventListener('click', () => {
    state.galleryIndex = (state.galleryIndex - 1 + state.filteredGallery.length) % state.filteredGallery.length;
    updateLightbox();
  });
  $('#lightboxNext')?.addEventListener('click', () => {
    state.galleryIndex = (state.galleryIndex + 1) % state.filteredGallery.length;
    updateLightbox();
  });

  window.addEventListener('keydown', e => {
    if ($('#lightboxModal').classList.contains('active')) {
      if (e.key === 'ArrowLeft') $('#lightboxPrev').click();
      if (e.key === 'ArrowRight') $('#lightboxNext').click();
      if (e.key === 'Escape') $('#lightboxModal').classList.remove('active');
    }
  });

  function openNotesModal(s) {
    $('#notesTitle').textContent = s.title;
    $('#notesSeries').textContent = `${s.series} · ${s.speaker}`;
    $('#notesScripture').textContent = s.scripture;
    $('#notesBody').innerHTML = `
      <p style="margin-bottom:1rem;color:var(--gray-600);line-height:1.65;">${s.description}</p>
      <h4 style="margin-bottom:0.5rem;">Key Takeaways</h4>
      <ul style="padding-left:1.25rem;line-height:1.8;margin-bottom:1rem;">
        ${s.notes.map(n => `<li>${n}</li>`).join('')}
      </ul>
    `;
    $('#notesModal').classList.add('active');
  }

  /* --- Tabs --- */
  function switchTab(tabId) {
    $$('.tab-btn').forEach(t => t.classList.toggle('active', t.dataset.tab === tabId));
    $$('.tab-panel').forEach(p => p.classList.toggle('active', p.id === `panel-${tabId}`));
  }

  $$('.tab-btn').forEach(t => t.addEventListener('click', () => switchTab(t.dataset.tab)));

  /* --- Event Filters --- */
  $$('.events-filters .filter-btn').forEach(b => {
    b.addEventListener('click', () => {
      $$('.events-filters .filter-btn').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      renderEvents(b.dataset.filter);
    });
  });

  /* --- Gallery Filters --- */
  $$('.gallery-filters .filter-btn').forEach(b => {
    b.addEventListener('click', () => {
      $$('.gallery-filters .filter-btn').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      renderGallery(b.dataset.category);
    });
  });

  /* --- Giving Calculator --- */
  const amountChips = $$('.amount-chip');
  const customInput = $('#customAmount');
  const freqBtns = $$('.freq-btn');
  const fundSelect = $('#fundSelect');
  const feeCheck = $('#feeCheck');
  const totalDisplay = $('#giveTotal');

  function updateTotal() {
    let amt = state.giving.amount || 0;
    if (state.giving.coverFee) amt += amt * state.giving.feeRate;
    if (totalDisplay) totalDisplay.textContent = `$${amt.toFixed(2)}${state.giving.frequency !== 'One-Time' ? ' / ' + state.giving.frequency : ''}`;
  }

  amountChips.forEach(c => c.addEventListener('click', () => {
    amountChips.forEach(x => x.classList.remove('active'));
    c.classList.add('active');
    state.giving.amount = parseFloat(c.dataset.amount);
    if (customInput) customInput.value = '';
    updateTotal();
  }));

  customInput?.addEventListener('input', e => {
    amountChips.forEach(x => x.classList.remove('active'));
    state.giving.amount = parseFloat(e.target.value) || 0;
    updateTotal();
  });

  freqBtns.forEach(b => b.addEventListener('click', () => {
    freqBtns.forEach(x => x.classList.remove('active'));
    b.classList.add('active');
    state.giving.frequency = b.dataset.freq;
    updateTotal();
  }));

  fundSelect?.addEventListener('change', e => { state.giving.fund = e.target.value; updateTotal(); });
  feeCheck?.addEventListener('change', e => { state.giving.coverFee = e.target.checked; updateTotal(); });

  $('#giveSubmitBtn')?.addEventListener('click', e => {
    e.preventDefault();
    if (!state.giving.amount || state.giving.amount <= 0) { showToast('Please select or enter an amount.'); return; }

    const name = $('#giveName')?.value || 'Generous Partner';
    const ref = 'ANC-' + Math.floor(100000 + Math.random() * 900000);
    const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    const total = state.giving.coverFee ? (state.giving.amount * (1 + state.giving.feeRate)).toFixed(2) : state.giving.amount.toFixed(2);

    $('#receiptName').textContent = name;
    $('#receiptRef').textContent = ref;
    $('#receiptDate').textContent = today;
    $('#receiptAmount').textContent = `$${total}`;
    $('#receiptFund').textContent = state.giving.fund;
    $('#receiptFreq').textContent = state.giving.frequency;
    $('#receiptModal').classList.add('active');
    showToast('Thank you for your generous contribution!');
  });

  /* --- Form Submissions --- */
  const formActions = {
    rsvpForm: 'Registration confirmed! A confirmation email is on its way.',
    connectCardForm: 'Welcome to the family! We\u2019re glad you\u2019re here.',
    prayerForm: 'Your prayer request has been sent to our intercessory team.',
    contactForm: 'Your message has been sent. We\u2019ll get back to you soon.',
    volunteerForm: 'Thank you for volunteering! Our team will be in touch.',
    planVisitForm: 'We\u2019re looking forward to welcoming you this Sunday!'
  };

  Object.entries(formActions).forEach(([id, msg]) => {
    $(`#${id}`)?.addEventListener('submit', e => {
      e.preventDefault();
      const modal = e.target.closest('.modal-overlay');
      if (modal) modal.classList.remove('active');
      showToast(msg);
      e.target.reset();
    });
  });

  /* --- Modal Close --- */
  $$('.modal__close, .close-modal').forEach(btn => {
    btn.addEventListener('click', e => {
      const m = e.target.closest('.modal-overlay');
      if (m) m.classList.remove('active');
    });
  });

  $$('.modal-overlay').forEach(m => {
    m.addEventListener('click', e => { if (e.target === m) m.classList.remove('active'); });
  });

  /* --- Toast --- */
  function showToast(message) {
    const container = $('#toastContainer');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  window.showToast = showToast;

  /* --- Init --- */
  renderMinistries('homeMinistriesGrid', churchData.ministries.slice(0, 3));
  renderMinistries('allMinistriesGrid', churchData.ministries);
  renderSermons();
  renderEvents('All');
  renderGallery('all');
  renderLeaders();
  renderLifeGroups();
  renderFAQ();
  updateTotal();
  navigateTo(getRoute());
});
