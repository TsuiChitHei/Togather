// services/geocodingService.ts
import { MAPBOX_ACCESS_TOKEN } from "@env";

export interface GeocodeResult {
  latitude: number;
  longitude: number;
  placeName: string;
}

const MAPBOX_ENDPOINT = "https://api.mapbox.com/geocoding/v5/mapbox.places";

export async function geocodeAddress(address: string): Promise<GeocodeResult> {
  if (!MAPBOX_ACCESS_TOKEN) {
    throw new Error("Mapbox Access Token is missing. Please check your .env file.");
  }

  const url = `${MAPBOX_ENDPOINT}/${encodeURIComponent(
    address
  )}.json?access_token=${MAPBOX_ACCESS_TOKEN}&limit=1`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Geocoding request failed. Please try again later.");
  }

  const data = await response.json();
  if (!data.features || data.features.length === 0) {
    throw new Error("No coordinates found for this address. Please be more specific.");
  }

  const [longitude, latitude] = data.features[0].center;
  const placeName = data.features[0].place_name;

  return {
    latitude,
    longitude,
    placeName,
  };
}
