import axios from 'axios';

const API_URL = 'http://localhost:5000/api/notifications';

const getAuthHeader = (token) => ({
  headers: { Authorization: `Bearer ${token}` }
});

// Get notifications for current user's role
export const getNotifications = async (token) => {
  const response = await axios.get(API_URL, getAuthHeader(token));
  return response.data;
};

// Mark single notification as read
export const markNotificationAsRead = async (id, token) => {
  const response = await axios.patch(`${API_URL}/${id}/read`, {}, getAuthHeader(token));
  return response.data;
};

// Mark all notifications as read
export const markAllNotificationsAsRead = async (token) => {
  const response = await axios.patch(`${API_URL}/read-all`, {}, getAuthHeader(token));
  return response.data;
};
