import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import {
  Text,
  Button,
  TextInput,
  IconButton,
  useTheme,
} from "react-native-paper";

interface LoginScreenProps {
  onLogin: (email: string, password: string) => void;
  onBack: () => void;
}

export default function LoginScreen({ onLogin, onBack }: LoginScreenProps) {
  const theme = useTheme();
  const [email, setEmail] = useState("jane@test.com");
  const [password, setPassword] = useState("password");

  const handleLogin = () => {
    if (email && password) {
      onLogin(email, password);
    } else {
      Alert.alert("Hint", "Please enter your email and password.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.backRow}>
        <IconButton
          icon="arrow-left"
          size={24}
          mode="contained-tonal"
          onPress={onBack}
          style={styles.backButton}
          containerColor="rgba(17, 24, 39, 0.1)"
          iconColor={theme.colors.onSurface}
        />
      </View>

      <View style={styles.content}>
        <Text variant="headlineLarge" style={styles.title}>
          Welcome Back
        </Text>

        <TextInput
          label="Email"
          mode="outlined"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder="jane@university.edu"
          style={styles.input}
        />

        <TextInput
          label="Password"
          mode="outlined"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="••••••••"
          style={styles.input}
        />

        <Button
          mode="contained"
          onPress={handleLogin}
          style={styles.loginButton}
          contentStyle={styles.loginButtonContent}
          labelStyle={styles.loginButtonLabel}
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
    paddingTop: 48,
    paddingBottom: 32,
  },
  backRow: {
    marginBottom: 24,
  },
  backButton: {
    alignSelf: "flex-start",
  },
  content: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    color: "#111827",
    fontWeight: "700",
    marginBottom: 32,
    textAlign: "left",
  },
  input: {
    marginBottom: 20,
  },
  loginButton: {
    marginTop: 12,
  },
  loginButtonContent: {
    height: 52,
  },
  loginButtonLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
});