const routes = [
  {
    id: 'ACX-102',
    mode: 'Bus',
    operator: 'CityLink',
    origin: 'Downtown',
    destination: 'Uptown',
    depart: '2024-05-18T08:15:00',
    durationMinutes: 32,
    price: 4.5,
    seats: 12,
    eco: 'A',
    features: ['Wi‑Fi', 'Wheelchair', 'USB power'],
  },
  {
    id: 'AMT-220',
    mode: 'Train',
    operator: 'MetroRail',
    origin: 'Union Station',
    destination: 'Harbor',
    depart: '2024-05-18T09:05:00',
    durationMinutes: 18,
    price: 5.25,
    seats: 81,
    eco: 'A+',
    features: ['Quiet car', 'Bike racks'],
  },
  {
    id: 'VLT-400',
    mode: 'Ferry',
    operator: 'BayFerry',
    origin: 'Harbor',
    destination: 'Island Pier',
    depart: '2024-05-18T10:20:00',
    durationMinutes: 26,
    price: 7.0,
    seats: 53,
    eco: 'B',
    features: ['Open deck', 'Snacks'],
  },
  {
    id: 'RDX-014',
    mode: 'Carpool',
    operator: 'RideShareX',
    origin: 'Downtown',
    destination: 'Tech Park',
    depart: '2024-05-18T08:45:00',
    durationMinutes: 22,
    price: 9.5,
    seats: 2,
    eco: 'C',
    features: ['EV', 'Quiet ride'],
  },
  {
    id: 'MIC-301',
    mode: 'Bike',
    operator: 'Spin eBike',
    origin: 'Central Plaza',
    destination: 'Tech Park',
    depart: '2024-05-18T08:10:00',
    durationMinutes: 16,
    price: 3.75,
    seats: 1,
    eco: 'A+',
    features: ['Helmet optional', 'Smart lock'],
  },
  {
    id: 'AMT-245',
    mode: 'Train',
    operator: 'MetroRail',
    origin: 'Union Station',
    destination: 'Airport',
    depart: '2024-05-18T11:05:00',
    durationMinutes: 32,
    price: 8.25,
    seats: 125,
    eco: 'A',
    features: ['USB power', 'Tray tables'],
  },
  {
    id: 'ACX-140',
    mode: 'Bus',
    operator: 'CityLink',
    origin: 'Uptown',
    destination: 'Airport',
    depart: '2024-05-18T12:15:00',
    durationMinutes: 48,
    price: 6.0,
    seats: 18,
    eco: 'B+',
    features: ['Wi‑Fi', 'Express'],
  },
];

const alerts = [
  'Rail maintenance near Union Station after 9:30 PM; expect 10-minute delays.',
  'Harbor Ferry deck is closed due to weather. Seating moved to lower cabin.',
  'CityLink buses running on detour through 5th Avenue between 3-5 PM.',
];

const form = document.getElementById('search-form');
const resultContainer = document.getElementById('results');
const resultCount = document.getElementById('result-count');
const cartList = document.getElementById('cart');
const cartCount = document.getElementById('cart-count');
const cartSummary = document.getElementById('cart-summary');
const searchMeta = document.getElementById('search-meta');
const alertsList = document.getElementById('alerts');

const resultTemplate = document.getElementById('result-template');
const cartTemplate = document.getElementById('cart-template');

const cart = [];

function formatTime(isoString) {
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

function formatDate(isoString) {
  const date = new Date(isoString);
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

function arrivalTime(route) {
  const depart = new Date(route.depart);
  const arrival = new Date(depart.getTime() + route.durationMinutes * 60000);
  return formatTime(arrival.toISOString());
}

function describeRoute(route) {
  return `${route.operator} • ${route.mode} • ${route.durationMinutes} min`;
}

function renderAlerts() {
  alertsList.innerHTML = '';
  alerts.forEach((text) => {
    const li = document.createElement('li');
    li.textContent = text;
    alertsList.appendChild(li);
  });
}

function renderCart() {
  cartList.innerHTML = '';
  cart.forEach((item) => {
    const node = cartTemplate.content.firstElementChild.cloneNode(true);
    node.querySelector('.route').textContent = `${item.origin} → ${item.destination}`;
    node.querySelector('.schedule').textContent = `${formatDate(item.depart)} • ${formatTime(item.depart)} → ${arrivalTime(item)}`;
    node.querySelector('.price').textContent = `$${item.price.toFixed(2)}`;
    cartList.appendChild(node);
  });

  const total = cart.reduce((sum, item) => sum + item.price, 0);
  const minutes = cart.reduce((sum, item) => sum + item.durationMinutes, 0);
  cartSummary.textContent = cart.length
    ? `Holding ${cart.length} trip${cart.length > 1 ? 's' : ''} • $${total.toFixed(2)} • ${minutes} minutes combined`
    : 'No trips saved yet.';
  cartCount.textContent = `${cart.length} saved`;
}

function renderRoutes(filteredRoutes) {
  resultContainer.innerHTML = '';
  filteredRoutes.forEach((route) => {
    const node = resultTemplate.content.firstElementChild.cloneNode(true);
    node.querySelector('.mode').textContent = route.mode;
    node.querySelector('.route').textContent = `${route.origin} → ${route.destination}`;
    node.querySelector('.details').textContent = describeRoute(route);
    node.querySelector('.price').textContent = `$${route.price.toFixed(2)}`;
    node.querySelector('.schedule').textContent = `${formatDate(route.depart)} • ${formatTime(route.depart)} → ${arrivalTime(route)}`;
    node.querySelector('.seats').textContent = `${route.seats} seats left`;
    node.querySelector('.eco').textContent = `Eco ${route.eco}`;

    const tagContainer = node.querySelector('.tags');
    route.features.forEach((feature) => {
      const tag = document.createElement('span');
      tag.className = 'tag';
      tag.textContent = feature;
      tagContainer.appendChild(tag);
    });

    node.querySelector('button.book').addEventListener('click', () => {
      cart.push(route);
      renderCart();
    });

    resultContainer.appendChild(node);
  });
  resultCount.textContent = `${filteredRoutes.length} result${filteredRoutes.length === 1 ? '' : 's'}`;
}

function filterRoutes() {
  const origin = document.getElementById('origin').value.trim().toLowerCase();
  const destination = document.getElementById('destination').value.trim().toLowerCase();
  const dateValue = document.getElementById('travel-date').value;
  const timeValue = document.getElementById('travel-time').value;
  const maxPrice = Number(document.getElementById('max-price').value);
  const allowedModes = Array.from(document.querySelectorAll('input[name="mode"]:checked')).map((i) => i.value);

  const filtered = routes.filter((route) => {
    const matchesOrigin = origin ? route.origin.toLowerCase().includes(origin) : true;
    const matchesDestination = destination ? route.destination.toLowerCase().includes(destination) : true;
    const matchesMode = allowedModes.includes(route.mode);
    const matchesPrice = maxPrice ? route.price <= maxPrice : true;

    let matchesDate = true;
    if (dateValue) {
      const routeDate = new Date(route.depart).toISOString().slice(0, 10);
      matchesDate = routeDate === dateValue;
    }

    let matchesTime = true;
    if (timeValue) {
      const [hour, minute] = timeValue.split(':').map(Number);
      const routeDate = new Date(route.depart);
      matchesTime = routeDate.getHours() >= hour && routeDate.getMinutes() >= minute;
    }

    return matchesOrigin && matchesDestination && matchesMode && matchesPrice && matchesDate && matchesTime;
  });

  renderRoutes(filtered);
  const phrases = [
    origin ? `from ${origin}` : 'any origin',
    destination ? `to ${destination}` : 'any destination',
    allowedModes.length === 5 ? 'all modes' : allowedModes.join(', '),
    maxPrice ? `under $${maxPrice}` : 'any price',
  ];
  searchMeta.textContent = `Showing ${filtered.length} options matching ${phrases.join(' • ')}`;
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  filterRoutes();
});

// Seed defaults
renderAlerts();
renderRoutes(routes);
renderCart();
searchMeta.textContent = 'Showing all options.';
