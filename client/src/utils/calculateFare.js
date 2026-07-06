/**
 * Fare calculation utilities for cab booking
 */

// Base fare rates per ride type
const FARE_RATES = {
  economy: {
    baseFare: 30,
    perKm: 10,
    perMinute: 1,
    surgeMultiplier: 1,
  },
  comfort: {
    baseFare: 50,
    perKm: 15,
    perMinute: 2,
    surgeMultiplier: 1.2,
  },
  premium: {
    baseFare: 80,
    perKm: 25,
    perMinute: 3,
    surgeMultiplier: 1.5,
  },
};

/**
 * Calculate fare for a ride
 * @param {number} distance - Distance in km
 * @param {number} duration - Duration in minutes
 * @param {string} rideType - 'economy' | 'comfort' | 'premium'
 * @param {boolean} isSurge - Whether surge pricing is active
 * @returns {object} Fare breakdown
 */
export const calculateFare = (
  distance,
  duration,
  rideType = 'economy',
  isSurge = false
) => {
  const rate = FARE_RATES[rideType];
  if (!rate) throw new Error('Invalid ride type');

  const baseFare = rate.baseFare;
  const distanceFare = distance * rate.perKm;
  const timeFare = duration * rate.perMinute;
  const surge = isSurge ? rate.surgeMultiplier : 1;

  const totalFare = Math.round((baseFare + distanceFare + timeFare) * surge);

  return {
    baseFare,
    distanceFare: Math.round(distanceFare),
    timeFare: Math.round(timeFare),
    surge,
    totalFare,
    currency: 'INR',
    breakdown: {
      base: baseFare,
      distance: `${distance} km × ₹${rate.perKm} = ₹${Math.round(distanceFare)}`,
      time: `${duration} min × ₹${rate.perMinute} = ₹${Math.round(timeFare)}`,
      surge: isSurge ? `×${rate.surgeMultiplier} surge` : null,
    },
  };
};

/**
 * Get estimated fare range for a distance
 */
export const getEstimatedFareRange = (distance, duration) => {
  const types = ['economy', 'comfort', 'premium'];
  return types.map((type) => ({
    type,
    fare: calculateFare(distance, duration, type),
  }));
};

/**
 * Format currency (INR)
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};
