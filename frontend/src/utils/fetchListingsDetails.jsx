import http from './http';

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
  try {
    // Fetch all listings first
    const listings = await fetchListings();
    if (listings) {
      // Iterate over the listings and fetch details for each one sequentially
      for (const listing of listings) {
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
