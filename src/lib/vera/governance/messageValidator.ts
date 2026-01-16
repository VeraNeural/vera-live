import type { IncomingMessageWithImage, RoutingTier } from '../core/types';

export type ValidationResult = {
  valid: boolean;
  error?: { text: string; status: number };
};

const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

/**
 * Validates incoming messages for structure, content, and image attachments.
 * Enforces tier-based access control for image features.
 */
export function validateMessages(
  messages: unknown,
  tier: 'anonymous' | 'free' | 'sanctuary' | 'build'
): ValidationResult {
  // Validate messages array structure
  if (!Array.isArray(messages) || messages.length === 0) {
    return {
      valid: false,
      error: {
        text: 'Please send at least one message.',
        status: 400,
      },
    };
  }

  // Check if any message contains an image attachment
  const hasAnyImage = messages.some(
    (m) =>
      m.role === 'user' &&
      Boolean(m.image && typeof m.image.base64 === 'string' && typeof m.image.mediaType === 'string')
  );

  // No image validation needed if no images present
  if (!hasAnyImage) {
    return { valid: true };
  }

  // Image attachments are Sanctuary-only
  if (tier !== 'sanctuary') {
    return {
      valid: false,
      error: {
        text: 'Image attachments are available for Sanctuary members.',
        status: 403,
      },
    };
  }

  // Validate each image attachment
  for (const m of messages) {
    if (m.role !== 'user' || !m.image) continue;

    // Validate image media type
    if (!ALLOWED_IMAGE_TYPES.has(m.image.mediaType)) {
      return {
        valid: false,
        error: {
          text: 'Unsupported image type. Please use JPG, PNG, WebP, or GIF.',
          status: 400,
        },
      };
    }

    // Validate base64 payload
    if (!m.image.base64 || m.image.base64.length < 8) {
      return {
        valid: false,
        error: {
          text: 'Invalid image payload.',
          status: 400,
        },
      };
    }
  }

  return { valid: true };
}
