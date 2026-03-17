import axios from 'axios';

const API_URL = 'http://localhost:5000/api/customers';

const getAuthHeader = (token) => ({
  headers: { Authorization: `Bearer ${token}` }
});

// Get all customers
export const getAllCustomers = async (token) => {
  const response = await axios.get(API_URL, getAuthHeader(token));
  return response.data;
};

// Get single customer
export const getCustomerById = async (id, token) => {
  const response = await axios.get(`${API_URL}/${id}`, getAuthHeader(token));
  return response.data;
};

// Create customer
export const createCustomer = async (customerData, token) => {
  const response = await axios.post(API_URL, customerData, getAuthHeader(token));
  return response.data;
};

// Update customer
export const updateCustomer = async (id, customerData, token) => {
  const response = await axios.put(`${API_URL}/${id}`, customerData, getAuthHeader(token));
  return response.data;
};

// Delete customer
export const deleteCustomer = async (id, token) => {
  const response = await axios.delete(`${API_URL}/${id}`, getAuthHeader(token));
  return response.data;
};

// Update loyalty points
export const updateLoyaltyPoints = async (id, points, token) => {
  const response = await axios.patch(`${API_URL}/${id}/loyalty`, { points }, getAuthHeader(token));
  return response.data;
};

// Search customers
export const searchCustomers = async (query, token) => {
  const response = await axios.get(`${API_URL}/search?query=${query}`, getAuthHeader(token));
  return response.data;
};