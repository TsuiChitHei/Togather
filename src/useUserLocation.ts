import { useEffect, useState } from "react";
import * as Location from "expo-location";
import { Alert } from "react-native";

export type UserCoords = Pick<Location.LocationObjectCoords, "latitude" | "longitude">;

export function useUserLocation() {
  const [coords, setCoords] = useState<UserCoords | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [permissionDenied, setPermissionDenied] = useState(false);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const servicesEnabled = await Location.hasServicesEnabledAsync();
        console.log("servicesEnabled =", servicesEnabled);
        if (!servicesEnabled) {
          Alert.alert("Enable Location", "Please turn on Location Services in settings.");
          return;
        }

        const { status, canAskAgain, granted } = await Location.requestForegroundPermissionsAsync();
        console.log("permission status =", status, "canAskAgain =", canAskAgain, "granted =", granted);

        if (status !== Location.PermissionStatus.GRANTED) {
          setPermissionDenied(true);
          Alert.alert("Location permission is required", "Please allow access to location to calculate distance.");
          return;
        }

        const position = await Location.getCurrentPositionAsync({
          accuracy: Location.LocationAccuracy.Balanced,
        });
        console.log("position coords =", position.coords);

        if (isMounted) {
          setCoords({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        }
      } catch (error) {
        console.warn("Location error", error);

        try {
          const lastKnown = await Location.getLastKnownPositionAsync();
          console.log("lastKnown coords =", lastKnown?.coords);

          if (lastKnown && isMounted) {
            setCoords({
              latitude: lastKnown.coords.latitude,
              longitude: lastKnown.coords.longitude,
            });
            return; 
          }
        } catch (fallbackError) {
          console.warn("Failed to read last known position", fallbackError);
        }

        Alert.alert(
          "Location failed",
          "We are unable to obtain your current location at the moment. Please try again later."
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
          console.log("useUserLocation finished, coords =", coords, "permissionDenied =", permissionDenied);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  return { coords, isLoading, permissionDenied };
}
