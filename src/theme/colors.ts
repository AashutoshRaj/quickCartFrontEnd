/**
 * Centralized theme tokens.
 * Values are CSS custom properties defined in `src/index.css` (`@theme`).
 * Never hardcode colors in components — reference these instead, or use
 * the matching Tailwind utility (e.g. `bg-primary`, `text-text-secondary`).
 */
export const colors = {
  primary : 'var(--color-primary)',
  primaryDark: 'var(--color-primary-dark)',
  primaryContainer: 'var(--color-primary-container)',
  accent: 'var(--color-accent)',
  background: 'var(--color-background)',
  surface: 'var(--color-surface)',
  textPrimary: 'var(--color-text-primary)',
  textSecondary: 'var(--color-text-secondary)',
  border: 'var(--color-border)',
  inputBackground: 'var(--color-input-bg)',
  success: 'var(--color-success)',
  warning: 'var(--color-warning)',
  error: 'var(--color-error)',
} as const;

export const gradients = {
  primary: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
} as const;

export type ThemeColorKey = keyof typeof colors;
