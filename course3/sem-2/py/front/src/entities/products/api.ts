import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  status: string;
  variants: ProductVariant[];
  media: ProductMedia[];
}

export interface ProductVariant {
  id: number;
  product_id: number;
  price: number;
  stock: number;
  sku: string;
  attributes: Record<string, string>;
}

export interface ProductMedia {
  id: number;
  product_id: number;
  url: string;
  alt: string;
}

export const productsApi = {
  getProducts: async (): Promise<Product[]> => {
    const response = await axios.get(`${API_URL}/products/`);
    return response.data.products;
  },

  getProduct: async (id: number): Promise<Product> => {
    const response = await axios.get(`${API_URL}/products/${id}`);
    return response.data.product;
  },

  createProduct: async (productData: Partial<Product>): Promise<Product> => {
    const response = await axios.post(`${API_URL}/products/`, productData);
    return response.data.product;
  },

  updateProduct: async (id: number, productData: Partial<Product>): Promise<Product> => {
    const response = await axios.put(`${API_URL}/products/${id}`, productData);
    return response.data.product;
  },

  deleteProduct: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/products/${id}`);
  },

  getProductVariants: async (productId: number): Promise<ProductVariant[]> => {
    const response = await axios.get(`${API_URL}/products/${productId}/variants`);
    return response.data.variants;
  },

  getProductVariant: async (variantId: number): Promise<ProductVariant> => {
    const response = await axios.get(`${API_URL}/products/variants/${variantId}`);
    return response.data.variant;
  },

  updateProductVariant: async (variantId: number, variantData: Partial<ProductVariant>): Promise<ProductVariant> => {
    const response = await axios.put(`${API_URL}/products/variants/${variantId}`, variantData);
    return response.data.variant;
  },

  getProductMedia: async (productId: number): Promise<ProductMedia[]> => {
    const response = await axios.get(`${API_URL}/products/${productId}/media`);
    return response.data.media;
  },

  getMedia: async (mediaId: number): Promise<ProductMedia> => {
    const response = await axios.get(`${API_URL}/products/media/${mediaId}`);
    return response.data.media;
  },

  createProductMedia: async (productId: number, files: File[], alt?: string): Promise<ProductMedia[]> => {
    const formData = new FormData();
    files.forEach(file => formData.append('x_files', file));
    if (alt) formData.append('alt', alt);

    const response = await axios.post(`${API_URL}/products/${productId}/media`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.media;
  },

  updateMedia: async (mediaId: number, file?: File, alt?: string): Promise<ProductMedia> => {
    const formData = new FormData();
    if (file) formData.append('file', file);
    if (alt) formData.append('alt', alt);

    const response = await axios.put(`${API_URL}/products/media/${mediaId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.media;
  },

  deleteProductMedia: async (productId: number, mediaIds: number[]): Promise<void> => {
    await axios.delete(`${API_URL}/products/${productId}/media`, {
      params: { media_ids: mediaIds.join(',') },
    });
  },

  deleteMedia: async (mediaId: number): Promise<void> => {
    await axios.delete(`${API_URL}/products/media/${mediaId}`);
  },
}; 