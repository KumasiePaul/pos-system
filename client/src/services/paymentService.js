import axios from 'axios';

const API_URL = 'http://localhost:5000/api/payments';

const getAuthHeader = (token) => ({
  headers: { Authorization: `Bearer ${token}` }
});

// Create a payment record
export const createPayment = async (paymentData, token) => {
  const response = await axios.post(API_URL, paymentData, getAuthHeader(token));
  return response.data;
};

// Get all payments
export const getAllPayments = async (token) => {
  const response = await axios.get(API_URL, getAuthHeader(token));
  return response.data;
};

// Get payment by sale ID
export const getPaymentBySale = async (saleId, token) => {
  const response = await axios.get(`${API_URL}/sale/${saleId}`, getAuthHeader(token));
  return response.data;
};

// Get payment summary
export const getPaymentSummary = async (token) => {
  const response = await axios.get(`${API_URL}/summary`, getAuthHeader(token));
  return response.data;
};