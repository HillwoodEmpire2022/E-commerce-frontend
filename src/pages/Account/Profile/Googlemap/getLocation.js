import React from 'react';
import axios from 'axios';

import { useState, useEffect } from 'react';
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  InfoWindow,
} from '@react-google-maps/api';

const center = {
  lat: -1.935114,
  lng: 30.082111,
};
// const libraries = ["places"];

function Mymap() {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey:
      process.env.REACT_APP_GOOGLE_MAP_API_KEY || '',
  });
  const [locationData, setLocationData] = useState(null);
  const [userLocation, setUserLocation] = useState({});
  const [selectedLocation, setSelectedLocation] =
    useState(null);

  const getLocation = async () => {
    const location = await axios.get(
      'https://ipapi.co/json'
    );
    setUserLocation(location?.data);
  };
  // const [userLocation, setUserLocation] = useState(null);

  // define the function that finds the users geolocation
  const getUserLocation = () => {
    // if geolocation is supported by the users browser
    if (navigator.geolocation) {
      // get the current users location
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // save the geolocation coordinates in two variables
          const { latitude, longitude } = position.coords;
          // update the value of userlocation variable
          setUserLocation({ latitude, longitude });
        },
        // if there was an error getting the users location
        (error) => {}
      );
    }
  };

  useEffect(() => {
    myCoord()
      .then((position) => {
        setUserLocation(position);
      })
      .catch((error) => {});
  }, []);

  const myCoord = () =>
    new Promise((resolve, reject) => {
      const geoSuccess = (position) => {
        const { latitude, longitude } = position.coords;
        resolve({ latitude, longitude });
      };

      const geoFailure = (error) => reject(error);

      const geoOptions = {
        timeout: 5000,
        maximumAge: 5000,
        enableHighAccuracy: false,
      };

      navigator.geolocation.getCurrentPosition(
        geoSuccess,
        geoFailure,
        geoOptions
      );
    });

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading maps</div>;
  }

  const getDetailedLocation = async (lat, lng) => {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.REACT_APP_GOOGLE_MAP_API_KEY}`
    );
    try {
      const results = response.data;

      if (results[0]) {
        const detailedLocation =
          results[0].formatted_address;
        return detailedLocation;
      }
      return null;
    } catch (error) {}
  };

  const getLocationDetails = async (
    latitude,
    longitude
  ) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.REACT_APP_GOOGLE_MAP_API_KEY}&libraries=places`
      );

      if (response.data.status === 'OK') {
        const addressComponents =
          response.data.results[0].address_components;
        const detailedLocation =
          response.data.results[0].formatted_address;

        // Extract location details
        let sector = '';
        let district = '';
        let village = '';
        let streetNumber = '';
        let route = '';

        //         places     ['route']0: "route"length: 1[[Prototype]]: Array(0)
        // bundle.js:29922 places     (3) ['political', 'sublocality', 'sublocality_level_1']
        let administrative_area_level_1 = '';
        let administrative_area_level_2 = '';
        let political = '';
        let country = '';
        let sublocality = '';
        let sublocality_level_1 = '';
        let types = '';
        let street_address = '';

        addressComponents.forEach((component) => {
          if (component.types.includes('street_address')) {
            street_address =
              street_address + component.long_name;
          }

          types = component.types;
          if (types.includes('neighborhood')) {
            sector = component.long_name;
          } else if (types.includes('locality')) {
            district = component.long_name;
          } else if (
            types.includes('administrative_area_level_2')
          ) {
            village = component.long_name;
          } else if (types.includes('street_number')) {
            streetNumber = component.long_name;
          } else if (types.includes('route')) {
            route = component.long_name;
          } else if (
            types.includes('administrative_area_level_1')
          ) {
            // handle administrative_area_level_1
          } else if (types.includes('political')) {
            // handle political
          } else if (types.includes('country')) {
            // handle country
          } else if (types.includes('sublocality')) {
            // handle sublocality
          } else if (
            types.includes('sublocality_level_1')
          ) {
            // handle sublocality_level_1
          }
        });

        // Return location details
        return {
          sector,
          district,
          village,
          streetNumber,
        };
      } else {
        console.error('Geocoding API request failed');
        return null;
      }
    } catch (error) {
      console.error(
        'Error fetching location details:',
        error
      );
      return null;
    }
  };

  const handleMarkerClick = async (event) => {
    const lat = event.latLng.lat();

    const lng = event.latLng.lng();
    const data = { lat, lng };

    // Store location data in local storage
    localStorage.setItem(
      'locationData',
      JSON.stringify(data)
    );
    // Update state to trigger re-render
    // setLocationData(data);
    getLocationDetails(data.lat, data.lng);
    setSelectedLocation(data);
    const detailedLocation = await getDetailedLocation(
      lat,
      lng
    );
  };

  return isLoaded ? (
    <>
      {userLocation.country_name}
      {userLocation.country_code}
      {userLocation.city}
      {userLocation.latitude}
      {userLocation.longitude}
      <GoogleMap
        center={
          userLocation
            ? {
                lat: userLocation.latitude,
                lng: userLocation.longitude,
              }
            : center
        }
        defaultCenter={
          userLocation
            ? {
                lat: userLocation.latitude,
                lng: userLocation.longitude,
              }
            : center
        }
        zoom={8}
        mapContainerStyle={{
          width: '100%',
          height: '50vh',
        }}
        options={{
          zoomControl: true,
          streetViewControl: true,
          mapTypeControl: false,
          fullscreenControl: false,
        }}
      >
        {/* {locationData && (
          <Marker position={{ lat: locationData.lat, lng: locationData.lng }} />
        )} */}
        {userLocation ? (
          <Marker
            position={{
              lat: userLocation.latitude,
              lng: userLocation.longitude,
            }}
            onClick={handleMarkerClick}
          >
            {selectedLocation && (
              <InfoWindow
                position={{
                  lat: selectedLocation.lat,
                  lng: selectedLocation.lng,
                }}
                onCloseClick={() => {
                  setSelectedLocation(null);
                }}
              >
                <div>
                  <h2>Selected Location</h2>
                  <p>This is your selected location!</p>
                </div>
              </InfoWindow>
            )}
          </Marker>
        ) : (
          <Marker
            onClick={handleMarkerClick}
            position={{
              lat: locationData.lat,
              lng: locationData.lng,
            }}
          />
        )}
        {/* <Marker onClick={handleMarkerClick} position={center} /> */}
      </GoogleMap>

      <GoogleMap
        onLoad={(map) => {
          const bounds =
            new window.google.maps.LatLngBounds();
          map.fitBounds(bounds);
        }}
        onUnmount={(map) => {
          //   localStorage.setItem("map", JSON.stringify(map));
          // do your stuff before map is unmounted
        }}
      />
    </>
  ) : (
    <></>
  );
}
export default Mymap;
