import axios from 'axios';

const API_URL = 'http://localhost:5000/api/sales';

const getAuthHeader = (token) => ({
  headers: { Authorization: `Bearer ${token}` }
});

// Create a new sale
export const createSale = async (saleData, token) => {
  const response = await axios.post(API_URL, saleData, getAuthHeader(token));
  return response.data;
};

// Get all sales
export const getAllSales = async (token) => {
  const response = await axios.get(API_URL, getAuthHeader(token));
  return response.data;
};

// Get single sale
export const getSaleById = async (id, token) => {
  const response = await axios.get(`${API_URL}/${id}`, getAuthHeader(token));
  return response.data;
};

// Get cashier's own sales
export const getMySales = async (token) => {
  const response = await axios.get(`${API_URL}/my-sales`, getAuthHeader(token));
  return response.data;
};