// Ждем загрузки Leaflet перед инициализацией
function initMap() {
  // Проверяем, что Leaflet загружен
  if (typeof window === 'undefined' || typeof window.L === 'undefined') {
    console.warn('[WTB] Leaflet not loaded yet, retrying...');
    setTimeout(initMap, 100);
    return;
  }

  const L = window.L;

  // Данные дилеров и конфигурация карты загружаются из window (прокидываются из Next.js)
  const STORES = (window.WTB_DEALERS || []).map(dealer => ({
    id: dealer.id,
    name: dealer.name,
    address: [
      dealer.address1,
      dealer.address2,
      `${dealer.city}, ${dealer.provinceState} ${dealer.postalCode}`,
      dealer.country
    ].filter(Boolean).join(', '),
    phone: dealer.phone || '',
    email: dealer.email || '',
    lat: dealer.lat,
    lng: dealer.lng
  })).filter(d => d.lat != null && d.lng != null);

  // Конфигурация карты из window.WTB_CONFIG
  const MAP_CONFIG = window.WTB_CONFIG || {
    center: [45.5019, -73.5674], // Montreal по умолчанию
    zoom: 5
  };

  // --- Helpers ----
  const haversineKm = (a, b) => {
    const R = 6371;
    const toRad = d => d * Math.PI/180;
    const dLat = toRad(b.lat-a.lat);
    const dLng = toRad(b.lng-a.lng);
    const s1 = Math.sin(dLat/2)**2 +
               Math.cos(toRad(a.lat))*Math.cos(toRad(b.lat)) *
               Math.sin(dLng/2)**2;
    return R * 2 * Math.atan2(Math.sqrt(s1), Math.sqrt(1-s1));
  };

  // Numbered icon
  const numberedIcon = n => L.divIcon({
    className: "",
    html: `<div class="wtb-pin"><b>${n}</b></div>`,
    iconSize: [36, 44],
    iconAnchor: [18, 42],
    popupAnchor: [0, -40]
  });

  // --- Map init ----
  const map = L.map('wtb-map').setView(MAP_CONFIG.center, MAP_CONFIG.zoom);
  L.tileLayer(
    'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    { maxZoom: 19 }
  ).addTo(map);

  map.zoomControl.setPosition('bottomright');

  // Если есть дилеры, подгоняем карту под них
  if (STORES.length > 0) {
    const bounds = L.latLngBounds(STORES.map(s => [s.lat, s.lng]));
    map.fitBounds(bounds.pad(0.15));
  }

  // Markers
  const markers = [];
  STORES.forEach((s, i) => {
    const mk = L.marker([s.lat, s.lng], { icon: numberedIcon(i+1) })
      .addTo(map)
      .bindPopup(`<strong>${s.name}</strong><br>${s.address}`);
    markers.push(mk);
  });

  // --- Render list ---
  const listEl = document.getElementById('wtb-list');

  function renderList(arr, origin=null){
    if (!listEl) return;
    listEl.innerHTML = '';
    arr.forEach((s, i) => {
      const dist = origin ? `${haversineKm(origin, s).toFixed(1)} km` : '';
      const el = document.createElement('article');
      el.className = 'wtb-card';
      el.innerHTML = `
        <div class="wtb-bullet">${i+1}</div>
        <a class="wtb-name">${s.name}</a>
        <p class="wtb-addr">${s.address}</p>
        ${s.phone ? `<p class="wtb-phone">${s.phone}</p>`:''}
        ${s.email ? `<p class="wtb-email">${s.email}</p>`:''}
        ${dist ? `<p class="wtb-dist">${dist}</p>`:''}
      `;
      el.addEventListener('click', () => {
        map.setView([s.lat, s.lng], 14, {animate:true});
        markers[i].openPopup();
      });
      listEl.appendChild(el);
    });
  }
  renderList(STORES);

  // For Future: search by postal code
  const findBtn = document.getElementById('wtb-find');
  if (findBtn) {
    findBtn.addEventListener('click', () => {
      alert('Postal code search will be enabled with Geocoder API');
    });
  }
}

// Запускаем инициализацию после загрузки DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMap);
} else {
  initMap();
}
