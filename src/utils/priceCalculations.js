// utils/priceCalculations.js
export function calculateTourPrice(tour, guests, groupPrices = tour.groupPrices) {
  // Handle undefined or missing data
  if (!groupPrices || !Array.isArray(groupPrices) || groupPrices.length === 0) {
    // Try to get price from different possible fields
    if (tour.calculatedPrice !== undefined) return tour.calculatedPrice;
    if (tour.price !== undefined) return tour.price;
    return 0;
  }

  // Convert guests to number if it's a string
  const guestCount = Number(guests) || 0;

  // Find appropriate pricing tier
  let selectedTier = groupPrices[0];

  for (const tier of groupPrices) {
    if (typeof tier.groupSize === "string") {
      const [min, max] = tier.groupSize.split("-").map(Number);
      if (guestCount >= min && guestCount <= max) {
        selectedTier = tier;
        break;
      }
    } else if (tier.groupSize === guestCount) {
      selectedTier = tier;
      break;
    }
  }

  // Calculate final price
  return selectedTier.perPerson !== false ? selectedTier.price * guestCount : selectedTier.price;
}

// Helper function to calculate original price from a tour
export function getOriginalTourPrice(tour) {
  // Check for originalPrice first, then calculatedPrice, then price
  if (tour.originalPrice !== undefined) return tour.originalPrice;
  if (tour.calculatedPrice !== undefined) return tour.calculatedPrice;
  if (tour.price !== undefined) return tour.price;

  // If we have guests and groupPrices, calculate it
  if (tour.guests && tour.groupPrices) {
    return calculateTourPrice(tour, tour.guests, tour.groupPrices);
  }

  return 0;
}
