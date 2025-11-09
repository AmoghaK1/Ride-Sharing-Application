// Centralized API base URL for frontend
// Priority:
// 1) Build-time env VITE_API_BASE_URL (set by CI/CD)
// 2) Fallback to http://<current-hostname>:8000 for local/EC2 default backend port

export const API_BASE_URL =
  (import.meta && import.meta.env && import.meta.env.VITE_API_BASE_URL)
    ? import.meta.env.VITE_API_BASE_URL
    : `http://${window.location.hostname}:8000`;

// Fallback URL for local development
export const API_FALLBACK_URL = 'http://localhost:8000';

/**
 * Fetch with automatic fallback from deployed URL to localhost
 * @param {string} endpoint - API endpoint (e.g., '/rides/nearby')
 * @param {RequestInit} options - Fetch options
 * @returns {Promise<Response>}
 */
export const fetchWithFallback = async (endpoint, options = {}) => {
  const primaryUrl = `${API_BASE_URL}${endpoint}`;
  const fallbackUrl = `${API_FALLBACK_URL}${endpoint}`;
  
  try {
    // Try primary URL first (deployed)
    const response = await fetch(primaryUrl, options);
    return response;
  } catch (error) {
    console.warn(`Primary API failed (${primaryUrl}), trying fallback (${fallbackUrl})`, error.message);
    
    try {
      // Fallback to localhost
      const response = await fetch(fallbackUrl, options);
      return response;
    } catch (fallbackError) {
      console.error('Both primary and fallback APIs failed', fallbackError);
      throw new Error(`API unavailable. Primary: ${error.message}, Fallback: ${fallbackError.message}`);
    }
  }
};
    
