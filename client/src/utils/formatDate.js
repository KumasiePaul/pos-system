// Format date to readable string
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-GH', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Format date to short string
export const formatShortDate = (date) => {
  return new Date(date).toLocaleDateString('en-GH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Format time
export const formatTime = (date) => {
  return new Date(date).toLocaleTimeString('en-GH', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Format date and time together
export const formatDateTime = (date) => {
  return new Date(date).toLocaleString('en-GH', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};