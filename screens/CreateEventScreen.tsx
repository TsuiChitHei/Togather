import React, {
  useContext,
  useMemo,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  View,
  Alert,
  Image,
  Platform,
} from "react-native";
import {
  Text,
  TextInput,
  Button,
  Chip,
  IconButton,
  useTheme,
  Portal,
  Modal,
  Divider,
} from "react-native-paper";
import DateTimePicker, {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { AppContext, CreateEventInput, Event } from "../context/AppContext";
import { geocodeAddress } from "../services/geocodingService";

interface CreateEventScreenProps {
  onCancel: () => void;
  onEventCreated: (event: Event) => void;
  onNavigateToDiscover: () => void;
}

export default function CreateEventScreen({
  onCancel,
  onEventCreated,
  onNavigateToDiscover,
}: CreateEventScreenProps) {
  const context = useContext(AppContext);
  const theme = useTheme();

  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [selectedCommunity, setSelectedCommunity] = useState<string | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [eventDate, setEventDate] = useState<Date | null>(null);
  const [eventTime, setEventTime] = useState<Date | null>(null);
  const [iosDatePickerVisible, setIosDatePickerVisible] = useState(false);
  const [iosTimePickerVisible, setIosTimePickerVisible] = useState(false);

  const [pickedImageUri, setPickedImageUri] = useState<string | null>(null);
  const [createdEvent, setCreatedEvent] = useState<Event | null>(null);

  const [latitude, setLatitude] = useState<string>("");
  const [longitude, setLongitude] = useState<string>("");
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [geocodeError, setGeocodeError] = useState<string | null>(null);

  if (!context) {
    return null;
  }

  const { createEvent, communities, currentUser } = context;

  const selectableCommunities = useMemo(() => {
    if (!currentUser) {
      return communities;
    }
    const joined = communities.filter((community) =>
      currentUser.joinedCommunityIds.includes(community.id)
    );
    return joined.length > 0 ? joined : communities;
  }, [communities, currentUser]);

  useEffect(() => {
    if (selectableCommunities.length > 0 && !selectedCommunity) {
      setSelectedCommunity(selectableCommunities[0].id);
    }
  }, [selectableCommunities, selectedCommunity]);

  const clearFormFields = useCallback(() => {
    setName("");
    setLocation("");
    setDescription("");
    setImageUrlInput("");
    setEventDate(null);
    setEventTime(null);
    setPickedImageUri(null);
    setLatitude("");
    setLongitude("");
    setGeocodeError(null);

    if (selectableCommunities.length > 0) {
      setSelectedCommunity(selectableCommunities[0].id);
    } else {
      setSelectedCommunity(null);
    }
  }, [selectableCommunities]);

  const formatDateLabel = useCallback((): string => {
    if (!eventDate) return "Select date";
    return eventDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, [eventDate]);

  const formatTimeLabel = useCallback((): string => {
    if (!eventTime) return "Select time";
    return eventTime.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  }, [eventTime]);

  const composeScheduleString = useCallback((): string => {
    if (!eventDate) return "";
    const composed = new Date(eventDate);
    if (eventTime) {
      composed.setHours(eventTime.getHours());
      composed.setMinutes(eventTime.getMinutes());
    }
    return composed.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }, [eventDate, eventTime]);

  const ensureMediaLibraryPermission = async (): Promise<boolean> => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission required",
        "We need access to your photo library so you can upload an image."
      );
      return false;
    }
    return true;
  };

  const handlePickImage = async () => {
    const hasPermission = await ensureMediaLibraryPermission();
    if (!hasPermission) {
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setPickedImageUri(result.assets[0].uri);
    }
  };

  const handleDateChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date
  ) => {
    if (Platform.OS === "android") {
      if (event.type === "set" && selectedDate) {
        setEventDate(selectedDate);
      }
    } else if (selectedDate) {
      setEventDate(selectedDate);
    }
  };

  const handleTimeChange = (
    event: DateTimePickerEvent,
    selectedTime?: Date
  ) => {
    if (Platform.OS === "android") {
      if (event.type === "set" && selectedTime) {
        setEventTime(selectedTime);
      }
    } else if (selectedTime) {
      setEventTime(selectedTime);
    }
  };

  const openDatePicker = () => {
    if (Platform.OS === "android") {
      DateTimePickerAndroid.open({
        value: eventDate || new Date(),
        mode: "date",
        is24Hour: false,
        onChange: handleDateChange,
      });
    } else {
      setIosDatePickerVisible(true);
    }
  };

  const openTimePicker = () => {
    if (Platform.OS === "android") {
      DateTimePickerAndroid.open({
        value: eventTime || new Date(),
        mode: "time",
        is24Hour: false,
        onChange: handleTimeChange,
      });
    } else {
      setIosTimePickerVisible(true);
    }
  };

  const handleGeocode = async () => {
    if (!location.trim()) {
      Alert.alert("Notice", "Please enter an address before fetching coordinates.");
      return;
    }
    try {
      setIsGeocoding(true);
      const result = await geocodeAddress(location.trim());
      setLatitude(result.latitude.toString());
      setLongitude(result.longitude.toString());
      setLocation(result.placeName);
      setGeocodeError(null);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Geocoding failed. Please try again.";
      setGeocodeError(message);
    } finally {
      setIsGeocoding(false);
    }
  };

  const handleSubmit = () => {
    if (!currentUser) {
      Alert.alert("Notice", "Please log in before creating an event.");
      return;
    }
    if (!name.trim() || !location.trim() || !description.trim()) {
      Alert.alert("Notice", "Please complete all required fields.");
      return;
    }
    if (!latitude || !longitude) {
      Alert.alert("Notice", "Please fetch coordinates for the event location.");
      return;
    }
    if (!selectedCommunity) {
      Alert.alert("Notice", "Please choose a community for this event.");
      return;
    }
    if (!eventDate || !eventTime) {
      Alert.alert("Notice", "Please select both a date and a time.");
      return;
    }

    const scheduleString = composeScheduleString();
    if (!scheduleString) {
      Alert.alert("Notice", "Unable to format date and time. Please try again.");
      return;
    }

    const latValue = Number(latitude);
    const lngValue = Number(longitude);

    if (!Number.isFinite(latValue) || !Number.isFinite(lngValue)) {
      Alert.alert("Notice", "Invalid coordinates. Please fetch them again.");
      return;
    }

    const payload: CreateEventInput = {
      name: name.trim(),
      time: scheduleString,
      location: location.trim(),
      latitude: latValue,
      longitude: lngValue,
      description: description.trim(),
      communityId: selectedCommunity,
      imageUrl:
        pickedImageUri ??
        (imageUrlInput.trim().length > 0 ? imageUrlInput.trim() : undefined),
    };

    setIsSubmitting(true);
    const newEvent = createEvent(payload);
    setIsSubmitting(false);

    if (!newEvent) {
      Alert.alert(
        "Notice",
        "Failed to create the event. Please try again later."
      );
      return;
    }

    setCreatedEvent(newEvent);
    clearFormFields();
  };

  const handleCreateAnother = () => {
    clearFormFields();
    setCreatedEvent(null);
  };

  if (createdEvent) {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.successContentContainer}
      >
        <View style={styles.successHeader}>
          <IconButton
            icon="check-circle"
            mode="contained"
            size={32}
            containerColor={theme.colors.primaryContainer}
            iconColor={theme.colors.primary}
          />
          <Text variant="headlineMedium" style={styles.successTitle}>
            Event created successfully!
          </Text>
          <Text variant="bodyMedium" style={styles.successSubtitle}>
            Your event "{createdEvent.name}" is now live.
          </Text>
        </View>

        <View style={styles.successCard}>
          {createdEvent.imageUrl ? (
            <Image
              source={{ uri: createdEvent.imageUrl }}
              style={styles.successImage}
              resizeMode="cover"
            />
          ) : null}
          <View style={styles.successDetails}>
            <Text variant="titleMedium" style={styles.successDetailTitle}>
              {createdEvent.name}
            </Text>
            <Text variant="bodySmall" style={styles.successDetailText}>
              {createdEvent.time}
            </Text>
            <Text variant="bodySmall" style={styles.successDetailText}>
              {createdEvent.location}
            </Text>
            <Text variant="bodySmall" style={styles.successDetailDescription}>
              {createdEvent.description}
            </Text>
          </View>
        </View>

        <Button
          mode="contained"
          onPress={() => onEventCreated(createdEvent)}
          style={styles.successButton}
          contentStyle={styles.successButtonContent}
          labelStyle={styles.successButtonLabel}
        >
          View event details
        </Button>

        <Button
          mode="outlined"
          onPress={onNavigateToDiscover}
          style={styles.successButton}
          contentStyle={styles.successButtonContent}
          labelStyle={styles.successSecondaryButtonLabel}
        >
          Back to Discover
        </Button>

        <Button
          mode="text"
          onPress={handleCreateAnother}
          labelStyle={styles.createAnotherLabel}
        >
          Create another event
        </Button>
      </ScrollView>
    );
  }

  return (
    <>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.headerRow}>
          <IconButton
            icon="arrow-left"
            size={24}
            mode="contained-tonal"
            onPress={onCancel}
            containerColor="rgba(17,24,39,0.08)"
          />
          <Text variant="headlineMedium" style={styles.headerTitle}>
            Create Event
          </Text>
        </View>

        <Text variant="bodyMedium" style={styles.helperText}>
          Share the essential details for your event and publish it to one of
          your communities.
        </Text>

        <View style={styles.fieldGroup}>
          <TextInput
            label="Event Name"
            mode="outlined"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />
          <TextInput
            label="Location"
            mode="outlined"
            value={location}
            onChangeText={setLocation}
            placeholder="e.g. Student Union Auditorium"
            style={styles.input}
          />
          <Button
            mode="outlined"
            icon="map-search"
            onPress={handleGeocode}
            loading={isGeocoding}
            disabled={isGeocoding}
            style={styles.geocodeButton}
            contentStyle={styles.inlinePickerButtonContent}
          >
            Fetch coordinates
          </Button>
          {latitude && longitude ? (
            <Text style={styles.geoResult}>
              Coordinates: {latitude}, {longitude}
            </Text>
          ) : null}
          {geocodeError ? (
            <Text style={styles.geoError}>{geocodeError}</Text>
          ) : null}
          <View style={styles.inlinePickerRow}>
            <Button
              mode="outlined"
              icon="calendar-blank"
              onPress={openDatePicker}
              style={styles.inlinePickerButton}
              contentStyle={styles.inlinePickerButtonContent}
            >
              {formatDateLabel()}
            </Button>
            <Button
              mode="outlined"
              icon="clock-outline"
              onPress={openTimePicker}
              style={styles.inlinePickerButton}
              contentStyle={styles.inlinePickerButtonContent}
            >
              {formatTimeLabel()}
            </Button>
          </View>
          <TextInput
            label="Description"
            mode="outlined"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            style={styles.input}
          />
          <View style={styles.uploadGroup}>
            <Button
              mode="outlined"
              icon="image-plus"
              onPress={handlePickImage}
              style={styles.uploadButton}
            >
              Upload image
            </Button>
            {pickedImageUri ? (
              <Image
                source={{ uri: pickedImageUri }}
                style={styles.previewImage}
                resizeMode="cover"
              />
            ) : null}
          </View>
          <TextInput
            label="Image URL (optional)"
            mode="outlined"
            value={imageUrlInput}
            onChangeText={setImageUrlInput}
            placeholder="https://..."
            style={styles.input}
          />
        </View>

        <Divider style={styles.divider} />

        <Text variant="titleMedium" style={styles.sectionLabel}>
          Choose community
        </Text>
        <Text variant="bodySmall" style={styles.sectionHint}>
          Communities you have already joined are shown first.
        </Text>

        <View style={styles.communityRow}>
          {selectableCommunities.map((community) => {
            const selected = community.id === selectedCommunity;
            return (
              <Chip
                key={community.id}
                selected={selected}
                onPress={() => setSelectedCommunity(community.id)}
                style={[
                  styles.communityChip,
                  selected && { backgroundColor: theme.colors.primary },
                ]}
                textStyle={[
                  styles.communityChipText,
                  selected && { color: theme.colors.onPrimary },
                ]}
              >
                {community.name}
              </Chip>
            );
          })}
        </View>

        <Button
          mode="contained"
          onPress={handleSubmit}
          loading={isSubmitting}
          disabled={isSubmitting}
          style={styles.submitButton}
          contentStyle={styles.submitButtonContent}
          labelStyle={styles.submitButtonLabel}
        >
          Publish event
        </Button>
      </ScrollView>

      <Portal>
        <Modal
          visible={iosDatePickerVisible}
          onDismiss={() => setIosDatePickerVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <Text variant="titleMedium" style={styles.modalTitle}>
            Select date
          </Text>
          <DateTimePicker
            value={eventDate || new Date()}
            mode="date"
            display={Platform.OS === "ios" ? "inline" : "default"}
            onChange={handleDateChange}
          />
          <Button
            mode="contained"
            onPress={() => setIosDatePickerVisible(false)}
            style={styles.modalButton}
          >
            Done
          </Button>
        </Modal>

        <Modal
          visible={iosTimePickerVisible}
          onDismiss={() => setIosTimePickerVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <Text variant="titleMedium" style={styles.modalTitle}>
            Select time
          </Text>
          <DateTimePicker
            value={eventTime || new Date()}
            mode="time"
            display={Platform.OS === "ios" ? "inline" : "default"}
            onChange={handleTimeChange}
          />
          <Button
            mode="contained"
            onPress={() => setIosTimePickerVisible(false)}
            style={styles.modalButton}
          >
            Done
          </Button>
        </Modal>
      </Portal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  headerTitle: {
    marginLeft: 8,
    color: "#111827",
    fontWeight: "700",
  },
  helperText: {
    color: "#4B5563",
    marginBottom: 24,
    lineHeight: 20,
  },
  fieldGroup: {
    gap: 16,
    marginBottom: 24,
  },
  input: {
    backgroundColor: "#FFFFFF",
  },
  geocodeButton: {
    borderRadius: 12,
  },
  inlinePickerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  inlinePickerButton: {
    flex: 1,
    borderRadius: 12,
    borderColor: "#D1D5DB",
  },
  inlinePickerButtonContent: {
    height: 48,
  },
  geoResult: {
    fontSize: 14,
    color: "#2563EB",
  },
  geoError: {
    fontSize: 14,
    color: "#DC2626",
  },
  uploadGroup: {
    gap: 12,
  },
  uploadButton: {
    alignSelf: "flex-start",
  },
  previewImage: {
    width: "100%",
    height: 180,
    borderRadius: 12,
  },
  divider: {
    marginBottom: 24,
  },
  sectionLabel: {
    color: "#111827",
    fontWeight: "600",
    marginBottom: 8,
  },
  sectionHint: {
    color: "#6B7280",
    marginBottom: 16,
  },
  communityRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 32,
  },
  communityChip: {
    borderRadius: 999,
    backgroundColor: "#E5E7EB",
  },
  communityChipText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
  },
  submitButton: {
    borderRadius: 12,
  },
  submitButtonContent: {
    height: 52,
  },
  submitButtonLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  modalContainer: {
    marginHorizontal: 24,
    padding: 24,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
  },
  modalTitle: {
    marginBottom: 12,
    textAlign: "center",
  },
  modalButton: {
    marginTop: 16,
  },
  successContentContainer: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 48,
    alignItems: "center",
  },
  successHeader: {
    alignItems: "center",
    marginBottom: 24,
  },
  successTitle: {
    marginTop: 12,
    textAlign: "center",
    color: "#111827",
    fontWeight: "700",
  },
  successSubtitle: {
    marginTop: 8,
    textAlign: "center",
    color: "#6B7280",
  },
  successCard: {
    width: "100%",
    backgroundColor: "#F9FAFB",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 24,
  },
  successImage: {
    width: "100%",
    height: 200,
  },
  successDetails: {
    padding: 16,
    gap: 6,
  },
  successDetailTitle: {
    color: "#111827",
    fontWeight: "600",
  },
  successDetailText: {
    color: "#4B5563",
  },
  successDetailDescription: {
    color: "#6B7280",
    marginTop: 8,
  },
  successButton: {
    width: "100%",
    borderRadius: 12,
    marginBottom: 12,
  },
  successButtonContent: {
    height: 52,
  },
  successButtonLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  successSecondaryButtonLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  createAnotherLabel: {
    fontWeight: "600",
    color: "#4B5563",
  },
});
