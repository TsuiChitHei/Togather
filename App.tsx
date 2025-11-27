import React, { useState, useMemo, useCallback, useEffect } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
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
import { getAllCommunities } from "./api/community";
import { getAllEvents } from "./api/event";
import { getAllPosts } from "./api/post";

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

    setCommunities((prev) =>
      prev.map((c) =>
        c.id === communityId
          ? {
              ...c,
              memberCount: isMember ? c.memberCount - 1 : c.memberCount + 1,
            }
          : c
      )
    );
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
      const updatedUser: User = {
        ...currentUser,
        signedUpEventIds: currentUser.signedUpEventIds.includes(eventId)
          ? currentUser.signedUpEventIds
          : [...currentUser.signedUpEventIds, eventId],
      };

      setEvents((prev) => [newEvent, ...prev]);
      setPosts((prev) => [
        {
          id: `post-${Date.now()}`,
          type: "event",
          authorId: currentUser.id,
          communityId: input.communityId,
          timestamp,
          eventId,
        },
        ...prev,
      ]);
      setCurrentUser(updatedUser);
      setUsers((prev) =>
        prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
      );

      return newEvent;
    },
    [currentUser]
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
          <View style={styles.welcomeContainer}>
            <PaperText variant="headlineMedium" style={styles.welcomeTitle}>
              Welcome to Togather
            </PaperText>
            <PaperText variant="bodyMedium" style={styles.welcomeSubtitle}>
              Explore campus communities and connect with people who share your
              interests.
            </PaperText>
            <Button
              mode="contained"
              onPress={() => setAuthScreen(AuthScreenType.Login)}
              style={styles.welcomeButton}
              contentStyle={styles.welcomeButtonContent}
            >
              Log In
            </Button>
            <Button
              mode="contained"
              onPress={() => setAuthScreen(AuthScreenType.SignUp)}
              style={styles.welcomeButton}
              contentStyle={styles.welcomeButtonContent}
            >
              Sign Up
            </Button>
          </View>
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
                  setActiveScreen={setActiveScreen}
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
    backgroundColor: "#5B61FF",
  },
  welcomeTitle: {
    color: "#FFFFFF",
    marginBottom: 12,
    textAlign: "center",
  },
  welcomeSubtitle: {
    color: "#E0E7FF",
    marginBottom: 32,
    textAlign: "center",
  },
  welcomeButton: {
    width: "100%",
    maxWidth: 280,
    marginBottom: 12,
  },
  welcomeButtonContent: {
    height: 48,
  },
});
