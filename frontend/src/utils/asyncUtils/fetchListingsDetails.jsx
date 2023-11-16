/**
 * @fileOverview fetchListingsDetails component
 * @abstract fetchListingsDetails component is used to fetch the listings details
 * @author Jason
 * @version 1.0.0
 */
import http from '../http';
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
  const user = localStorage.getItem('user') || null;
  let bookings = [];
  const highPriority = [];
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
        // calculate the average rating
        if (listing.reviews.length > 0) {
          listing.averageRating = listing.reviews.reduce((acc, review) => {
            return acc + review.rating;
          }, 0) / listing.reviews.length;
        } else {
          listing.averageRating = 0;
        }
        const details = await fetchListingDetails(listing.id);
        listing.metadata = details.metadata;
        listing.availability = details.availability;
        listing.postedOn = details.postedOn;
        listing.published = details.published;
        if (token && listing.bookings.length > 0) {
          for (const booking of listing.bookings) {
            if (booking.owner === user) {
              listing.status = booking.status;
              if (booking.status === 'pending' || booking.status === 'accepted') {
                highPriority.push(listing);
              }
            }
          }
        }
      }
      // sort in alphabetical order
      if (token && highPriority.length > 0) {
        const sortedListings = listings.sort((a, b) => a.title.localeCompare(b.title));
        const tmp = sortedListings.filter(listing => !highPriority.includes(listing));
        const result = highPriority.concat(tmp);
        setDetailedListings(result);
        console.log(result);
        return;
      } else {
        const result = listings.sort((a, b) => a.title.localeCompare(b.title));
        // const result = highPriority.concat(tmp);
        //! we can print the result here to see what it looks like
        console.log(result);
        setDetailedListings(result);
      }
    }
  } catch (error) {
    console.error('Failed to fetch listings:', error);
  }
};

export default fetchAllListingsAndDetailsSequentially;
