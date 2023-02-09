import React, { useCallback, useEffect, useState } from "react";
import Stack from "@mui/material/Stack";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import MapMarker from "../MapMarker/MapMarker";
import PolylineContainer from "../Polyline/PolylineContainer";
import { libraries } from "../../utils/Utils";
import DirectionService from "../DirectionService/DirectionService";
import { current } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";

const containerStyle = {
  position: "relative",
  width: "50vw",
  // width: "100vw",
  height: "100vh",
  zIndex: 100,
};

function MapContainer({
  isLoaded,
  customStyle = null,
  autolocationControl = true,
  routes,
  displayRouteIds,
  center,
}) {
  console.log("center : ", displayRouteIds);
  // const stops = useSelector((state) => state.routes.routes);

  const [map, setMap] = useState(/** @type google.maps.Map */ (null));

  const onLoad = function callback(map) {
    const bounds = new window.google.maps.LatLngBounds();
    map.fitBounds(bounds);
    setMap(map);
  };

  const [currentPosition, setCurrentPosition] = useState(null);

  useEffect(() => {
    // if (routes.length > 0 && !autolocationControl) {
    //   setCurrentPosition({
    //     lat: parseFloat(routes[0]?.stops[0]?.lat),
    //     lng: parseFloat(routes[0]?.stops[0]?.lng),
    //   });
    // } else
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setCurrentPosition({
          lat: parseFloat(position.coords.latitude),
          lng: parseFloat(position.coords.longitude),
        });
      });
    } else {
      console.error("Geolocation is not available in your browser.");
    }
  }, []);

  useEffect(
    () =>
      function callback(map) {
        const bounds = new window.google.maps.LatLngBounds();
        // map && map.fitBounds(bounds);
        map && map.fitBounds(bounds);
        setMap(map);
        // onLoadInfo()
      },
    [currentPosition, map]
  );

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

  // Generate the center coordinates
  //   const [center, setCenter] = useState([]);
  //   function generateCenterCoordinates() {
  //     let lat = 0;
  //     let lng = 0;
  //     lat = stops.reduce((sum, coord) => sum + coord.lat, 0) / stops.length;
  //     lng = stops.reduce((sum, coord) => sum + coord.lng, 0) / stops.length;
  //     setCenter({
  //       lat: parseFloat(lat),
  //       lng: parseFloat(lng),
  //     });
  //   }

  //   useEffect(() => {
  //     generateCenterCoordinates();
  //   }, [stops]);

  return (
    <Stack>
      {isLoaded ? (
        <GoogleMap
          mapContainerStyle={customStyle ? customStyle : containerStyle}
          center={currentPosition}
          zoom={40}
          onLoad={onLoad}
          onUnmount={onUnmount}
          options={{
            streetViewControl: false,
            mapTypeControl: false,
          }}
        >
          {!autolocationControl ? (
            routes.length > 0 &&
            routes.map(
              (route) =>
                displayRouteIds.includes(route.route_id) && (
                  // rs.stops?.filter((stop) => stop.stop_id).length > 0 ? (
                  //   stops.map(
                  //     (stop) =>
                  //       stop.stop_id && (
                  //         <MapMarker center={{ lat: stop.lat, lng: stop.lng }} />
                  //       )
                  //   )
                  // ) : (
                  //   <MapMarker center={currentPosition} />
                  // )
                  <PolylineContainer stops={route?.stops} />
                )
            )
          ) : (
            <PolylineContainer stops={routes} />
          )}
        </GoogleMap>
      ) : (
        <></>
      )}
    </Stack>
  );
}

export default MapContainer;
