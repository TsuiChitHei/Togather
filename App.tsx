import React, { useState, useMemo, useCallback, useEffect } from "react";
import { View, ScrollView, StyleSheet, ImageBackground } from "react-native";
import {
  AppContext,
  User,
  Community,
  Event,
  AppContextType,
  Post,
  CreateEventInput,
} from "./context/AppContext";
import { getAllUsers } from "./api/user";
import { getAllCommunities, updateCommunityInDatabase } from "./api/community";
import { getAllEvents } from "./api/event";
import { getAllPosts } from "./api/post";
import { updateEventInDatabase } from "./api/event";

import ProfileSetupScreen from "./screens/ProfileSetupScreen";
import DiscoverScreen from "./screens/DiscoverScreen";
import FollowingScreen from "./screens/FollowingScreen";
import ProfileScreen from "./screens/ProfileScreen";
import BottomNav from "./components/BottomNav";
import CommunityDetailScreen from "./screens/CommunityDetailScreen";
import EventDetailScreen from "./screens/EventDetailScreen";
import LoginScreen from "./screens/LoginScreen";
import SignUpScreen from "./screens/SignUpScreen";
import CreateEventScreen from "./screens/CreateEventScreen";
import { Screen, AuthScreenType } from "./types";
import { createUserInDatabase, updateUserInDatabase } from "./api/user";
import { createEventInDatabase } from "./api/event";
import { createPostInDatabase } from "./api/post";
import {
  Provider as PaperProvider,
  Text as PaperText,
  Button,
  FAB,
} from "react-native-paper";
import { theme } from "./src/theme";

import { useUserLocation } from "./src/useUserLocation";

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeScreen, setActiveScreen] = useState<Screen>(Screen.Discover);
  const [authScreen, setAuthScreen] = useState<AuthScreenType>(
    AuthScreenType.Welcome
  );

  const [viewingCommunity, setViewingCommunity] = useState<Community | null>(
    null
  );
  const [viewingEvent, setViewingEvent] = useState<Event | null>(null);

  const [users, setUsers] = useState<User[]>([]);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [pendingUser, setPendingUser] = useState<Partial<User> | null>(null);
  const [isCreatingEvent, setIsCreatingEvent] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fetchedUsers, fetchedCommunities, fetchedEvents, fetchedPosts] =
          await Promise.all([
            getAllUsers(),
            getAllCommunities(),
            getAllEvents(),
            getAllPosts(),
          ]);
        setUsers(fetchedUsers);
        setCommunities(fetchedCommunities);
        setEvents(fetchedEvents);
        setPosts(fetchedPosts);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  // 新增：调用定位 hook
  const {
    coords: userCoords,
    isLoading: isLocatingUser,
    permissionDenied,
  } = useUserLocation();

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setActiveScreen(Screen.Discover);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setViewingCommunity(null);
    setViewingEvent(null);
    setIsCreatingEvent(false);
    setAuthScreen(AuthScreenType.Welcome);
  };

  const handleScreenChange = (screen: Screen) => {
    setViewingEvent(null);
    setViewingCommunity(null);
    setIsCreatingEvent(false);
    setActiveScreen(screen);
  };

  const updateUser = (updatedUser: User) => {
    if (currentUser && currentUser.id === updatedUser.id) {
      setCurrentUser(updatedUser);
      setUsers((prevUsers) =>
        prevUsers.map((u) => (u.id === updatedUser.id ? updatedUser : u))
      );
      updateUserInDatabase(updatedUser);
    }
  };

  const toggleCommunityMembership = (communityId: string) => {
    if (!currentUser) return;
    const isMember = currentUser.joinedCommunityIds.includes(communityId);

    const updatedUser = {
      ...currentUser,
      joinedCommunityIds: isMember
        ? currentUser.joinedCommunityIds.filter((id) => id !== communityId)
        : [...currentUser.joinedCommunityIds, communityId],
    };
    setCurrentUser(updatedUser);
    setUsers((prev) =>
      prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
    );
    updateUserInDatabase(updatedUser);

    setCommunities((prev) =>
      prev.map((c) =>
        c.id === communityId
          ? {
              ...c,
              memberCount: isMember ? c.memberCount - 1 : c.memberCount + 1,
              members: isMember
                ? c.members.filter((id) => id !== currentUser.id)
                : [...c.members, currentUser.id],
            }
          : c
      )
    );

    const currentCommunity = communities.find((c) => c.id === communityId);
    const updatedCommunity: Community | null = currentCommunity
      ? {
          ...currentCommunity,
          memberCount: isMember
            ? currentCommunity.memberCount - 1
            : currentCommunity.memberCount + 1,
          members: isMember
            ? currentCommunity.members.filter((id) => id !== currentUser.id)
            : [...currentCommunity.members, currentUser.id],
        }
      : null;
    if (updatedCommunity) {
      updateCommunityInDatabase(updatedCommunity);
    }
  };

  const toggleEventSignup = (eventId: string) => {
    if (!currentUser) return;
    const isSignedUp = currentUser.signedUpEventIds.includes(eventId);

    const updatedUser = {
      ...currentUser,
      signedUpEventIds: isSignedUp
        ? currentUser.signedUpEventIds.filter((id) => id !== eventId)
        : [...currentUser.signedUpEventIds, eventId],
    };
    setCurrentUser(updatedUser);
    setUsers((prev) =>
      prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
    );
    updateUserInDatabase(updatedUser);

    setEvents((prev) =>
      prev.map((e) =>
        e.id === eventId
          ? {
              ...e,
              attendees: isSignedUp
                ? e.attendees.filter((id) => id !== currentUser.id)
                : [...e.attendees, currentUser.id],
            }
          : e
      )
    );
    const currentEvent = events.find((e) => e.id === eventId);
    const updatedEvent: Event | null = currentEvent
      ? {
          ...currentEvent,
          attendees: isSignedUp
            ? currentEvent.attendees.filter((id) => id !== currentUser.id)
            : [...currentEvent.attendees, currentUser.id],
        }
      : null;
    if (updatedEvent) {
      updateEventInDatabase(updatedEvent);
    }
  };

  const handleCreateEvent = useCallback(
    (input: CreateEventInput): Event | null => {
      if (!currentUser) {
        return null;
      }

      const eventId = `event-${Date.now()}`;
      const imageUrl =
        input.imageUrl && input.imageUrl.trim().length > 0
          ? input.imageUrl.trim()
          : `https://picsum.photos/seed/${eventId}/200/200`;

      const newEvent: Event = {
        id: eventId,
        name: input.name.trim(),
        time: input.time.trim(),
        location: input.location.trim(),
        latitude: input.latitude,
        longitude: input.longitude,
        communityId: input.communityId,
        description: input.description.trim(),
        imageUrl,
        attendees: [currentUser.id],
      };

      const timestamp = "Just now";

      const newPost: Post = {
        id: `post-${Date.now()}`,
        type: "event",
        authorId: currentUser.id,
        communityId: input.communityId,
        timestamp,
        eventId,
      };

      const updatedUser: User = {
        ...currentUser,
        signedUpEventIds: currentUser.signedUpEventIds.includes(eventId)
          ? currentUser.signedUpEventIds
          : [...currentUser.signedUpEventIds, eventId],
        postIds: currentUser.postIds.includes(newPost.id)
          ? currentUser.postIds
          : [...currentUser.postIds, newPost.id],
      };

      const currentCommunity = communities.find(
        (c) => c.id === input.communityId
      );
      const updatedCommunity: Community | null = currentCommunity
        ? {
            ...currentCommunity,
            postIds: currentCommunity.postIds.includes(newPost.id)
              ? currentCommunity.postIds
              : [...currentCommunity.postIds, newPost.id],
          }
        : null;

      if (updatedCommunity) {
        updateCommunityInDatabase(updatedCommunity);
        setCommunities((prev) =>
          prev.map((c) => (c.id === updatedCommunity.id ? updatedCommunity : c))
        );
      }

      setEvents((prev) => [newEvent, ...prev]);

      createEventInDatabase(newEvent);

      setPosts((prev) => [newPost, ...prev]);
      createPostInDatabase(newPost);
      setCurrentUser(updatedUser);
      setUsers((prev) =>
        prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
      );
      updateUserInDatabase(updatedUser);

      if (updatedCommunity) {
        setCommunities((prev) =>
          prev.map((c) => (c.id === updatedCommunity.id ? updatedCommunity : c))
        );
        updateCommunityInDatabase(updatedCommunity);
      }

      return newEvent;
    },
    [currentUser, communities]
  );

  const appContextValue: AppContextType = useMemo(
    () => ({
      currentUser,
      users,
      communities,
      events,
      posts,
      updateUser,
      toggleCommunityMembership,
      toggleEventSignup,
      createEvent: handleCreateEvent,
      viewCommunity: (id: string) => {
        setViewingEvent(null);
        setIsCreatingEvent(false);
        setViewingCommunity(communities.find((c) => c.id === id) || null);
      },
      viewEvent: (id: string) => {
        setIsCreatingEvent(false);
        setViewingEvent(events.find((e) => e.id === id) || null);
      },
      userCoords,
      isLocatingUser,
      permissionDenied,
    }),
    [
      currentUser,
      users,
      communities,
      events,
      posts,
      handleCreateEvent,
      userCoords,
      isLocatingUser,
      permissionDenied,
    ]
  );

  const renderAuthContent = () => {
    if (authScreen === AuthScreenType.ProfileSetup && pendingUser) {
      return (
        <ProfileSetupScreen
          pendingUser={pendingUser}
          onProfileCreated={(newUser) => {
            setUsers((prev) => [...prev, newUser]);
            handleLogin(newUser);
            createUserInDatabase(newUser);
            setPendingUser(null);
            setAuthScreen(AuthScreenType.Welcome);
          }}
          onBack={() => {
            setPendingUser(null);
            setAuthScreen(AuthScreenType.SignUp);
          }}
        />
      );
    }

    switch (authScreen) {
      case AuthScreenType.Login:
        return (
          <LoginScreen
            onLogin={(email, password) => {
              const user = users.find(
                (u) => u.email === email && u.password === password
              );
              if (user) {
                handleLogin(user);
              } else {
                alert("Invalid credentials!");
              }
            }}
            onBack={() => setAuthScreen(AuthScreenType.Welcome)}
          />
        );
      case AuthScreenType.SignUp:
        return (
          <SignUpScreen
            onSignUp={(email, password) => {
              if (users.some((u) => u.email === email)) {
                alert("A user with this email already exists.");
                return;
              }
              const partialUser = {
                id: `user-${Date.now()}`,
                email,
                password,
              };
              setPendingUser(partialUser);
              setAuthScreen(AuthScreenType.ProfileSetup);
            }}
            onBack={() => setAuthScreen(AuthScreenType.Welcome)}
          />
        );
      case AuthScreenType.Welcome:
      default:
        return (
          <ImageBackground
            source={require("./assets/Login Background Image.png")}
            style={styles.welcomeContainer}
            resizeMode="cover"
          >
            <View style={styles.welcomeOverlay}>
              <PaperText variant="headlineMedium" style={styles.welcomeTitle}>
                Welcome to Togather
              </PaperText>
              <PaperText variant="bodyMedium" style={styles.welcomeSubtitle}>
                Explore campus communities and connect with people who share
                your interests.
              </PaperText>
              <Button
                mode="contained"
                onPress={() => setAuthScreen(AuthScreenType.Login)}
                style={styles.welcomeButton}
                contentStyle={styles.welcomeButtonContent}
                labelStyle={styles.welcomeButtonLabel}
              >
                Log In
              </Button>
              <Button
                mode="contained"
                onPress={() => setAuthScreen(AuthScreenType.SignUp)}
                style={styles.welcomeButton}
                contentStyle={styles.welcomeButtonContent}
                labelStyle={styles.welcomeButtonLabel}
              >
                Sign Up
              </Button>
            </View>
          </ImageBackground>
        );
    }
  };

  const renderContent = () => {
    if (isCreatingEvent) {
      return (
        <CreateEventScreen
          onCancel={() => setIsCreatingEvent(false)}
          onEventCreated={(event) => {
            setIsCreatingEvent(false);
            setViewingCommunity(null);
            setViewingEvent(event);
          }}
          onNavigateToDiscover={() => {
            setIsCreatingEvent(false);
            setViewingEvent(null);
            setViewingCommunity(null);
            setActiveScreen(Screen.Discover);
          }}
        />
      );
    }

    if (viewingEvent) {
      return (
        <EventDetailScreen
          event={viewingEvent}
          onBack={() => setViewingEvent(null)}
        />
      );
    }
    if (viewingCommunity) {
      return (
        <CommunityDetailScreen
          community={viewingCommunity}
          onBack={() => setViewingCommunity(null)}
        />
      );
    }

    switch (activeScreen) {
      case Screen.Discover:
        return <DiscoverScreen />;
      case Screen.Following:
        return <FollowingScreen />;
      case Screen.Profile:
        return <ProfileScreen onLogout={handleLogout} />;
      default:
        return <DiscoverScreen />;
    }
  };

  const showCreateFab =
    !!currentUser &&
    !isCreatingEvent &&
    !viewingCommunity &&
    !viewingEvent &&
    activeScreen === Screen.Discover;

  return (
    <PaperProvider theme={theme}>
      <AppContext.Provider value={appContextValue}>
        <View style={styles.appBackground}>
          <View style={styles.appContainer}>
            {!currentUser ? (
              renderAuthContent()
            ) : (
              <>
                <View style={styles.contentWrapper}>
                  <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                  >
                    {renderContent()}
                  </ScrollView>
                  {showCreateFab && (
                    <FAB
                      icon="plus"
                      style={styles.floatingActionButton}
                      size="medium"
                      onPress={() => setIsCreatingEvent(true)}
                    />
                  )}
                </View>
                <BottomNav
                  activeScreen={activeScreen}
                  setActiveScreen={handleScreenChange}
                />
              </>
            )}
          </View>
        </View>
      </AppContext.Provider>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  appBackground: {
    flex: 1,
    backgroundColor: "#1F2937",
  },
  appContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  contentWrapper: {
    flex: 1,
    position: "relative",
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  scrollContent: {
    paddingBottom: 96,
  },
  floatingActionButton: {
    position: "absolute",
    right: 24,
    bottom: 96,
  },
  welcomeContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  welcomeOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  welcomeTitle: {
    color: "#FFFFFF",
    marginBottom: 12,
    textAlign: "center",
    fontWeight: "bold",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    fontSize: 28,
  },
  welcomeSubtitle: {
    color: "#FFFFFF",
    marginBottom: 32,
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    fontSize: 16,
    lineHeight: 22,
  },
  welcomeButton: {
    width: "100%",
    maxWidth: 280,
    marginBottom: 12,
    backgroundColor: "#5B61FF",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  welcomeButtonContent: {
    height: 52,
  },
  welcomeButtonLabel: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
