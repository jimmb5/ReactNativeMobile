import { Place } from '../types/place';

export type RootStackParamList = {
  Initialization: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  Explore: undefined;
  Map: undefined;
  MainApp: undefined;
  AddPlace: undefined;
  MyPlaces: undefined;
  LocationSelect: {
    onLocationSelected: (latitude: number, longitude: number) => void;
  };
  PlaceDetail: {
  place: Place;
};
};

// tänne screenien määrittelyt. 
// mikäli tarvitaan esim kirjautuminen menisi se esim näin:
// Home: {userId: string} eli tämä odottaa parametrin userId 