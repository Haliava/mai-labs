import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export interface SearchResult {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  rating: number;
}

export interface SearchParams {
  q: string;
  category?: string;
  min_rating?: number;
}

export const searchApi = {
  search: async (params: SearchParams): Promise<SearchResult[]> => {
    const response = await axios.get(`${API_URL}/search/`, { params });
    return response.data;
  },
}; 