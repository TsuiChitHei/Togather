import React, { useContext } from "react";
import { View, ScrollView, StyleSheet, Image } from "react-native";
import {
  Text,
  Card,
  Avatar,
  Surface,
  TouchableRipple,
} from "react-native-paper";
import { AppContext, Event, Post, User } from "../context/AppContext";
import { MOCK_POSTS } from "../data/mockData";
import { theme } from "../src/theme";

type MatchPayload = {
  id: string;
  event: Event;
  matchUser: Pick<User, "id" | "name" | "avatarUrl" | "faculty" | "major"> & {
    headline?: string;
  };
  description: string;
  compatibilityLabel?: string;
};

const SAMPLE_MATCHES: MatchPayload[] = [
  {
    id: "match-sample-1",
    event: {
      id: "event-1",
      name: "The Peak Social Hike",
      time: "Today, 5pm",
      location: "Sai Ying Pun MTR Exit A2",
      communityId: "comm-1",
      description:
        "Join us for a scenic hike up The Peak! A great way to meet new people and enjoy the amazing Hong Kong skyline. We'll meet at the MTR exit and head up together. All fitness levels welcome.",
      imageUrl: "https://picsum.photos/seed/hike/200/200",
      attendees: ["user-2", "user-3"],
      latitude: 22.283057,
      longitude: 114.1354754,
    },
    event: {
      id: "event-1",
      name: "The Peak Social Hike",
      time: "Today, 5pm",
      location: "Sai Ying Pun MTR Exit A2",
      communityId: "comm-1",
      description:
        "Join us for a scenic hike up The Peak! A great way to meet new people and enjoy the amazing Hong Kong skyline. We'll meet at the MTR exit and head up together. All fitness levels welcome.",
      imageUrl: "https://picsum.photos/seed/hike/200/200",
      attendees: ["user-2", "user-3"],
      latitude: 22.283057,
      longitude: 114.1354754,
    },
    matchUser: {
      id: "user-98",
      name: "Alex Rivers",
      avatarUrl: "https://picsum.photos/seed/match1/200",
      faculty: "Business",
      major: "Marketing",
      headline: "Final-year marketing major who never misses a hike.",
    },
    description: "You both share a love for sunrise trails and photography.",
    description: "You both share a love for sunrise trails and photography.",
    compatibilityLabel: "Trail vibes",
  },
];

const MatchmakingCard = ({ match }: { match: MatchPayload }) => {
  const context = useContext(AppContext);
  if (!context) return null;
  const { viewEvent } = context;

  return (
    <Card style={styles.card} elevation={5}>
      <Card.Content>
        <View style={styles.rowBetween}>
          <Text variant="labelMedium" style={styles.badge}>
            Match
          </Text>
          <Text variant="bodySmall" style={styles.metaSubtle}>
            {match.event.time}
          </Text>
        </View>

        <Text variant="bodyMedium" style={styles.metaPrimary}>
          {match.event.name}
        </Text>

        <TouchableRipple
          rippleColor={theme.colors.surfaceVariant}
          onPress={() => viewEvent(match.event.id)}
          borderless={false}
          style={styles.touchable}
        >
          <View style={styles.eventBody}>
            <Avatar.Image
              source={{ uri: match.matchUser.avatarUrl }}
              size={56}
              style={styles.avatar}
            />
            <View style={styles.eventInfo}>
              <Text variant="titleSmall" style={styles.titlePrimary}>
                {match.matchUser.name}
              </Text>
              <Text variant="bodyMedium" style={styles.bodySecondary}>
                {match.description}
              </Text>
            </View>
            <View style={styles.chevron} pointerEvents="none">
              <Text style={styles.chevronText}>›</Text>
            </View>
          </View>
        </TouchableRipple>
      </Card.Content>
    </Card>
  );
};

const PostCard: React.FC<{ post: Post }> = ({ post }) => {
  const context = useContext(AppContext);
  if (!context) return null;

  const { users, events, viewEvent } = context;
  const author = users.find((u) => u.id === post.authorId);
  if (!author) return null;

  if (post.type === "event") {
    const event = events.find((e) => e.id === post.eventId);
    if (!event) return null;

    return (
      <Card style={styles.card} elevation={5}>
        <Card.Content>
          <View style={styles.rowBetween}>
            <Text variant="labelMedium" style={styles.badge}>
              New Event
            </Text>
            <Text variant="bodySmall" style={styles.metaSubtle}>
              {post.timestamp}
            </Text>
          </View>

          <TouchableRipple
            rippleColor={theme.colors.surfaceVariant}
            onPress={() => viewEvent(event.id)}
            borderless={false}
            style={styles.touchable}
          >
            <View style={styles.eventBody}>
              {event.imageUrl ? (
                <Image
                  source={{ uri: event.imageUrl }}
                  style={styles.eventImage}
                  resizeMode="cover"
                />
              ) : null}
              <View style={styles.eventInfo}>
                <Text variant="titleSmall" style={styles.titlePrimary}>
                  {event.name}
                </Text>
                <Text variant="bodySmall" style={styles.metaSecondary}>
                  {event.time}
                </Text>
                <Text variant="bodySmall" style={styles.metaSecondary}>
                  {event.location}
                </Text>
              </View>
              <View style={styles.chevron} pointerEvents="none">
                <Text style={styles.chevronText}>›</Text>
              </View>
            </View>
          </TouchableRipple>
        </Card.Content>
      </Card>
    );
  }

  return (
    <Card style={styles.card} elevation={5}>
      <Card.Content>
        <View style={styles.row}>
          <Avatar.Image source={{ uri: author.avatarUrl }} size={40} />
          <View style={styles.authorDetails}>
            <Text variant="titleSmall" style={styles.titlePrimary}>
              {author.name}
            </Text>
            <Text variant="bodySmall" style={styles.metaSubtle}>
              {post.timestamp}
            </Text>
          </View>
        </View>
        <Text variant="bodyMedium" style={styles.bodySecondary}>
          {post.content}
        </Text>
      </Card.Content>
    </Card>
  );
};

export default function FollowingScreen() {
  const context = useContext(AppContext);

  if (!context || !context.currentUser) {
    return (
      <Surface style={styles.loadingContainer} elevation={2}>
        <Text variant="bodyLarge" style={styles.loadingText}>
          Please sign in to view your feed
        </Text>
      </Surface>
    );
  }

  const { currentUser, events, posts } = context;
  const followedPosts = posts.filter((post) =>
    currentUser.joinedCommunityIds.includes(post.communityId)
  );
  const joinedEvents = events.filter((event) =>
    currentUser.signedUpEventIds.includes(event.id)
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerSection}>
        <Text variant="displayMedium" style={styles.title}>
          Following
        </Text>
        <Text variant="bodyLarge" style={styles.subtitle}>
          Your personalized feed
        </Text>
      </View>

      <View style={styles.feed}>
        {followedPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}

        <MatchmakingCard match={SAMPLE_MATCHES[0]} />

        {followedPosts.length === 0 && joinedEvents.length === 0 ? (
          <View style={styles.feedEmpty}>
            <Text variant="titleLarge" style={styles.emptyTitle}>
              Your feed is empty
            </Text>
            <Text variant="bodyLarge" style={styles.emptySubtitle}>
              Join communities on the Discover page to start seeing updates in your feed
            </Text>
          </View>
        ) : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // Screen container and header (aligned with DiscoverScreen)
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  content: { paddingHorizontal: 0, paddingBottom: 64 },
  headerSection: { marginBottom: 32, paddingHorizontal: 24, paddingTop: 32 },
  title: {
    color: "#111827",
    fontWeight: "bold",
    letterSpacing: -1,
    marginBottom: 12,
  },
  subtitle: { color: "#6B7280", lineHeight: 24 },

  // Feed area
  feed: { paddingHorizontal: 24, paddingTop: 8 },

  // Card style (aligned with Discover cards)
  card: {
    borderRadius: 28,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 5,
    backgroundColor: "#FFFFFF",
  },

  // Common rows and spacing
  row: { flexDirection: "row", alignItems: "center" },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  touchable: { borderRadius: 24, overflow: "hidden" },

  // Typography tokens (aligned to DiscoverScreen hierarchy)
  titlePrimary: { color: "#111827", fontWeight: "bold", fontSize: 18 },
  metaPrimary: {
    color: "#111827",
    marginTop: 6,
    marginBottom: 14,
    fontSize: 16,
    fontWeight: "600",
  },
  metaSecondary: { color: "#6B7280", marginTop: 2, fontSize: 14, lineHeight: 20 },
  metaSubtle: { color: "#9CA3AF", fontSize: 13 },
  bodySecondary: { marginTop: 12, color: "#4B5563", lineHeight: 22, fontSize: 15 },

  // Badges (added to fix missing style)
  badge: {
    backgroundColor: "#EEF2FF",
    color: "#4C1D95",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    overflow: "hidden",
    fontWeight: "600",
    fontSize: 12,
    letterSpacing: 0.3,
  },

  // Event card body
  eventBody: { flexDirection: "row", alignItems: "center" },
  eventImage: { width: 64, height: 64, borderRadius: 16 },
  eventInfo: { flex: 1, marginLeft: 16 },

  // Avatars
  avatar: { shadowOpacity: 0.1, shadowRadius: 8, elevation: 3 },

  // Author details (added to fix missing style)
  authorDetails: { marginLeft: 12 },

  // Chevron
  chevron: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
  },
  chevronText: { color: "#6B7280", fontSize: 20, lineHeight: 20 },

  // Empty state
  feedEmpty: { alignItems: "center", paddingVertical: 48, paddingHorizontal: 24 },
  emptyTitle: { color: "#475569", marginBottom: 12, fontWeight: "600", fontSize: 18 },
  emptySubtitle: { color: "#94A3B8", textAlign: "center", lineHeight: 24, fontSize: 16 },

  // Loading state (aligned with Discover's Surface)
  loadingContainer: {
    padding: 32,
    backgroundColor: "#F3F4F6",
    borderRadius: 20,
    margin: 24,
  },
  loadingText: { color: "#6B7280", marginTop: 16 },
});
