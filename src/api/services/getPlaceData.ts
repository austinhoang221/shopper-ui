const username = "linh12346549847";
const baseUrl = "http://api.geonames.org/";

export interface Place {
    geonameId: string;
    name: string;
    countryName?: string;
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
        console.error('Error fetching regions:', error);
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
        console.error('Error fetching cities:', error);
        return [];
    }
};
