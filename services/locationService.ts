import * as Location from 'expo-location';
import { Location as LocationType } from '@/store/notesSlice';

export const getCurrentLocation = async (): Promise<LocationType | null> => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    
    if (status !== 'granted') {
      console.log('Permission to access location was denied');
      return null;
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  } catch (error) {
    console.error('Error getting location:', error);
    return null;
  }
};

export const getAddressFromCoordinates = async (
  latitude: number,
  longitude: number
): Promise<string | undefined> => {
  try {
    const addressResponse = await Location.reverseGeocodeAsync({
      latitude,
      longitude,
    });

    if (addressResponse && addressResponse.length > 0) {
      const address = addressResponse[0];
      const addressParts = [];

      if (address.name) addressParts.push(address.name);
      if (address.street) {
        const streetAddress = address.name !== address.street 
          ? address.street 
          : '';
        if (streetAddress) addressParts.push(streetAddress);
      }
      if (address.city) addressParts.push(address.city);
      if (address.region) addressParts.push(address.region);

      return addressParts.join(', ');
    }
    
    return undefined;
  } catch (error) {
    console.error('Error getting address:', error);
    return undefined;
  }
};
