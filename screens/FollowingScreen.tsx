import React, { useContext } from "react";
import { View, ScrollView, StyleSheet, Image } from "react-native";
import {
  Text,
  Card,
  Avatar,
  Surface,
  TouchableRipple,
  useTheme,
} from "react-native-paper";
import { AppContext, Post } from "../context/AppContext";
import { MOCK_POSTS } from "../data/mockData";

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

          <Text variant="bodyMedium" style={styles.eventIntro}>
            发布了一个新活动！
          </Text>

          <TouchableRipple
            rippleColor={theme.colors.surfaceDisabled}
            onPress={() => viewEvent(event.id)}
            style={styles.eventPreview}
            borderless={false}
          >
            <View style={styles.eventPreviewContent}>
              <Image
                source={{ uri: event.imageUrl }}
                style={styles.eventImage}
                resizeMode="cover"
              />
              <View style={styles.eventInfo}>
                <Text variant="titleSmall" style={styles.eventTitle}>
                  {event.name}
                </Text>
                <Text variant="bodySmall" style={styles.eventMeta}>
                  {event.time}
                </Text>
                <Text variant="bodySmall" style={styles.eventMeta}>
                  {event.location}
                </Text>
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
          请登录以查看关注动态。
        </Text>
      </Surface>
    );
  }

  const { currentUser } = context;
  const followedPosts = MOCK_POSTS.filter((post) =>
    currentUser.joinedCommunityIds.includes(post.communityId)
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Surface style={styles.header} elevation={1}>
        <Text variant="headlineSmall" style={styles.headerTitle}>
          Following
        </Text>
      </Surface>

      <View style={styles.feed}>
        {followedPosts.length > 0 ? (
          followedPosts.map((post) => <PostCard key={post.id} post={post} />)
        ) : (
          <View style={styles.feedEmpty}>
            <Text variant="titleSmall" style={styles.feedEmptyTitle}>
              动态为空
            </Text>
            <Text variant="bodyMedium" style={styles.feedEmptySubtitle}>
              前往 Discover 页面加入一些社群，开始你的校园旅程吧。
            </Text>
          </View>
        )}
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
  headerTitle: {
    textAlign: "center",
    fontWeight: "700",
    color: "#111827",
  },
  feed: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  postCard: {
    borderRadius: 18,
    marginBottom: 16,
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
  eventIntro: {
    marginTop: 16,
    color: "#4B5563",
    fontWeight: "500",
  },
  eventPreview: {
    marginTop: 12,
    borderRadius: 14,
    overflow: "hidden",
  },
  eventPreviewContent: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    padding: 12,
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