import React, { useContext, useState, useMemo } from "react";
import {
  View,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Text, Card, Button, Searchbar, Surface } from "react-native-paper";
import { AppContext, Community, Event } from "../context/AppContext";
import { haversineDistanceKm } from "../src/distance";

type EventCardProps = {
  event: Event;
  onClick: () => void;
};

const EventCard: React.FC<EventCardProps> = ({ event, onClick }) => {
  const context = useContext(AppContext);
  const userCoords = context?.userCoords;
  const isLocatingUser = context?.isLocatingUser;

  const distanceLabel = useMemo(() => {
    if (
      !userCoords ||
      typeof event.latitude !== "number" ||
      typeof event.longitude !== "number"
    ) {
      return null;
    }
    const distance = haversineDistanceKm(
      userCoords.latitude,
      userCoords.longitude,
      event.latitude,
      event.longitude
    );
    return `${distance.toFixed(1)} km away`;
  }, [userCoords, event.latitude, event.longitude]);

  return (
    <Card style={styles.eventCard} mode="contained">
      <TouchableOpacity activeOpacity={0.85} onPress={onClick}>
        <Card.Content style={styles.eventCardContent}>
          <Image
            source={{ uri: event.imageUrl }}
            style={styles.eventImage}
            resizeMode="cover"
          />
          <View style={styles.eventInfo}>
            <Text
              variant="titleSmall"
              style={styles.eventName}
              numberOfLines={1}
            >
              {event.name}
            </Text>
            <Text
              variant="bodySmall"
              style={styles.eventMeta}
              numberOfLines={1}
            >
              {event.time}
            </Text>
            <Text
              variant="bodySmall"
              style={styles.eventMeta}
              numberOfLines={1}
            >
              {event.location}
            </Text>
            {distanceLabel ? (
              <Text variant="labelSmall" style={styles.distanceLabel}>
                {distanceLabel}
              </Text>
            ) : isLocatingUser ? (
              <Text variant="labelSmall" style={styles.distanceLabel}>
                Locating you...
              </Text>
            ) : null}
          </View>
        </Card.Content>
      </TouchableOpacity>
    </Card>
  );
};

type CommunityCardProps = {
  community: Community;
  isMember: boolean;
  onJoin: () => void;
  onNavigate: () => void;
};

const CommunityCard: React.FC<CommunityCardProps> = ({
  community,
  isMember,
  onJoin,
  onNavigate,
}) => {
  const buttonMode = isMember ? "outlined" : "contained";

  return (
    <Card style={styles.communityCard} mode="contained">
      <TouchableOpacity activeOpacity={0.85} onPress={onNavigate}>
        <Image
          source={{ uri: community.imageUrl }}
          style={styles.communityImage}
          resizeMode="cover"
        />
      </TouchableOpacity>

      <Card.Content style={styles.communityContent}>
        <TouchableOpacity activeOpacity={0.7} onPress={onNavigate}>
          <Text
            variant="titleMedium"
            style={styles.communityName}
            numberOfLines={1}
          >
            {community.name}
          </Text>
        </TouchableOpacity>

        <Text
          variant="bodySmall"
          style={styles.communityDescription}
          numberOfLines={3}
        >
          {community.description}
        </Text>

        <Text variant="bodySmall" style={styles.communityMeta}>
          {community.memberCount} members
        </Text>

        <Button
          mode={buttonMode}
          onPress={onJoin}
          style={styles.communityButton}
          contentStyle={styles.communityButtonContent}
          labelStyle={
            isMember
              ? styles.communityButtonLabelOutlined
              : styles.communityButtonLabelContained
          }
        >
          {isMember ? "Joined" : "Join"}
        </Button>
      </Card.Content>
    </Card>
  );
};

export default function DiscoverScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const context = useContext(AppContext);

  if (!context) {
    return (
      <Surface style={styles.loadingContainer} elevation={0}>
        <Text variant="bodyMedium" style={styles.loadingText}>
          Loading...
        </Text>
      </Surface>
    );
  }

  const {
    communities,
    events,
    viewCommunity,
    viewEvent,
    currentUser,
    toggleCommunityMembership,
    userCoords,
    isLocatingUser,
  } = context;

  const eventsNearYou = events.slice(0, 4);
  const recommendedCommunities = communities;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.headerRow}>
        <Text variant="headlineLarge" style={styles.title}>
          Discover
        </Text>
      </View>

      <View style={styles.searchWrapper}>
        <Searchbar
          placeholder="Search communities, events..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchbar}
          inputStyle={styles.searchInput}
        />
      </View>

      <View style={styles.section}>
        <Text variant="titleLarge" style={styles.sectionTitle}>
          Events Near You
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
        >
          {eventsNearYou.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onClick={() => viewEvent(event.id)}
            />
          ))}
          <View style={styles.horizontalSpacer} />
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text variant="titleLarge" style={styles.sectionTitle}>
          Recommended Communities
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
        >
          {recommendedCommunities.map((community) => (
            <CommunityCard
              key={community.id}
              community={community}
              isMember={
                currentUser?.joinedCommunityIds.includes(community.id) ?? false
              }
              onJoin={() => toggleCommunityMembership(community.id)}
              onNavigate={() => viewCommunity(community.id)}
            />
          ))}
          <View style={styles.horizontalSpacer} />
        </ScrollView>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 32,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  title: { color: "#111827", fontWeight: "700" },
  searchWrapper: { marginBottom: 24 },
  searchbar: {
    borderRadius: 999,
    elevation: 0,
    backgroundColor: "#FFFFFF",
    borderColor: "#E5E7EB",
    borderWidth: 1,
  },
  searchInput: { fontSize: 16 },
  section: { marginBottom: 32 },
  sectionTitle: {
    color: "#111827",
    fontWeight: "600",
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  horizontalList: { paddingLeft: 4, paddingRight: 12 },
  horizontalSpacer: { width: 12 },
  eventCard: { width: 240, marginRight: 16, borderRadius: 18 },
  eventCardContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  eventImage: { width: 64, height: 64, borderRadius: 12 },
  eventInfo: { flex: 1, marginLeft: 12 },
  eventName: { color: "#1F2937", fontWeight: "600" },
  eventMeta: { color: "#6B7280", marginTop: 4 },
  distanceLabel: {
    marginTop: 6,
    color: "#2563EB",
    fontWeight: "600",
  },
  communityCard: {
    width: 288,
    marginRight: 16,
    borderRadius: 20,
    overflow: "hidden",
  },
  communityImage: { width: "100%", height: 148 },
  communityContent: { paddingTop: 16 },
  communityName: { color: "#111827", fontWeight: "700" },
  communityDescription: {
    color: "#6B7280",
    marginTop: 8,
    minHeight: 44,
    lineHeight: 18,
  },
  communityMeta: { color: "#9CA3AF", marginTop: 12 },
  communityButton: { marginTop: 16 },
  communityButtonContent: { height: 44 },
  communityButtonLabelContained: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  communityButtonLabelOutlined: {
    fontSize: 15,
    fontWeight: "600",
    color: "#374151",
  },
  loadingContainer: { padding: 24, backgroundColor: "#F3F4F6" },
  loadingText: { color: "#4B5563" },
});
