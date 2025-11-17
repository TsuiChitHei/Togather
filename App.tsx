import React, { useState, useMemo } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import {
  AppContext,
  User,
  Community,
  Event,
  AppContextType,
} from "./context/AppContext";
import { MOCK_USERS, MOCK_COMMUNITIES, MOCK_EVENTS } from "./data/mockData";

import ProfileSetupScreen from "./screens/ProfileSetupScreen";
import DiscoverScreen from "./screens/DiscoverScreen";
import FollowingScreen from "./screens/FollowingScreen";
import ProfileScreen from "./screens/ProfileScreen";
import BottomNav from "./components/BottomNav";
import CommunityDetailScreen from "./screens/CommunityDetailScreen";
import EventDetailScreen from "./screens/EventDetailScreen";
import LoginScreen from "./screens/LoginScreen";
import SignUpScreen from "./screens/SignUpScreen";
import { Screen, AuthScreenType } from "./types";

import { Provider as PaperProvider, Text as PaperText, Button } from "react-native-paper";
import { theme } from "./src/theme";

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

  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [communities, setCommunities] = useState<Community[]>(
    MOCK_COMMUNITIES
  );
  const [events, setEvents] = useState<Event[]>(MOCK_EVENTS);
  const [pendingUser, setPendingUser] = useState<Partial<User> | null>(null);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setActiveScreen(Screen.Discover);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setAuthScreen(AuthScreenType.Welcome);
  };

  const updateUser = (updatedUser: User) => {
    if (currentUser && currentUser.id === updatedUser.id) {
      setCurrentUser(updatedUser);
      setUsers((prevUsers) =>
        prevUsers.map((u) => (u.id === updatedUser.id ? updatedUser : u))
      );
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

  const appContextValue: AppContextType = useMemo(
    () => ({
      currentUser,
      users,
      communities,
      events,
      updateUser,
      toggleCommunityMembership,
      toggleEventSignup,
      viewCommunity: (id: string) => {
        setViewingEvent(null);
        setViewingCommunity(communities.find((c) => c.id === id) || null);
      },
      viewEvent: (id: string) =>
        setViewingEvent(events.find((e) => e.id === id) || null),
    }),
    [currentUser, users, communities, events]
  );

  const renderAuthContent = () => {
    if (authScreen === AuthScreenType.ProfileSetup && pendingUser) {
      return (
        <ProfileSetupScreen
          pendingUser={pendingUser}
          onProfileCreated={(newUser) => {
            setUsers((prev) => [...prev, newUser]);
            handleLogin(newUser);
            setPendingUser(null);
            setAuthScreen(AuthScreenType.Welcome);
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
                alert("User with this email already exists!");
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
              欢迎来到 Togather
            </PaperText>
            <PaperText variant="bodyMedium" style={styles.welcomeSubtitle}>
              探索校园社区，结识志趣相投的伙伴。
            </PaperText>
            <Button
              mode="contained"
              onPress={() => setAuthScreen(AuthScreenType.Login)}
              style={styles.welcomeButton}
              contentStyle={styles.welcomeButtonContent}
            >
              登录
            </Button>
            <Button
              mode="outlined"
              onPress={() => setAuthScreen(AuthScreenType.SignUp)}
              contentStyle={styles.welcomeButtonContent}
            >
              注册
            </Button>
          </View>
        );
    }
  };

  const renderContent = () => {
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

  return (
    <PaperProvider theme={theme}>
      <AppContext.Provider value={appContextValue}>
        <View style={styles.appBackground}>
          <View style={styles.appContainer}>
            {!currentUser ? (
              renderAuthContent()
            ) : (
              <>
                <ScrollView
                  style={styles.scrollView}
                  contentContainerStyle={styles.scrollContent}
                >
                  {renderContent()}
                </ScrollView>
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
  scrollView: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  scrollContent: {
    paddingBottom: 64,
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