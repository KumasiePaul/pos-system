import axios from 'axios';

const API_URL = 'http://localhost:5000/api/reports';

const getAuthHeader = (token) => ({
  headers: { Authorization: `Bearer ${token}` }
});

// Get overall summary
export const getSummary = async (token) => {
  const response = await axios.get(`${API_URL}/summary`, getAuthHeader(token));
  return response.data;
};

// Get daily sales
export const getDailySales = async (token) => {
  const response = await axios.get(`${API_URL}/daily`, getAuthHeader(token));
  return response.data;
};

// Get weekly sales
export const getWeeklySales = async (token) => {
  const response = await axios.get(`${API_URL}/weekly`, getAuthHeader(token));
  return response.data;
};

// Get product performance
export const getProductPerformance = async (token) => {
  const response = await axios.get(`${API_URL}/products`, getAuthHeader(token));
  return response.data;
};

// Get cashier performance
export const getCashierPerformance = async (token) => {
  const response = await axios.get(`${API_URL}/cashiers`, getAuthHeader(token));
  return response.data;
};