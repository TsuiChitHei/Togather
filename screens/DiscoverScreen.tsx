// DiscoverScreen.tsx
import React, { useContext, useState, useMemo } from "react";
import {
  View,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Text, Card, Button, Searchbar, Surface, useTheme, ActivityIndicator } from "react-native-paper";
import { AppContext, Community, Event } from "../context/AppContext";
import { haversineDistanceKm } from "../src/distance";
import { theme } from "../src/theme";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

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
    <Card style={styles.eventCard} elevation={5}>
      <TouchableOpacity activeOpacity={0.8} onPress={onClick}>
        <LinearGradient
          colors={[theme.colors.surface, theme.colors.surfaceVariant]}
          style={styles.eventCardContent}
        >
          <Image
            source={{ uri: event.imageUrl }}
            style={styles.eventImage}
            resizeMode="cover"
          />
          <View style={styles.eventInfo}>
            <Text variant="headlineSmall" style={styles.eventName} numberOfLines={1}>
              {event.name}
            </Text>
            <Text variant="bodyMedium" style={styles.eventMeta} numberOfLines={1}>
              {event.time}
            </Text>
            <Text variant="bodyMedium" style={styles.eventMeta} numberOfLines={1}>
              {event.location}
            </Text>
            {distanceLabel ? (
              <Text variant="labelLarge" style={styles.distanceLabel}>
                {distanceLabel}
              </Text>
            ) : isLocatingUser ? (
              <Text variant="labelMedium" style={styles.distanceLabel}>
                Locating...
              </Text>
            ) : null}
          </View>
        </LinearGradient>
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
    <Card style={styles.communityCard} elevation={5}>
      <TouchableOpacity activeOpacity={0.9} onPress={onNavigate}>
        <Image
          source={{ uri: community.imageUrl }}
          style={styles.communityImage}
          resizeMode="cover"
        />
      </TouchableOpacity>

      <Card.Content style={styles.communityContent}>
        <TouchableOpacity activeOpacity={0.7} onPress={onNavigate}>
          <Text variant="headlineMedium" style={styles.communityName} numberOfLines={1}>
            {community.name}
          </Text>
        </TouchableOpacity>

        <Text variant="bodyLarge" style={styles.communityDescription} numberOfLines={3}>
          {community.description}
        </Text>

        <Text variant="labelLarge" style={styles.communityMeta}>
          {community.memberCount} {community.memberCount === 1 ? "member" : "members"}
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
  const context = useContext(AppContext);
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState("");

  if (!context) {
    return (
      <Surface style={styles.loadingContainer} elevation={2}>
        <ActivityIndicator animating size="large" />
        <Text variant="bodyLarge" style={styles.loadingText}>
          Loading...
        </Text>
      </Surface>
    );
  }

  const {
    events,
    communities,
    currentUser,
    toggleCommunityMembership,
    viewEvent,
    viewCommunity,
  } = context;

  const recommendedEvents = useMemo(() => {
    return events;
  }, [events]);

  const recommendedCommunities = useMemo(() => {
    return communities;
  }, [communities]);

  const filteredEvents = useMemo(() => {
    const lowerQuery = searchQuery.toLowerCase();
    return recommendedEvents.filter(
      (event) =>
        event.name.toLowerCase().includes(lowerQuery) ||
        event.location.toLowerCase().includes(lowerQuery)
    );
  }, [recommendedEvents, searchQuery]);

  const filteredCommunities = useMemo(() => {
    const lowerQuery = searchQuery.toLowerCase();
    return recommendedCommunities.filter(
      (community) =>
        community.name.toLowerCase().includes(lowerQuery) ||
        community.description.toLowerCase().includes(lowerQuery)
    );
  }, [recommendedCommunities, searchQuery]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      nestedScrollEnabled={true}
    >
      {/* Header */}
      <View style={styles.headerSection}>
        <Text variant="displayMedium" style={styles.title}>
          Discover
        </Text>
        <Text variant="bodyLarge" style={styles.subtitle}>
          Find events and communities around you
        </Text>
      </View>

      {/* Search */}
      <View style={styles.searchWrapper}>
        <Searchbar
          placeholder="Search events or communities"
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
          inputStyle={styles.searchInput}
          icon="magnify"
          clearIcon="close-circle"
        />
      </View>

      {/* Recommended Events – Horizontal */}
      <View style={styles.section}>
        <Text variant="headlineMedium" style={styles.sectionTitle}>
          Recommended Events
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
        >
          {filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onClick={() => viewEvent(event.id)}
            />
          ))}
          <View style={styles.horizontalSpacer} />
        </ScrollView>
      </View>

      {/* Suggested Communities – Independent Vertical Scroll (Instagram-style) */}
      <View style={styles.communitySection}>
        <Text variant="headlineMedium" style={styles.sectionTitle}>
          Suggested Communities
        </Text>

        <View style={{ flex: 1 }}>
          <ScrollView
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.verticalList}>
              {filteredCommunities.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text variant="bodyLarge" style={styles.emptyText}>
                    No communities found matching your search.
                  </Text>
                </View>
              ) : (
                filteredCommunities.map((community) => (
                  <CommunityCard
                    key={community.id}
                    community={community}
                    isMember={
                      currentUser?.joinedCommunityIds.includes(community.id) ?? false
                    }
                    onJoin={() => toggleCommunityMembership(community.id)}
                    onNavigate={() => viewCommunity(community.id)}
                  />
                ))
              )}
              {/* Bottom padding so last card isn't cut off */}
              <View style={{ height: 120 }} />
            </View>
          </ScrollView>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  contentContainer: {
    paddingTop: 32,
    paddingBottom: 32,
  },
  headerSection: {
    marginBottom: 32,
    paddingHorizontal: 24,
  },
  title: {
    color: "#111827",
    fontWeight: "bold",
    letterSpacing: -1,
    marginBottom: 12,
  },
  subtitle: {
    color: "#6B7280",
    lineHeight: 24,
  },
  searchWrapper: { marginBottom: 40, paddingHorizontal: 24 },
  searchbar: {
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    borderColor: "#D1D5DB",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  searchInput: { fontSize: 16, color: "#1F2937" },

  section: { marginBottom: 48 },
  communitySection: { 
    flex: 1,
    marginBottom: 48,
  },
  sectionTitle: {
    color: "#111827",
    fontWeight: "bold",
    marginBottom: 24,
    paddingHorizontal: 24,
    fontSize: 24,
    letterSpacing: -0.5,
  },

  horizontalList: { paddingLeft: 24, paddingRight: 0, paddingBottom: 26 },
  horizontalSpacer: { width: 24 },

  eventCard: {
    width: width * 0.8,
    marginRight: 16,
    borderRadius: 28,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 5,
  },
  eventCardContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 24,
  },
  eventImage: { width: 96, height: 96, borderRadius: 20 },
  eventInfo: { flex: 1, marginLeft: 20 },
  eventName: { color: "#111827", fontWeight: "bold", fontSize: 20, marginBottom: 8 },
  eventMeta: { color: "#6B7280", marginTop: 4, fontSize: 14, lineHeight: 20 },
  distanceLabel: { marginTop: 12, color: "#4F46E5", fontWeight: "bold", fontSize: 13 },

  communityCard: {
    width: "100%",
    borderRadius: 28,
    marginBottom: 24,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 5,
  },
  communityImage: { width: "100%", height: 220 },
  communityContent: { padding: 24 },
  communityName: {
    color: "#111827",
    fontWeight: "bold",
    fontSize: 22,
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  communityDescription: {
    color: "#6B7280",
    marginTop: 8,
    minHeight: 60,
    lineHeight: 24,
    fontSize: 15,
  },
  communityMeta: { color: "#9CA3AF", marginTop: 16, fontSize: 14, fontWeight: "500" },
  communityButton: { marginTop: 24, borderRadius: 16 },
  communityButtonContent: { height: 52 },
  communityButtonLabelContained: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  communityButtonLabelOutlined: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4B5563",
    letterSpacing: 0.5,
  },

  verticalList: {
    paddingHorizontal: 24,
  },
  emptyState: {
    paddingVertical: 100,
    alignItems: "center",
  },
  emptyText: {
    color: "#9CA3AF",
    fontSize: 16,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
  },
  loadingText: {
    marginTop: 16,
    color: "#6B7280",
  },
});