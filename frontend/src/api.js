import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 120000, // 120 seconds timeout to accommodate heavy LLM calls
});

export const getStrategy = async (matchState) => {
  try {
    const customKey = localStorage.getItem('gemini_api_key') || '';
    const mode = localStorage.getItem('presentation_mode') || 'simulated';
    
    const headers = {
      'x-presentation-mode': mode
    };
    
    if (customKey.trim()) {
      headers['x-gemini-key'] = customKey.trim();
    }
    
    const response = await api.post('/strategy', matchState, { headers });
    return response.data;
  } catch (error) {
    console.error('API Strategy request failed:', error);
    throw error;
  }
};
