/**
 * Get initials from a full name.
 * "Dharshan G" → "DG"
 * "Ravi Kumar Sharma" → "RS" (first + last)
 * "Dharshan" → "DH" (first two letters)
 */
export const getInitials = (name: string | null | undefined): string => {
  if (!name || !name.trim()) return '??';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

/**
 * Generate a consistent HSL color from a string (name hash).
 */
export const getAvatarColor = (name: string | null | undefined): string => {
  const str = name || 'User';
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash % 360);
  return `hsl(${hue}, 65%, 45%)`;
};
