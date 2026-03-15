import axios from 'axios';

const API_URL = 'http://localhost:5000/api/inventory';

const getAuthHeader = (token) => ({
  headers: { Authorization: `Bearer ${token}` }
});

// Get all inventory
export const getAllInventory = async (token) => {
  const response = await axios.get(API_URL, getAuthHeader(token));
  return response.data;
};

// Get low stock items
export const getLowStockItems = async (token) => {
  const response = await axios.get(`${API_URL}/low-stock`, getAuthHeader(token));
  return response.data;
};

// Create inventory record
export const createInventory = async (inventoryData, token) => {
  const response = await axios.post(API_URL, inventoryData, getAuthHeader(token));
  return response.data;
};

// Update stock
export const updateStock = async (id, stockData, token) => {
  const response = await axios.put(`${API_URL}/${id}`, stockData, getAuthHeader(token));
  return response.data;
};

// Adjust stock
export const adjustStock = async (id, adjustmentData, token) => {
  const response = await axios.patch(`${API_URL}/${id}/adjust`, adjustmentData, getAuthHeader(token));
  return response.data;
};