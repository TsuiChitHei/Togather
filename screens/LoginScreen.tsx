// Updated LoginScreen.tsx
import React, { useState } from "react";
import { View, StyleSheet, Alert, KeyboardAvoidingView, Platform } from "react-native";
import {
  Text,
  Button,
  TextInput,
  IconButton,
  useTheme,
  Surface,
} from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient"; // Added for gradients
import { theme } from "../src/theme"

interface LoginScreenProps {
  onLogin: (email: string, password: string) => void;
  onBack: () => void;
}

export default function LoginScreen({ onLogin, onBack }: LoginScreenProps) {
  const [email, setEmail] = useState("jane@test.com");
  const [password, setPassword] = useState("password");

  const handleLogin = () => {
    if (email && password) {
      onLogin(email, password);
    } else {
      Alert.alert("Required", "Please enter your email and password.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <LinearGradient
        colors={[theme.colors.gradientPrimaryStart, theme.colors.gradientPrimaryEnd]}
        style={styles.topGradient}
      >
        <View style={styles.backRow}>
          <IconButton
            icon="arrow-left"
            size={28}
            mode="contained"
            onPress={onBack}
            style={styles.backButton}
            containerColor={theme.colors.surface}
            iconColor={theme.colors.textPrimary}
          />
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.headerSection}>
          <Text variant="displayMedium" style={styles.title}>
            Welcome Back
          </Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            Sign in to continue connecting
          </Text>
        </View>

        <Surface style={styles.formContainer} elevation={5}>
          <TextInput
            label="Email"
            mode="outlined"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            placeholder="you@university.edu"
            style={styles.input}
            outlineStyle={styles.inputOutline}
            left={<TextInput.Icon icon="email" />}
          />

          <TextInput
            label="Password"
            mode="outlined"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoComplete="password"
            placeholder="Enter your password"
            style={styles.input}
            outlineStyle={styles.inputOutline}
            left={<TextInput.Icon icon="lock" />}
          />

          <Button
            mode="contained"
            onPress={handleLogin}
            style={styles.loginButton}
            contentStyle={styles.loginButtonContent}
            labelStyle={styles.loginButtonLabel}
          >
            Sign In
          </Button>
        </Surface>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  topGradient: {
    paddingTop: 64,
    paddingBottom: 48,
  },
  backRow: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  backButton: {
    alignSelf: "flex-start",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  headerSection: {
    marginBottom: 48,
  },
  title: {
    color: "#111827",
    fontWeight: "bold",
    marginBottom: 16,
    letterSpacing: -1,
  },
  subtitle: {
    color: "#6B7280",
    lineHeight: 24,
  },
  formContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    padding: 32,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 5,
  },
  input: {
    marginBottom: 24,
    backgroundColor: "#FFFFFF",
  },
  inputOutline: {
    borderWidth: 1,
    borderRadius: 16,
  },
  loginButton: {
    marginTop: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  loginButtonContent: {
    height: 56,
  },
  loginButtonLabel: {
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
});