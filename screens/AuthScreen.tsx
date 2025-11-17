import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Button, Surface } from "react-native-paper";

interface AuthScreenProps {
  onNavigateLogin: () => void;
  onNavigateSignUp: () => void;
}

const Logo = () => (
  <Surface style={styles.logoContainer} elevation={0}>
    <Text variant="headlineSmall" style={styles.logoText}>
      LOGO
    </Text>
  </Surface>
);

export default function AuthScreen({
  onNavigateLogin,
  onNavigateSignUp,
}: AuthScreenProps) {
  return (
    <View style={styles.container}>
      <View style={styles.headerSection}>
        <Logo />
        <Text variant="headlineLarge" style={styles.title}>
          UniConnect
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          Find your community.
        </Text>
      </View>

      <View style={styles.actionsSection}>
        <Button
          mode="contained"
          onPress={onNavigateSignUp}
          style={styles.primaryButton}
          contentStyle={styles.buttonContent}
          labelStyle={styles.primaryButtonLabel}
        >
          Create Account
        </Button>

        <Button
          mode="outlined"
          onPress={onNavigateLogin}
          style={styles.secondaryButton}
          contentStyle={styles.buttonContent}
          labelStyle={styles.secondaryButtonLabel}
        >
          Log In
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 24,
    paddingTop: 72,
    paddingBottom: 48,
    justifyContent: "space-between",
  },
  headerSection: {
    alignItems: "center",
  },
  logoContainer: {
    width: 72,
    height: 72,
    borderRadius: 16,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    color: "#4F46E5",
    fontWeight: "600",
  },
  title: {
    marginTop: 24,
    color: "#111827",
    fontWeight: "700",
  },
  subtitle: {
    marginTop: 8,
    color: "#6B7280",
  },
  actionsSection: {
    width: "100%",
  },
  primaryButton: {
    marginBottom: 12,
  },
  secondaryButton: {
    borderColor: "#D1D5DB",
  },
  buttonContent: {
    height: 52,
  },
  primaryButtonLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButtonLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
  },
});