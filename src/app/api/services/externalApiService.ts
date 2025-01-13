const username = process.env.NEXT_PUBLIC_GEONAMES_USERNAME;
const baseUrl = process.env.NEXT_PUBLIC_GEONAMES_BASE_URL;
const shippoApiKey = process.env.NEXT_PUBLIC_SHIPPO_API_KEY;
const mapboxAccessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

interface Place {
  geonameId: number;
  name: string;
  lat: number;
  lng: number;
  countryCode: string;
  population: number;
}

export interface ShippingRate {
  amount: number;
  currency: string;
  estimated_days: number;
  duration_terms: string;
}

export const getCountries = async (): Promise<Place[]> => {
  const url = `http://api.geonames.org/countryInfoJSON?username=${username}`;
  const res = await fetch(url);
  const data = await res.json();
  return data.geonames || [];
};

export const getRegions = async (countryId: string): Promise<Place[]> => {
  const url = `${baseUrl}childrenJSON?geonameId=${countryId}&username=${username}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    return data.geonames || [];
  } catch (error) {
    console.error("Error fetching regions:", error);
    return [];
  }
};

export const getCities = async (regionId: string): Promise<Place[]> => {
  const url = `${baseUrl}childrenJSON?geonameId=${regionId}&username=${username}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    return data.geonames || [];
  } catch (error) {
    console.error("Error fetching cities:", error);
    return [];
  }
};

export const autocomplete = async (query: string): Promise<A[]> => {
  if (!query) return [];

    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${mapboxAccessToken}&autocomplete=true&limit=5&types=place`;
    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.features) {
            return data.features.map((feature: A) => ({
                id: feature.id,
                name: feature.place_name,
                coordinates: feature.geometry.coordinates,
            }));
        }

        return [];
    } catch (error) {
        console.error("Error fetching places:", error);
        return [];
    }
};

export const reverseGeocode = async (
  lng: number,
  lat: number
): Promise<A | null> => {
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxAccessToken}`;
  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.features && data.features.length > 0) {
      const feature = data.features[0];
      return {
        id: feature.id,
        name: feature.place_name,
        coordinates: feature.geometry.coordinates,
      };
    }
    return null;
  } catch (error) {
    console.error("Error fetching reverse geocode:", error);
    return null;
  }
};

export const calculateShipping = async (
  address: {
    name: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  },
  parcel: { length: number; width: number; height: number; weight: number }
) => {
  const shipmentRequest = {
    address_from: {
      name: "John Doe",
      street1: "123 Sender St",
      city: "San Francisco",
      state: "CA",
      zip: "94103",
      country: "US",
    },
    address_to: {
      name: address.name,
      street1: address.street,
      city: address.city,
      state: address.state,
      zip: address.zip,
      country: address.country,
    },
    parcels: [
      {
        length: parcel.length,
        width: parcel.width,
        height: parcel.height,
        distance_unit: "in",
        weight: parcel.weight,
        mass_unit: "lb",
      },
    ],
    async: false,
  };

  try {
    const response = await fetch("https://api.goshippo.com/shipments/", {
      method: "POST",
      headers: {
        Authorization: `ShippoToken ${shippoApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(shipmentRequest),
    });

    const data = await response.json();
    const shippingInfo = data.rates.map((rate: ShippingRate) => ({
      amount: rate.amount,
      currency: rate.currency,
      estimated_days: rate.estimated_days,
      duration_terms: rate.duration_terms,
    }));
    return shippingInfo;
  } catch (error) {
    console.error("Error calculating shipping with Shippo:", error);
    return null;
  }
};
