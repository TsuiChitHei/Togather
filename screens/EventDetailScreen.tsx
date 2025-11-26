import React, { useContext, useState, useEffect, useCallback } from "react";
import {
  View,
  Image,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import {
  Text,
  Button,
  Card,
  Avatar,
  IconButton,
  useTheme,
  Surface,
} from "react-native-paper";
import { Event, AppContext, User } from "../context/AppContext";
import { generateMatchDescription } from "../services/geminiService";
import { findSimilarUsers } from "../api/user";

const MatchmakingCard = ({ event }: { event: Event }) => {
  const context = useContext(AppContext);
  const theme = useTheme();
  const [match, setMatch] = useState<User | null>(null);
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const findMatch = useCallback(async () => {
    if (!context || !context.currentUser) {
      setIsLoading(false);
      return;
    }

    const otherAttendees = event.attendees.filter(
      (id) => id !== context.currentUser?.id
    );
    if (otherAttendees.length === 0) {
      setIsLoading(false);
      return;
    }

    // const matchId =
    //   otherAttendees[Math.floor(Math.random() * otherAttendees.length)];
    const matches = await findSimilarUsers(context.currentUser.id, event.id);
    const matchId = matches && matches.length > 0 ? matches[0]["id"] : null;
    const matchUser = context.users.find((u) => u.id === matchId);

    if (matchUser) {
      setMatch(matchUser);
      try {
        const desc = await generateMatchDescription(
          context.currentUser,
          matchUser
        );
        setDescription(desc);
      } catch {
        setDescription(`You and ${matchUser.name} make a good match!`);
      }
    }
    setIsLoading(false);
  }, [context, event.attendees]);

  useEffect(() => {
    findMatch();
  }, [findMatch]);

  if (isLoading) {
    return (
      <Surface style={styles.matchCard} elevation={1}>
        <View style={styles.matchLoadingRow}>
          <ActivityIndicator color={theme.colors.primary} />
          <Text variant="bodyMedium" style={styles.matchLoadingText}>
            Finding your match...
          </Text>
        </View>
      </Surface>
    );
  }

  if (!match) {
    return null;
  }

  return (
    <Surface
      style={[styles.matchCard, styles.matchCardHighlight]}
      elevation={2}
    >
      <Text variant="titleMedium" style={styles.matchTitle}>
        Potential matching partners
      </Text>
      <View style={styles.matchContent}>
        <Avatar.Image
          source={{ uri: match.avatarUrl }}
          size={48}
          style={styles.matchAvatar}
        />
        <View style={styles.matchDetails}>
          <Text variant="titleSmall" style={styles.matchName}>
            {match.name} Will also participate in this event.
          </Text>
          <Text variant="bodySmall" style={styles.matchDescription}>
            {description}
          </Text>
        </View>
      </View>
    </Surface>
  );
};

interface EventDetailScreenProps {
  event: Event;
  onBack: () => void;
}

export default function EventDetailScreen({
  event,
  onBack,
}: EventDetailScreenProps) {
  const context = useContext(AppContext);
  const theme = useTheme();

  if (!context) {
    return null;
  }

  const { currentUser, toggleEventSignup, users } = context;

  const isSignedUp = currentUser?.signedUpEventIds.includes(event.id);
  const eventAttendees = users.filter((u) => event.attendees.includes(u.id));

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.headerSection}>
        <Image
          source={{ uri: event.imageUrl }}
          style={styles.headerImage}
          resizeMode="cover"
        />
        <IconButton
          icon="arrow-left"
          size={24}
          mode="contained-tonal"
          onPress={onBack}
          style={styles.backButton}
          containerColor="rgba(0,0,0,0.45)"
          iconColor="#FFFFFF"
        />
      </View>

      <View style={styles.body}>
        <Text variant="headlineMedium" style={styles.eventTitle}>
          {event.name}
        </Text>

        <Surface style={styles.metaCard} elevation={0}>
          <Text variant="bodyLarge" style={styles.metaText}>
            <Text style={styles.metaLabel}>Date/Time: </Text>
            {event.time}
          </Text>
          <Text variant="bodyLarge" style={styles.metaText}>
            <Text style={styles.metaLabel}>Location:</Text>
            {event.location}
          </Text>
        </Surface>

        {isSignedUp && <MatchmakingCard event={event} />}

        <Button
          mode={isSignedUp ? "outlined" : "contained"}
          onPress={() => toggleEventSignup(event.id)}
          style={styles.signupButton}
          contentStyle={styles.signupButtonContent}
          labelStyle={
            isSignedUp
              ? styles.signupOutlinedLabel
              : styles.signupContainedLabel
          }
        >
          {isSignedUp ? "Exit the activity" : "Sign up for"}
        </Button>

        <Text variant="titleLarge" style={styles.sectionTitle}>
          activity introduction
        </Text>
        <Text variant="bodyMedium" style={styles.eventDescription}>
          {event.description}
        </Text>

        <View style={styles.attendeeSection}>
          <Text variant="titleMedium" style={styles.attendeeTitle}>
            {event.attendees.length} participants
          </Text>

          <View style={styles.attendeeAvatarRow}>
            {eventAttendees.slice(0, 7).map((attendee, index) => (
              <Avatar.Image
                key={attendee.id}
                source={{ uri: attendee.avatarUrl }}
                size={40}
                style={[
                  styles.attendeeAvatar,
                  index > 0 && { marginLeft: -12 },
                  { borderColor: theme.colors.background },
                ]}
              />
            ))}
            {eventAttendees.length > 7 && (
              <View style={styles.attendeeMore}>
                <Text style={styles.attendeeMoreText}>
                  +{eventAttendees.length - 7}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  contentContainer: {
    paddingBottom: 32,
  },
  headerSection: {
    position: "relative",
  },
  headerImage: {
    width: "100%",
    height: 224,
  },
  backButton: {
    position: "absolute",
    top: 16,
    left: 16,
  },
  body: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  eventTitle: {
    color: "#111827",
    marginBottom: 16,
    fontWeight: "700",
  },
  metaCard: {
    backgroundColor: "#F3F4F6",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  metaText: {
    color: "#374151",
    marginBottom: 8,
  },
  metaLabel: {
    fontWeight: "600",
    color: "#1F2937",
  },
  matchCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    backgroundColor: "#FEF3C7",
  },
  matchCardHighlight: {
    borderLeftWidth: 4,
    borderLeftColor: "#F59E0B",
  },
  matchTitle: {
    color: "#B45309",
    fontWeight: "700",
  },
  matchContent: {
    flexDirection: "row",
    marginTop: 12,
    alignItems: "center",
  },
  matchLoadingRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  matchLoadingText: {
    marginLeft: 12,
    color: "#92400E",
  },
  matchAvatar: {
    marginRight: 16,
  },
  matchDetails: {
    flex: 1,
  },
  matchName: {
    color: "#92400E",
    fontWeight: "600",
  },
  matchDescription: {
    color: "#B45309",
    marginTop: 4,
    lineHeight: 18,
  },
  signupButton: {
    marginBottom: 24,
  },
  signupButtonContent: {
    height: 52,
  },
  signupContainedLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  signupOutlinedLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
  },
  sectionTitle: {
    color: "#111827",
    marginBottom: 12,
    fontWeight: "600",
  },
  eventDescription: {
    color: "#4B5563",
    lineHeight: 22,
  },
  attendeeSection: {
    marginTop: 32,
  },
  attendeeTitle: {
    color: "#111827",
    marginBottom: 16,
    fontWeight: "600",
  },
  attendeeAvatarRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  attendeeAvatar: {
    borderWidth: 2,
  },
  attendeeMore: {
    marginLeft: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },
  attendeeMoreText: {
    color: "#4B5563",
    fontWeight: "600",
    fontSize: 12,
  },
});
