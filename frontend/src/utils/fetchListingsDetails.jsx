import http from './http';
import fetchBookingListings from './fetchBookingListings';

const fetchListingDetails = async (id) => {
  try {
    const additionalInfo = await http.get(`listings/${id}`);
    return additionalInfo.listing;
  } catch (error) {
    console.error(`Failed to fetch additional info for ${id}:`, error);
    return null; // Or handle the error as you see fit
  }
};

const fetchListings = async () => {
  try {
    // Await the HTTP get request
    const response = await http.get('listings');
    // Set the listings in state
    return response.listings;
  } catch (error) {
    // If there's an error, log it
    console.error('Failed to fetch listings:', error);
  }
};

const fetchAllListingsAndDetailsSequentially = async (setDetailedListings) => {
  const token = localStorage.getItem('token') || null;
  let bookings = [];
  try {
    // Fetch all listings first
    const listings = await fetchListings();
    // const bookings = await fetchBookingListings();
    if (token) {
      bookings = await fetchBookingListings();
    }
    if (listings) {
      // Iterate over the listings and fetch details for each one sequentially
      for (const listing of listings) {
        // Filter the bookings to get the ones for this listing
        if (token) {
          listing.bookings = bookings.filter(booking =>
            String(listing.id) === booking.listingId);
        }
        const details = await fetchListingDetails(listing.id);
        setDetailedListings((prevDetailedListings) => {
          const metadata = details.metadata;
          const result = [...prevDetailedListings, { ...listing, metadata, ...details }]
          //! we can print the result here to see what it looks like
          console.log(result);
          return result;
        });
      }
    }
  } catch (error) {
    console.error('Failed to fetch listings:', error);
  }
};

export default fetchAllListingsAndDetailsSequentially;
