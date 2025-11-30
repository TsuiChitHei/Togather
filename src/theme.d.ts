// types/theme.d.ts
import "react-native-paper";

declare module "react-native-paper" {
  interface ThemeColors {
    textPrimary: string;
    textSecondary: string;
    textTertiary: string;
    gradientPrimaryStart: string;
    gradientPrimaryEnd: string;
    gradientAccentStart: string;
    gradientAccentEnd: string;
    shadow: string;
    backdrop: string;
  }
}
