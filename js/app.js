/**
 * All Nations Church NorthWest — House of Grace
 * Application Logic
 */
document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', () => {
  const state = {
    currentRoute: 'home',
    activeSermon: null,
    isPlaying: false,
    audioElement: new Audio(),
    giving: { amount: 100, frequency: 'One-Time', fund: 'Tithes & General', coverFee: false, feeRate: 0.022 }
  };

  const $ = s => document.querySelector(s);
  const $$ = s => document.querySelectorAll(s);
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const header = $('#siteHeader');
  const mobileToggle = $('#mobileToggle');
  const mobileDrawer = $('#mobileDrawer');
  const drawerOverlay = $('#drawerOverlay');
  const drawerClose = $('#drawerClose');
  const audioBar = $('#audioBar');
  const dotNav = $('#dotNav');

  /* --- Routing --- */
  const validRoutes = ['home','about','ministries','sermons','gallery','give','visit','contact'];
  const routeAliases = { connect: 'visit', events: 'home' };

  function resolveRoute(r) {
    r = (r || '').toLowerCase();
    r = routeAliases[r] || r;
    return validRoutes.includes(r) ? r : null;
  }

  function getRoute() {
    return resolveRoute(location.hash.replace('#','')) || 'home';
  }

  function navigateTo(route, opts = {}) {
    state.currentRoute = route;
    if (location.hash !== `#${route}`) history.pushState(null, '', `#${route}`);

    $$('.page-view').forEach(v => v.classList.toggle('active-view', v.id === `view-${route}`));

    $$('.nav-link, .mobile-link').forEach(l => {
      l.classList.toggle('active', l.dataset.route === route);
      if (l.dataset.route === route) l.setAttribute('aria-current', 'page');
      else l.removeAttribute('aria-current');
    });

    closeMobileDrawer();
    if (opts.subTab) switchTab(opts.subTab);
    dotNav.classList.toggle('visible', route === 'home');

    const target = opts.scrollTo && document.getElementById(opts.scrollTo);
    if (target) {
      requestAnimationFrame(() => scrollToEl(target));
    } else {
      window.scrollTo({ top: 0, behavior: opts.instant || reduceMotion ? 'auto' : 'smooth' });
    }
  }

  function scrollToEl(el) {
    const y = el.getBoundingClientRect().top + window.scrollY - header.offsetHeight;
    window.scrollTo({ top: y, behavior: reduceMotion ? 'auto' : 'smooth' });
  }

  window.addEventListener('popstate', () => navigateTo(getRoute(), { instant: true }));
  window.addEventListener('hashchange', () => navigateTo(getRoute(), { instant: true }));

  document.addEventListener('click', e => {
    const link = e.target.closest('[data-route]');
    if (link) {
      const r = resolveRoute(link.dataset.route);
      if (r) {
        e.preventDefault();
        navigateTo(r, { subTab: link.dataset.subtab, scrollTo: link.dataset.scrollto });
      }
      return;
    }
    const scroller = e.target.closest('[data-scroll]');
    if (scroller) {
      const el = $(scroller.dataset.scroll);
      if (el) scrollToEl(el);
    }
  });

  /* --- Header scroll state --- */
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 8);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* --- Mobile drawer --- */
  function openMobileDrawer() {
    mobileDrawer.classList.add('open');
    drawerOverlay.classList.add('active');
    mobileToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function closeMobileDrawer() {
    mobileDrawer.classList.remove('open');
    drawerOverlay.classList.remove('active');
    mobileToggle?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
  mobileToggle?.addEventListener('click', openMobileDrawer);
  drawerClose?.addEventListener('click', closeMobileDrawer);
  drawerOverlay?.addEventListener('click', closeMobileDrawer);

  /* --- Splash slideshow --- */
  function initSlideshow() {
    const root = $('#slides');
    if (!root) return;
    const slides = [...root.querySelectorAll('.slide')];
    const INTERVAL = 7000;
    let index = 0, timer = null, paused = false;

    if (slides.length < 2) root.querySelector('.slides__nav')?.setAttribute('hidden', '');

    function show(i) {
      index = (i + slides.length) % slides.length;
      slides.forEach((s, n) => {
        const on = n === index;
        s.classList.toggle('is-active', on);
        s.setAttribute('aria-hidden', !on);
      });
    }

    function schedule() {
      clearTimeout(timer);
      if (reduceMotion || paused || slides.length < 2) return;
      timer = setTimeout(() => { show(index + 1); schedule(); }, INTERVAL);
    }
    const go = i => { show(i); schedule(); };

    $('#slidePrev')?.addEventListener('click', () => go(index - 1));
    $('#slideNext')?.addEventListener('click', () => go(index + 1));

    // pause while the visitor is interacting or the tab is hidden
    root.addEventListener('mouseenter', () => { paused = true; clearTimeout(timer); });
    root.addEventListener('mouseleave', () => { paused = false; schedule(); });
    root.addEventListener('focusin', () => { paused = true; clearTimeout(timer); });
    root.addEventListener('focusout', () => { paused = false; schedule(); });
    document.addEventListener('visibilitychange', () => document.hidden ? clearTimeout(timer) : schedule());

    // swipe on touch screens
    let startX = null;
    root.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
    root.addEventListener('touchend', e => {
      if (startX === null) return;
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1));
      startX = null;
    });

    show(0);
    schedule();
  }

  /* --- Helpers --- */
  function parseEventDate(dateStr) {
    const parts = dateStr.split(' ');
    const month = (parts[0] || '').substring(0, 3).toUpperCase();
    let day = (parts[1] || '').replace(',', '');
    if (parts[2] === '–' || parts[2] === '-') day += '–' + (parts[3] || '').replace(',', '');
    return { month, day };
  }

  // last day of an event, e.g. "November 12 – 15, 2026" -> Nov 15 2026
  function eventEndDate(dateStr) {
    const m = dateStr.match(/^([A-Za-z]+)\s+\d+(?:\s*[–-]\s*(?:([A-Za-z]+)\s+)?(\d+))?,?\s*(\d{4})/);
    if (!m) return null;
    const [, month, endMonth, endDay, year] = m;
    const day = endDay || dateStr.match(/^[A-Za-z]+\s+(\d+)/)[1];
    const d = new Date(`${endMonth || month} ${day}, ${year}`);
    return isNaN(d) ? null : d;
  }

  /* --- Home: upcoming events --- */
  function renderHomeEvents() {
    const el = $('#homeEvents');
    if (!el) return;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const upcoming = churchData.events.filter(e => {
      const end = eventEndDate(e.date);
      return !end || end >= today;
    });
    // no upcoming events: drop the section (and its dot) from the home page
    if (!upcoming.length) { $('#home-events')?.remove(); return; }
    el.innerHTML = upcoming.map(e => {
      const d = parseEventDate(e.date);
      return `
        <li class="event">
          <div class="event__date"><span class="event__month">${d.month}</span><span class="event__day">${d.day}</span></div>
          <div>
            <h3 class="event__title">${e.title}</h3>
            <div class="event__meta"><span>${e.time}</span><span>${e.location}</span></div>
            <p class="event__desc">${e.description}</p>
          </div>
          <div class="event__actions">
            <button class="btn btn--outline btn--sm open-rsvp" data-title="${e.title}">RSVP</button>
          </div>
        </li>`;
    }).join('');
  }

  /* --- Home: ministry index --- */
  function renderHomeMinistries() {
    const el = $('#homeMinistries');
    if (!el) return;
    el.innerHTML = churchData.ministries.map(m => `
      <li><a href="#ministries" data-route="ministries" data-scrollto="ministry-${m.id}">
        <span class="ministry-index__name">${m.title}</span>
        <span class="ministry-index__when">${m.meetingTime}</span>
      </a></li>`).join('');
  }

  /* --- Ministries page --- */
  function renderMinistries() {
    const el = $('#allMinistriesGrid');
    if (!el) return;
    el.innerHTML = churchData.ministries.map(m => `
      <article class="ministry-row" id="ministry-${m.id}" data-reveal>
        <div class="ministry-row__image"><img src="${m.image}" alt="${m.title}" loading="lazy"></div>
        <div>
          <p class="eyebrow">${m.category}</p>
          <h2>${m.title}</h2>
          <p>${m.description}</p>
          <dl class="ministry-row__meta">
            <dt>Led by</dt><dd>${m.leader}</dd>
            <dt>When</dt><dd>${m.meetingTime}</dd>
          </dl>
          <button class="btn btn--primary btn--sm open-volunteer" data-ministry="${m.title}">Get involved</button>
        </div>
      </article>`).join('');

    const sel = $('#volunteerSelect');
    if (sel) {
      const extra = ['Hospitality', 'Media & Sound'];
      sel.innerHTML = [...churchData.ministries.map(m => m.title), ...extra]
        .map(t => `<option>${t}</option>`).join('');
    }
  }

  /* --- Sermons --- */
  function renderSermons() {
    const el = $('#sermonsGrid');
    if (!el) return;
    el.innerHTML = churchData.sermons.map(s => `
      <li class="sermon-row">
        <button class="sermon-row__thumb play-sermon" data-id="${s.id}" aria-label="Play: ${s.title}">
          <img src="${s.videoThumbnail}" alt="" loading="lazy">
          <span class="sermon-row__duration">${s.duration}</span>
        </button>
        <div>
          <div class="sermon-row__series">${s.series}</div>
          <h3>${s.title}</h3>
          <div class="sermon-row__meta">${s.speaker} &middot; ${s.date} &middot; ${s.scripture}</div>
        </div>
        <div class="sermon-row__actions">
          <button class="btn btn--primary btn--sm play-sermon" data-id="${s.id}">Listen</button>
          <button class="btn btn--outline btn--sm view-notes" data-id="${s.id}">Notes</button>
        </div>
      </li>`).join('');
  }

  /* --- Leadership --- */
  function renderLeaders() {
    const el = $('#leaderGrid');
    if (!el) return;
    el.innerHTML = churchData.leadership.map(l => `
      <article class="leader">
        <div class="leader__photo"><img src="${l.image}" alt="${l.name}" loading="lazy"></div>
        <h3 class="leader__name">${l.name}</h3>
        <div class="leader__role">${l.role}</div>
        <p class="leader__bio">${l.bio}</p>
      </article>`).join('');
  }

  /* --- Life Groups --- */
  function renderLifeGroups() {
    const el = $('#lifegroupsGrid');
    if (!el) return;
    el.innerHTML = churchData.lifeGroups.map(lg => `
      <li class="group">
        <div><span class="group__type">${lg.type}</span><h3>${lg.name}</h3></div>
        <div class="group__detail"><span class="label">When</span>${lg.schedule}</div>
        <div class="group__detail"><span class="label">Where</span>${lg.neighborhood}<br><span class="label" style="margin-top:.4rem">Leaders</span>${lg.leader}</div>
        <button class="btn btn--outline btn--sm join-group" data-group="${lg.name}">Join group</button>
      </li>`).join('');
  }

  /* --- FAQ --- */
  function renderFAQ() {
    const el = $('#faqList');
    if (!el) return;
    el.innerHTML = churchData.faq.map((f, i) => `
      <div class="faq-item">
        <button class="faq-question" aria-expanded="false" aria-controls="faq-${i}">
          <span>${f.question}</span>
          <span class="faq-question__icon" aria-hidden="true"></span>
        </button>
        <div class="faq-answer" id="faq-${i}"><div><p>${f.answer}</p></div></div>
      </div>`).join('');

    el.querySelectorAll('.faq-question').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = btn.closest('.faq-item');
        const wasOpen = item.classList.contains('open');
        el.querySelectorAll('.faq-item').forEach(x => {
          x.classList.remove('open');
          x.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        });
        if (!wasOpen) {
          item.classList.add('open');
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  /* --- Section dots (home) --- */
  function initDots() {
    const sections = [...$$('#view-home [data-dot]')];
    dotNav.innerHTML = sections.map(s =>
      `<button data-target="${s.id}" aria-label="${s.dataset.dot}"><span>${s.dataset.dot}</span></button>`
    ).join('');
    dotNav.addEventListener('click', e => {
      const b = e.target.closest('button');
      if (b) scrollToEl(document.getElementById(b.dataset.target));
    });
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          dotNav.querySelectorAll('button').forEach(b => b.classList.toggle('active', b.dataset.target === en.target.id));
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(s => io.observe(s));
  }

  /* --- Reveal on scroll --- */
  function initReveal() {
    const items = $$('[data-reveal]');
    if (reduceMotion || !('IntersectionObserver' in window)) {
      items.forEach(i => i.classList.add('is-visible'));
      return;
    }
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    items.forEach(i => io.observe(i));
  }

  /* --- Audio Player --- */
  const playIcon = '<svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>';
  const pauseIcon = '<svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';

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
    document.body.classList.add('player-open');

    state.audioElement.src = s.audioUrl;
    state.audioElement.play().catch(() => {});
  }

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
    document.body.classList.remove('player-open');
  });

  state.audioElement.addEventListener('timeupdate', () => {
    if (!state.audioElement.duration) return;
    const c = state.audioElement.currentTime;
    $('#audioFilled').style.width = `${(c / state.audioElement.duration) * 100}%`;
    const m = Math.floor(c / 60), s = Math.floor(c % 60);
    $('#audioTime').textContent = `${m}:${s < 10 ? '0' : ''}${s}`;
  });

  $('#audioScrubber')?.addEventListener('click', e => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    if (state.audioElement.duration) state.audioElement.currentTime = pos * state.audioElement.duration;
  });

  /* --- Global Click Handlers --- */
  function openModal(id) { $(id).classList.add('active'); }

  document.addEventListener('click', e => {
    const playBtn = e.target.closest('.play-sermon');
    if (playBtn) playSermon(playBtn.dataset.id || churchData.sermons[0].id);

    const notesBtn = e.target.closest('.view-notes');
    if (notesBtn) {
      const s = churchData.sermons.find(x => x.id === notesBtn.dataset.id);
      if (s) openNotesModal(s);
    }

    const rsvpBtn = e.target.closest('.open-rsvp');
    if (rsvpBtn) {
      $('#rsvpEventTitle').textContent = rsvpBtn.dataset.title;
      $('#rsvpHiddenEvent').value = rsvpBtn.dataset.title;
      openModal('#rsvpModal');
    }


    const volBtn = e.target.closest('.open-volunteer');
    if (volBtn) {
      const sel = $('#volunteerSelect');
      if (sel && volBtn.dataset.ministry) sel.value = volBtn.dataset.ministry;
      openModal('#volunteerModal');
    }

    const grpBtn = e.target.closest('.join-group');
    if (grpBtn) showToast(`Thanks! The leaders of ${grpBtn.dataset.group} will reach out.`);
  });

  window.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      $$('.modal-overlay.active').forEach(m => m.classList.remove('active'));
      closeMobileDrawer();
    }
  });

  function openNotesModal(s) {
    $('#notesTitle').textContent = s.title;
    $('#notesSeries').textContent = `${s.series} · ${s.speaker}`;
    $('#notesScripture').textContent = s.scripture;
    $('#notesBody').innerHTML = `
      <p>${s.description}</p>
      <h4>Key takeaways</h4>
      <ul class="notes-list">${s.notes.map(n => `<li>${n}</li>`).join('')}</ul>`;
    openModal('#notesModal');
  }

  /* --- Tabs --- */
  function switchTab(tabId) {
    $$('.tab-btn').forEach(t => {
      const on = t.dataset.tab === tabId;
      t.classList.toggle('active', on);
      t.setAttribute('aria-selected', on);
    });
    $$('.tab-panel').forEach(p => p.classList.toggle('active', p.id === `panel-${tabId}`));
  }
  $$('.tab-btn').forEach(t => t.addEventListener('click', () => switchTab(t.dataset.tab)));

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
    if (totalDisplay) totalDisplay.textContent = `$${amt.toFixed(2)}${state.giving.frequency !== 'One-Time' ? ' / ' + state.giving.frequency.toLowerCase() : ''}`;
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
    openModal('#receiptModal');
  });

  /* --- Form Submissions --- */
  const formActions = {
    rsvpForm: 'You’re registered. A confirmation email is on its way.',
    connectCardForm: 'Thank you. Someone from our team will be in touch soon.',
    prayerForm: 'Your prayer request has been sent to our prayer team.',
    contactForm: 'Your message has been sent. We’ll get back to you soon.',
    volunteerForm: 'Thank you for volunteering. A ministry leader will be in touch.',
    planVisitForm: 'Thank you. We look forward to welcoming you on Sunday.'
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
    btn.addEventListener('click', e => e.target.closest('.modal-overlay')?.classList.remove('active'));
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
    }, 3800);
  }
  window.showToast = showToast;

  /* --- Init --- */
  initSlideshow();
  renderHomeEvents();
  renderHomeMinistries();
  renderMinistries();
  renderSermons();
  renderLeaders();
  renderLifeGroups();
  renderFAQ();
  updateTotal();
  initDots();
  initReveal();
  navigateTo(getRoute(), { instant: true });
});
