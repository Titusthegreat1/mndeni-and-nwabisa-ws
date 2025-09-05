export const WEDDING_DATE = new Date('2025-09-27T15:00:00+02:00');
export const RSVP_DEADLINE = new Date('2025-08-31T23:59:59+02:00');

export const getDaysUntilWedding = (): number => {
  const now = new Date().getTime();
  const distance = WEDDING_DATE.getTime() - now;
  
  if (distance <= 0) return 0;
  
  return Math.floor(distance / (1000 * 60 * 60 * 24));
};

export const isWithinMilestone = (days: number = 30): boolean => {
  return getDaysUntilWedding() <= days && getDaysUntilWedding() > 0;
};

export const isRSVPAvailable = (): boolean => {
  const now = new Date().getTime();
  return now < RSVP_DEADLINE.getTime();
};