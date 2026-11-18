const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const CONTACT = {
  email: 'srikrishnanookala18@gmail.com',
  githubUrl: 'https://github.com/srikrishnanookala18-lab',
  linkedinUrl: 'https://www.linkedin.com/in/sri-krishna-nookala-19758a44b',
};

const CAMPUS_ROOMS = [
  { id: 'R101', name: 'Central Lobby & Helpdesk', floor: 1, type: 'Facility', status: 'Open', x: 18, y: 18, w: 120, h: 62 },
  { id: 'R102', name: 'Data & DB Lab 102', floor: 1, type: 'Laboratory', status: 'Occupied', x: 152, y: 18, w: 120, h: 62 },
  { id: 'R103', name: 'Seminar Hall 103', floor: 1, type: 'Facility', status: 'Available', x: 286, y: 18, w: 116, h: 62 },
  { id: 'R201', name: 'AI & ML Lab 201', floor: 2, type: 'Laboratory', status: 'Available', x: 18, y: 18, w: 120, h: 62 },
  { id: 'R202', name: 'Robotics Lab 202', floor: 2, type: 'Laboratory', status: 'Occupied', x: 152, y: 18, w: 120, h: 62 },
  { id: 'R203', name: 'Student Commons 203', floor: 2, type: 'Facility', status: 'Open', x: 286, y: 18, w: 116, h: 62 },
  { id: 'R301', name: 'Classroom 301', floor: 3, type: 'Classroom', status: 'Occupied', x: 18, y: 18, w: 120, h: 62 },
  { id: 'R304', name: 'Classroom 304', floor: 3, type: 'Classroom', status: 'Available', x: 152, y: 18, w: 120, h: 62 },
  { id: 'R305', name: 'Faculty Wing 305', floor: 3, type: 'Facility', status: 'Open', x: 286, y: 18, w: 116, h: 62 },
];

const WEATHER_BASELINE = {
  Hyderabad: {
    temp: '31°C',
    humidity: '44%',
    wind: '14 km/h',
    pressure: '1011 hPa',
    uv: '7 (High)',
    comfort: 'Warm / Dry',
    alert: { level: 'Advisory', text: 'Peak UV window 11:30–15:00 IST. Hydrate regularly.' },
    hourly: [
      { t: '09h', v: 26 },
      { t: '12h', v: 31 },
      { t: '15h', v: 33 },
      { t: '18h', v: 29 },
      { t: '21h', v: 25 },
      { t: '00h', v: 23 },
    ],
    daily: [
      { t: 'Mon', v: 32 },
      { t: 'Tue', v: 33 },
      { t: 'Wed', v: 31 },
      { t: 'Thu', v: 30 },
      { t: 'Fri', v: 32 },
      { t: 'Sat', v: 34 },
      { t: 'Sun', v: 33 },
    ],
  },
  Bengaluru: {
    temp: '25°C',
    humidity: '61%',
    wind: '18 km/h',
    pressure: '1015 hPa',
    uv: '5 (Mod)',
    comfort: 'Pleasant',
    alert: { level: 'Clear', text: 'Mild evening breeze expected; comfortable outdoor index.' },
    hourly: [
      { t: '09h', v: 21 },
      { t: '12h', v: 25 },
      { t: '15h', v: 27 },
      { t: '18h', v: 23 },
      { t: '21h', v: 20 },
      { t: '00h', v: 19 },
    ],
    daily: [
      { t: 'Mon', v: 26 },
      { t: 'Tue', v: 27 },
      { t: 'Wed', v: 25 },
      { t: 'Thu', v: 24 },
      { t: 'Fri', v: 26 },
      { t: 'Sat', v: 27 },
      { t: 'Sun', v: 26 },
    ],
  },
  Delhi: {
    temp: '36°C',
    humidity: '29%',
    wind: '11 km/h',
    pressure: '1008 hPa',
    uv: '8 (Very High)',
    comfort: 'Hot / Arid',
    alert: { level: 'Heat Alert', text: 'High daytime temperature & UV index; limit direct afternoon sun.' },
    hourly: [
      { t: '09h', v: 29 },
      { t: '12h', v: 36 },
      { t: '15h', v: 38 },
      { t: '18h', v: 34 },
      { t: '21h', v: 29 },
      { t: '00h', v: 26 },
    ],
    daily: [
      { t: 'Mon', v: 37 },
      { t: 'Tue', v: 38 },
      { t: 'Wed', v: 36 },
      { t: 'Thu', v: 35 },
      { t: 'Fri', v: 37 },
      { t: 'Sat', v: 39 },
      { t: 'Sun', v: 38 },
    ],
  },
};

function jsonResponse(statusCode, data) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
    body: JSON.stringify(data),
  };
}

export async function handler(event) {
  const rawPath = event.path || '';
  const apiPath = rawPath
    .replace(/^\/\.netlify\/functions\/api/, '')
    .replace(/^\/api/, '');
  const method = (event.httpMethod || 'GET').toUpperCase();
  const params = event.queryStringParameters || {};

  let body = {};
  if (event.body) {
    try {
      body = JSON.parse(event.body);
    } catch {
      body = {};
    }
  }

  if (method === 'GET' && apiPath === '/health') {
    return jsonResponse(200, { ok: true, runtime: 'netlify-function' });
  }

  if (method === 'GET' && apiPath === '/enquiries') {
    return jsonResponse(200, { enquiries: [] });
  }

  if (method === 'POST' && apiPath === '/enquiries') {
    const name = String(body.name || '').trim();
    const email = String(body.email || '').trim();
    const doubt = String(body.doubt || '').trim();
    const description = String(body.description || '').trim();

    const errors = {};
    if (!name) errors.name = 'Please enter your name.';
    if (!email) errors.email = 'Please enter your email address.';
    else if (!EMAIL_RE.test(email)) errors.email = 'Please enter a valid email address.';
    if (!doubt) errors.doubt = 'Please enter your doubt or topic.';
    if (!description || description.length < 10) {
      errors.description = 'Please add a clear description about your doubt (at least 10 characters).';
    }

    if (Object.keys(errors).length > 0) {
      return jsonResponse(400, { errors });
    }

    const formatted_message = [
      'Hello Sri Krishna,',
      '',
      `Name: ${name}`,
      `Email: ${email}`,
      `Doubt / Topic: ${doubt}`,
      '',
      'Description about my doubt:',
      description,
    ].join('\n');

    const enquiry = {
      id: String(Date.now()),
      name,
      email,
      doubt,
      description,
      formatted_message,
      dispatched_via: null,
      created_at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const subject = encodeURIComponent(`[Portfolio Enquiry] ${doubt}`);
    const bodyText = encodeURIComponent(formatted_message);

    return jsonResponse(201, {
      enquiry,
      channels: {
        Email: { label: 'Email', target: `mailto:${CONTACT.email}?subject=${subject}&body=${bodyText}` },
        LinkedIn: { label: 'LinkedIn', target: CONTACT.linkedinUrl },
        GitHub: { label: 'GitHub', target: CONTACT.githubUrl },
      },
    });
  }

  if (method === 'PATCH' && /^\/enquiries\/[^/]+\/channel$/.test(apiPath)) {
    return jsonResponse(200, { ok: true, channel: body.channel || null });
  }

  if (method === 'DELETE' && apiPath === '/enquiries') {
    return jsonResponse(200, { deleted: 0 });
  }

  if (method === 'GET' && apiPath === '/weather') {
    const city = WEATHER_BASELINE[params.city] ? params.city : 'Hyderabad';
    return jsonResponse(200, { city, ...WEATHER_BASELINE[city] });
  }

  if (method === 'GET' && apiPath === '/campus/rooms') {
    const floor = params.floor ? Number(params.floor) : null;
    const rooms = floor ? CAMPUS_ROOMS.filter((r) => r.floor === floor) : CAMPUS_ROOMS;
    return jsonResponse(200, { rooms });
  }

  if (method === 'POST' && apiPath === '/campus/query') {
    const query = String(body.query || '').trim() || 'Find available AI Lab';
    const text = query.toLowerCase();
    let matches = [];
    if (text.includes('vacant') || (text.includes('available') && !text.includes('ai'))) {
      matches = CAMPUS_ROOMS.filter((r) => r.status === 'Available');
    } else if (text.includes('ai') || text.includes('ml')) {
      matches = CAMPUS_ROOMS.filter((r) => r.id === 'R201');
    } else if (text.includes('304')) {
      matches = CAMPUS_ROOMS.filter((r) => r.id === 'R304');
    } else if (text.includes('lab')) {
      matches = CAMPUS_ROOMS.filter((r) => r.type === 'Laboratory');
    } else {
      matches = CAMPUS_ROOMS.filter(
        (r) => r.name.toLowerCase().includes(text) || r.id.toLowerCase().includes(text)
      );
    }
    if (matches.length === 0) matches = [CAMPUS_ROOMS[0]];

    const summary = matches
      .map((m) => `${m.id} (${m.name}, Floor ${m.floor}, ${m.status})`)
      .join('; ');

    return jsonResponse(200, {
      query,
      floor: matches[0].floor,
      highlighted_ids: matches.map((m) => m.id),
      matches,
      trace: [
        `1. NL Query: "${query}"`,
        '2. Serverless Intent Engine: Room & availability lookup',
        `3. Matched: ${summary}`,
      ],
    });
  }

  return jsonResponse(404, { error: 'Not found' });
}
