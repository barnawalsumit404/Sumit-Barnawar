# Cloud Function: getPublicPortfolio

This folder contains a minimal Firebase Cloud Function that returns a sanitized subset of your `projects` and `certificates` Firestore collections.

How it works
- Uses `firebase-admin` to read Firestore with admin privileges.
- Sanitizes and limits fields to avoid leaking sensitive data.
- Returns JSON and sets short cache headers.

Deploy steps
1. Install Firebase CLI and login:

```bash
npm install -g firebase-tools
firebase login
```

2. From this repository root (or `functions` folder), install dependencies:

```bash
cd functions
npm install
```

3. Deploy the function (replace with your project):

```bash
firebase deploy --only functions:getPublicPortfolio
```

4. After deploy you'll get a URL like `https://us-central1-YOUR_PROJECT.cloudfunctions.net/getPublicPortfolio`.

Client usage
- Set an env var in your client `.env` file:

```
REACT_APP_PORTFOLIO_FUNC_URL=https://us-central1-YOUR_PROJECT.cloudfunctions.net/getPublicPortfolio
```

- The client will call this URL to fetch public portfolio data when the user is not authenticated.

Security notes
- Keep Firestore rules strict (require auth) and use this function to expose only sanitized read data.
- Optionally verify ID tokens in the function to provide additional fields for authenticated callers.
- Add App Check, rate-limiting, or Cloud Armor for production workloads.
