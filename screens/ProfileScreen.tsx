// Updated ProfileScreen.tsx
import React, { useContext, useState, useEffect, useMemo } from "react";
import { View, ScrollView, StyleSheet, Alert } from "react-native";
import {
  Text,
  Avatar,
  Button,
  Chip,
  Divider,
  Surface,
  TextInput,
  ActivityIndicator,
} from "react-native-paper";
import { AppContext, User } from "../context/AppContext";
import { LinearGradient } from "expo-linear-gradient";
import { theme } from "../src/theme";

interface ProfileScreenProps {
  onLogout: () => void;
}

const interestOptions = [
  "Cycling",
  "Hiking",
  "Movies",
  "Drama",
  "Entrepreneurship",
  "Traveling",
  "Gaming",
  "Cooking",
];

export default function ProfileScreen({ onLogout }: ProfileScreenProps) {
  const context = useContext(AppContext);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<User | null>(null);

  useEffect(() => {
    if (context?.currentUser) {
      const user = context.currentUser;
      setFormData({
        ...user,
        privatePrompts: {
          prompt1: user.privatePrompts?.prompt1 ?? "",
          prompt2: user.privatePrompts?.prompt2 ?? "",
        },
      });
    }
  }, [context?.currentUser]);

  if (!context || !context.currentUser) {
    return (
      <LinearGradient
        colors={[theme.colors.gradientPrimaryStart, theme.colors.gradientPrimaryEnd]}
        style={styles.loadingContainer}
      >
        <ActivityIndicator animating size="large" color={theme.colors.onPrimary} />
        <Text variant="bodyLarge" style={[styles.loadingText, { color: theme.colors.onPrimary }]}>
          Loading profile...
        </Text>
      </LinearGradient>
    );
  }

  const { currentUser, updateUser } = context;

  const handleInputChange = <K extends keyof User>(field: K, value: User[K]) => {
    setFormData((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handlePrivatePromptChange = (
    prompt: "prompt1" | "prompt2",
    value: string
  ) => {
    setFormData((prev) =>
      prev
        ? {
            ...prev,
            privatePrompts: { ...prev.privatePrompts, [prompt]: value },
          }
        : prev
    );
  };

  const handleToggleInterest = (interest: string) => {
    setFormData((prev) => {
      if (!prev) return prev;
      const exists = prev.interests.includes(interest);
      const updated = exists
        ? prev.interests.filter((item) => item !== interest)
        : [...prev.interests, interest];
      return { ...prev, interests: updated };
    });
  };

  const handleSave = () => {
    if (!formData) return;
    if (!formData.name.trim() || !formData.bio.trim()) {
      Alert.alert("Required", "Please fill in your name and a brief introduction.");
      return;
    }
    updateUser({
      ...formData,
      name: formData.name.trim(),
      bio: formData.bio.trim(),
    });
    setIsEditing(false);
  };

  const editablePrivatePrompts = useMemo(
    () => formData?.privatePrompts ?? { prompt1: "", prompt2: "" },
    [formData?.privatePrompts]
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <LinearGradient
        colors={[theme.colors.gradientPrimaryStart, theme.colors.gradientPrimaryEnd]}
        style={styles.headerGradient}
      >
        <View style={styles.headerRow}>
          <View>
            <Text variant="displayMedium" style={[styles.headerTitle, { color: theme.colors.onPrimary }]}>
              Profile
            </Text>
            <Text variant="bodyLarge" style={[styles.headerSubtitle, { color: theme.colors.inversePrimary }]}>
              Manage your account information
            </Text>
          </View>
          <Button
            mode="text"
            onPress={() => setIsEditing((prev) => !prev)}
            labelStyle={[styles.editButtonLabel, { color: theme.colors.onPrimary }]}
          >
            {isEditing ? "Cancel" : "Edit"}
          </Button>
        </View>
      </LinearGradient>

      <View style={styles.avatarSection}>
        <Avatar.Image source={{ uri: currentUser.avatarUrl }} size={120} style={styles.avatarImage} />
        <Text variant="headlineLarge" style={styles.profileName}>
          {currentUser.name}
        </Text>
        <Text variant="bodyLarge" style={styles.profileFaculty}>
          {currentUser.faculty} • {currentUser.major}
        </Text>
      </View>

      {isEditing && formData ? (
        <Surface style={styles.card} elevation={4}>
          <Text variant="headlineMedium" style={styles.sectionHeading}>
            Public information
          </Text>

          <Text variant="labelLarge" style={styles.label}>
            Name
          </Text>
          <TextInput
            mode="outlined"
            value={formData.name}
            onChangeText={(text) => handleInputChange("name", text)}
            style={styles.input}
            outlineStyle={styles.inputOutline}
          />

          <Text variant="labelLarge" style={styles.label}>
            Introduction
          </Text>
          <TextInput
            mode="outlined"
            value={formData.bio}
            onChangeText={(text) => handleInputChange("bio", text)}
            multiline
            numberOfLines={4}
            style={styles.input}
            outlineStyle={styles.inputOutline}
          />

          <Text variant="labelLarge" style={styles.label}>
            Interests
          </Text>
          <View style={styles.interestRow}>
            {interestOptions.map((interest) => (
              <Chip
                key={interest}
                selected={formData.interests.includes(interest)}
                onPress={() => handleToggleInterest(interest)}
                style={styles.interestChip}
                textStyle={styles.interestChipText}
                icon={formData.interests.includes(interest) ? "check" : undefined}
              >
                {interest}
              </Chip>
            ))}
          </View>

          <Divider style={styles.divider} />

          <Text variant="headlineMedium" style={styles.sectionHeading}>
            Private prompts
          </Text>
          <Text variant="bodyMedium" style={styles.privateHint}>
            These help us find better matches for you. Not shown publicly.
          </Text>

          <Text variant="labelLarge" style={styles.label}>
            Something unique about me...
          </Text>
          <TextInput
            mode="outlined"
            value={editablePrivatePrompts.prompt1}
            onChangeText={(text) => handlePrivatePromptChange("prompt1", text)}
            multiline
            numberOfLines={3}
            style={styles.input}
            outlineStyle={styles.inputOutline}
          />

          <Text variant="labelLarge" style={styles.label}>
            I'm looking for friends who...
          </Text>
          <TextInput
            mode="outlined"
            value={editablePrivatePrompts.prompt2}
            onChangeText={(text) => handlePrivatePromptChange("prompt2", text)}
            multiline
            numberOfLines={3}
            style={styles.input}
            outlineStyle={styles.inputOutline}
          />

          <Button
            mode="contained"
            onPress={handleSave}
            style={styles.saveButton}
            contentStyle={styles.saveButtonContent}
            labelStyle={styles.saveButtonLabel}
          >
            Save changes
          </Button>
        </Surface>
      ) : (
        <Surface style={styles.card} elevation={4}>
          <View style={styles.infoRow}>
            <Text variant="labelLarge" style={styles.label}>
              Name
            </Text>
            <Text variant="bodyLarge" style={styles.infoValue}>
              {currentUser.name}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text variant="labelLarge" style={styles.label}>
              Introduction
            </Text>
            <Text variant="bodyLarge" style={styles.bioText}>
              {currentUser.bio}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text variant="labelLarge" style={styles.label}>
              Interests
            </Text>
            <View style={styles.interestDisplayRow}>
              {currentUser.interests.map((interest) => (
                <Chip
                  key={interest}
                  mode="outlined"
                  style={styles.interestDisplayChip}
                  textStyle={styles.interestDisplayChipText}
                >
                  {interest}
                </Chip>
              ))}
            </View>
          </View>
        </Surface>
      )}

      {/* Settings section: improved alignment and hierarchy */}
      <View style={styles.sectionContainer}>
        <Surface style={styles.settingsCard} elevation={4}>
          <View style={styles.settingsHeaderRow}>
            <View style={styles.settingsHeaderTextGroup}>
              <Text variant="headlineMedium" style={styles.settingsTitle}>
                Settings
              </Text>
              <Text variant="bodyMedium" style={styles.settingsSubtitle}>
                Manage your account and preferences
              </Text>
            </View>
          </View>

          <Divider style={styles.settingsDivider} />

          <Button
            mode="outlined"
            onPress={onLogout}
            style={styles.logoutButton}
            contentStyle={styles.logoutButtonContent}
            labelStyle={styles.logoutButtonLabel}
          >
            Log out
          </Button>
        </Surface>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // Screen
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  contentContainer: { paddingBottom: 64 },

  // Header gradient
  headerGradient: { paddingTop: 64, paddingBottom: 32, paddingHorizontal: 24 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  headerTitle: { fontWeight: "bold", letterSpacing: -1, marginBottom: 8 },
  headerSubtitle: { lineHeight: 24 },
  editButtonLabel: { fontWeight: "bold", fontSize: 16 },

  // Avatar section
  avatarSection: { alignItems: "center", marginBottom: 40, paddingVertical: 32 },
  avatarImage: { shadowColor: "#000", shadowOpacity: 0.2, shadowRadius: 16, elevation: 8 },
  profileName: { marginTop: 24, color: "#111827", fontWeight: "bold", fontSize: 28, letterSpacing: -0.5 },
  profileFaculty: { marginTop: 8, color: "#6B7280", fontSize: 16 },

  // Cards
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    padding: 32,
    marginHorizontal: 24,
    marginBottom: 32,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 5,
  },

  // Section heading
  sectionHeading: {
    color: "#111827",
    fontWeight: "bold",
    marginBottom: 24,
    fontSize: 24,
    letterSpacing: -0.5,
  },

  // Form labels and inputs
  label: { color: "#1F2937", fontWeight: "500", marginBottom: 12, fontSize: 15 },
  input: { marginBottom: 24, backgroundColor: "#FFFFFF" },
  inputOutline: { borderWidth: 1, borderRadius: 16 },

  // Interests (edit)
  interestRow: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  interestChip: {
    borderRadius: 999,
    backgroundColor: "#F3F4F6",
    height: 44,
    paddingHorizontal: 16,
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  interestChipText: { fontSize: 15, fontWeight: "500", color: "#4B5563" },

  // Divider
  divider: { marginVertical: 32, backgroundColor: "#E5E7EB" },

  // Private prompts hint
  privateHint: { color: "#6B7280", marginBottom: 24, lineHeight: 24, fontSize: 15 },

  // Save button
  saveButton: { marginTop: 24, borderRadius: 16, shadowColor: "#000", shadowOpacity: 0.2, shadowRadius: 12, elevation: 6 },
  saveButtonContent: { height: 56 },
  saveButtonLabel: { fontSize: 16, fontWeight: "bold", letterSpacing: 0.5 },

  // Info view mode
  infoRow: { marginBottom: 32 },
  infoValue: { color: "#1F2937", fontSize: 16, lineHeight: 24 },
  bioText: { color: "#4B5563", lineHeight: 26, fontSize: 16 },
  interestDisplayRow: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  interestDisplayChip: { borderRadius: 999, borderColor: "#D1D5DB", height: 40, paddingHorizontal: 16 },
  interestDisplayChipText: { fontSize: 15, fontWeight: "500", color: "#4B5563" },

  // Settings section container
  sectionContainer: { paddingHorizontal: 24 },
  settingsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    padding: 24,
    marginBottom: 32,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 5,
  },
  settingsHeaderRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  settingsHeaderTextGroup: { flex: 1 },
  settingsTitle: { color: "#111827", fontWeight: "bold", fontSize: 22, letterSpacing: -0.5 },
  settingsSubtitle: { color: "#6B7280", marginTop: 6, fontSize: 15, lineHeight: 22 },
  settingsDivider: { marginVertical: 16, backgroundColor: "#E5E7EB" },

  // Logout
  logoutButton: { borderRadius: 16, borderColor: "#D1D5DB", shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 },
  logoutButtonContent: { height: 52 },
  logoutButtonLabel: { fontSize: 16, fontWeight: "bold", color: "#1F2937", letterSpacing: 0.3 },

  // Loading
  loadingContainer: { flex: 1, alignItems: "center", justifyContent: "center", gap: 24 },
  loadingText: { fontSize: 18, fontWeight: "500" },
});
