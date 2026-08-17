/**
 * Semantic design tokens for the mobile app.
 *
 * These tokens mirror the naming conventions used in web artifacts (index.css)
 * so that multi-artifact projects share a cohesive visual identity.
 *
 * Replace the placeholder values below with values that match the project's
 * brand. If a sibling web artifact exists, read its index.css and convert the
 * HSL values to hex so both artifacts use the same palette.
 *
 * To add dark mode, add a `dark` key with the same token names.
 * The useColors() hook will automatically pick it up.
 */

const colors = {
  light: {
    text: '#101517',
    tint: '#b7f200',
    background: '#f5f7f3',
    foreground: '#101517',
    card: '#ffffff',
    cardForeground: '#101517',
    primary: '#b7f200',
    primaryForeground: '#101517',
    secondary: '#e8eee6',
    secondaryForeground: '#24302b',
    muted: '#e7ece7',
    mutedForeground: '#6f7d76',
    accent: '#dff6a0',
    accentForeground: '#304100',
    destructive: '#ef6b5b',
    destructiveForeground: '#ffffff',
    border: '#d8e0d9',
    input: '#d8e0d9',
    success: '#3da978',
    warning: '#f5a94d',
    deep: '#172220',
    deepForeground: '#f6fbf4',
    overlay: '#d6e4d5',
  },
  dark: {
    text: '#f4f8f2',
    tint: '#c7ff18',
    background: '#101617',
    foreground: '#f4f8f2',
    card: '#182120',
    cardForeground: '#f4f8f2',
    primary: '#c7ff18',
    primaryForeground: '#162000',
    secondary: '#24312f',
    secondaryForeground: '#dce9df',
    muted: '#24302f',
    mutedForeground: '#98aaa0',
    accent: '#384a22',
    accentForeground: '#dafa74',
    destructive: '#f17a6c',
    destructiveForeground: '#2b0e0a',
    border: '#2b3a37',
    input: '#31403d',
    success: '#61d89e',
    warning: '#ffc067',
    deep: '#0b1010',
    deepForeground: '#f8fff7',
    overlay: '#21302d',
  },
  radius: 8,
};

export default colors;
