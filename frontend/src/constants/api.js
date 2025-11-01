// Centralized API base URL for frontend
// Priority:
// 1) Build-time env VITE_API_BASE_URL (set by CI/CD)
// 2) Fallback to http://<current-hostname>:8000 for local/EC2 default backend port

export const API_BASE_URL =
  (import.meta && import.meta.env && import.meta.env.VITE_API_BASE_URL)
    ? import.meta.env.VITE_API_BASE_URL
    : `http://${window.location.hostname}:8000`;
