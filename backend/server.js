const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const firebaseConfigPath =
  process.env.GOOGLE_SERVICES_JSON ||
  path.join(__dirname, '..', 'android', 'app', 'google-services.json');

const googleServices = JSON.parse(fs.readFileSync(firebaseConfigPath, 'utf8'));
const projectId = googleServices.project_info.project_id;
const apiKey = googleServices.client?.[0]?.api_key?.[0]?.current_key;

if (!projectId || !apiKey) {
  throw new Error('Missing Firebase project_id or api_key in android/app/google-services.json');
}

const firestoreBaseUrl =
  `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents`;
const authBaseUrl = 'https://identitytoolkit.googleapis.com/v1/accounts';

const demoData = {
  banners: [
    'assets/banner_explore.png',
    'assets/DaNangNew.png',
  ],
  journeys: [
    {
      id: 'journey-1',
      image: 'assets/DN-BN-HA.jpg',
      title: 'Da Nang - Ba Na - Hoi An',
      date: 'Jan 30, 2026',
      days: '3 days',
      price: '$400.00',
    },
    {
      id: 'journey-2',
      image: 'assets/HanoiHaLongBay.png',
      title: 'Hanoi - Ha Long Bay',
      date: 'Feb 12, 2026',
      days: '2 days',
      price: '$500.00',
    },
    {
      id: 'journey-3',
      image: 'assets/thailan.png',
      title: 'Thailand Discovery',
      date: 'Mar 18, 2026',
      days: '4 days',
      price: '$600.00',
    },
  ],
  guides: [
    { id: 'guide-1', image: 'assets/anna.png', name: 'Emmy', role: 'Hanoi, Vietnam', reviews: 127 },
    { id: 'guide-2', image: 'assets/John.png', name: 'Khai Ho', role: 'Ho Chi Minh, Vietnam', reviews: 85 },
    { id: 'guide-3', image: 'assets/lina.png', name: 'Linh Hana', role: 'Da Nang, Vietnam', reviews: 156 },
    { id: 'guide-4', image: 'assets/TuanTran.png', name: 'Tuan Tran', role: 'Hoi An, Vietnam', reviews: 204 },
  ],
  experiences: [
    {
      id: 'experience-1',
      image: 'assets/hoian.png',
      avatar: 'assets/TuanTran.png',
      name: 'Tuan Tran',
      title: '2 Hour Bicycle Tour exploring Hoi An',
      location: 'Hoi An, Vietnam',
    },
    {
      id: 'experience-2',
      image: 'assets/bana.png',
      avatar: 'assets/lina.png',
      name: 'Linh Hana',
      title: 'One day at Ba Na Hills',
      location: 'Da Nang, Vietnam',
    },
    {
      id: 'experience-3',
      image: 'assets/quoctugiam.png',
      avatar: 'assets/anna.png',
      name: 'Emmy',
      title: 'Temple of Literature walking tour',
      location: 'Hanoi, Vietnam',
    },
  ],
  tours: [
    {
      id: 'tour-1',
      image: 'assets/img1.png',
      title: 'Da Nang - Ba Na - Hoi An',
      date: 'Jan 30, 2026',
      days: '3 days',
      price: '$400.00',
      isLiked: false,
      isSaved: true,
      likes: 1247,
    },
    {
      id: 'tour-2',
      image: 'assets/MelbourneSydney.png',
      title: 'Melbourne - Sydney',
      date: 'Apr 15, 2026',
      days: '5 days',
      price: '$600.00',
      isLiked: true,
      isSaved: false,
      likes: 980,
    },
    {
      id: 'tour-3',
      image: 'assets/HCMmausoleum.jpg',
      title: 'Hanoi Heritage Day',
      date: 'May 22, 2026',
      days: '1 day',
      price: '$120.00',
      isLiked: true,
      isSaved: true,
      likes: 742,
    },
  ],
  trips: [
    {
      id: 'trip-1',
      status: 'Current Trips',
      title: 'Dragon Bridge Trip',
      location: 'Da Nang, Vietnam',
      date: 'Jan 30, 2026',
      time: '13:00 - 15:00',
      image: 'assets/dragonbridge.png',
      avatar: 'assets/anna.png',
    },
    {
      id: 'trip-2',
      status: 'Current Trips',
      title: 'Ho Guom Trip',
      location: 'Hanoi, Vietnam',
      date: 'Feb 2, 2026',
      time: '08:00 - 10:00',
      image: 'assets/HoGuomTrip.jpg',
      avatar: 'assets/lina.png',
    },
    {
      id: 'trip-3',
      status: 'Next Trips',
      title: 'Ba Na Hill Discovery',
      location: 'Da Nang, Vietnam',
      date: 'May 10, 2026',
      time: '08:00 - 17:00',
      image: 'assets/bana.png',
      avatar: 'assets/TuanTran.png',
    },
    {
      id: 'trip-4',
      status: 'Past Trips',
      title: 'Old Town Walk',
      location: 'Hoi An, Vietnam',
      date: 'Dec 15, 2025',
      time: '10:00 - 12:00',
      image: 'assets/hoian.png',
      avatar: 'assets/lina.png',
    },
    {
      id: 'trip-5',
      status: 'Wish List',
      title: 'Sydney Opera House',
      location: 'Sydney, Australia',
      date: 'TBD',
      time: 'Anytime',
      image: 'assets/MelbourneSydney.png',
      avatar: 'assets/John.png',
    },
  ],
  profile: {
    id: 'demo-user',
    email: 'yoojin@gmail.com',
    firstName: 'Yoo',
    lastName: 'Jin',
    country: 'Vietnam',
    userType: 'Traveler',
    avatar: 'assets/anna.png',
  },
  notifications: [
    {
      id: 'notification-1',
      title: 'Trip reminder',
      message: 'Dragon Bridge Trip starts at 13:00 today.',
      read: false,
      createdAt: '2026-05-15T09:00:00.000Z',
    },
    {
      id: 'notification-2',
      title: 'New guide offer',
      message: 'Linh Hana sent an offer for Ba Na Hill Discovery.',
      read: true,
      createdAt: '2026-05-14T14:30:00.000Z',
    },
  ],
  settings: {
    language: 'English',
    currency: 'USD',
    notificationsEnabled: true,
    darkMode: false,
  },
  help: [
    {
      id: 'help-1',
      title: 'How do I book a guide?',
      content: 'Choose a tour, tap Detail, then contact a guide from the trip page.',
    },
    {
      id: 'help-2',
      title: 'Can I cancel a trip?',
      content: 'Yes. Open My Trips, choose a trip, and request cancellation from Detail.',
    },
  ],
  about: {
    name: 'Fellow4U',
    version: '1.0.0',
    description: 'A travel companion app connecting travelers with local guides.',
    supportEmail: 'support@fellow4u.local',
  },
  chats: [
    {
      id: 'chat-1',
      tripId: 'trip-1',
      sender: 'Emmy',
      message: 'Hi Yoo Jin, I will meet you near Dragon Bridge.',
      createdAt: '2026-05-15T08:30:00.000Z',
    },
    {
      id: 'chat-2',
      tripId: 'trip-1',
      sender: 'Yoo Jin',
      message: 'Great, see you there!',
      createdAt: '2026-05-15T08:35:00.000Z',
    },
  ],
};

function fallbackForCollection(collectionPath) {
  const cleanPath = collectionPath
    .replace(/^users\/[^/]+\/trips$/, 'trips')
    .replace(/^users\/[^/]+\/notifications$/, 'notifications')
    .replace(/^users\/[^/]+\/chats$/, 'chats');
  return demoData[cleanPath] || [];
}

function canUseDemoFallback(error) {
  const reason = error.details?.error?.details?.[0]?.metadata?.service === 'firestore.googleapis.com';
  return (
    error.status === 403 ||
    reason ||
    error.message === 'CONFIGURATION_NOT_FOUND' ||
    error.message === 'fetch failed'
  );
}

function sendError(res, error, fallbackMessage = 'Request failed') {
  const status = error.status || 500;
  const firebaseMessage = error.message || '';
  const friendlyMessages = {
    CONFIGURATION_NOT_FOUND:
      'Firebase Authentication is not configured. Enable Authentication > Sign-in method > Email/Password in Firebase Console.',
    OPERATION_NOT_ALLOWED:
      'Email/Password sign-in is disabled. Enable it in Firebase Console > Authentication > Sign-in method.',
    EMAIL_EXISTS: 'This email is already registered.',
    WEAK_PASSWORD: 'Password is too weak. Use at least 6 characters.',
    INVALID_PASSWORD: 'Invalid password.',
    EMAIL_NOT_FOUND: 'Email not found.',
  };

  res.status(status).json({
    message: friendlyMessages[firebaseMessage] || firebaseMessage || fallbackMessage,
    code: firebaseMessage || undefined,
    details: error.details,
  });
}

async function firebaseFetch(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = body.error?.message || body.message || 'Firebase request failed';
    const error = new Error(message);
    error.status = response.status;
    error.details = body;
    throw error;
  }

  return body;
}

function decodeFirestoreValue(value) {
  if (value.stringValue !== undefined) return value.stringValue;
  if (value.integerValue !== undefined) return Number(value.integerValue);
  if (value.doubleValue !== undefined) return Number(value.doubleValue);
  if (value.booleanValue !== undefined) return value.booleanValue;
  if (value.timestampValue !== undefined) return value.timestampValue;
  if (value.nullValue !== undefined) return null;
  if (value.arrayValue !== undefined) {
    return (value.arrayValue.values || []).map(decodeFirestoreValue);
  }
  if (value.mapValue !== undefined) {
    return decodeFirestoreFields(value.mapValue.fields || {});
  }
  return null;
}

function decodeFirestoreFields(fields = {}) {
  return Object.fromEntries(
    Object.entries(fields).map(([key, value]) => [key, decodeFirestoreValue(value)]),
  );
}

function encodeFirestoreValue(value) {
  if (value === null || value === undefined) return { nullValue: null };
  if (Array.isArray(value)) {
    return { arrayValue: { values: value.map(encodeFirestoreValue) } };
  }
  if (typeof value === 'boolean') return { booleanValue: value };
  if (typeof value === 'number') {
    return Number.isInteger(value) ? { integerValue: String(value) } : { doubleValue: value };
  }
  if (typeof value === 'object') {
    return { mapValue: { fields: encodeFirestoreFields(value) } };
  }
  return { stringValue: String(value) };
}

function encodeFirestoreFields(data = {}) {
  return Object.fromEntries(
    Object.entries(data)
      .filter(([, value]) => value !== undefined)
      .map(([key, value]) => [key, encodeFirestoreValue(value)]),
  );
}

function documentId(documentName = '') {
  return documentName.split('/').pop();
}

function decodeDocument(document) {
  return {
    id: documentId(document.name),
    ...decodeFirestoreFields(document.fields),
  };
}

function collectionUrl(collectionPath, params = {}) {
  const searchParams = new URLSearchParams({ key: apiKey, ...params });
  return `${firestoreBaseUrl}/${collectionPath}?${searchParams.toString()}`;
}

async function listCollection(collectionPath) {
  try {
    const data = await firebaseFetch(collectionUrl(collectionPath));
    const documents = (data.documents || []).map(decodeDocument);
    return documents.length > 0 ? documents : fallbackForCollection(collectionPath);
  } catch (error) {
    if (canUseDemoFallback(error)) return fallbackForCollection(collectionPath);
    throw error;
  }
}

async function getDocument(documentPath) {
  try {
    const data = await firebaseFetch(collectionUrl(documentPath));
    return decodeDocument(data);
  } catch (error) {
    if (canUseDemoFallback(error)) {
      const [collection, id] = documentPath.split('/');
      return (demoData[collection] || []).find((item) => item.id === id) || null;
    }
    throw error;
  }
}

async function createDocument(collectionPath, data) {
  const body = JSON.stringify({ fields: encodeFirestoreFields(data) });
  try {
    const document = await firebaseFetch(collectionUrl(collectionPath), {
      method: 'POST',
      body,
    });
    return decodeDocument(document);
  } catch (error) {
    if (canUseDemoFallback(error)) {
      return { id: `demo-${Date.now()}`, ...data };
    }
    throw error;
  }
}

async function setDocument(documentPath, data, merge = true, idToken = null) {
  const fields = encodeFirestoreFields(data);
  const searchParams = new URLSearchParams({ key: apiKey });
  if (merge) {
    Object.keys(fields).forEach((field) => searchParams.append('updateMask.fieldPaths', field));
  }

  const document = await firebaseFetch(`${firestoreBaseUrl}/${documentPath}?${searchParams.toString()}`, {
    method: 'PATCH',
    headers: idToken ? { Authorization: `Bearer ${idToken}` } : {},
    body: JSON.stringify({ fields }),
  });
  return decodeDocument(document);
}

function filterByStatus(items, status) {
  if (!status) return items;
  return items.filter((item) => item.status === status || item.tripStatus === status);
}

function includesText(value, query) {
  return String(value || '').toLowerCase().includes(query);
}

function searchDemoData(query) {
  const normalizedQuery = String(query || '').trim().toLowerCase();
  if (!normalizedQuery) {
    return {
      tours: demoData.tours,
      journeys: demoData.journeys,
      guides: demoData.guides,
      experiences: demoData.experiences,
      trips: demoData.trips,
    };
  }

  return {
    tours: demoData.tours.filter((item) =>
      [item.title, item.date, item.days, item.price].some((value) => includesText(value, normalizedQuery))),
    journeys: demoData.journeys.filter((item) =>
      [item.title, item.date, item.days, item.price].some((value) => includesText(value, normalizedQuery))),
    guides: demoData.guides.filter((item) =>
      [item.name, item.role].some((value) => includesText(value, normalizedQuery))),
    experiences: demoData.experiences.filter((item) =>
      [item.title, item.name, item.location].some((value) => includesText(value, normalizedQuery))),
    trips: demoData.trips.filter((item) =>
      [item.title, item.location, item.status, item.date, item.time].some((value) => includesText(value, normalizedQuery))),
  };
}

async function lookupUserIdFromToken(req) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) return null;

  const data = await firebaseFetch(`${authBaseUrl}:lookup?key=${apiKey}`, {
    method: 'POST',
    body: JSON.stringify({ idToken: token }),
  });

  return data.users?.[0]?.localId || null;
}

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    firebaseProjectId: projectId,
    source: 'android/app/google-services.json',
  });
});

// 1. Sign up with Firebase Authentication and save profile to Firestore.
app.post('/api/signup', async (req, res) => {
  try {
    const { email, password, firstName, lastName, country, userType } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'email and password are required' });
    }

    const auth = await firebaseFetch(`${authBaseUrl}:signUp?key=${apiKey}`, {
      method: 'POST',
      body: JSON.stringify({ email, password, returnSecureToken: true }),
    });

    const user = await setDocument(`users/${auth.localId}`, {
      email,
      firstName,
      lastName,
      country,
      userType,
      createdAt: new Date().toISOString(),
    }, true, auth.idToken);

    res.status(201).json({
      message: 'User created successfully',
      user: { id: auth.localId, email, ...user },
      idToken: auth.idToken,
    });
  } catch (error) {
    if (canUseDemoFallback(error) || error.message === 'OPERATION_NOT_ALLOWED') {
      return res.status(201).json({
        message: 'Demo user created locally because Firebase Auth/Firestore is not ready',
        user: {
          id: `demo-${Date.now()}`,
          email: req.body.email,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          country: req.body.country,
          userType: req.body.userType,
        },
        idToken: null,
      });
    }
    sendError(res, error, 'Failed to sign up');
  }
});

// 2. Login with Firebase Authentication.
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'email and password are required' });
    }

    const auth = await firebaseFetch(`${authBaseUrl}:signInWithPassword?key=${apiKey}`, {
      method: 'POST',
      body: JSON.stringify({ email, password, returnSecureToken: true }),
    });

    res.json({
      message: 'Login successful',
      user: { id: auth.localId, email: auth.email },
      idToken: auth.idToken,
      refreshToken: auth.refreshToken,
    });
  } catch (error) {
    if (error.message === 'CONFIGURATION_NOT_FOUND' || error.message === 'OPERATION_NOT_ALLOWED') {
      return res.json({
        message: 'Demo login successful because Firebase Auth is not ready',
        user: { id: `demo-${Date.now()}`, email: req.body.email },
        idToken: null,
        refreshToken: null,
      });
    }
    error.status = error.status === 400 ? 401 : error.status;
    sendError(res, error, 'Failed to login');
  }
});

// 3. Banners from Firestore collection: banners
app.get('/api/banners', async (req, res) => {
  try {
    const banners = await listCollection('banners');
    res.json(
      banners
        .map((banner) => (typeof banner === 'string' ? banner : banner.url || banner.image || banner.path))
        .filter(Boolean),
    );
  } catch (error) {
    sendError(res, error, 'Failed to load banners');
  }
});

// 4. Journeys from Firestore collection: journeys
app.get('/api/journeys', async (req, res) => {
  try {
    res.json(await listCollection('journeys'));
  } catch (error) {
    sendError(res, error, 'Failed to load journeys');
  }
});

// 5. Guides from Firestore collection: guides
app.get('/api/guides', async (req, res) => {
  try {
    res.json(await listCollection('guides'));
  } catch (error) {
    sendError(res, error, 'Failed to load guides');
  }
});

// 6. Experiences from Firestore collection: experiences
app.get('/api/experiences', async (req, res) => {
  try {
    res.json(await listCollection('experiences'));
  } catch (error) {
    sendError(res, error, 'Failed to load experiences');
  }
});

// 7. Tours from Firestore collection: tours
app.get('/api/tours', async (req, res) => {
  try {
    res.json(await listCollection('tours'));
  } catch (error) {
    sendError(res, error, 'Failed to load tours');
  }
});

// 8. Tour detail from Firestore document: tours/{id}
app.get('/api/tours/:id', async (req, res) => {
  try {
    const tour = await getDocument(`tours/${req.params.id}`);
    if (!tour) return res.status(404).json({ message: 'Tour not found' });
    res.json(tour);
  } catch (error) {
    sendError(res, error, 'Failed to load tour detail');
  }
});

// Products screen uses the same data shape as tours.
app.get('/api/products', async (req, res) => {
  try {
    res.json(await listCollection('tours'));
  } catch (error) {
    sendError(res, error, 'Failed to load products');
  }
});

// Search bar data across visible home sections.
app.get('/api/search', async (req, res) => {
  try {
    const query = req.query.q || '';
    const [tours, journeys, guides, experiences, trips] = await Promise.all([
      listCollection('tours'),
      listCollection('journeys'),
      listCollection('guides'),
      listCollection('experiences'),
      listCollection('trips'),
    ]);
    const normalizedQuery = String(query).trim().toLowerCase();

    if (!normalizedQuery) {
      return res.json({ tours, journeys, guides, experiences, trips });
    }

    res.json({
      tours: tours.filter((item) =>
        [item.title, item.date, item.days, item.price].some((value) => includesText(value, normalizedQuery))),
      journeys: journeys.filter((item) =>
        [item.title, item.date, item.days, item.price].some((value) => includesText(value, normalizedQuery))),
      guides: guides.filter((item) =>
        [item.name, item.role].some((value) => includesText(value, normalizedQuery))),
      experiences: experiences.filter((item) =>
        [item.title, item.name, item.location].some((value) => includesText(value, normalizedQuery))),
      trips: trips.filter((item) =>
        [item.title, item.location, item.status, item.date, item.time].some((value) => includesText(value, normalizedQuery))),
    });
  } catch (error) {
    if (canUseDemoFallback(error)) return res.json(searchDemoData(req.query.q));
    sendError(res, error, 'Failed to search');
  }
});

// 9. Trips from users/{uid}/trips, or top-level trips when uid is not provided.
app.get('/api/trips', async (req, res) => {
  try {
    const status = req.query.status;
    const uid = req.query.uid || await lookupUserIdFromToken(req);
    const collectionPath = uid ? `users/${uid}/trips` : 'trips';
    const trips = await listCollection(collectionPath);
    res.json(filterByStatus(trips, status));
  } catch (error) {
    sendError(res, error, 'Failed to load trips');
  }
});

// Trip detail used by Detail buttons.
app.get('/api/trips/:id', async (req, res) => {
  try {
    const trips = await listCollection('trips');
    const trip = trips.find((item) => item.id === req.params.id);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    res.json(trip);
  } catch (error) {
    sendError(res, error, 'Failed to load trip detail');
  }
});

// 10. Create trip in users/{uid}/trips.
app.post('/api/users/:uid/trips', async (req, res) => {
  try {
    const { uid } = req.params;
    const { title, location, date, time, image, avatar, status } = req.body;
    if (!title || !status) {
      return res.status(400).json({ message: 'title and status are required' });
    }

    const trip = await createDocument(`users/${uid}/trips`, {
      title,
      location,
      date,
      time,
      image,
      avatar,
      status,
      createdAt: new Date().toISOString(),
    });

    res.status(201).json(trip);
  } catch (error) {
    sendError(res, error, 'Failed to create trip');
  }
});

// Profile screen.
app.get('/api/users/:uid', async (req, res) => {
  try {
    const user = await getDocument(`users/${req.params.uid}`);
    res.json(user || { ...demoData.profile, id: req.params.uid });
  } catch (error) {
    if (canUseDemoFallback(error)) return res.json({ ...demoData.profile, id: req.params.uid });
    sendError(res, error, 'Failed to load user profile');
  }
});

app.patch('/api/users/:uid', async (req, res) => {
  try {
    const user = await setDocument(`users/${req.params.uid}`, req.body, true, req.headers.authorization?.replace('Bearer ', ''));
    res.json(user);
  } catch (error) {
    if (canUseDemoFallback(error)) return res.json({ ...demoData.profile, id: req.params.uid, ...req.body });
    sendError(res, error, 'Failed to update user profile');
  }
});

// Forgot Password screen.
app.post('/api/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'email is required' });

    await firebaseFetch(`${authBaseUrl}:sendOobCode?key=${apiKey}`, {
      method: 'POST',
      body: JSON.stringify({ requestType: 'PASSWORD_RESET', email }),
    });

    res.json({ message: 'Password reset email sent' });
  } catch (error) {
    if (error.message === 'CONFIGURATION_NOT_FOUND' || error.message === 'OPERATION_NOT_ALLOWED' || error.message === 'fetch failed') {
      return res.json({ message: 'Demo reset email accepted because Firebase Auth is not ready' });
    }
    sendError(res, error, 'Failed to send password reset email');
  }
});

// Notifications, Settings, Help Center, About Us.
app.get('/api/users/:uid/notifications', async (req, res) => {
  try {
    res.json(await listCollection(`users/${req.params.uid}/notifications`));
  } catch (error) {
    sendError(res, error, 'Failed to load notifications');
  }
});

app.get('/api/users/:uid/settings', async (req, res) => {
  try {
    const settings = await getDocument(`users/${req.params.uid}/settings/default`);
    res.json(settings || demoData.settings);
  } catch (error) {
    if (canUseDemoFallback(error)) return res.json(demoData.settings);
    sendError(res, error, 'Failed to load settings');
  }
});

app.patch('/api/users/:uid/settings', async (req, res) => {
  try {
    const settings = await setDocument(`users/${req.params.uid}/settings/default`, req.body);
    res.json(settings);
  } catch (error) {
    if (canUseDemoFallback(error)) return res.json({ ...demoData.settings, ...req.body });
    sendError(res, error, 'Failed to update settings');
  }
});

app.get('/api/help', (req, res) => {
  res.json(demoData.help);
});

app.get('/api/about', (req, res) => {
  res.json(demoData.about);
});

// Chat buttons.
app.get('/api/chats', async (req, res) => {
  try {
    const tripId = req.query.tripId;
    const chats = await listCollection('chats');
    res.json(tripId ? chats.filter((chat) => chat.tripId === tripId) : chats);
  } catch (error) {
    sendError(res, error, 'Failed to load chats');
  }
});

app.post('/api/chats', async (req, res) => {
  try {
    const { tripId, sender, message } = req.body;
    if (!tripId || !message) return res.status(400).json({ message: 'tripId and message are required' });

    const chat = await createDocument('chats', {
      tripId,
      sender: sender || 'Yoo Jin',
      message,
      createdAt: new Date().toISOString(),
    });
    res.status(201).json(chat);
  } catch (error) {
    sendError(res, error, 'Failed to send chat message');
  }
});

app.use((req, res) => {
  res.status(404).json({ message: 'API not found' });
});

app.listen(port, () => {
  console.log(`Travel API running at http://localhost:${port}`);
  console.log(`Firebase project: ${projectId}`);
});
