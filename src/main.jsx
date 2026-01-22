import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.jsx"
import "./index.css"

// Handle GitHub Pages SPA routing redirect
if (window.location.search.includes('p=')) {
  const params = new URLSearchParams(window.location.search);
  const route = params.get('p')?.replace(/~and~/g, '&') || '';
  const query = params.get('q')?.replace(/~and~/g, '&') || '';
  
  // Restore the original path
  const newPath = '/' + route + (query ? '?' + query : '');
  window.history.replaceState(null, null, newPath);
}

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
)
