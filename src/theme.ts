// src/theme.ts
import {
  MD3LightTheme,
  configureFonts,
  MD3TypescaleKey, // ← this is the correct type (not MD3Type)
} from "react-native-paper";
import { DefaultTheme as NavigationDefaultTheme } from "@react-navigation/native";

// ──────────────────────────────────────────────────────────────
// Colors (unchanged – you already have a beautiful palette)
const colors = {
  primary: "#4F46E5",
  primaryContainer: "#6366F1",
  secondary: "#8B5CF6",
  secondaryContainer: "#A78BFA",
  tertiary: "#EC4899",
  tertiaryContainer: "#F472B6",
  background: "#F9FAFB",
  surface: "#FFFFFF",
  surfaceVariant: "#F3F4F6",
  error: "#EF4444",
  errorContainer: "#FCA5A5",
  warning: "#F59E0B",
  success: "#10B981",
  onPrimary: "#FFFFFF",
  onPrimaryContainer: "#FFFFFF",
  onSecondary: "#FFFFFF",
  onBackground: "#111827",
  onSurface: "#1F2937",
  onSurfaceVariant: "#6B7280",
  outline: "#D1D5DB",
  outlineVariant: "#E5E7EB",
  shadow: "#000000",
  inversePrimary: "#A5B4FC",
  backdrop: "transparent",

  // Extra custom colors
  textPrimary: "#111827",
  textSecondary: "#4B5563",
  textTertiary: "#9CA3AF",
  gradientPrimaryStart: "#6366F1",
  gradientPrimaryEnd: "#4F46E5",
  gradientAccentStart: "#EC4899",
  gradientAccentEnd: "#DB2777",
};

// ──────────────────────────────────────────────────────────────
// Correct font config for react-native-paper v5 (MD3)
const fontConfig = {
  // You only need to override the variants you want to customize
  // Everything else falls back to defaults
  displayLarge: { fontFamily: "Inter-Bold", fontSize: 57, lineHeight: 64, letterSpacing: -0.25, fontWeight: "700" as const },
  displayMedium: { fontFamily: "Inter-Bold", fontSize: 45, lineHeight: 52, fontWeight: "700" as const },
  displaySmall: { fontFamily: "Inter-Bold", fontSize: 36, lineHeight: 44, fontWeight: "700" as const },

  headlineLarge: { fontFamily: "Inter-Bold", fontSize: 32, lineHeight: 40, fontWeight: "700" as const },
  headlineMedium: { fontFamily: "Inter-SemiBold", fontSize: 28, lineHeight: 36, fontWeight: "600" as const },
  headlineSmall: { fontFamily: "Inter-SemiBold", fontSize: 24, lineHeight: 32, fontWeight: "600" as const },

  titleLarge: { fontFamily: "Inter-SemiBold", fontSize: 22, lineHeight: 28, fontWeight: "600" as const },
  titleMedium: { fontFamily: "Inter-Medium", fontSize: 16, lineHeight: 24, letterSpacing: 0.15, fontWeight: "500" as const },
  titleSmall: { fontFamily: "Inter-Medium", fontSize: 14, lineHeight: 20, letterSpacing: 0.1, fontWeight: "500" as const },

  labelLarge: { fontFamily: "Inter-Medium", fontSize: 14, lineHeight: 20, letterSpacing: 0.1, fontWeight: "500" as const },
  labelMedium: { fontFamily: "Inter-Medium", fontSize: 12, lineHeight: 16, letterSpacing: 0.5, fontWeight: "500" as const },
  labelSmall: { fontFamily: "Inter-Medium", fontSize: 11, lineHeight: 16, letterSpacing: 0.5, fontWeight: "500" as const },

  bodyLarge: { fontFamily: "Inter-Regular", fontSize: 16, lineHeight: 24, fontWeight: "400" as const },
  bodyMedium: { fontFamily: "Inter-Regular", fontSize: 14, lineHeight: 20, fontWeight: "400" as const },
  bodySmall: { fontFamily: "Inter-Regular", fontSize: 12, lineHeight: 16, letterSpacing: 0.4, fontWeight: "400" as const },
} satisfies Partial<Record<MD3TypescaleKey, any>>; // ← correct type

// ──────────────────────────────────────────────────────────────
// Final theme
export const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    ...colors,
  },
  fonts: configureFonts({ config: fontConfig }), // ← now 100% type-safe
  roundness: 16,
};

// ──────────────────────────────────────────────────────────────
// Navigation theme
export const navigationTheme = {
  ...NavigationDefaultTheme,
  colors: {
    ...NavigationDefaultTheme.colors,
    primary: colors.primary,
    background: colors.background,
    card: colors.surface,
    text: colors.textPrimary,
    border: colors.outline,
    notification: colors.tertiary,
  },
};