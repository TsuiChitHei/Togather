// AuthScreen.tsx
import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Button, useTheme } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { theme } from "../src/theme"

interface AuthScreenProps {
  onNavigateLogin: () => void;
  onNavigateSignUp: () => void;
}

const Logo = () => (
  <LinearGradient
    colors={["#6366F1", "#4F46E5"]}
    style={styles.logoContainer}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
  >
    <Text variant="headlineMedium" style={styles.logoText}>
      UC
    </Text>
  </LinearGradient>
);

export default function AuthScreen({
  onNavigateLogin,
  onNavigateSignUp,
}: AuthScreenProps) {

  return (
    <LinearGradient
      colors={["#F9FAFB", "#FFFFFF"]}
      style={styles.container}
    >
      <View style={styles.headerSection}>
        <Logo />
        <Text variant="displayMedium" style={styles.title}>
          ToGather
        </Text>
        <Text variant="bodyLarge" style={styles.subtitle}>
          Discover events, find communities, and connect with friends.
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
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 120,
    paddingBottom: 80,
    justifyContent: "space-between",
  },
  headerSection: {
    alignItems: "center",
  },
  logoContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  logoText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 36,
  },
  title: {
    marginTop: 32,
    color: "#111827",
    fontWeight: "bold",
    letterSpacing: -0.5,
  },
  subtitle: {
    marginTop: 16,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  actionsSection: {
    width: "100%",
  },
  primaryButton: {
    marginBottom: 16,
    borderRadius: 16,
    backgroundColor: "#4F46E5",
  },
  secondaryButton: {
    borderColor: "#D1D5DB",
    borderRadius: 16,
  },
  buttonContent: {
    height: 56,
  },
  primaryButtonLabel: {
    fontSize: 16,
    fontWeight: "bold",
  },
  secondaryButtonLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
  },
});