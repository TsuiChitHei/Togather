import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import {
  Text,
  Button,
  TextInput,
  IconButton,
  useTheme,
  ProgressBar,
} from "react-native-paper";

interface SignUpScreenProps {
  onSignUp: (email: string, password: string) => void;
  onBack: () => void;
}

export default function SignUpScreen({ onSignUp, onBack }: SignUpScreenProps) {
  const theme = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = () => {
    if (email.trim() && password.trim()) {
      onSignUp(email.trim(), password);
    } else {
      Alert.alert("提示", "请输入邮箱和密码。");
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
          containerColor="rgba(17,24,39,0.08)"
          iconColor={theme.colors.onSurface}
        />
      </View>

      <View style={styles.progressWrapper}>
        <ProgressBar progress={0.5} color={theme.colors.primary} />
      </View>

      <View style={styles.content}>
        <Text variant="headlineLarge" style={styles.title}>
          Create Account
        </Text>

        <TextInput
          label="Email"
          mode="outlined"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder="you@university.edu"
          style={styles.input}
        />

        <TextInput
          label="Password"
          mode="outlined"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="Choose a secure password"
          style={styles.input}
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
    marginBottom: 16,
  },
  backButton: {
    alignSelf: "flex-start",
  },
  progressWrapper: {
    marginBottom: 32,
  },
  content: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    color: "#111827",
    fontWeight: "700",
    marginBottom: 32,
  },
  input: {
    marginBottom: 20,
  },
  submitButton: {
    marginTop: 12,
    borderRadius: 12,
  },
  submitButtonContent: {
    height: 52,
  },
  submitButtonLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
});