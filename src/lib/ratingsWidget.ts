/**
 * User Ratings Widget
 * Supports Trustpilot integration and custom rating system
 */

export interface Rating {
  id: string;
  author: string;
  avatar?: string;
  rating: number; // 1-5 stars
  title: string;
  content: string;
  date: number;
  verified: boolean;
  helpfulCount?: number;
}

export interface RatingsStats {
  averageRating: number;
  totalReviews: number;
  distribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  trustpilotScore?: number;
  trustpilotUrl?: string;
}

export interface RatingSubmission {
  author: string;
  email: string;
  rating: number;
  title: string;
  content: string;
  tool?: string;
}

/**
 * Mock ratings data for demo purposes
 * In production, fetch from Trustpilot API or database
 */
const MOCK_RATINGS: Rating[] = [
  {
    id: '1',
    author: 'Sarah Chen',
    avatar: '👩‍💻',
    rating: 5,
    title: 'Perfect for streaming setup',
    content: 'The ring light simulator is incredibly accurate. Helped me dial in my lighting perfectly before investing in real equipment. Saved me hundreds!',
    date: Date.now() - 7 * 24 * 60 * 60 * 1000,
    verified: true,
    helpfulCount: 24,
  },
  {
    id: '2',
    author: 'Marcus Johnson',
    avatar: '👨‍🎬',
    rating: 5,
    title: 'Game changer for content creators',
    content: 'All 20+ tools in one place? This is exactly what I needed. The prank screens are hilarious and my audience loves them!',
    date: Date.now() - 14 * 24 * 60 * 60 * 1000,
    verified: true,
    helpfulCount: 18,
  },
  {
    id: '3',
    author: 'Jessica Martinez',
    avatar: '👩‍🏫',
    rating: 4,
    title: 'Great for presentations',
    content: 'Using the white screen and color tools for my teaching materials. Would love more customization options, but overall excellent.',
    date: Date.now() - 21 * 24 * 60 * 60 * 1000,
    verified: true,
    helpfulCount: 12,
  },
  {
    id: '4',
    author: 'David Kim',
    avatar: '👨‍💼',
    rating: 5,
    title: 'Indispensable tool',
    content: 'The Pomodoro timer + ambient sounds combo is my new productivity secret. No ads, no signup, just pure utility. Love it!',
    date: Date.now() - 28 * 24 * 60 * 60 * 1000,
    verified: true,
    helpfulCount: 31,
  },
  {
    id: '5',
    author: 'Emma Rodriguez',
    avatar: '👩‍🎨',
    rating: 5,
    title: 'Creative inspiration',
    content: 'The Matrix rain and ambient spaces are perfect for creative sessions. Exactly what I needed to get in the zone.',
    date: Date.now() - 35 * 24 * 60 * 60 * 1000,
    verified: true,
    helpfulCount: 27,
  },
];

/**
 * Calculate ratings statistics
 */
export function calculateRatingsStats(ratings: Rating[]): RatingsStats {
  if (ratings.length === 0) {
    return {
      averageRating: 0,
      totalReviews: 0,
      distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      trustpilotScore: 0,
    };
  }

  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  let totalScore = 0;

  ratings.forEach(rating => {
    totalScore += rating.rating;
    distribution[rating.rating as keyof typeof distribution]++;
  });

  const averageRating = totalScore / ratings.length;

  return {
    averageRating: Math.round(averageRating * 10) / 10,
    totalReviews: ratings.length,
    distribution,
    trustpilotScore: Math.round(averageRating * 10) / 10,
    trustpilotUrl: 'https://www.trustpilot.com/review/purewhitescreen.online',
  };
}

/**
 * Get ratings with sorting options
 */
export function getSortedRatings(
  ratings: Rating[],
  sortBy: 'recent' | 'helpful' | 'highest' | 'lowest' = 'recent'
): Rating[] {
  const sorted = [...ratings];

  switch (sortBy) {
    case 'recent':
      return sorted.sort((a, b) => b.date - a.date);
    case 'helpful':
      return sorted.sort((a, b) => (b.helpfulCount || 0) - (a.helpfulCount || 0));
    case 'highest':
      return sorted.sort((a, b) => b.rating - a.rating);
    case 'lowest':
      return sorted.sort((a, b) => a.rating - b.rating);
    default:
      return sorted;
  }
}

/**
 * Filter ratings by star rating
 */
export function filterRatingsByStars(ratings: Rating[], stars: number): Rating[] {
  return ratings.filter(rating => rating.rating === stars);
}

/**
 * Get mock ratings (for demo)
 */
export function getMockRatings(): Rating[] {
  return MOCK_RATINGS;
}

/**
 * Get mock ratings stats
 */
export function getMockRatingsStats(): RatingsStats {
  return calculateRatingsStats(MOCK_RATINGS);
}

/**
 * Format date for display
 */
export function formatRatingDate(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  if (weeks < 4) return `${weeks}w ago`;
  if (months < 12) return `${months}mo ago`;
  return `${years}y ago`;
}

/**
 * Validate rating submission
 */
export function validateRatingSubmission(submission: RatingSubmission): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!submission.author || submission.author.trim().length < 2) {
    errors.push('Name must be at least 2 characters');
  }

  if (!submission.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(submission.email)) {
    errors.push('Valid email required');
  }

  if (submission.rating < 1 || submission.rating > 5) {
    errors.push('Rating must be between 1 and 5');
  }

  if (!submission.title || submission.title.trim().length < 5) {
    errors.push('Title must be at least 5 characters');
  }

  if (!submission.content || submission.content.trim().length < 20) {
    errors.push('Review must be at least 20 characters');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Generate star display
 */
export function generateStarDisplay(rating: number): string {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  let stars = '★'.repeat(fullStars);
  if (hasHalfStar) stars += '⯨';
  stars += '☆'.repeat(emptyStars);

  return stars;
}

/**
 * Get rating distribution percentage
 */
export function getRatingDistributionPercentage(
  distribution: RatingsStats['distribution'],
  stars: number
): number {
  const total = Object.values(distribution).reduce((a, b) => a + b, 0);
  if (total === 0) return 0;
  return Math.round((distribution[stars as keyof typeof distribution] / total) * 100);
}

/**
 * Trustpilot integration
 */
export const trustpilotConfig = {
  businessUnitId: 'purewhitescreen-online', // Replace with actual ID
  apiKey: process.env.VITE_TRUSTPILOT_API_KEY,
  businessUrl: 'https://www.trustpilot.com/review/purewhitescreen.online',
};

/**
 * Fetch ratings from Trustpilot API
 */
export async function fetchTrustpilotRatings(): Promise<Rating[]> {
  try {
    // In production, call Trustpilot API
    // const response = await fetch(`https://api.trustpilot.com/v1/business-units/${trustpilotConfig.businessUnitId}/reviews`);
    // const data = await response.json();
    // return data.reviews.map(mapTrustpilotReview);

    // Mock implementation for demo
    return getMockRatings();
  } catch (error) {
    console.error('Error fetching Trustpilot ratings:', error);
    return getMockRatings();
  }
}

/**
 * Map Trustpilot review to Rating format
 */
function mapTrustpilotReview(review: any): Rating {
  return {
    id: review.id,
    author: review.reviewer.name,
    avatar: review.reviewer.profilePhotoUrl,
    rating: review.rating,
    title: review.title,
    content: review.text,
    date: new Date(review.createdAt).getTime(),
    verified: review.verified,
    helpfulCount: review.numberOfLikes,
  };
}

/**
 * Submit rating to backend
 */
export async function submitRating(submission: RatingSubmission): Promise<{ success: boolean; error?: string }> {
  const validation = validateRatingSubmission(submission);
  if (!validation.valid) {
    return { success: false, error: validation.errors.join(', ') };
  }

  try {
    // In production, send to backend API
    // const response = await fetch('/api/ratings/submit', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(submission),
    // });
    // return await response.json();

    // Mock implementation for demo
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to submit rating' };
  }
}

/**
 * Get average rating color
 */
export function getRatingColor(rating: number): string {
  if (rating >= 4.5) return 'text-green-500';
  if (rating >= 4) return 'text-green-400';
  if (rating >= 3) return 'text-yellow-500';
  if (rating >= 2) return 'text-orange-500';
  return 'text-red-500';
}

/**
 * Get rating badge text
 */
export function getRatingBadgeText(rating: number): string {
  if (rating >= 4.5) return 'Excellent';
  if (rating >= 4) return 'Great';
  if (rating >= 3) return 'Good';
  if (rating >= 2) return 'Fair';
  return 'Poor';
}
