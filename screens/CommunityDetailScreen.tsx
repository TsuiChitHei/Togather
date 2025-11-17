import React, { useContext } from "react";
import {
  View,
  Image,
  StyleSheet,
  ScrollView,
  ImageSourcePropType,
} from "react-native";
import {
  Text,
  Button,
  Card,
  Avatar,
  IconButton,
  TouchableRipple,
  useTheme,
} from "react-native-paper";
import { Community, AppContext, Post } from "../context/AppContext";
import { MOCK_POSTS } from "../data/mockData";

type PostCardProps = {
  post: Post;
};

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const context = useContext(AppContext);
  const theme = useTheme();

  if (!context) {
    return null;
  }

  const { users, events, viewEvent } = context;
  const author = users.find((u) => u.id === post.authorId);

  if (!author) {
    return null;
  }

  const authorAvatar: ImageSourcePropType = { uri: author.avatarUrl };

  if (post.type === "event") {
    const event = events.find((e) => e.id === post.eventId);
    if (!event) {
      return null;
    }

    return (
      <Card style={styles.postCard} mode="contained">
        <Card.Content>
          <View style={styles.authorRow}>
            <Avatar.Image source={authorAvatar} size={40} />
            <View style={styles.authorDetails}>
              <Text variant="titleSmall" style={styles.authorName}>
                {author.name}
              </Text>
              <Text variant="bodySmall" style={styles.timestamp}>
                {post.timestamp}
              </Text>
            </View>
          </View>
        </Card.Content>

        <TouchableRipple
          style={styles.eventPreviewContainer}
          onPress={() => viewEvent(event.id)}
          borderless
          rippleColor={theme.colors.primary}
        >
          <View style={styles.eventPreviewContent}>
            <Image
              source={{ uri: event.imageUrl }}
              style={styles.eventImage}
              resizeMode="cover"
            />
            <View style={styles.eventDetails}>
              <Text variant="titleMedium" style={styles.eventTitle}>
                {event.name}
              </Text>
              <Text variant="bodySmall" style={styles.eventTime}>
                {event.time}
              </Text>
            </View>
          </View>
        </TouchableRipple>
      </Card>
    );
  }

  return (
    <Card style={styles.postCard} mode="contained">
      <Card.Content>
        <View style={styles.authorRow}>
          <Avatar.Image source={authorAvatar} size={40} />
          <View style={styles.authorDetails}>
            <Text variant="titleSmall" style={styles.authorName}>
              {author.name}
            </Text>
            <Text variant="bodySmall" style={styles.timestamp}>
              {post.timestamp}
            </Text>
          </View>
        </View>
        <Text variant="bodyMedium" style={styles.postContent}>
          {post.content}
        </Text>
      </Card.Content>
    </Card>
  );
};

interface CommunityDetailScreenProps {
  community: Community;
  onBack: () => void;
}

export default function CommunityDetailScreen({
  community,
  onBack,
}: CommunityDetailScreenProps) {
  const context = useContext(AppContext);
  const theme = useTheme();

  if (!context) {
    return null;
  }

  const { currentUser, toggleCommunityMembership } = context;
  const communityPosts = MOCK_POSTS.filter(
    (p) => p.communityId === community.id
  );

  const isMember = currentUser?.joinedCommunityIds.includes(community.id);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.headerSection}>
        <Image
          source={{ uri: community.imageUrl }}
          style={styles.headerImage}
          resizeMode="cover"
        />
        <IconButton
          icon="arrow-left"
          mode="contained-tonal"
          size={24}
          onPress={onBack}
          style={styles.backButton}
          containerColor="rgba(0,0,0,0.45)"
          iconColor="#FFFFFF"
        />
      </View>

      <View style={styles.body}>
        <Text variant="headlineMedium" style={styles.communityName}>
          {community.name}
        </Text>
        <Text variant="bodyMedium" style={styles.memberCount}>
          {community.memberCount} members
        </Text>

        <Button
          mode={isMember ? "outlined" : "contained"}
          onPress={() => toggleCommunityMembership(community.id)}
          style={styles.membershipButton}
          contentStyle={styles.membershipButtonContent}
          labelStyle={
            isMember
              ? styles.membershipButtonLabelOutlined
              : styles.membershipButtonLabelContained
          }
        >
          {isMember ? "Leave Community" : "Join Community"}
        </Button>

        <Text variant="titleLarge" style={styles.sectionTitle}>
          Posts
        </Text>

        {communityPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}

        {communityPosts.length === 0 && (
          <Card mode="outlined" style={styles.emptyCard}>
            <Card.Content>
              <Text variant="bodyMedium" style={styles.emptyText}>
                暂无帖子，成为首位分享者吧！
              </Text>
            </Card.Content>
          </Card>
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
  contentContainer: {
    paddingBottom: 24,
  },
  headerSection: {
    position: "relative",
  },
  headerImage: {
    width: "100%",
    height: 200,
  },
  backButton: {
    position: "absolute",
    top: 16,
    left: 16,
  },
  body: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  communityName: {
    color: "#111827",
    marginBottom: 4,
  },
  memberCount: {
    color: "#6B7280",
    marginBottom: 24,
  },
  membershipButton: {
    marginBottom: 24,
  },
  membershipButtonContent: {
    height: 48,
  },
  membershipButtonLabelContained: {
    fontWeight: "600",
    color: "#FFFFFF",
  },
  membershipButtonLabelOutlined: {
    fontWeight: "600",
    color: "#374151",
  },
  sectionTitle: {
    color: "#111827",
    marginBottom: 16,
  },
  postCard: {
    borderRadius: 16,
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
  },
  timestamp: {
    color: "#9CA3AF",
  },
  postContent: {
    marginTop: 12,
    color: "#1F2937",
    lineHeight: 22,
  },
  eventPreviewContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  eventPreviewContent: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    padding: 12,
  },
  eventImage: {
    width: 72,
    height: 72,
    borderRadius: 12,
  },
  eventDetails: {
    marginLeft: 16,
    flex: 1,
  },
  eventTitle: {
    color: "#111827",
  },
  eventTime: {
    marginTop: 4,
    color: "#6B7280",
  },
  emptyCard: {
    marginTop: 8,
    borderRadius: 16,
  },
  emptyText: {
    textAlign: "center",
    color: "#6B7280",
  },
});