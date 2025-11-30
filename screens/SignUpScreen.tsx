// Updated SignUpScreen.tsx
import React, { useState } from "react";
import { View, StyleSheet, Alert, KeyboardAvoidingView, Platform } from "react-native";
import {
  Text,
  Button,
  TextInput,
  IconButton,
  useTheme,
  ProgressBar,
  Surface,
} from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient"; // Added for gradients
import { theme } from "../src/theme"

interface SignUpScreenProps {
  onSignUp: (email: string, password: string) => void;
  onBack: () => void;
}

export default function SignUpScreen({ onSignUp, onBack }: SignUpScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = () => {
    if (email.trim() && password.trim()) {
      onSignUp(email.trim(), password);
    } else {
      Alert.alert("Required", "Please enter your email and password to continue.");
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

        <View style={styles.progressWrapper}>
          <View style={styles.progressBarContainer}>
            <ProgressBar 
              progress={0.33} 
              color={theme.colors.onPrimary} 
              style={styles.progressBar}
            />
            <Text variant="labelMedium" style={[styles.progressText, { color: theme.colors.inversePrimary }]}>
              Step 1 of 3
            </Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.headerSection}>
          <Text variant="displayMedium" style={styles.title}>
            Create Account
          </Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            Start your journey with ToGather
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
            autoComplete="password-new"
            placeholder="Choose a secure password"
            style={styles.input}
            outlineStyle={styles.inputOutline}
            left={<TextInput.Icon icon="lock" />}
            right={
              password.length > 0 ? (
                <TextInput.Icon icon="check-circle" color={theme.colors.success} />
              ) : null
            }
          />

          <Button
            mode="contained"
            onPress={handleSignUp}
            style={styles.submitButton}
            contentStyle={styles.submitButtonContent}
            labelStyle={styles.submitButtonLabel}
          >
            Continue
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
    paddingBottom: 32,
  },
  backRow: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  backButton: {
    alignSelf: "flex-start",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  progressWrapper: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  progressBarContainer: {
    gap: 12,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  progressText: {
    textAlign: "right",
    fontWeight: "bold",
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
  submitButton: {
    marginTop: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  submitButtonContent: {
    height: 56,
  },
  submitButtonLabel: {
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
});