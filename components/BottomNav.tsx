import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Svg, { Path } from "react-native-svg";
import { Screen } from "../types";

interface BottomNavProps {
  activeScreen: Screen;
  setActiveScreen: (screen: Screen) => void;
}

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onPress: () => void;
}

const NavItem = ({ icon, label, isActive, onPress }: NavItemProps) => (
  <TouchableOpacity onPress={onPress} style={styles.navItem}>
    <View style={styles.iconWrapper}>{icon}</View>
    <Text accessible accessibilityLabel="BottomNav mounted" style={styles.hiddenText}>
      BottomNav mounted
    </Text>
    <Text style={[styles.navLabel, isActive ? styles.navLabelActive : styles.navLabelInactive]}>
      {label}
    </Text>
  </TouchableOpacity>
);

const DiscoverIcon = ({ active }: { active?: boolean }) => (
  <Svg
    style={styles.icon}
    fill="none"
    viewBox="0 0 24 24"
    stroke={active ? "#6366F1" : "#94A3B8"}
    strokeWidth={2}
  >
    <Path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </Svg>
);

const FollowingIcon = ({ active }: { active?: boolean }) => (
  <Svg
    style={styles.icon}
    fill="none"
    viewBox="0 0 24 24"
    stroke={active ? "#6366F1" : "#94A3B8"}
    strokeWidth={2}
  >
    <Path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
    />
  </Svg>
);

const ProfileIcon = ({ active }: { active?: boolean }) => (
  <Svg
    style={styles.icon}
    fill="none"
    viewBox="0 0 24 24"
    stroke={active ? "#6366F1" : "#94A3B8"}
    strokeWidth={2}
  >
    <Path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </Svg>
);

export default function BottomNav({
  activeScreen,
  setActiveScreen,
}: BottomNavProps) {
  return (
    <View style={styles.container}>
      <NavItem
        icon={<DiscoverIcon active={activeScreen === Screen.Discover} />}
        label="Discover"
        isActive={activeScreen === Screen.Discover}
        onPress={() => setActiveScreen(Screen.Discover)}
      />
      <NavItem
        icon={<FollowingIcon active={activeScreen === Screen.Following} />}
        label="Following"
        isActive={activeScreen === Screen.Following}
        onPress={() => setActiveScreen(Screen.Following)}
      />
      <NavItem
        icon={<ProfileIcon active={activeScreen === Screen.Profile} />}
        label="Profile"
        isActive={activeScreen === Screen.Profile}
        onPress={() => setActiveScreen(Screen.Profile)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 72,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingBottom: 8,
    shadowColor: "#0F172A",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 8,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
  iconWrapper: {
    marginBottom: 4,
  },
  icon: {
    width: 24,
    height: 24,
  },
  navLabel: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  navLabelActive: {
    color: "#6366F1",
  },
  navLabelInactive: {
    color: "#94A3B8",
  },
  hiddenText: {
    height: 0,
    width: 0,
    opacity: 0,
  },
});