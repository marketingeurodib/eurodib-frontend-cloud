/* =========================
   Eurodib — Our Reps (US/CA)
   Полный JS для интерактивной карты
   ========================= */

/* ---------- CONFIG ---------- */
const EDB_COLORS = {
  activeFill: '#2C6BED',     // бренд-синий (активный)
  activeStroke: '#2C6BED',
  hoverFill:  '#88a8f5',     // светлее для hover
  hoverStroke:'#6b87ff',
  baseFill:   '#a8bcff',     // базовый цвет заливки
  baseStroke: '#6b87ff'
};

// Локальные файлы (рекомендуется) + fallback на RAW GitHub, если локальные не найдены
const dataSrc = {
  us: {
    local:  'data/us-states.geojson',
    remote: 'https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json',
    keyField: 'name',
    bounds: [[24.396308,-124.848974],[49.384358,-66.885444]]
  },
  ca: {
    local:  'data/canada.geojson',
    remote: 'https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/canada.geojson',
    keyField: 'name',
    bounds: [[41.7,-141.0],[83.2,-52.6]]
  }
};

/* ---------- BUSINESS DATA (сокращено под задачу; заполнил все блоки, как вы давали) ---------- */
const repsDataUS = [
  { region:'Alabama | Florida Panhandle & Tennessee | Georgia', areas:['Alabama','Tennessee','Georgia','Florida'],
    contacts:[{name:'Fabio Capparelli', phone:'cell: 845 653-2797', email:'#'}] },
  { region:'Alaska | Idaho | Oregon | W. Montana | Washington',
    areas:['Alaska','Idaho','Oregon','Montana','Washington'],
    company:'Hybrid Marketing', address:'13023 NE HWY 99 Suite-23, Vancouver, WA 98686',
    contacts:[{name:'Rob Burch', phone:'office: 360 597-3100', email:'#'},{name:'', phone:'cell: 503 806-4378'}] },
  { region:'Albany | Buffalo | New York Upstate | Rochester | Syracuse',
    areas:['New York'], company:'Louis Tellier USA',
    address:'334 Cornelia, Suite #263, Plattsburgh, NY 12901',
    contacts:[{name:'', phone:'888 483-5543', email:'#'}] },
  { region:'Arkansas | Louisiana | Mississippi',
    areas:['Arkansas','Louisiana','Mississippi'],
    company:'Leonard Sales & Jayhawk Central DC',
    address:'195 Matthews Dr., Hot Spring, AR 71901',
    contacts:[
      {name:'Sue Burnett', phone:'cell: 405 229-3180', email:'#'},
      {name:'Keith Larmeu', phone:'cell: 504 676-5285', email:'#', address:'107 Greenbank Ln. Yountville , LA 70592'},
      {name:'Carr Carothers', email:'#', address:'2613 Industrial Ln, Garland, TX 75041'}
    ]},
  { region:'Arizona | California | Nevada', areas:['Arizona','California','Nevada'],
    company:'R & B Wholesale Distributors',
    address:'2350 South Milliken Ave., Ontario, CA 91761 • 25425 Industrial Blvd, Hayward, CA 94545',
    website:'www.rbdist.com',
    contacts:[{name:'Marikay Early', phone:'tel: 909 230-5410 • fax: 909 230-5415', email:'#'}] },
  { region:'Carolina North & South', areas:['North Carolina','South Carolina'],
    contacts:[{name:'Fabio Capparelli', phone:'cell: 845 653-2797', email:'#'}] },
  { region:'Colorado | New Mexico | Utah | Wyoming',
    areas:['Colorado','New Mexico','Utah','Wyoming'],
    company:'S3 Hospitality', address:'4707 Lima St., Denver, CO 80239',
    phone:'tel: 303 761-0241', fax:'fax: 303 761-1222',
    contacts:[{name:'Amy Roth', phone:'cell: 303 910-6794', email:'#'},{name:'Bob Swam', phone:'cell: 970 691-0539', email:'#'}] },
  { region:'Connecticut | Maine | Massachusetts | New Hampshire | Rhode Island | Vermont',
    areas:['Connecticut','Maine','Massachusetts','New Hampshire','Rhode Island','Vermont'],
    contacts:[{name:'Shaun McDonald', phone:'tel: 888 956-6866 ext #208 • cell: 514-968-0815', email:'#'}] },
  { region:'Delaware | Pennsylvania | Philadelphia | South New Jersey',
    areas:['Delaware','Pennsylvania','New Jersey'],
    company:'Mid-Atlantic Hospitality Sales',
    address:'701 West Rolling Road, Springfield, PA 19064',
    website:'www.mahsales.com',
    contacts:[
      {name:'Leon Worrell', email:'#', address:'427 Darby Paoli Road, Wayne, PA 19086'},
      {name:'Heather Worrell', email:'#', address:'106 Oakford Circle, Wayne, PA 19087', phone:'tel: 877 953-7241 • fax: 877 953-2086'}
    ]},
  { region:'Florida', areas:['Florida'], company:'Avision Sales Group',
    address:'Coral Springs, FL — Corporate Office',
    contacts:[
      {name:'Paul Schmitt', email:'#', phone:'Tel: 561 272-7824 • Fax: 561 279-1352', note:'Delray Beach Branch — East Coast Vero Beach South to Key West; PR & Caribbean'},
      {name:'J.D. Dinsmore', email:'#', phone:'cell: 678 360-2992', note:'Orlando Branch — Melbourne North to Jacksonville; Orlando'},
      {name:'Steever Flannigan', email:'#', phone:'cell: 706 255-5158'},
      {name:'Chris Kessler', email:'#', phone:'cell: 404 858-6188'},
      {name:'Michele Brainard', email:'#', phone:'cell: 630 586-6895'},
      {name:'Tim Trainor Jr.', email:'#', phone:'cell: 484 401-0977 • office: 484 401-0977', note:'Tampa Branch — West Coast Tampa North & South'}
    ]},
  { region:'Illinois | Indiana | Kentucky | Michigan | Ohio',
    areas:['Illinois','Indiana','Kentucky','Michigan','Ohio'],
    company:'Kappus', website:'Kappus web site',
    contacts:[
      {name:'Amanda Harley', email:'#', phone:'Taylor Manager | Ohio North — 216 534-1725'},
      {name:'Hannah Southern', email:'#', phone:'Taylor | Ohio South — 216 244-7280'},
      {name:'Chris Weinel', email:'#', phone:'HP Manager | Columbus/Dayton/Cinci — 937 416-0084'},
      {name:'Howard Hale', email:'#', phone:'HP Northern Indiana | NW Ohio — 937 369-3081'},
      {name:'Tom Heiser', email:'#', phone:'HP Kentucky — 937 367-2655'},
      {name:'Josh Smith', email:'#', phone:'HP Eastern Ohio | WV — 216 375-1846'},
      {name:'Rick Berry', email:'#', phone:'HP PA — 724 640-0318'},
      {name:'Mark DeCarlucci', email:'#', phone:'HP PA — 724 640-0315'}
    ]},
  { region:'Minnesota | North & South Dakota | Wisconsin',
    areas:['Minnesota','North Dakota','South Dakota','Wisconsin'],
    company:'The Waite Group', address:'13750 West Morningview, New Berlin, WI 53151',
    website:'www.thewaiternow.com', phone:'tel: 262 796-0046',
    contacts:[{name:'Bob Waite', email:'#', phone:'cell: 262 853-2222'},{name:'Matt Waite', email:'#', phone:'cell: 262 853-8883'}] },
  { region:'New York City | North New Jersey',
    areas:['New York','New Jersey'],
    contacts:[{name:'Charlie Landis', email:'#', phone:'tel: 516 551-8442 • fax: 631 223-2125', address:'20 E Rogues Path, Huntington Station, NY 11748'}] },
  { region:'Oklahoma | Texas',
    areas:['Oklahoma','Texas'],
    company:'New Generation Sales & Marketing', address:'8318 Sterling St., Irving, TX 75063',
    contacts:[
      {name:'James Enman', email:'#', phone:'tel: 702 292-9622'},
      {name:'Vince Ramos', email:'#', phone:'tel: 469 284-5400', note:'Dallas–Fort Worth and Oklahoma'},
      {name:'Bailey Bryan', email:'#', phone:'office: 469 284-5400 • cell: 601 503-3225', note:'Dallas–Fort Worth'}
    ]}
];

const repsDataCA = [
  { region:'Alberta | Northwest Territories', areas:['Alberta','Northwest Territories'],
    company:'Mac Sales & Marketing', address:'215 Cannell Place SW, Calgary, AB T2W 1T6', website:'www.macsaleskitchen.com',
    contacts:[{name:'Steve Mackell', email:'#', phone:'tel: 403 281-8540 • cell: 403 607-2537 • fax: 403 281-9280'}] },
  { region:'British Columbia', areas:['British Columbia'], company:'Eurodib', website:'www.eurodib.com',
    contacts:[{name:'Alexandre Dumaine — Canada Sales Manager', email:'#', phone:'toll free: 888 956-6866 ext. 238'}] },
  { region:'Ontario', areas:['Ontario'], company:'Eurodib', website:'www.eurodib.com',
    contacts:[{name:'Lito Armada — Ontario Sales Manager', email:'#', phone:'cell: 647 545-9565'}] },
  { region:'Québec', areas:['Quebec'], company:'Eurodib',
    address:'120 rue de La Barre, Boucherville QC J4B 2X7 | office: 1 888 956-6866 | fax: 1 877 956-6867',
    website:'www.eurodib.com',
    contacts:[{name:'Claude Bourgeois — Quebec Sales Manager', email:'#', phone:'cell: 514 212-1512'},
              {name:'Marie-Ève Tremblay — Regional Sales Manager', email:'#', phone:'cell: 514 996-4724'}] }
];

/* ---------- MAP ---------- */
const map = L.map('edbRepsMap', { zoomControl: true, scrollWheelZoom: true });
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap' }).addTo(map);
// стартовый вид — сразу над США
map.setView([39.5, -98.35], 4);

const layerGroup = L.layerGroup().addTo(map);
let activeCountry = 'us';
let geoLayer = null;
let geojsonIndex = {};     // name → layer
let activeAreas = new Set();

/* ---------- HELPERS ---------- */
const codeMapUS = {AL:'Alabama',AK:'Alaska',AZ:'Arizona',AR:'Arkansas',CA:'California',CO:'Colorado',CT:'Connecticut',DE:'Delaware',FL:'Florida',GA:'Georgia',HI:'Hawaii',ID:'Idaho',IL:'Illinois',IN:'Indiana',IA:'Iowa',KS:'Kansas',KY:'Kentucky',LA:'Louisiana',ME:'Maine',MD:'Maryland',MA:'Massachusetts',MI:'Michigan',MN:'Minnesota',MS:'Mississippi',MO:'Missouri',MT:'Montana',NE:'Nebraska',NV:'Nevada',NH:'New Hampshire',NJ:'New Jersey',NM:'New Mexico',NY:'New York',NC:'North Carolina',ND:'North Dakota',OH:'Ohio',OK:'Oklahoma',OR:'Oregon',PA:'Pennsylvania',RI:'Rhode Island',SC:'South Carolina',SD:'South Dakota',TN:'Tennessee',TX:'Texas',UT:'Utah',VT:'Vermont',VA:'Virginia',WA:'Washington',WI:'Wisconsin',WV:'West Virginia',WY:'Wyoming'};
const codeMapCA = {AB:'Alberta',BC:'British Columbia',MB:'Manitoba',NB:'New Brunswick',NL:'Newfoundland and Labrador',NS:'Nova Scotia',NT:'Northwest Territories',NU:'Nunavut',ON:'Ontario',PE:'Prince Edward Island',QC:'Quebec',SK:'Saskatchewan',YT:'Yukon'};

async function fetchJsonWithFallback(localUrl, remoteUrl){
  try{
    const r = await fetch(localUrl, {cache:'no-cache'});
    if(!r.ok) throw new Error(`HTTP ${r.status}`);
    return await r.json();
  }catch(e){
    // пробуем удалённый
    const r2 = await fetch(remoteUrl, {cache:'no-cache'});
    if(!r2.ok) throw new Error(`HTTP ${r2.status}`);
    return await r2.json();
  }
}

function repDataList(){
  return activeCountry==='us' ? repsDataUS : repsDataCA;
}
function byAreaName(name){
  const list = repDataList();
  return list.find(r => r.areas.some(a => a.toLowerCase() === name.toLowerCase()));
}

function renderPanel(payload){
  const root = document.getElementById('edbRepsResults');
  root.innerHTML = '';
  if(!payload){
    root.innerHTML = '<p style="color:var(--edb-muted)">Click a state/province or search by ZIP/Postal code.</p>';
    return;
  }
  const mk = (html)=>{ const d=document.createElement('div'); d.className='edb-reps__rep'; d.innerHTML=html; return d; };
  const head = document.createElement('div');
  head.className='edb-reps__rep';
  head.innerHTML = `<strong>${payload.region}</strong>${payload.company? `<div>${payload.company}</div>`:''}${payload.address?`<div>${payload.address}</div>`:''}${payload.website?`<div>${payload.website}</div>`:''}`;
  root.appendChild(head);
  (payload.contacts||[]).forEach(c=>{
    const email = c.email && c.email !== '#' ? `<a href="mailto:${c.email}">${c.email}</a>` : (c.email?'<a href="#">send email</a>':'');
    root.appendChild(mk(`
      ${c.name?`<strong>${c.name}</strong>`:''}
      ${c.address?`<div>${c.address}</div>`:''}
      ${email?`<div>${email}</div>`:''}
      ${c.phone?`<div>${c.phone}</div>`:''}
      ${c.note?`<div style="color:var(--edb-muted)">${c.note}</div>`:''}
    `));
  });
}

/* ---------- LOAD COUNTRY & INTERACTION ---------- */
async function loadCountry(country){
  activeCountry = country;
  document.querySelectorAll('.edb-reps__tab')
    .forEach(btn => btn.setAttribute('aria-selected', btn.dataset.target === country));

  layerGroup.clearLayers();
  geojsonIndex = {};
  activeAreas.clear();

  const cfg = dataSrc[country];
  let gj;
  try{
    gj = await fetchJsonWithFallback(cfg.local, cfg.remote);
  }catch(err){
    console.error('[EDB-REPS] Failed to load GeoJSON:', cfg.local, '→', cfg.remote, err);
    document.getElementById('edbRepsResults').innerHTML =
      `<div class="edb-reps__rep"><strong>Could not load boundaries</strong><div>${cfg.local}</div></div>`;
    return;
  }

  const styleBase = ()=>({ color: EDB_COLORS.baseStroke, weight: 1, fillColor: EDB_COLORS.baseFill, fillOpacity: .25 });
  const onEach = (feature, layer)=>{
    const name = feature.properties[cfg.keyField];
    geojsonIndex[name] = layer;
    layer.on({
      mouseover: (e)=>{
        if(activeAreas.has(name)) return; // не перебивать активную
        e.target.setStyle({ fillColor: EDB_COLORS.hoverFill, fillOpacity: .45, color: EDB_COLORS.hoverStroke, weight: 1.5 });
        e.target.bringToFront();
      },
      mouseout: (e)=>{
        if(activeAreas.has(name)) return;
        geoLayer.resetStyle(e.target);
      },
      click: ()=>{
        // Сброс всех активных
        activeAreas.clear();
        Object.values(geojsonIndex).forEach(l => geoLayer.resetStyle(l));
        // Активируем весь регион (все области из reps)
        const hit = byAreaName(name);
        const toFocus = hit ? hit.areas : [name];
        toFocus.forEach(n=>{
          const lay = geojsonIndex[n];
          if(lay){
            activeAreas.add(n);
            lay.setStyle({ fillColor: EDB_COLORS.activeFill, fillOpacity: .55, color: EDB_COLORS.activeStroke, weight: 2 });
          }
        });
        // FitBounds по первой области
        const first = geojsonIndex[toFocus[0]];
        if(first) map.fitBounds(first.getBounds(), { maxZoom: 6 });
        renderPanel(hit);
      }
    });
    layer.setStyle({ cursor:'pointer' });
  };

  geoLayer = L.geoJSON(gj.features, { style: styleBase, onEachFeature: onEach }).addTo(layerGroup);
  map.fitBounds(cfg.bounds);
  renderPanel(null);
}

/* ---------- SEARCH ---------- */
async function lookupAndZoom(query){
  query = (query||'').trim();
  if(!query) return;

  const codes = activeCountry==='us' ? codeMapUS : codeMapCA;

  // 1) 2-буквенный код
  const codeHit = codes[query.toUpperCase()];
  if(codeHit && geojsonIndex[codeHit]){
    selectAreas([codeHit]);
    renderPanel(byAreaName(codeHit));
    return;
  }
  // 2) Полное имя
  const byName = Object.keys(geojsonIndex).find(n => n.toLowerCase() === query.toLowerCase());
  if(byName){
    selectAreas([byName]);
    renderPanel(byAreaName(byName));
    return;
  }
  // 3) ZIP/Postal → координаты через zippopotam.us
  const cc = activeCountry==='us' ? 'us' : 'ca';
  try{
    const r = await fetch(`https://api.zippopotam.us/${cc}/${encodeURIComponent(query)}`);
    if(!r.ok) throw new Error('not found');
    const j = await r.json();
    const p = j.places && j.places[0];
    if(p){
      const ll = L.latLng(parseFloat(p.latitude), parseFloat(p.longitude));
      let hitName = null;
      for(const [name, layer] of Object.entries(geojsonIndex)){
        if(layer.getBounds().contains(ll)){ hitName = name; break; }
      }
      if(hitName){
        selectAreas([hitName]);
        renderPanel(byAreaName(hitName));
        map.setView(ll, 7);
        return;
      }
    }
    alert('No match found for this code.');
  }catch(e){
    alert('Could not resolve this ZIP/Postal code.');
  }
}

function selectAreas(areaNames){
  activeAreas.clear();
  Object.values(geojsonIndex).forEach(l => geoLayer.resetStyle(l));
  areaNames.forEach(name=>{
    const layer = geojsonIndex[name];
    if(layer){
      activeAreas.add(name);
      layer.setStyle({ fillColor: EDB_COLORS.activeFill, fillOpacity: .55, color: EDB_COLORS.activeStroke, weight: 2 });
      map.fitBounds(layer.getBounds(), { maxZoom: 6 });
    }
  });
}

/* ---------- UI BINDINGS ---------- */
document.getElementById('edbRepsFind').addEventListener('click', () => lookupAndZoom(document.getElementById('edbRepsQuery').value));
document.getElementById('edbRepsQuery').addEventListener('keydown', e => {
  if(e.key==='Enter'){ e.preventDefault(); lookupAndZoom(e.target.value); }
});
document.querySelectorAll('.edb-reps__tab').forEach(btn=>{
  btn.addEventListener('click', ()=> loadCountry(btn.dataset.target));
});

/* ---------- BOOT ---------- */
loadCountry('us');
