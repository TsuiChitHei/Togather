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
  useTheme,
  ActivityIndicator,
} from "react-native-paper";
import { AppContext, User } from "../context/AppContext";

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
  const theme = useTheme();
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
      <Surface style={styles.loadingContainer} elevation={0}>
        <ActivityIndicator animating size="small" />
        <Text variant="bodyMedium" style={styles.loadingText}>
          Loading profile...
        </Text>
      </Surface>
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
      Alert.alert("提示", "请至少填写姓名和简介。");
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
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.headerRow}>
        <Text variant="headlineMedium" style={styles.headerTitle}>
          Your Profile
        </Text>
        <Button
          mode="text"
          onPress={() => setIsEditing((prev) => !prev)}
          labelStyle={styles.editButtonLabel}
        >
          {isEditing ? "Cancel" : "Edit"}
        </Button>
      </View>

      <View style={styles.avatarSection}>
        <Avatar.Image source={{ uri: currentUser.avatarUrl }} size={96} />
        <Text variant="titleLarge" style={styles.profileName}>
          {currentUser.name}
        </Text>
        <Text variant="bodyMedium" style={styles.profileFaculty}>
          {currentUser.faculty}
        </Text>
      </View>

      {isEditing && formData ? (
        <Surface style={styles.card} elevation={0}>
          <Text variant="titleMedium" style={styles.sectionHeading}>
            Public Section
          </Text>

          <TextInput
            label="Name"
            mode="outlined"
            value={formData.name}
            onChangeText={(value) => handleInputChange("name", value)}
            style={styles.input}
          />

          <TextInput
            label="Bio"
            mode="outlined"
            value={formData.bio}
            onChangeText={(value) => handleInputChange("bio", value)}
            multiline
            numberOfLines={4}
            style={styles.input}
          />

          <View>
            <Text variant="labelLarge" style={styles.label}>
              Interests
            </Text>
            <View style={styles.interestRow}>
              {interestOptions.map((interest) => {
                const selected = formData.interests.includes(interest);
                return (
                  <Chip
                    key={interest}
                    selected={selected}
                    onPress={() => handleToggleInterest(interest)}
                    style={[
                      styles.interestChip,
                      selected && { backgroundColor: theme.colors.primary },
                    ]}
                    textStyle={[
                      styles.interestChipText,
                      selected && { color: theme.colors.onPrimary },
                    ]}
                  >
                    {interest}
                  </Chip>
                );
              })}
            </View>
          </View>

          <Divider style={styles.divider} />

          <Text variant="titleMedium" style={styles.sectionHeading}>
            Private Section
          </Text>
          <Text variant="bodySmall" style={styles.privateHint}>
            This is only used for matchmaking and won't be shown to others.
          </Text>

          <TextInput
            label="A perfect weekend for me is..."
            mode="outlined"
            value={editablePrivatePrompts.prompt1}
            onChangeText={(value) => handlePrivatePromptChange("prompt1", value)}
            style={styles.input}
          />

          <TextInput
            label="I'm looking for friends who are..."
            mode="outlined"
            value={editablePrivatePrompts.prompt2}
            onChangeText={(value) => handlePrivatePromptChange("prompt2", value)}
            style={styles.input}
          />

          <Button
            mode="contained"
            onPress={handleSave}
            style={styles.saveButton}
            contentStyle={styles.saveButtonContent}
            labelStyle={styles.saveButtonLabel}
          >
            Save Changes
          </Button>
        </Surface>
      ) : (
        <Surface style={styles.card} elevation={0}>
          <View style={styles.infoRow}>
            <Text variant="labelLarge" style={styles.label}>
              Year
            </Text>
            <Text variant="bodyLarge" style={styles.infoValue}>
              {currentUser.year}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text variant="labelLarge" style={styles.label}>
              Major
            </Text>
            <Text variant="bodyLarge" style={styles.infoValue}>
              {currentUser.major}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text variant="labelLarge" style={styles.label}>
              Hometown
            </Text>
            <Text variant="bodyLarge" style={styles.infoValue}>
              {currentUser.hometown}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text variant="labelLarge" style={styles.label}>
              Bio
            </Text>
            <Text variant="bodyMedium" style={styles.bioText}>
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

      <Divider style={styles.sectionDivider} />

      <Text variant="titleMedium" style={styles.sectionHeading}>
        Settings
      </Text>
      <Button
        mode="contained-tonal"
        onPress={onLogout}
        style={styles.logoutButton}
        contentStyle={styles.logoutButtonContent}
        labelStyle={styles.logoutButtonLabel}
      >
        Log Out
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerTitle: {
    color: "#111827",
    fontWeight: "700",
  },
  editButtonLabel: {
    fontWeight: "600",
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  profileName: {
    marginTop: 16,
    color: "#1F2937",
    fontWeight: "700",
  },
  profileFaculty: {
    marginTop: 4,
    color: "#6B7280",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
  },
  sectionHeading: {
    color: "#111827",
    fontWeight: "600",
    marginBottom: 16,
  },
  label: {
    color: "#374151",
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    marginBottom: 16,
    backgroundColor: "#FFFFFF",
  },
  interestRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  interestChip: {
    borderRadius: 999,
    backgroundColor: "#E5E7EB",
  },
  interestChipText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
  },
  divider: {
    marginVertical: 20,
  },
  privateHint: {
    color: "#6B7280",
    marginBottom: 16,
    lineHeight: 20,
  },
  saveButton: {
    marginTop: 8,
    borderRadius: 12,
  },
  saveButtonContent: {
    height: 50,
  },
  saveButtonLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  infoRow: {
    marginBottom: 16,
  },
  infoValue: {
    color: "#1F2937",
  },
  bioText: {
    color: "#4B5563",
    lineHeight: 20,
  },
  interestDisplayRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  interestDisplayChip: {
    borderRadius: 999,
  },
  interestDisplayChipText: {
    fontSize: 13,
    fontWeight: "600",
  },
  sectionDivider: {
    marginVertical: 32,
  },
  logoutButton: {
    borderRadius: 12,
  },
  logoutButtonContent: {
    height: 52,
  },
  logoutButtonLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    backgroundColor: "#F3F4F6",
    padding: 24,
  },
  loadingText: {
    color: "#4B5563",
  },
});