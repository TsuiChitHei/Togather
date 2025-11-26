
export interface GeocodeResult {
  latitude: number;
  longitude: number;
  placeName: string;
}

export async function geocodeAddress(address: string): Promise<GeocodeResult> {
  const url =
    `https://nominatim.openstreetmap.org/search?` +
    `q=${encodeURIComponent(address + ", Hong Kong")}` +
    `&format=json&addressdetails=1&limit=1`;

  console.log("Nominatim URL:", url);

  const response = await fetch(url, {
    headers: { 
      "User-Agent": "HK-Student-Project-Geocoder/1.0", 
      "Accept-Language": "en"
    }
  });

  const results = await response.json();
  if (!results || results.length === 0) {
    throw new Error("No coordinates found for this address.");
  }

  const r = results[0];

  return {
    latitude: parseFloat(r.lat),
    longitude: parseFloat(r.lon),
    placeName: r.display_name
  };
}
