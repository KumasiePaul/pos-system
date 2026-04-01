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

// Submit OTP to complete a mobile money charge
export const submitMobileMoneyOtp = async (data, token) => {
  const response = await axios.post(`${API_URL}/mobile-money/submit-otp`, data, getAuthHeader(token));
  return response.data;
};

// Initiate a Paystack mobile money charge
export const initiateMobileMoney = async (data, token) => {
  const response = await axios.post(`${API_URL}/mobile-money/initiate`, data, getAuthHeader(token));
  return response.data;
};

// Verify a Paystack mobile money transaction
export const verifyMobileMoneyPayment = async (reference, token) => {
  const response = await axios.get(`${API_URL}/mobile-money/verify/${reference}`, getAuthHeader(token));
  return response.data;
};