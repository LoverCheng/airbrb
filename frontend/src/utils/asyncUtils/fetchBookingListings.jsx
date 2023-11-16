/**
 * Fetches the bookings from the backend
 * @author Jason
 * @version 1.0.0
 */

import http from '../http';

const fetchBookingListings = async () => {
  try {
    const response = await http.get('bookings');
    if (response.error) {
      console.error('Error fetching bookings:', response.error);
      return null;
    }
    console.log(response);
    return response.bookings; // Assuming response.bookings is the array of bookings
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return null;
  }
};
export default fetchBookingListings;
