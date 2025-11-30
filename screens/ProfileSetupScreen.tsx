// Updated ProfileSetupScreen.tsx
import React, { useState, useMemo } from "react";
import { View, ScrollView, StyleSheet, Alert, KeyboardAvoidingView, Platform } from "react-native";
import {
  Text,
  TextInput,
  Button,
  IconButton,
  Chip,
  useTheme,
  ProgressBar,
  Divider,
  Surface,
} from "react-native-paper";
import { User } from "../context/AppContext";
import { LinearGradient } from "expo-linear-gradient"; // Added for gradients
import { theme } from "../src/theme"

interface ProfileSetupScreenProps {
  pendingUser: Partial<User>;
  onProfileCreated: (user: User) => void;
  onBack: () => void;
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

export default function ProfileSetupScreen({
  pendingUser,
  onProfileCreated,
  onBack,
}: ProfileSetupScreenProps) {
  const [step, setStep] = useState<1 | 2>(1);

  const [name, setName] = useState("");
  const [year, setYear] = useState<number>(4);
  const [faculty, setFaculty] = useState("Computing and Data Science");
  const [major, setMajor] = useState("");
  const [hometown, setHometown] = useState("");
  const [interests, setInterests] = useState<string[]>(["Hiking", "Traveling"]);
  const [bio, setBio] = useState("");

  const [prompt1, setPrompt1] = useState("");
  const [prompt2, setPrompt2] = useState("");

  const handleToggleInterest = (interest: string) => {
    setInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((item) => item !== interest)
        : [...prev, interest]
    );
  };

  const handleContinue = () => {
    if (!name.trim() || !major.trim() || !hometown.trim() || !bio.trim()) {
      Alert.alert("Required", "Please complete all public profile fields.");
      return;
    }
    setStep(2);
  };

  const handleComplete = () => {
    if (!prompt1.trim() || !prompt2.trim()) {
      Alert.alert("Required", "Please answer both private prompts.");
      return;
    }

    const normalizedYear = Number.isFinite(year) ? year : 4;

    const newUser: User = {
      ...pendingUser,
      id: pendingUser.id!,
      email: pendingUser.email!,
      name: name.trim(),
      year: normalizedYear,
      faculty: faculty.trim(),
      major: major.trim(),
      hometown: hometown.trim(),
      interests,
      bio: bio.trim(),
      privatePrompts: {
        prompt1: prompt1.trim(),
        prompt2: prompt2.trim(),
      },
      joinedCommunityIds: [],
      signedUpEventIds: [],
      postIds: [],
      avatarUrl: `https://picsum.photos/seed/${name.split(" ").join("")}/200`,
    };

    onProfileCreated(newUser);
  };

  const progress = useMemo(() => (step === 1 ? 0.5 : 1), [step]);

  const renderYearChips = () =>
    [1, 2, 3, 4, 5, "5+"].map((item) => {
      const isSelected = item === "5+" ? year > 5 : year === item;
      return (
        <Chip
          key={`${item}`}
          selected={isSelected}
          onPress={() => setYear(typeof item === "number" ? item : 6)}
          style={[
            styles.yearChip,
            isSelected && { backgroundColor: theme.colors.primaryContainer },
          ]}
          textStyle={[
            styles.yearChipText,
            isSelected && { color: theme.colors.onPrimaryContainer },
          ]}
        >
          {item}
        </Chip>
      );
    });

  const renderPublicSection = () => (
    <View style={styles.section}>
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
      <View style={styles.headerSection}>
        <Text variant="displayMedium" style={styles.heading}>
          Let's get to know you
        </Text>
        <Text variant="headlineSmall" style={styles.subheading}>
          Public Profile
        </Text>
        <Text variant="bodyLarge" style={styles.description}>
          Share information that others will see on your profile
        </Text>
      </View>

      <Surface style={styles.formContainer} elevation={5}>
        <View style={styles.fieldGroup}>
          <Text variant="labelLarge" style={styles.label}>
            Name
          </Text>
          <TextInput
            mode="outlined"
            value={name}
            onChangeText={setName}
            style={styles.input}
            outlineStyle={styles.inputOutline}
            left={<TextInput.Icon icon="account" />}
          />

          <Text variant="labelLarge" style={styles.label}>
            Year
          </Text>
          <View style={styles.yearRow}>
            {renderYearChips()}
          </View>

          <Text variant="labelLarge" style={styles.label}>
            Faculty
          </Text>
          <TextInput
            mode="outlined"
            value={faculty}
            onChangeText={setFaculty}
            style={styles.input}
            outlineStyle={styles.inputOutline}
            left={<TextInput.Icon icon="school" />}
          />

          <Text variant="labelLarge" style={styles.label}>
            Major
          </Text>
          <TextInput
            mode="outlined"
            value={major}
            onChangeText={setMajor}
            style={styles.input}
            outlineStyle={styles.inputOutline}
            left={<TextInput.Icon icon="book-open-variant" />}
          />

          <Text variant="labelLarge" style={styles.label}>
            Hometown
          </Text>
          <TextInput
            mode="outlined"
            value={hometown}
            onChangeText={setHometown}
            style={styles.input}
            outlineStyle={styles.inputOutline}
            left={<TextInput.Icon icon="home-city" />}
          />

          <Text variant="labelLarge" style={styles.label}>
            Interests
          </Text>
          <View style={styles.interestRow}>
            {interestOptions.map((interest) => (
              <Chip
                key={interest}
                selected={interests.includes(interest)}
                onPress={() => handleToggleInterest(interest)}
                style={styles.interestChip}
                textStyle={styles.interestChipText}
                icon={interests.includes(interest) ? "check" : undefined}
              >
                {interest}
              </Chip>
            ))}
          </View>

          <Text variant="labelLarge" style={styles.label}>
            Bio
          </Text>
          <TextInput
            mode="outlined"
            value={bio}
            onChangeText={setBio}
            multiline
            numberOfLines={4}
            style={styles.input}
            outlineStyle={styles.inputOutline}
            left={<TextInput.Icon icon="note-text" />}
          />
        </View>

        <Button
          mode="contained"
          onPress={handleContinue}
          style={styles.primaryButton}
          contentStyle={styles.primaryButtonContent}
          labelStyle={styles.primaryButtonLabel}
        >
          Continue
        </Button>
      </Surface>
    </View>
  );

  const renderPrivateSection = () => (
    <View style={styles.section}>
      <View style={styles.backRow}>
        <IconButton
          icon="arrow-left"
          size={28}
          mode="contained"
          onPress={() => setStep(1)}
          style={styles.backButton}
          containerColor={theme.colors.surface}
          iconColor={theme.colors.textPrimary}
        />
      </View>
      <View style={styles.headerSection}>
        <Text variant="displayMedium" style={styles.heading}>
          A bit more about you
        </Text>
        <Text variant="headlineSmall" style={styles.subheading}>
          Private Prompts
        </Text>
        <Text variant="bodyLarge" style={styles.description}>
          These help us match you better. Not visible to others.
        </Text>
      </View>

      <Surface style={styles.formContainer} elevation={5}>
        <View style={styles.fieldGroup}>
          <Text variant="labelLarge" style={styles.label}>
            Something unique about me...
          </Text>
          <TextInput
            mode="outlined"
            value={prompt1}
            onChangeText={setPrompt1}
            placeholder="e.g., I can juggle while coding"
            style={styles.input}
            outlineStyle={styles.inputOutline}
            multiline
            numberOfLines={3}
          />

          <Text variant="labelLarge" style={styles.label}>
            I'm looking for friends who are...
          </Text>
          <TextInput
            mode="outlined"
            value={prompt2}
            onChangeText={setPrompt2}
            placeholder="e.g., adventurous and love coffee chats"
            style={styles.input}
            outlineStyle={styles.inputOutline}
            multiline
            numberOfLines={3}
          />
        </View>

        <Button
          mode="contained"
          onPress={handleComplete}
          style={styles.primaryButton}
          contentStyle={styles.primaryButtonContent}
          labelStyle={styles.primaryButtonLabel}
        >
          Complete Profile
        </Button>
      </Surface>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={[theme.colors.gradientPrimaryStart, theme.colors.gradientPrimaryEnd]}
          style={styles.progressWrapper}
        >
          <View style={styles.progressContainer}>
            <ProgressBar 
              progress={progress} 
              color={theme.colors.onPrimary} 
              style={styles.progressBar}
            />
            <Text variant="labelMedium" style={[styles.progressText, { color: theme.colors.inversePrimary }]}>
              Step {step} of 2
            </Text>
          </View>
        </LinearGradient>

        {step === 1 ? renderPublicSection() : renderPrivateSection()}
        <Divider style={styles.bottomSpacer} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  contentContainer: {
    paddingBottom: 64,
  },
  progressWrapper: {
    paddingHorizontal: 24,
    paddingVertical: 32,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  progressContainer: {
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
  formContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    padding: 32,
    marginHorizontal: 24,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 5,
  },
  inputOutline: {
    borderWidth: 1,
    borderRadius: 16,
  },
  section: {
    flex: 1,
    paddingTop: 32,
  },
  headerSection: {
    marginBottom: 40,
    paddingHorizontal: 24,
  },
  heading: {
    color: "#111827",
    fontWeight: "bold",
    letterSpacing: -1,
    marginBottom: 16,
  },
  subheading: {
    color: "#4B5563",
    marginTop: 8,
    fontWeight: "bold",
  },
  description: {
    color: "#6B7280",
    marginTop: 12,
    marginBottom: 16,
    lineHeight: 24,
  },
  fieldGroup: {
    gap: 24,
    marginBottom: 40,
  },
  input: {
    backgroundColor: "#FFFFFF",
  },
  label: {
    color: "#1F2937",
    marginBottom: 12,
    fontWeight: "medium",
    fontSize: 15,
  },
  yearRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  yearChip: {
    borderRadius: 999,
    height: 44,
    paddingHorizontal: 16,
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  yearChipText: {
    fontWeight: "medium",
    fontSize: 15,
  },
  interestRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  interestChip: {
    borderRadius: 999,
    backgroundColor: "#F3F4F6",
    height: 44,
    paddingHorizontal: 16,
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  interestChipText: {
    fontSize: 15,
    fontWeight: "medium",
    color: "#4B5563",
  },
  primaryButton: {
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  primaryButtonContent: {
    height: 56,
  },
  primaryButtonLabel: {
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  backRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 32,
    paddingHorizontal: 24,
  },
  backLabel: {
    color: "#4B5563",
    marginLeft: 12,
    fontWeight: "bold",
  },
  bottomSpacer: {
    opacity: 0,
  },
  backButton: {
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
});