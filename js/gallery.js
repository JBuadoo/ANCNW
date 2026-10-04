/**
 * All Nations Church NorthWest — Gallery
 * Password-protected photo albums. Album photo lists are encrypted in
 * js/gallery-data.js (see tools/gallery.mjs) and only decrypted in the
 * browser once the right password is entered. The password itself is never
 * stored in the site.
 */
document.addEventListener('DOMContentLoaded', () => {
  if (typeof galleryVault === 'undefined') return;

  const $ = s => document.querySelector(s);
  const albums = galleryVault.albums;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const albumIndex = $('#albumIndex');
  const albumGrid = $('#albumGrid');
  const albumView = $('#albumView');
  const collage = $('#albumCollage');
  const unlockModal = $('#unlockModal');
  const unlockForm = $('#unlockForm');
  const unlockInput = $('#unlockPassword');
  const unlockError = $('#unlockError');
  const unlockSubmit = $('#unlockSubmit');
  const viewer = $('#viewerModal');
  const viewerImg = $('#viewerImg');

  let key = null;              // derived once per visit, kept in memory only
  const opened = new Map();    // album id -> decrypted photo list
  let pending = null;          // album waiting on the password
  let current = null;          // { album, photos }
  let index = 0;

  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const plural = n => `${n} photo${n === 1 ? '' : 's'}`;

  /* --- Crypto (must match tools/gallery.mjs) --- */
  const unb64 = s => Uint8Array.from(atob(s), c => c.charCodeAt(0));

  async function deriveKey(password) {
    const base = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveKey']);
    return crypto.subtle.deriveKey(
      { name: 'PBKDF2', salt: unb64(galleryVault.kdf.salt), iterations: galleryVault.kdf.iterations, hash: 'SHA-256' },
      base, { name: 'AES-GCM', length: 256 }, false, ['decrypt']
    );
  }

  async function decrypt(k, album) {
    const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: unb64(album.iv) }, k, unb64(album.data));
    return JSON.parse(new TextDecoder().decode(plain)).photos;
  }

  /* --- Album folders --- */
  function renderAlbums() {
    if (!albums.length) {
      albumGrid.innerHTML = '<li class="albums__empty">New albums are on the way. Check back soon.</li>';
      return;
    }
    albumGrid.innerHTML = albums.map(a => `
      <li>
        <button class="album${opened.has(a.id) ? ' is-unlocked' : ''}" data-album="${esc(a.id)}" aria-label="Open album: ${esc(a.title)}, ${plural(a.count)}">
          <span class="album__cover">
            <img src="${esc(a.cover)}" alt="" loading="lazy" width="1200" height="900">
            <span class="album__lock" aria-hidden="true">
              <svg class="album__lock-closed" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="10" rx="1.5"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>
              <svg class="album__lock-open" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="10" rx="1.5"/><path d="M8 11V7a4 4 0 0 1 7.8-1.2"/></svg>
            </span>
            <span class="album__badge">${plural(a.count)}</span>
          </span>
          <span class="album__body">
            <span class="album__date">${esc(a.date)}</span>
            <span class="album__title">${esc(a.title)}</span>
            <span class="album__cta">View album</span>
          </span>
        </button>
      </li>`).join('');
  }

  albumGrid.addEventListener('click', async e => {
    const btn = e.target.closest('[data-album]');
    if (!btn) return;
    const album = albums.find(a => a.id === btn.dataset.album);
    if (!album) return;

    if (opened.has(album.id)) return openAlbum(album);
    if (key) {
      try {
        opened.set(album.id, await decrypt(key, album));
        return openAlbum(album);
      } catch { /* key doesn't fit this album; ask again */ }
    }
    askPassword(album);
  });

  /* --- Password --- */
  function askPassword(album) {
    pending = album;
    $('#unlockTitle').textContent = album.title;
    unlockError.textContent = '';
    unlockForm.reset();
    unlockModal.classList.add('active');
    setTimeout(() => unlockInput.focus(), 60);
  }

  unlockForm.addEventListener('submit', async e => {
    e.preventDefault();
    if (!pending) return;
    if (!window.crypto?.subtle) {
      unlockError.textContent = 'Your browser can’t open private albums here. Please try a current browser over https.';
      return;
    }
    unlockSubmit.disabled = true;
    unlockSubmit.textContent = 'Checking…';
    unlockError.textContent = '';
    try {
      const k = await deriveKey(unlockInput.value.trim());
      const photos = await decrypt(k, pending);
      key = k;
      opened.set(pending.id, photos);
      unlockModal.classList.remove('active');
      openAlbum(pending);
      pending = null;
    } catch {
      unlockError.textContent = 'That password isn’t right. Please try again.';
      unlockInput.select();
    } finally {
      unlockSubmit.disabled = false;
      unlockSubmit.textContent = 'View photos';
    }
  });

  /* --- Album collage --- */
  function openAlbum(album) {
    const photos = opened.get(album.id);
    current = { album, photos };

    $('#albumTitle').textContent = album.title;
    $('#albumDate').textContent = album.date;
    $('#albumCount').textContent = plural(photos.length);

    // justified rows: each tile grows in proportion to its aspect ratio
    collage.innerHTML = photos.map(([url, w, h], i) => {
      const ar = (w / h).toFixed(4);
      return `
        <button class="collage__item" data-index="${i}" style="--ar:${ar}" aria-label="View photo ${i + 1} of ${photos.length}">
          <img src="${url}=w${Math.round(640 * w / h)}-h640" alt="" loading="lazy" referrerpolicy="no-referrer">
        </button>`;
    }).join('');

    albumIndex.hidden = true;
    albumView.hidden = false;
    renderAlbums();
    scrollToGallery();
  }

  function showIndex() {
    if (albumView.hidden) return;
    albumView.hidden = true;
    albumIndex.hidden = false;
    collage.innerHTML = '';
    current = null;
  }

  function scrollToGallery() {
    const top = albumView.closest('.section').getBoundingClientRect().top + window.scrollY - $('#siteHeader').offsetHeight;
    window.scrollTo({ top, behavior: reduceMotion ? 'auto' : 'smooth' });
  }

  $('#albumBack').addEventListener('click', () => { showIndex(); scrollToGallery(); });

  // the Gallery link always lands on the folders
  document.addEventListener('click', e => { if (e.target.closest('[data-route="gallery"]')) showIndex(); });

  collage.addEventListener('click', e => {
    const item = e.target.closest('.collage__item');
    if (item) openViewer(+item.dataset.index);
  });

  /* --- Viewer --- */
  const full = url => `${url}=w2400-h2400`;

  function show(i) {
    const { photos, album } = current;
    index = (i + photos.length) % photos.length;
    const [url] = photos[index];

    viewer.classList.add('is-loading');
    viewerImg.onload = () => viewer.classList.remove('is-loading');
    viewerImg.src = full(url);
    viewerImg.alt = `${album.title}, photo ${index + 1} of ${photos.length}`;

    $('#viewerTitle').textContent = album.title;
    $('#viewerCount').textContent = `${index + 1} / ${photos.length}`;
    const dl = $('#viewerDownload');
    dl.href = `${url}=d`;
    dl.setAttribute('download', `${album.id}-${index + 1}.jpg`);

    // warm the neighbours so paging feels instant
    [index - 1, index + 1].forEach(n => { new Image().src = full(photos[(n + photos.length) % photos.length][0]); });
  }

  function openViewer(i) {
    show(i);
    viewer.classList.add('active');
    document.documentElement.classList.add('viewer-open');
  }

  function closeViewer() {
    viewer.classList.remove('active');
    document.documentElement.classList.remove('viewer-open');
  }

  $('#viewerPrev').addEventListener('click', () => show(index - 1));
  $('#viewerNext').addEventListener('click', () => show(index + 1));
  $('#viewerClose').addEventListener('click', closeViewer);
  viewer.addEventListener('click', e => { if (e.target === viewer || e.target.id === 'viewerStage') closeViewer(); });

  window.addEventListener('keydown', e => {
    if (e.key === 'Escape') return closeViewer();   // app.js may already have hidden the overlay
    if (!viewer.classList.contains('active')) return;
    if (e.key === 'ArrowLeft') show(index - 1);
    if (e.key === 'ArrowRight') show(index + 1);
  });

  // swipe on touch screens
  let startX = null;
  viewer.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  viewer.addEventListener('touchend', e => {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) show(index + (dx < 0 ? 1 : -1));
    startX = null;
  });

  renderAlbums();
});
