// JULIJA - User Tier Validation

export interface UserTierInfo {
  isValid: boolean;
  tier: 'anonymous' | 'free' | 'sanctuary' | 'admin';
  email: string;
  userId: string;
}

const ADMIN_EMAILS = ['elvec2kw@gmail.com', 'krajceva@gmail.com'];

/**
 * Validates the user and returns their tier information
 */
export async function validateUserTier(
  userId: string,
  userEmail: string
): Promise<UserTierInfo> {
  // No user = anonymous
  if (!userId || !userEmail) {
    return {
      isValid: true,
      tier: 'anonymous',
      email: '',
      userId: '',
    };
  }

  // Check if admin
  if (ADMIN_EMAILS.includes(userEmail.toLowerCase())) {
    return {
      isValid: true,
      tier: 'admin',
      email: userEmail,
      userId,
    };
  }

  // TODO: Check database for actual tier (sanctuary vs free)
  // For now, authenticated users are 'free'
  return {
    isValid: true,
    tier: 'free',
    email: userEmail,
    userId,
  };
}

/**
 * Checks if a user tier has access to a specific feature
 */
export function checkFeatureAccess(tier: string, feature: string): boolean {
  const featureMatrix: Record<string, string[]> = {
    anonymous: ['basic-chat'],
    free: ['basic-chat', 'daily-messages', 'journal'],
    sanctuary: ['basic-chat', 'daily-messages', 'journal', 'voice', 'unlimited', 'premium-support'],
    admin: ['all'],
  };

  if (tier === 'admin') return true;
  return featureMatrix[tier]?.includes(feature) || false;
}