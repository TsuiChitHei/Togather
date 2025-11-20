import React, {
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { View, ScrollView, StyleSheet, Image } from "react-native";
import {
  Text,
  Card,
  Avatar,
  Surface,
  TouchableRipple,
  useTheme,
  ActivityIndicator,
} from "react-native-paper";
import { AppContext, Event, Post, User } from "../context/AppContext";
import { MOCK_POSTS } from "../data/mockData";
import { generateMatchDescription } from "../services/geminiService";

type MatchPayload = {
  id: string;
  event: Event;
  matchUser: Pick<User, "id" | "name" | "avatarUrl" | "faculty" | "major"> & {
    headline?: string;
  };
  description: string;
  compatibilityLabel?: string;
};

// Sample payload to illustrate shape; replace with real match results when wired up.
const SAMPLE_MATCHES: MatchPayload[] = [
  {
    id: "match-sample-1",
    event: { id: 'event-1', name: 'The Peak Social Hike', time: 'Today, 5pm', location: 'Sai Ying Pun MTR Exit A2', communityId: 'comm-1', description: 'Join us for a scenic hike up The Peak! A great way to meet new people and enjoy the amazing Hong Kong skyline. We\'ll meet at the MTR exit and head up together. All fitness levels welcome.', imageUrl: 'https://picsum.photos/seed/hike/200/200', attendees: ['user-2', 'user-3'] },
    matchUser: {
      id: "user-98",
      name: "Alex Rivers",
      avatarUrl: "https://picsum.photos/seed/match1/200",
      faculty: "Business",
      major: "Marketing",
      headline: "Final-year marketing major who never misses a hike.",
    },
    description:
      "You both share a love for sunrise trails and photography.",
    compatibilityLabel: "Trail vibes",
  },
];


const MatchmakingCard = ({ match }: { match: MatchPayload }) => {
  const context = useContext(AppContext);
  const theme = useTheme();

  if (!context) return null;
  const { viewEvent } = context;

  return (
<Card style={styles.postCard} mode="contained">
  <Card.Content>
    {/* Header row */}
    <View style={styles.eventMetaRow}>
      <Text variant="labelSmall" style={styles.eventBadge}>
        Match update
      </Text>
      <Text variant="bodySmall" style={styles.eventTimestamp}>
        {match.event.time}
      </Text>
    </View>

    {/* Event name */}
    <Text variant="bodySmall" style={styles.eventContext}>
      {match.event.name}
    </Text>

    {/* Pressable body */}
    <TouchableRipple
      rippleColor={theme.colors.surfaceDisabled}
      onPress={() => viewEvent(match.event.id)}
      borderless={false}
    >
      <View style={styles.eventCardBody}>
        <Avatar.Image
          source={{ uri: match.matchUser.avatarUrl }}
          size={56}
          style={styles.matchAvatar}
        />
        <View style={styles.eventInfo}>
          <Text variant="titleMedium" style={styles.matchName}>
            {match.matchUser.name}
          </Text>
          <Text variant="bodyMedium" style={styles.matchDescription}>
            {match.description}
          </Text>
        </View>
        <View style={styles.eventChevron} pointerEvents="none">
          <Text style={styles.eventChevronText}>›</Text>
        </View>
      </View>
    </TouchableRipple>
  </Card.Content>
</Card>
  );
};



const PostCard: React.FC<{ post: Post }> = ({ post }) => {
  const context = useContext(AppContext);
  const theme = useTheme();

  if (!context) return null;

  const { users, events, viewEvent } = context;
  const author = users.find((u) => u.id === post.authorId);

  if (!author) return null;

  if (post.type === "event") {
    const event = events.find((e) => e.id === post.eventId);
    if (!event) return null;

    return (
<Card style={styles.postCard} mode="contained">
  <Card.Content>
    <View style={styles.eventMetaRow}>
      <Text variant="labelSmall" style={styles.eventBadge}>Event drop</Text>
      <Text variant="bodySmall" style={styles.eventTimestamp}>{post.timestamp}</Text>
    </View>

    <TouchableRipple
      rippleColor={theme.colors.surfaceDisabled}
      onPress={() => viewEvent(event.id)}
      borderless={false}
    >
      <View style={styles.eventCardBody}>
        {event.imageUrl ? (
          <Image
            source={{ uri: event.imageUrl }}
            style={styles.eventImage}
            resizeMode="cover"
          />
        ) : null}
        <View style={styles.eventInfo}>
          <Text variant="titleSmall" style={styles.eventTitle}>{event.name}</Text>
          <Text variant="bodySmall" style={styles.eventMeta}>{event.time}</Text>
          <Text variant="bodySmall" style={styles.eventMeta}>{event.location}</Text>
        </View>
        <View style={styles.eventChevron} pointerEvents="none">
          <Text style={styles.eventChevronText}>›</Text>
        </View>
      </View>
    </TouchableRipple>
  </Card.Content>
</Card>


    );
  }

  return (
    <Card style={styles.postCard} mode="contained">
      <Card.Content>
        <View style={styles.authorRow}>
          <Avatar.Image source={{ uri: author.avatarUrl }} size={40} />
          <View style={styles.authorDetails}>
            <Text variant="titleSmall" style={styles.authorName}>
              {author.name}
            </Text>
            <Text variant="bodySmall" style={styles.timestamp}>
              {post.timestamp}
            </Text>
          </View>
        </View>
        <Text variant="bodyMedium" style={styles.postBody}>
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
      <Surface style={styles.emptyState} elevation={0}>
        <Text variant="bodyMedium" style={styles.emptyStateText}>
          Please log in to view your following feed.
        </Text>
      </Surface>
    );
  }

  const { currentUser, events } = context;
  const followedPosts = MOCK_POSTS.filter((post) =>
    currentUser.joinedCommunityIds.includes(post.communityId)
  );
  const joinedEvents = events.filter((event) =>
    currentUser.signedUpEventIds.includes(event.id)
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Surface style={styles.header} elevation={1}>
        <Text variant="headlineLarge" style={styles.title}>
          Following
        </Text>
      </Surface>

      <View style={styles.feed}>
        {followedPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}

        {<MatchmakingCard match={SAMPLE_MATCHES[0]} />}

        {followedPosts.length === 0 && joinedEvents.length === 0 ? (
          <View style={styles.feedEmpty}>
            <Text variant="titleSmall" style={styles.feedEmptyTitle}>
              Nothing to see yet
            </Text>
            <Text variant="bodyMedium" style={styles.feedEmptySubtitle}>
              Join a few communities on the Discover page to start building your feed.
            </Text>
          </View>
        ) : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  content: {
    paddingBottom: 24,
  },
  header: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E5E7EB",
  },
  title: {
    color: "#111827",
    fontWeight: "700",
    marginBottom: 16,
  },
  feed: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  postCard: {
    borderRadius: 18,
    marginBottom: 16,
  },
  cardTouchable: {
    borderRadius: 18,
    overflow: "hidden",
  },
  authorRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  authorDetails: {
    marginLeft: 12,
  },
  authorName: {
    color: "#1F2937",
    fontWeight: "600",
  },
  timestamp: {
    color: "#9CA3AF",
  },
  postBody: {
    marginTop: 12,
    color: "#374151",
    lineHeight: 22,
  },
  eventMetaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  eventContext: {
    marginTop: 4,
    marginBottom: 12,
    color: '#6b6b6b',
  },
  eventBadge: {
    backgroundColor: "#EEF2FF",
    color: "#4C1D95",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    overflow: "hidden",
    fontWeight: "600",
  },
  eventTimestamp: {
    color: "#9CA3AF",
  },
  eventCardBody: {
    flexDirection: "row",
    alignItems: "center",
  },
  eventImage: {
    width: 64,
    height: 64,
    borderRadius: 12,
  },
  eventInfo: {
    flex: 1,
    marginLeft: 14,
  },
  eventTitle: {
    color: "#111827",
    fontWeight: "600",
  },
  eventMeta: {
    color: "#6B7280",
    marginTop: 4,
  },
  eventChevron: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
  },
  eventChevronText: {
    color: "#6B7280",
    fontSize: 20,
    lineHeight: 20,
  },
  matchEventHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  matchEventTextGroup: {
    flexShrink: 1,
  },
  matchEventName: {
    color: "#1F2937",
    fontWeight: "600",
    marginTop: 6,
  },
  matchEventMeta: {
    alignItems: "flex-end",
  },
  matchEventMetaText: {
    color: "#9CA3AF",
  },
  matchFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 16,
  },
  matchFooterText: {
    color: "#6B7280",
  },
  matchBadge: {
    backgroundColor: "#ECFDF5",
    color: "#047857",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    overflow: "hidden",
    fontWeight: "600",
  },
  matchLoadingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },
  matchLoadingText: {
    color: "#4B5563",
    marginLeft: 8,
  },
  matchContent: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
  },
  matchAvatar: {
    marginRight: 12,
  },
  matchDetails: {
    flex: 1,
  },
  matchName: {
    color: "#1F2937",
    fontWeight: "600",
    marginBottom: 4,
  },
  matchSubtle: {
    color: "#6B7280",
    marginBottom: 8,
  },
  matchDescription: {
    color: "#4B5563",
    lineHeight: 20,
  },
  feedEmpty: {
    alignItems: "center",
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  feedEmptyTitle: {
    color: "#6B7280",
    marginBottom: 8,
  },
  feedEmptySubtitle: {
    color: "#9CA3AF",
    textAlign: "center",
    lineHeight: 20,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#F3F4F6",
  },
  emptyStateText: {
    color: "#4B5563",
  },
});
