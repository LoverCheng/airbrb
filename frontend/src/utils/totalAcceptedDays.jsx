function calculateTotalAcceptedDays (bookings) {
  const currentYear = new Date().getFullYear();
  const oneDay = 24 * 60 * 60 * 1000; // milliseconds in one day

  let totalDays = 0;

  bookings.forEach(booking => {
    if (booking.status === 'accepted') {
      const startDate = new Date(booking.dateRange.startDate);
      const endDate = new Date(booking.dateRange.endDate);

      // Check if the booking is within the current year
      if (startDate.getFullYear() === currentYear || endDate.getFullYear() === currentYear) {
        const diffInTime = endDate - startDate;
        const diffInDays = Math.round(diffInTime / oneDay);

        totalDays += diffInDays;
      }
    }
  });

  return totalDays;
}
export default calculateTotalAcceptedDays;
