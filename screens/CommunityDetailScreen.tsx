// Updated CommunityDetailScreen.tsx
import React, { useContext } from "react";
import {
  View,
  Image,
  StyleSheet,
  ScrollView,
  ImageSourcePropType,
  Dimensions,
} from "react-native";
import {
  Text,
  Button,
  Card,
  Avatar,
  IconButton,
  TouchableRipple,
} from "react-native-paper";
import { Community, AppContext, Post } from "../context/AppContext";
import { LinearGradient } from "expo-linear-gradient";
import { theme } from "../src/theme"; // ✅ Import your custom theme directly

const { width } = Dimensions.get("window");

type PostCardProps = {
  post: Post;
};

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const context = useContext(AppContext);

  if (!context) return null;

  const { users, events, viewEvent } = context;
  const author = users.find((u) => u.id === post.authorId);
  if (!author) return null;

  const authorAvatar: ImageSourcePropType = { uri: author.avatarUrl };

  if (post.type === "event") {
    const event = events.find((e) => e.id === post.eventId);
    if (!event) return null;

    return (
      <Card style={styles.postCard} elevation={4}>
        <Card.Content>
          <View style={styles.authorRow}>
            <Avatar.Image source={authorAvatar} size={48} style={styles.authorAvatar} />
            <View style={styles.authorDetails}>
              <Text variant="titleMedium" style={styles.authorName}>
                {author.name}
              </Text>
              <Text variant="bodyMedium" style={styles.timestamp}>
                {post.timestamp}
              </Text>
            </View>
          </View>
        </Card.Content>

        <TouchableRipple
          onPress={() => viewEvent(event.id)}
          rippleColor={theme.colors.surfaceVariant}
          style={styles.eventPreviewContainer}
        >
          <LinearGradient
            colors={[theme.colors.surface, theme.colors.surfaceVariant]}
            style={styles.eventPreviewContent}
          >
            <Image
              source={{ uri: event.imageUrl }}
              style={styles.eventImage}
              resizeMode="cover"
            />
            <View style={styles.eventDetails}>
              <Text variant="headlineSmall" style={styles.eventTitle}>
                {event.name}
              </Text>
              <Text variant="bodyLarge" style={styles.eventTime}>
                {event.time}
              </Text>
            </View>
          </LinearGradient>
        </TouchableRipple>
      </Card>
    );
  }

  return (
    <Card style={styles.postCard} elevation={4}>
      <Card.Content>
        <View style={styles.authorRow}>
          <Avatar.Image source={authorAvatar} size={48} style={styles.authorAvatar} />
          <View style={styles.authorDetails}>
            <Text variant="titleMedium" style={styles.authorName}>
              {author.name}
            </Text>
            <Text variant="bodyMedium" style={styles.timestamp}>
              {post.timestamp}
            </Text>
          </View>
        </View>
        <Text variant="bodyLarge" style={styles.postContent}>
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
  if (!context) return null;

  const { currentUser, toggleCommunityMembership, posts } = context;
  const communityPosts = posts.filter((p) => p.communityId === community.id);
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
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          style={styles.headerGradient}
        />
        <IconButton
          icon="arrow-left"
          mode="contained"
          size={28}
          onPress={onBack}
          style={styles.backButton}
          containerColor={theme.colors.surface}
          iconColor={theme.colors.textPrimary} // ✅ No TS error now
        />
      </View>
      <View style={styles.body}>
        <Text variant="displaySmall" style={styles.communityName}>
          {community.name}
        </Text>
        <Text variant="bodyLarge" style={styles.memberCount}>
          {community.memberCount} {community.memberCount === 1 ? "member" : "members"}
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

        <Text variant="headlineMedium" style={styles.sectionTitle}>
          Posts
        </Text>

        {communityPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}

        {communityPosts.length === 0 && (
          <Card mode="outlined" style={styles.emptyCard}>
            <Card.Content>
              <Text variant="bodyLarge" style={styles.emptyText}>
                No posts yet. Be the first to share something!
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
    paddingBottom: 64,
  },
  headerSection: {
    position: "relative",
  },
  headerImage: {
    width: "100%",
    height: 360,
  },
  headerGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 160,
  },
  backButton: {
    position: "absolute",
    top: 48,
    left: 24,
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  body: {
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  communityName: {
    color: "#111827",
    marginBottom: 12,
    fontWeight: "bold",
    letterSpacing: -1,
  },
  memberCount: {
    color: "#6B7280",
    marginBottom: 32,
    fontSize: 16,
  },
  membershipButton: {
    marginBottom: 40,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 5,
  },
  membershipButtonContent: {
    height: 56,
  },
  membershipButtonLabelContained: {
    fontWeight: "bold",
    color: "#FFFFFF",
    fontSize: 16,
    letterSpacing: 0.5,
  },
  membershipButtonLabelOutlined: {
    fontWeight: "bold",
    color: "#4B5563",
    fontSize: 16,
    letterSpacing: 0.5,
  },
  sectionTitle: {
    color: "#111827",
    marginBottom: 24,
    fontWeight: "bold",
    fontSize: 24,
    letterSpacing: -0.5,
  },
  postCard: {
    borderRadius: 24,
    marginBottom: 24,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 5,
  },
  authorRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  authorAvatar: {
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  authorDetails: {
    marginLeft: 16,
  },
  authorName: {
    color: "#111827",
    fontWeight: "bold",
    fontSize: 18,
  },
  timestamp: {
    color: "#9CA3AF",
    fontSize: 14,
    marginTop: 4,
  },
  postContent: {
    marginTop: 20,
    color: "#4B5563",
    lineHeight: 26,
    fontSize: 16,
  },
  eventPreviewContainer: {
    paddingHorizontal: 0,
    paddingBottom: 0,
  },
  eventPreviewContent: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    padding: 20,
  },
  eventImage: {
    width: 96,
    height: 96,
    borderRadius: 20,
  },
  eventDetails: {
    marginLeft: 20,
    flex: 1,
  },
  eventTitle: {
    color: "#111827",
    fontWeight: "bold",
    fontSize: 20,
  },
  eventTime: {
    marginTop: 8,
    color: "#6B7280",
    fontSize: 15,
  },
  emptyCard: {
    marginTop: 16,
    borderRadius: 24,
    borderColor: "#D1D5DB",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  emptyText: {
    textAlign: "center",
    color: "#6B7280",
    fontSize: 16,
    lineHeight: 24,
    paddingVertical: 16,
  },
});