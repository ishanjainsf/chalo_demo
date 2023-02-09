import React, { useState, useEffect } from "react";
import { DirectionsService, DirectionsRenderer } from "@react-google-maps/api";
import Stack from "@mui/material/Stack";

function DirectionService({ stops }) {
  console.log("stopssss : ", stops);
  //   const [stops, setStops] = React.useState({
  //     response: null,
  //     travelMode: "DRIVING",
  //     origin: "",
  //     destination: "",
  //   });

  // Directions callback
  //   function directionsCallback(response) {
  //     console.log(response);

  //     if (response !== null) {
  //       if (response.status === "OK") {
  //         setStops(() => ({
  //           response,
  //         }));
  //       } else {
  //         console.log("response: ", response);
  //       }
  //     }
  //   }

  // Fetching the directions
  const [directions, setDirections] = useState(null);

  const [totalDistance, setTotalDistance] = useState("");
  const [totalDuration, setTotalDuration] = useState("");

  async function calculateRoute() {
    let len = stops.length;
    if (stops.slice(0, len - 1).length < 2) {
      return;
    }
    console.log("stopsss : ", stops);
    // eslint-disable-next-line no-undef
    const directionsService = new google.maps.DirectionsService();
    const results = await directionsService.route({
      origin: {
        lat: parseFloat(stops[0]?.lat),
        lng: parseFloat(stops[0]?.lng),
      },
      destination: {
        lat: parseFloat(stops[1]?.lat),
        lng: parseFloat(stops[1]?.lng),
      },
      // eslint-disable-next-line no-undef
      travelMode: google.maps.TravelMode.DRIVING,
    });
    console.log("Results: ", results);
    setDirections(results);
    setTotalDistance(results.routes[0].legs[0].distance.text);
    setTotalDuration(results.routes[0].legs[0].duration.text);
  }

  function clearRoute() {
    setDirections(null);
    setTotalDistance("");
    setTotalDuration("");
  }

  useEffect(() => {
    calculateRoute();
  }, [stops]);

  return (
    <Stack>
      {/* <DirectionsService
        options={{
          origin: {
            lat: parseFloat(stops[0]?.lat),
            lng: parseFloat(stops[0]?.lng),
          },
          destination: {
            lat: parseFloat(stops[1]?.lat),
            lng: parseFloat(stops[1]?.lng),
          },
          waypoints: [],
          //   waypoints: [
          //     {
          //       location: { lat: waypoint1Latitude, lng: waypoint1Longitude },
          //     },
          //     {
          //       location: { lat: waypoint2Latitude, lng: waypoint2Longitude },
          //     },
          //   ],
          travelMode: "DRIVING",
        }}
        callback={(response, status) => {
          console.log("response, status : ", response, status);
          if (status === "OK") {
            setDirections(response);
          } else {
            console.error(`error fetching directions ${JSON.parse(response)}`);
          }
        }}
      /> */}
      {directions && <DirectionsRenderer directions={directions} />}
    </Stack>
  );
}

export default DirectionService;
