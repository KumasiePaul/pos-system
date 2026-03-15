import axios from 'axios';

const API_URL = 'http://localhost:5000/api/products';

// Helper to get auth header
const getAuthHeader = (token) => ({
  headers: { Authorization: `Bearer ${token}` }
});

// Get all products
export const getAllProducts = async (token) => {
  const response = await axios.get(API_URL, getAuthHeader(token));
  return response.data;
};

// Get single product
export const getProductById = async (id, token) => {
  const response = await axios.get(`${API_URL}/${id}`, getAuthHeader(token));
  return response.data;
};

// Create product
export const createProduct = async (productData, token) => {
  const response = await axios.post(API_URL, productData, getAuthHeader(token));
  return response.data;
};

// Update product
export const updateProduct = async (id, productData, token) => {
  const response = await axios.put(`${API_URL}/${id}`, productData, getAuthHeader(token));
  return response.data;
};

// Delete product
export const deleteProduct = async (id, token) => {
  const response = await axios.delete(`${API_URL}/${id}`, getAuthHeader(token));
  return response.data;
};

// Search products
export const searchProducts = async (query, token) => {
  const response = await axios.get(`${API_URL}/search?query=${query}`, getAuthHeader(token));
  return response.data;
};