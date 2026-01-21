const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();
const db = admin.firestore();

// HTTP endpoint: returns a sanitized, limited set of portfolio data
exports.getPublicPortfolio = functions.https.onRequest(async (req, res) => {
  try {
    // Optional: support passing an ID token in Authorization header
    const idToken = (req.headers.authorization || '').split('Bearer ')[1];
    let authUser = null;
    if (idToken) {
      try {
        authUser = await admin.auth().verifyIdToken(idToken);
      } catch (e) {
        // token invalid or not provided; continue as anonymous
      }
    }

    const projectsSnap = await db.collection('projects').limit(50).get();
    const certificatesSnap = await db.collection('certificates').limit(50).get();

    const sanitizeProject = (doc) => {
      const data = doc.data() || {};
      return {
        id: doc.id,
        Title: data.Title || '',
        Img: data.Img || '',
        Link: data.Link || '',
        Description: data.Description ? (String(data.Description).slice(0, 300)) : '',
        TechStack: Array.isArray(data.TechStack) ? data.TechStack.slice(0, 5) : []
      };
    };

    const projects = projectsSnap.docs.map(sanitizeProject);
    const certificates = certificatesSnap.docs.map((doc) => {
      const data = doc.data() || {};
      return {
        id: doc.id,
        Title: data.Title || '',
        Img: data.Img || '',
        Issuer: data.Issuer || ''
      };
    });

    // Short client-side caching header
    res.set('Cache-Control', 'public, max-age=60, s-maxage=120');
    res.json({ ok: true, projects, certificates });
  } catch (err) {
    console.error('getPublicPortfolio error:', err);
    res.status(500).json({ ok: false, message: 'Server error' });
  }
});
