// src/utils/formatDate.js
import { format, parseISO } from 'date-fns';

export const formatDate = (dateString) => {
  if (!dateString) return '';
  try {
    const date = parseISO(dateString);
    return format(date, 'PPP');
  } catch (error) {
    console.error('Invalid date format:', error);
    return '';
  }
};