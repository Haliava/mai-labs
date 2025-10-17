import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export interface OrderItem {
  product_id: number;
  variant_id: number;
  quantity: number;
}

export interface Order {
  id: number;
  user_id: number;
  items: OrderItem[];
  status: string;
  total_amount: number;
  created_at: string;
  updated_at: string;
}

export const ordersApi = {
  // Create order
  createOrder: async (items: OrderItem[]): Promise<Order> => {
    const response = await axios.post(`${API_URL}/orders/`, { items });
    return response.data;
  },

  // Get user orders
  getUserOrders: async (): Promise<Order[]> => {
    const response = await axios.get(`${API_URL}/orders/`);
    return response.data;
  },

  // Get single order
  getOrder: async (orderId: number): Promise<Order> => {
    const response = await axios.get(`${API_URL}/orders/${orderId}`);
    return response.data;
  },
}; 