import React, { useState, useMemo } from "react";
import { View, ScrollView, StyleSheet, Alert } from "react-native";
import {
  Text,
  TextInput,
  Button,
  IconButton,
  Chip,
  useTheme,
  ProgressBar,
  Divider,
} from "react-native-paper";
import { User } from "../context/AppContext";

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
  const theme = useTheme();
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
      Alert.alert("Heads up", "Please complete all public profile fields.");
      return;
    }
    setStep(2);
  };

  const handleComplete = () => {
    if (!prompt1.trim() || !prompt2.trim()) {
      Alert.alert("Heads up", "Please answer both private prompts.");
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
            isSelected && { backgroundColor: theme.colors.primary },
          ]}
          textStyle={[
            styles.yearChipText,
            isSelected && { color: theme.colors.onPrimary },
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
          size={24}
          mode="contained-tonal"
          onPress={onBack}
          style={styles.backButton}
          containerColor="rgba(17,24,39,0.08)"
          iconColor={theme.colors.onSurface}
        />
      </View>
      <Text variant="headlineMedium" style={styles.heading}>
        Let's talk about you!
      </Text>
      <Text variant="titleMedium" style={styles.subheading}>
        Public Section
      </Text>
      <Text variant="bodyMedium" style={styles.description}>
        How will you introduce yourself to others?
      </Text>

      <View style={styles.fieldGroup}>
        <TextInput
          label="Name"
          mode="outlined"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />

        <View>
          <Text variant="labelMedium" style={styles.label}>
            Year
          </Text>
          <View style={styles.yearRow}>{renderYearChips()}</View>
        </View>

        <TextInput
          label="Faculty"
          mode="outlined"
          value={faculty}
          onChangeText={setFaculty}
          style={styles.input}
        />

        <TextInput
          label="Major(s)"
          mode="outlined"
          value={major}
          onChangeText={setMajor}
          style={styles.input}
        />

        <TextInput
          label="Hometown"
          mode="outlined"
          value={hometown}
          onChangeText={setHometown}
          style={styles.input}
        />

        <View>
          <Text variant="labelMedium" style={styles.label}>
            Interests / Hobbies
          </Text>
          <View style={styles.interestRow}>
            {interestOptions.map((interest) => {
              const selected = interests.includes(interest);
              return (
                <Chip
                  key={interest}
                  onPress={() => handleToggleInterest(interest)}
                  selected={selected}
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

        <TextInput
          label="Bio"
          mode="outlined"
          value={bio}
          onChangeText={setBio}
          multiline
          numberOfLines={4}
          style={styles.input}
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
    </View>
  );

  const renderPrivateSection = () => (
    <View style={styles.section}>
      <View style={styles.backRow}>
        <IconButton
          icon="arrow-left"
          size={24}
          mode="contained-tonal"
          onPress={() => setStep(1)}
          containerColor="rgba(17,24,39,0.08)"
        />
        <Text variant="titleMedium" style={styles.backLabel}>
          Back
        </Text>
      </View>

      <Text variant="headlineMedium" style={styles.heading}>
        Just a little more...
      </Text>
      <Text variant="titleMedium" style={styles.subheading}>
        Private Section
      </Text>
      <Text variant="bodyMedium" style={styles.description}>
        This is only used for matchmaking and won’t be shown to others.
      </Text>

      <View style={styles.fieldGroup}>
        <TextInput
          label="A perfect weekend for me is..."
          mode="outlined"
          value={prompt1}
          onChangeText={setPrompt1}
          placeholder="e.g., exploring a new hiking trail"
          style={styles.input}
        />

        <TextInput
          label="I'm looking for friends who are..."
          mode="outlined"
          value={prompt2}
          onChangeText={setPrompt2}
          placeholder="e.g., open-minded and love to laugh"
          style={styles.input}
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
    </View>
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.progressWrapper}>
        <ProgressBar progress={progress} color={theme.colors.primary} />
      </View>

      {step === 1 ? renderPublicSection() : renderPrivateSection()}
      <Divider style={styles.bottomSpacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
  },
  progressWrapper: {
    marginBottom: 24,
  },
  section: {
    flex: 1,
  },
  heading: {
    color: "#111827",
    fontWeight: "700",
  },
  subheading: {
    color: "#1F2937",
    marginTop: 8,
  },
  description: {
    color: "#4B5563",
    marginTop: 12,
    marginBottom: 20,
    lineHeight: 20,
  },
  fieldGroup: {
    gap: 20,
    marginBottom: 32,
  },
  input: {
    backgroundColor: "#FFFFFF",
  },
  label: {
    color: "#374151",
    marginBottom: 8,
    fontWeight: "600",
  },
  yearRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  yearChip: {
    borderRadius: 999,
  },
  yearChipText: {
    fontWeight: "600",
  },
  interestRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
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
  primaryButton: {
    borderRadius: 12,
  },
  primaryButtonContent: {
    height: 52,
  },
  primaryButtonLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  backRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  backLabel: {
    color: "#374151",
    marginLeft: 4,
  },
  bottomSpacer: {
    opacity: 0,
  },
  backButton: {
    alignSelf: "flex-start",
  },
});
