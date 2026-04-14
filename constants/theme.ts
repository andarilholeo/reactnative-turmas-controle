/**
 * Tema Medieval Escuro — design tokens do app.
 *
 * MedievalTheme: paleta completa para uso direto nos StyleSheets.
 * Colors: tokens que ThemedText / ThemedView / tab bar consomem via
 *         useThemeColor(). Ambos os modos (light/dark) usam o mesmo
 *         tema escuro para que a aparência seja sempre consistente.
 */

import { Platform } from 'react-native';

// ── Paleta medieval escura ────────────────────────────────────────────────────
export const MedievalTheme = {
  /** Fundo principal da tela */
  bg:             '#121212',
  /** Fundo de superfícies secundárias (sheets, headers internos) */
  surface:        '#1E1E1E',
  /** Fundo dos cards */
  card:           '#2A2A2A',
  /** Texto primário */
  textPrimary:    '#F5F5F5',
  /** Texto secundário / placeholders */
  textSecondary:  '#BDBDBD',
  /** Dourado — botão primário e accent principal */
  gold:           '#C2A878',
  /** Dourado claro — estado hover/pressed */
  goldHover:      '#D4B98A',
  /** Botão secundário */
  btnSecondary:   '#3A3A3A',
  /** Bordas e separadores */
  border:         '#3A3A3A',
  /** Accent bruno — badges, ícones de destaque */
  accent:         '#8F7A66',
};

// ── Colors para ThemedText / ThemedView / tab bar ─────────────────────────────
export const Colors = {
  light: {
    text:            MedievalTheme.textPrimary,
    background:      MedievalTheme.bg,
    tint:            MedievalTheme.gold,
    icon:            MedievalTheme.textSecondary,
    tabIconDefault:  MedievalTheme.textSecondary,
    tabIconSelected: MedievalTheme.gold,
  },
  dark: {
    text:            MedievalTheme.textPrimary,
    background:      MedievalTheme.bg,
    tint:            MedievalTheme.gold,
    icon:            MedievalTheme.textSecondary,
    tabIconDefault:  MedievalTheme.textSecondary,
    tabIconSelected: MedievalTheme.gold,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
